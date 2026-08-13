"use client";

import { Check, ChevronDown, Sparkles } from "lucide-react";
import { useState } from "react";
import { models } from "@/lib/models";
import { cn } from "@/lib/utils";

export function ModelSelector({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const selected = models.find((model) => model.id === value) || models[0];
  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex h-9 items-center gap-2 rounded-lg px-2.5 text-sm font-medium text-foreground hover:bg-panel-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/25"
      >
        <Sparkles className="size-4 text-muted" aria-hidden="true" />
        <span className="hidden sm:inline">{selected.name}</span>
        <span className="sm:hidden">{selected.name.replace(" Preview", "")}</span>
        <ChevronDown className={cn("size-3.5 text-muted transition-transform", open && "rotate-180")} aria-hidden="true" />
      </button>
      {open && (
        <>
          <button aria-label="Close model menu" className="fixed inset-0 z-10 cursor-default" onClick={() => setOpen(false)} />
          <div role="listbox" className="absolute right-0 top-11 z-20 w-72 rounded-xl border border-border bg-panel p-1.5 shadow-xl shadow-black/10">
            <p className="px-2.5 pb-1.5 pt-2 text-[11px] font-semibold uppercase tracking-[.14em] text-muted">Models</p>
            {models.map((model) => (
              <button
                key={model.id}
                role="option"
                aria-selected={model.id === selected.id}
                onClick={() => { onChange(model.id); setOpen(false); }}
                className="flex w-full items-start gap-3 rounded-lg px-2.5 py-2.5 text-left hover:bg-panel-muted"
              >
                <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-panel-muted text-muted"><Sparkles className="size-3.5" /></span>
                <span className="min-w-0 flex-1"><span className="block text-sm font-medium">{model.name}</span><span className="mt-0.5 block text-xs text-muted">{model.provider} · {model.description}</span></span>
                {model.id === selected.id && <Check className="mt-1 size-4" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
