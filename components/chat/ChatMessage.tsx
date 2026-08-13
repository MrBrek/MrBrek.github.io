"use client";

import { Check, Copy, UserRound } from "lucide-react";
import { useState } from "react";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { Button } from "@/components/ui/Button";

export function ChatMessage({ role, content, streaming = false }: { role: "user" | "assistant"; content: string; streaming?: boolean }) {
  const [copied, setCopied] = useState(false);
  const isUser = role === "user";
  async function copy() {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }
  return (
    <article className="group flex animate-[fade-in_.18s_ease-out] gap-3 py-5 sm:gap-4">
      <div className={isUser ? "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-foreground text-background" : "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-panel text-foreground"}>
        {isUser ? <UserRound className="size-3.5" aria-hidden="true" /> : <span className="text-xs font-semibold">W</span>}
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 text-xs font-semibold text-muted">{isUser ? "You" : "WhiteAI"}</div>
        {isUser ? <p className="whitespace-pre-wrap break-words text-[15px] leading-7">{content}</p> : <MarkdownRenderer content={content} />}
        {!isUser && content && !streaming && (
          <Button aria-label="Copy response" onClick={copy} size="sm" className="mt-2 -ml-2 opacity-0 group-hover:opacity-100 focus-visible:opacity-100">
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}{copied ? "Copied" : "Copy"}
          </Button>
        )}
        {streaming && <span className="ml-1 inline-block h-4 w-0.5 animate-pulse bg-foreground align-middle" aria-label="Generating" />}
      </div>
    </article>
  );
}
