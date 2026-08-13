import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { renameChatSchema } from "@/lib/validation";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const chat = await db.chat.findUnique({
      where: { id },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });
    if (!chat) return NextResponse.json({ error: "Chat not found." }, { status: 404 });
    return NextResponse.json({ chat });
  } catch {
    return NextResponse.json({ error: "Couldn't load this chat." }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const parsed = renameChatSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Enter a chat name between 1 and 120 characters." }, { status: 400 });
    const chat = await db.chat.update({ where: { id }, data: { title: parsed.data.title } });
    return NextResponse.json({ chat });
  } catch {
    return NextResponse.json({ error: "Couldn't rename this chat." }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await db.chat.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Couldn't delete this chat." }, { status: 500 });
  }
}
