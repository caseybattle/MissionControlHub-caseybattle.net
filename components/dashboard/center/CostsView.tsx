"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { Dot, Hairline } from "../ui/primitives";
import { costRows } from "../data";

export function CostsView() {
    return (
        <>
            {/* Costs Header */}
            <div className="px-4 pt-3">
                <div className="grid grid-cols-[1.5fr_1fr_1fr_100px] gap-1 text-[11px] uppercase tracking-[0.12em] text-[color:var(--muted)] font-semibold">
                    <div>SERVICE</div>
                    <div>COST (MTD)</div>
                    <div>TREND</div>
                    <div>STATUS</div>
                </div>
            </div>
            <Hairline className="mt-3" />
            <div className="flex-1 overflow-auto">
                <div className="px-4">
                    {costRows.map((c) => (
                        <div key={c.id} className="grid grid-cols-[1.5fr_1fr_1fr_100px] gap-1 py-3 border-b border-[color:var(--stroke-2)] items-center hover:bg-[color:var(--panel)] transition-colors">
                            <div className="text-[14px] font-medium text-[color:var(--text)]">{c.service}</div>
                            <div className="text-[14px] font-mono text-[color:var(--text)]">{c.cost}</div>
                            <div className={`text-[13px] flex items-center gap-1 ${c.trend.startsWith('+') ? 'text-red-400' : c.trend.startsWith('-') ? 'text-green-400' : 'text-[color:var(--muted)]'}`}>
                                {c.trend !== "0%" && (c.trend.startsWith('+') ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />)}
                                {c.trend}
                            </div>
                            <div className="flex items-center gap-2 text-[13px]">
                                <Dot color={c.status === 'OK' ? 'ok' : 'err'} />
                                <span className="text-[color:var(--muted-2)]">{c.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
