import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requestAIStream, AIServiceError } from "@/lib/ai";
import { chatRequestSchema } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rate-limit";
import { getRequestKey, makeTitle } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function event(data: unknown) {
  return `data: ${JSON.stringify(data)}\n\n`;
}

export async function POST(request: Request) {
  const limit = checkRateLimit(getRequestKey(request));
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many requests. Try again in a minute." }, { status: 429 });
  }

  try {
    const raw = await request.text();
    if (raw.length > 250_000) return NextResponse.json({ error: "This request is too large." }, { status: 413 });
    const parsed = chatRequestSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) return NextResponse.json({ error: "Message is empty or too long." }, { status: 400 });

    const { chatId, messages, model } = parsed.data;
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role !== "user") return NextResponse.json({ error: "The last message must come from the user." }, { status: 400 });

    const chat = await db.chat.findUnique({ where: { id: chatId }, include: { messages: { orderBy: { createdAt: "asc" } } } });
    if (!chat) return NextResponse.json({ error: "Chat not found." }, { status: 404 });

    const isFirstMessage = chat.messages.length === 0;
    await db.message.create({ data: { chatId, role: "user", content: lastMessage.content } });
    if (isFirstMessage) {
      await db.chat.update({ where: { id: chatId }, data: { title: makeTitle(lastMessage.content) } });
    }

    const context = [...chat.messages, { role: "user", content: lastMessage.content }]
      .slice(-60)
      .map((message) => ({ role: message.role, content: message.content }));
    const providerResponse = await requestAIStream({ model, messages: context, signal: request.signal });
    const reader = providerResponse.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let assistantContent = "";

    const stream = new ReadableStream({
      async start(controller) {
        const send = (payload: unknown) => controller.enqueue(new TextEncoder().encode(event(payload)));
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\\n");
            buffer = lines.pop() || "";
            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith("data:")) continue;
              const data = trimmed.slice(5).trim();
              if (data === "[DONE]") continue;
              try {
                const json = JSON.parse(data) as { choices?: Array<{ delta?: { content?: string }; text?: string }> };
                const delta = json.choices?.[0]?.delta?.content ?? json.choices?.[0]?.text ?? "";
                if (delta) {
                  assistantContent += delta;
                  send({ type: "delta", content: delta });
                }
              } catch {
                continue;
              }
            }
          }
          if (!assistantContent) {
            send({ type: "error", message: "The AI returned an empty response." });
            controller.close();
            return;
          }
          await db.message.create({ data: { chatId, role: "assistant", content: assistantContent } });
          await db.chat.update({ where: { id: chatId }, data: { updatedAt: new Date() } });
          send({ type: "done" });
          controller.close();
        } catch {
          send({ type: "error", message: "Something went wrong while generating the response." });
          controller.close();
        } finally {
          reader.releaseLock();
        }
      },
      cancel() {
        reader.cancel().catch(() => undefined);
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    if (error instanceof SyntaxError) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    if (error instanceof AIServiceError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 });
  }
}
