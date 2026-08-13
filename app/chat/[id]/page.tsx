import { ChatApp } from "@/components/chat/ChatApp";

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ChatApp initialChatId={id} />;
}
