"use client";

import { CheckCircle, XCircle } from "lucide-react";
import { Hairline } from "../ui/primitives";
import { decisionRows } from "../data";

export function DecisionsView() {
    return (
        <>
            {/* Decisions Header */}
            <div className="px-4 pt-3">
                <div className="grid grid-cols-[1fr_100px_100px_100px_100px] gap-1 text-[11px] uppercase tracking-[0.12em] text-[color:var(--muted)] font-semibold">
                    <div>TITLE</div>
                    <div>PRIORITY</div>
                    <div>STATUS</div>
                    <div>DUE</div>
                    <div>ACTIONS</div>
                </div>
            </div>
            <Hairline className="mt-3" />
            <div className="flex-1 overflow-auto">
                <div className="px-4">
                    {decisionRows.map((d) => (
                        <div key={d.id} className="grid grid-cols-[1fr_100px_100px_100px_100px] gap-1 py-3 border-b border-[color:var(--stroke-2)] items-center hover:bg-[color:var(--panel)] transition-colors">
                            <div>
                                <div className="text-[14px] font-medium text-[color:var(--text)]">{d.title}</div>
                                <div className="text-[12px] text-[color:var(--muted-2)]">by {d.author}</div>
                            </div>
                            <div>
                                <span className={`text-[11px] px-2 py-0.5 rounded-full ${d.priority === 'HIGH' ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                    {d.priority}
                                </span>
                            </div>
                            <div className="text-[13px] text-[color:var(--muted-2)]">{d.status}</div>
                            <div className="text-[13px] text-[color:var(--muted-2)]">{d.due}</div>
                            <div className="flex gap-2">
                                <button className="p-1 hover:text-green-400 transition-colors" title="Approve"><CheckCircle className="w-4 h-4" /></button>
                                <button className="p-1 hover:text-red-400 transition-colors" title="Reject"><XCircle className="w-4 h-4" /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
