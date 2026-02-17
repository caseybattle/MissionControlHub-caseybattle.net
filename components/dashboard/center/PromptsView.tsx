"use client";

import { MessageSquare } from "lucide-react";
import { Hairline } from "../ui/primitives";
import { promptRows } from "../data";

export function PromptsView() {
    return (
        <>
            {/* Prompts Header */}
            <div className="px-4 pt-3">
                <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-1 text-[11px] uppercase tracking-[0.12em] text-[color:var(--muted)] font-semibold">
                    <div>TITLE</div>
                    <div>USAGE</div>
                    <div>LAST USED</div>
                    <div>TAGS</div>
                </div>
            </div>
            <Hairline className="mt-3" />
            <div className="flex-1 overflow-auto">
                <div className="px-4">
                    {promptRows.map((p) => (
                        <div key={p.id} className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-1 py-3 border-b border-[color:var(--stroke-2)] items-center hover:bg-[color:var(--panel)] transition-colors cursor-pointer">
                            <div className="flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-[color:var(--blue)]" />
                                <span className="text-[14px] font-medium text-[color:var(--text)]">{p.title}</span>
                            </div>
                            <div className="text-[13px] text-[color:var(--muted-2)]">{p.usage}</div>
                            <div className="text-[13px] text-[color:var(--muted-2)]">{p.lastUsed}</div>
                            <div className="flex gap-1">
                                {p.tags.map(tag => (
                                    <span key={tag} className="text-[11px] bg-[color:var(--panel-2)] px-1.5 py-0.5 rounded text-[color:var(--muted)]">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
