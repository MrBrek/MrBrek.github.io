"use client";

import { Menu, Settings2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { ChatWindow, type UIMessage } from "./ChatWindow";
import { ModelSelector } from "@/components/model/ModelSelector";
import { SettingsDialog } from "@/components/settings/SettingsDialog";
import { Button } from "@/components/ui/Button";
import { defaultModel } from "@/lib/models";

type ChatSummary = { id: string; title: string; updatedAt: string };

type Props = { initialChatId?: string; openSettings?: boolean };

export function ChatApp({ initialChatId, openSettings = false }: Props) {
  const router = useRouter();
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [activeId, setActiveId] = useState(initialChatId);
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [model, setModel] = useState(defaultModel);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(openSettings);
  const [controller, setController] = useState<AbortController | null>(null);

  const loadChats = useCallback(async () => {
    const response = await fetch(`/api/chats${search ? `?search=${encodeURIComponent(search)}` : ""}`, { cache: "no-store" });
    if (!response.ok) return;
    const data = await response.json() as { chats: ChatSummary[] };
    setChats(data.chats);
  }, [search]);

  const loadChat = useCallback(async (id: string) => {
    const response = await fetch(`/api/chats/${id}`, { cache: "no-store" });
    if (!response.ok) { setError("Couldn't load this conversation."); return; }
    const data = await response.json() as { chat: { messages: Array<{ id: string; role: string; content: string }> } };
    setMessages(data.chat.messages.filter((message): message is UIMessage => message.role === "user" || message.role === "assistant").map((message) => ({ id: message.id, role: message.role, content: message.content })));
  }, []);

  useEffect(() => { loadChats().catch(() => setError("Couldn't load chat history.")); }, [loadChats]);
  useEffect(() => { if (initialChatId) { setActiveId(initialChatId); loadChat(initialChatId).catch(() => setError("Couldn't load this conversation.")); } else { setActiveId(undefined); setMessages([]); } }, [initialChatId, loadChat]);

  function newChat() { setActiveId(undefined); setMessages([]); setInput(""); setError(null); setSidebarOpen(false); router.push("/"); }
  function selectChat(id: string) { setActiveId(id); setError(null); setSidebarOpen(false); router.push(`/chat/${id}`); }

  async function ensureChat() {
    if (activeId) return activeId;
    const response = await fetch("/api/chats", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
    if (!response.ok) throw new Error("Couldn't create a chat.");
    const data = await response.json() as { chat: ChatSummary };
    setActiveId(data.chat.id);
    router.replace(`/chat/${data.chat.id}`);
    return data.chat.id;
  }

  async function sendMessage() {
    const content = input.trim();
    if (!content || isGenerating) return;
    setError(null);
    let chatId: string;
    try { chatId = await ensureChat(); } catch { setError("Couldn't create a chat. Try again."); return; }
    const userMessage: UIMessage = { id: `local-user-${Date.now()}`, role: "user", content };
    const assistantMessage: UIMessage = { id: `local-assistant-${Date.now()}`, role: "assistant", content: "" };
    const nextMessages = [...messages, userMessage];
    setMessages([...nextMessages, assistantMessage]);
    setInput("");
    setIsGenerating(true);
    const requestController = new AbortController();
    setController(requestController);
    try {
      const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json", Accept: "text/event-stream" }, body: JSON.stringify({ chatId, model, messages: nextMessages.map(({ role, content: text }) => ({ role, content: text })) }), signal: requestController.signal });
      if (!response.ok) { const body = await response.json().catch(() => null) as { error?: string } | null; throw new Error(body?.error || "Something went wrong. Try again."); }
      if (!response.body) throw new Error("The AI returned no response.");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() || "";
        for (const raw of events) {
          const line = raw.split("\n").find((item) => item.startsWith("data:"));
          if (!line) continue;
          const payload = JSON.parse(line.slice(5).trim()) as { type: string; content?: string; message?: string };
          if (payload.type === "delta" && payload.content) setMessages((current) => current.map((item) => item.id === assistantMessage.id ? { ...item, content: item.content + payload.content } : item));
          if (payload.type === "error") throw new Error(payload.message || "Something went wrong while generating the response.");
        }
      }
      await loadChats();
    } catch (requestError) {
      if (requestError instanceof DOMException && requestError.name === "AbortError") {
        setMessages((current) => current.filter((item) => item.id !== assistantMessage.id || item.content));
      } else {
        setMessages((current) => current.filter((item) => item.id !== assistantMessage.id));
        setError(requestError instanceof Error ? requestError.message : "Something went wrong. Try again.");
      }
    } finally { setIsGenerating(false); setController(null); }
  }

  function stopGeneration() { controller?.abort(); }
  function suggestion(value: string) { setInput(value + ": "); }
  async function renameChat(chat: ChatSummary) { const title = window.prompt("Rename chat", chat.title); if (!title?.trim() || title.trim() === chat.title) return; const response = await fetch(`/api/chats/${chat.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: title.trim() }) }); if (!response.ok) { setError("Couldn't rename this chat."); return; } await loadChats(); }
  async function deleteChat(chat: ChatSummary) { if (!window.confirm(`Delete “${chat.title}”?`)) return; const response = await fetch(`/api/chats/${chat.id}`, { method: "DELETE" }); if (!response.ok) { setError("Couldn't delete this chat."); return; } if (chat.id === activeId) newChat(); await loadChats(); }

  return (
    <main className="flex h-[100dvh] overflow-hidden bg-background text-foreground">
      <Sidebar chats={chats} activeId={activeId} search={search} onSearch={setSearch} onNew={newChat} onSelect={selectChat} onRename={renameChat} onDelete={deleteChat} onSettings={() => setSettingsOpen(true)} open={sidebarOpen} onClose={() => setSidebarOpen(false)} collapsed={collapsed} onCollapse={() => setCollapsed((value) => !value)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border px-3 sm:px-6">
          <div className="flex items-center gap-2"><Button size="icon" aria-label="Open sidebar" className="md:hidden" onClick={() => setSidebarOpen(true)}><Menu className="size-4" /></Button><div className="md:hidden text-[15px] font-semibold">WhiteAI</div><div className="hidden md:block"><ModelSelector value={model} onChange={setModel} /></div></div>
          <div className="flex items-center gap-1"><div className="md:hidden"><ModelSelector value={model} onChange={setModel} /></div><Button size="icon" aria-label="Open settings" onClick={() => setSettingsOpen(true)}><Settings2 className="size-4" /></Button></div>
        </header>
        <ChatWindow messages={messages} input={input} setInput={setInput} onSend={sendMessage} onStop={stopGeneration} isGenerating={isGenerating} error={error} onSuggestion={suggestion} />
      </div>
      <SettingsDialog open={settingsOpen} onClose={() => { setSettingsOpen(false); if (openSettings) router.push("/"); }} model={model} onModelChange={setModel} />
    </main>
  );
}
