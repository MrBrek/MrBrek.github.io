"use client";

import { ArrowUp, Square } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";

export function MessageInput({ value, onChange, onSend, onStop, isGenerating, disabled }: { value: string; onChange: (value: string) => void; onSend: () => void; onStop: () => void; isGenerating: boolean; disabled?: boolean }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    element.style.height = "auto";
    element.style.height = `${Math.min(element.scrollHeight, 180)}px`;
  }, [value]);
  return (
    <div className="border-t border-border bg-background/90 px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur sm:px-6">
      <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border border-border bg-panel px-3 py-2 shadow-sm focus-within:border-foreground/40 focus-within:shadow-md">
        <textarea
          ref={ref}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); onSend(); } }}
          placeholder="Message WhiteAI..."
          aria-label="Message WhiteAI"
          rows={1}
          disabled={disabled || isGenerating}
          className="max-h-[180px] min-h-8 flex-1 resize-none bg-transparent py-1.5 text-[15px] leading-6 outline-none placeholder:text-muted disabled:opacity-60"
        />
        {isGenerating ? <Button variant="outline" size="icon" aria-label="Stop generating" onClick={onStop}><Square className="size-3.5 fill-current" /></Button> : <Button variant="primary" size="icon" aria-label="Send message" disabled={disabled || !value.trim()} onClick={onSend}><ArrowUp className="size-4" /></Button>}
      </div>
      <p className="mx-auto mt-2 max-w-3xl text-center text-[11px] text-muted">Enter to send · Shift + Enter for a new line</p>
    </div>
  );
}
