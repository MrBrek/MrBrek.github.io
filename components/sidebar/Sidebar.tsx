"use client";

import { ChevronsLeft, MoreHorizontal, Plus, Search, Settings, X } from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type ChatSummary = { id: string; title: string; updatedAt: string };

function formatGroup(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diff = Math.round((start.getTime() - day.getTime()) / 86_400_000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return date.toLocaleDateString(undefined, { month: "long", day: "numeric" });
}

export function Sidebar({ chats, activeId, search, onSearch, onNew, onSelect, onRename, onDelete, onSettings, open, onClose, collapsed, onCollapse }: { chats: ChatSummary[]; activeId?: string; search: string; onSearch: (value: string) => void; onNew: () => void; onSelect: (id: string) => void; onRename: (chat: ChatSummary) => void; onDelete: (chat: ChatSummary) => void; onSettings: () => void; open: boolean; onClose: () => void; collapsed: boolean; onCollapse: () => void }) {
  const grouped = useMemo(() => chats.reduce<Record<string, ChatSummary[]>>((groups, chat) => { const key = formatGroup(chat.updatedAt); (groups[key] ||= []).push(chat); return groups; }, {}), [chats]);
  return (
    <>
      {open && <button className="fixed inset-0 z-30 bg-black/20 md:hidden" aria-label="Close sidebar" onClick={onClose} />}
      <aside className={cn("fixed inset-y-0 left-0 z-40 flex w-[292px] flex-col border-r border-border bg-panel transition-transform duration-200 md:static md:z-auto md:translate-x-0", !open && "-translate-x-full md:translate-x-0", collapsed && "md:w-[68px]")}>
        <div className="flex h-16 items-center justify-between px-4">
          {!collapsed && <span className="text-[15px] font-semibold tracking-[-.02em]">WhiteAI</span>}
          <Button size="icon" aria-label="Close sidebar" className="md:hidden" onClick={onClose}><X className="size-4" /></Button>
          <Button size="icon" aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} className="hidden md:inline-flex" onClick={onCollapse}><ChevronsLeft className={cn("size-4 transition-transform", collapsed && "rotate-180")} /></Button>
        </div>
        <div className="px-3">
          <Button variant="primary" className={cn("w-full justify-start", collapsed && "justify-center px-0")} onClick={onNew}><Plus className="size-4" />{!collapsed && "New chat"}</Button>
          {!collapsed && <label className="mt-3 flex h-9 items-center gap-2 rounded-lg border border-transparent bg-panel-muted px-2.5 text-muted focus-within:border-border"><Search className="size-4 shrink-0" /><input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search chats" aria-label="Search chats" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted" /></label>}
        </div>
        {!collapsed && <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto px-2.5 pb-3 pt-5">
          {Object.keys(grouped).length === 0 ? <p className="px-2.5 py-8 text-center text-xs leading-5 text-muted">{search ? "No matching chats" : "Your conversations will appear here"}</p> : Object.entries(grouped).map(([group, items]) => <div key={group} className="mb-5"><h2 className="mb-1 px-2.5 text-[11px] font-semibold uppercase tracking-[.12em] text-muted">{group}</h2>{items.map((chat) => <div key={chat.id} className={cn("group flex items-center gap-1 rounded-lg px-2.5 py-2 text-sm transition-colors", chat.id === activeId ? "bg-panel-muted text-foreground" : "text-muted hover:bg-panel-muted hover:text-foreground")}><button className="min-w-0 flex-1 truncate text-left" onClick={() => onSelect(chat.id)}>{chat.title}</button><details className="relative shrink-0"><summary className="flex size-7 list-none items-center justify-center rounded-md opacity-0 hover:bg-background group-hover:opacity-100 focus-visible:opacity-100 [&::-webkit-details-marker]:hidden" aria-label={`Actions for ${chat.title}`}><MoreHorizontal className="size-4" /></summary><div className="absolute right-0 top-8 z-30 w-28 rounded-lg border border-border bg-panel p-1 shadow-lg"><button className="flex w-full rounded-md px-2 py-1.5 text-left text-xs hover:bg-panel-muted" onClick={(event) => { event.currentTarget.closest("details")?.removeAttribute("open"); onRename(chat); }}>Rename</button><button className="flex w-full rounded-md px-2 py-1.5 text-left text-xs text-danger hover:bg-danger/10" onClick={(event) => { event.currentTarget.closest("details")?.removeAttribute("open"); onDelete(chat); }}>Delete</button></div></details></div>)}</div>) }
        </div>}
        <div className="border-t border-border p-3">
          <Button className={cn("w-full justify-start", collapsed && "justify-center px-0")} onClick={onSettings}><Settings className="size-4" />{!collapsed && "Settings"}</Button>
        </div>
      </aside>
    </>
  );
}
