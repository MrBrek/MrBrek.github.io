"use client";

import { ChatMessage } from "./ChatMessage";
import { MessageInput } from "./MessageInput";
import { Button } from "@/components/ui/Button";

export type UIMessage = { id: string; role: "user" | "assistant"; content: string };

const suggestions = ["Explain something", "Write code", "Help me plan", "Analyze this"];

export function ChatWindow({ messages, input, setInput, onSend, onStop, isGenerating, error, onSuggestion }: { messages: UIMessage[]; input: string; setInput: (value: string) => void; onSend: () => void; onStop: () => void; isGenerating: boolean; error: string | null; onSuggestion: (value: string) => void }) {
  const empty = messages.length === 0;
  return (
    <section className="flex min-h-0 flex-1 flex-col">
      <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto">
        <div className={empty ? "flex min-h-full items-center justify-center px-5 py-12" : "mx-auto max-w-3xl px-4 pb-8 pt-4 sm:px-6"}>
          {empty ? (
            <div className="w-full max-w-xl text-center">
              <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-2xl border border-border bg-panel text-lg font-semibold shadow-sm">W</div>
              <h1 className="text-2xl font-semibold tracking-[-.035em] sm:text-3xl">How can I help?</h1>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">Ask a question, explore an idea, or bring a problem to work through.</p>
              <div className="mt-7 flex flex-wrap justify-center gap-2">
                {suggestions.map((suggestion) => <Button key={suggestion} variant="outline" size="sm" onClick={() => onSuggestion(suggestion)}>{suggestion}</Button>)}
              </div>
            </div>
          ) : (
            messages.map((message, index) => <ChatMessage key={message.id} role={message.role} content={message.content} streaming={isGenerating && index === messages.length - 1 && message.role === "assistant"} />)
          )}
          {isGenerating && messages.at(-1)?.role === "user" && <div className="flex gap-3 py-5 sm:gap-4"><div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-panel text-xs font-semibold">W</div><div className="flex items-center gap-1 pt-2"><span className="size-1.5 animate-pulse rounded-full bg-muted" /><span className="size-1.5 animate-pulse rounded-full bg-muted [animation-delay:150ms]" /><span className="size-1.5 animate-pulse rounded-full bg-muted [animation-delay:300ms]" /><span className="sr-only">WhiteAI is generating a response</span></div></div>}
          {error && <div role="alert" className="mb-5 rounded-xl border border-danger/25 bg-danger/10 px-4 py-3 text-sm text-danger">{error}</div>}
        </div>
      </div>
      <MessageInput value={input} onChange={setInput} onSend={onSend} onStop={onStop} isGenerating={isGenerating} />
    </section>
  );
}
