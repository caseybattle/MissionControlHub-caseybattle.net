"use client";

import { useState } from "react";
import { Clock, Play, Pause, RotateCcw } from "lucide-react";
import { Dot, Hairline } from "../ui/primitives";
import { cronRows } from "../data";

function StatusCell({ s }: { s: string }) {
    // Determine status color map safely
    const statusMap: Record<string, "ok" | "late" | "idle" | "err"> = {
        "OK": "ok",
        "LATE": "late",
        "IDLE": "idle",
        "ERROR": "err"
    };

    return (
        <div className="flex items-center gap-2 text-[13px]">
            <Dot color={statusMap[s] || "idle"} />
            <span className="text-[color:var(--muted-2)] font-medium">
                {s}
            </span>
        </div>
    );
}

export function SignalsView() {
    const [selectedJob, setSelectedJob] = useState<string | null>(null);
    const [runningJobs, setRunningJobs] = useState<Set<number>>(new Set());

    const handleJobClick = (job: string) => {
        setSelectedJob(job === selectedJob ? null : job);
    };

    const handleToggleJob = (e: React.MouseEvent, idx: number) => {
        e.stopPropagation();
        setRunningJobs(prev => {
            const next = new Set(prev);
            if (next.has(idx)) {
                next.delete(idx);
            } else {
                next.add(idx);
            }
            return next;
        });
    };

    return (
        <>
            {/* table header */}
            <div className="px-4 pt-3">
                <div className="grid grid-cols-[100px_1.6fr_1fr_0.8fr_0.9fr_80px] gap-1 text-[11px] uppercase tracking-[0.12em] text-[color:var(--muted)] font-semibold">
                    <div>STATUS</div>
                    <div>JOB</div>
                    <div>SCHEDULE</div>
                    <div>LAST RUN</div>
                    <div>NEXT</div>
                    <div>ACTIONS</div>
                </div>
            </div>

            <Hairline className="mt-3" />

            {/* rows */}
            <div className="flex-1 overflow-auto">
                <div className="px-4">
                    {cronRows.map((r, idx) => {
                        const isSelected = selectedJob === r.job;
                        const isRunning = runningJobs.has(idx);

                        return (
                            <div
                                key={idx}
                                onClick={() => handleJobClick(r.job)}
                                className={[
                                    "grid grid-cols-[100px_1.6fr_1fr_0.8fr_0.9fr_80px] gap-1 py-2.5 cursor-pointer rounded-lg transition-all items-center",
                                    isSelected
                                        ? "bg-[color:var(--panel)] border border-[color:var(--blue)]"
                                        : "hover:bg-[color:var(--panel)] border border-transparent"
                                ].join(" ")}
                            >
                                <StatusCell s={r.status} />

                                <div>
                                    <div className="text-[14px] text-[color:var(--text)] font-medium">{r.job}</div>
                                    <div className="text-[13px] text-[color:var(--muted-2)]">{r.sub}</div>
                                </div>

                                <div className="text-[13px] text-[color:var(--muted-2)] flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {r.schedule}
                                </div>
                                <div className="text-[13px] text-[color:var(--muted-2)]">{r.lastRun}</div>
                                <div className="text-[13px] text-[color:var(--muted-2)]">{r.next}</div>

                                {/* Action buttons */}
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={(e) => handleToggleJob(e, idx)}
                                        className={`p-1.5 rounded ${isRunning
                                            ? 'bg-[color:var(--err)] text-white'
                                            : 'bg-[color:var(--ok)] text-white hover:opacity-80'
                                            }`}
                                        title={isRunning ? 'Stop' : 'Run'}
                                    >
                                        {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                                    </button>
                                    <button
                                        className="p-1.5 rounded bg-[color:var(--panel-2)] text-[color:var(--muted-2)] hover:text-[color:var(--text)]"
                                        title="Restart"
                                    >
                                        <RotateCcw className="w-3 h-3" />
                                    </button>
                                </div>

                                {/* divider */}
                                <div className="col-span-6 h-px bg-[color:var(--stroke-2)] mt-2" />
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
