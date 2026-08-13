"use client";

import { Check, CircleAlert, Moon, Monitor, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { models } from "@/lib/models";

export function SettingsDialog({ open, onClose, model, onModelChange }: { open: boolean; onClose: () => void; model: string; onModelChange: (value: string) => void }) {
  const [theme, setTheme] = useState("system");
  const [health, setHealth] = useState<{ connected: boolean; message: string } | null>(null);
  useEffect(() => { if (!open) return; fetch("/api/health").then((response) => response.json()).then(setHealth).catch(() => setHealth({ connected: false, message: "Unavailable" })); }, [open]);
  useEffect(() => { document.documentElement.classList.toggle("dark", theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)); localStorage.setItem("whiteai-theme", theme); }, [theme]);
  useEffect(() => { const saved = localStorage.getItem("whiteai-theme"); if (saved) setTheme(saved); }, []);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/25 p-4 pt-[8vh] backdrop-blur-[2px]" role="dialog" aria-modal="true" aria-labelledby="settings-title">
      <div className="max-h-[84vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-border bg-panel shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4"><h2 id="settings-title" className="font-semibold">Settings</h2><Button size="icon" aria-label="Close settings" onClick={onClose}><X className="size-4" /></Button></div>
        <div className="space-y-7 p-5">
          <section><h3 className="text-sm font-semibold">Appearance</h3><p className="mt-1 text-xs text-muted">Choose how WhiteAI looks on this device.</p><div className="mt-3 grid grid-cols-3 gap-2">{[["light", Sun, "Light"], ["dark", Moon, "Dark"], ["system", Monitor, "System"]].map(([id, Icon, label]) => <button key={id as string} onClick={() => setTheme(id as string)} className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm ${theme === id ? "border-foreground bg-panel-muted" : "border-border hover:bg-panel-muted"}`}><Icon className="size-4" />{label as string}{theme === id && <Check className="size-3.5" />}</button>)}</div></section>
          <section><h3 className="text-sm font-semibold">AI</h3><div className="mt-3 rounded-xl border border-border"><div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3"><div><p className="text-sm font-medium">Current model</p><p className="mt-0.5 text-xs text-muted">Used for new messages.</p></div><select value={model} onChange={(event) => onModelChange(event.target.value)} className="max-w-[220px] rounded-md border border-border bg-panel-muted px-2 py-1.5 text-xs outline-none"><option value="">Select model</option>{models.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></div><div className="flex items-center justify-between px-4 py-3"><div><p className="text-sm font-medium">AI service</p><p className="mt-0.5 text-xs text-muted">Backend connectivity status.</p></div><span className={`inline-flex items-center gap-1.5 text-xs font-medium ${health?.connected ? "text-emerald-600 dark:text-emerald-400" : "text-danger"}`}><span className="size-1.5 rounded-full bg-current" />{health?.connected ? "Connected" : health?.message || "Checking..."}</span></div></div></section>
          <section><h3 className="text-sm font-semibold">Data</h3><div className="mt-3 flex items-center justify-between gap-4 rounded-xl border border-border px-4 py-3"><div><p className="text-sm font-medium">Clear chat history</p><p className="mt-0.5 text-xs text-muted">This action cannot be undone.</p></div><Button variant="danger" size="sm" onClick={() => window.alert("Delete chats one at a time from the sidebar to keep this action safe.")}><CircleAlert className="size-3.5" />Clear</Button></div></section>
          <section><h3 className="text-sm font-semibold">About</h3><div className="mt-3 flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm"><span>WhiteAI</span><span className="text-xs text-muted">Version 0.1.0</span></div></section>
        </div>
      </div>
    </div>
  );
}
