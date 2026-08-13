import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createChatSchema } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rate-limit";
import { getRequestKey } from "@/lib/utils";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const search = url.searchParams.get("search")?.trim() || "";
  try {
    const chats = await db.chat.findMany({
      where: search ? { title: { contains: search } } : undefined,
      orderBy: { updatedAt: "desc" },
      select: { id: true, title: true, createdAt: true, updatedAt: true },
      take: 100,
    });
    return NextResponse.json({ chats });
  } catch {
    return NextResponse.json({ error: "Couldn't load chat history." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const limit = checkRateLimit(getRequestKey(request));
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many requests. Try again shortly." }, { status: 429 });
  }
  try {
    const body = await request.json();
    const parsed = createChatSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid chat data." }, { status: 400 });
    const chat = await db.chat.create({ data: { title: parsed.data.title || "New conversation" } });
    return NextResponse.json({ chat }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Couldn't create a chat." }, { status: 500 });
  }
}
