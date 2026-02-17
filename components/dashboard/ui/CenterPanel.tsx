"use client";

import { useState } from "react";
import { Panel, Dot, Hairline } from "./primitives";
import { centerTabs } from "../data";
import { Plus } from "lucide-react";
import { DecisionsView } from "../center/DecisionsView";
import { PromptsView } from "../center/PromptsView";
import { CostsView } from "../center/CostsView";
import { SignalsView } from "../center/SignalsView";

function Badge({ n }: { n: number }) {
    return (
        <span className="ml-2 rounded-full bg-[rgba(233,67,87,0.12)] px-2 py-[1px] text-[12px] text-[color:var(--err)]">
            {n}
        </span>
    );
}

function Tab({ label, badge, active, onClick }: { label: string; badge?: number; active?: boolean; onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            className="relative flex h-full items-center px-5 hover:bg-[color:var(--panel)] transition-colors"
        >
            <div className={["text-[13px] font-medium", active ? "text-[color:var(--tab-active)]" : "text-[color:var(--tab-inactive)]"].join(" ")}>
                {label}{typeof badge === "number" ? <Badge n={badge} /> : null}
            </div>
            {active ? (
                <div className="absolute bottom-0 left-1/2 h-[3px] w-[80%] -translate-x-1/2 bg-[color:var(--blue)] shadow-[0_0_8px_rgba(37,99,237,0.3)]" />
            ) : null}
        </button>
    );
}

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

export function CenterPanel() {
    const [activeTab, setActiveTab] = useState("Signals"); // Default to Signals (existing table)
    const [tabs, setTabs] = useState(centerTabs);

    const handleAddTab = () => {
        const newTabName = prompt("Enter new tab name:");
        if (newTabName) {
            setTabs([...tabs, { label: newTabName }]);
            setActiveTab(newTabName);
        }
    };

    return (
        <Panel className="h-full overflow-hidden">
            <div className="flex h-full flex-col">
                {/* tabs */}
                <div className="h-[48px] border-b border-[color:var(--stroke)] bg-[color:var(--bg-1)] flex items-center justify-between pr-2">
                    <div className="flex h-full items-center">
                        {tabs.map((t, i) => (
                            <div key={t.label} className="flex h-full items-center">
                                <Tab
                                    label={t.label}
                                    badge={t.badge}
                                    active={activeTab === t.label}
                                    onClick={() => setActiveTab(t.label)}
                                />
                                {/* Separator */}
                                <div className="h-4 w-[1px] bg-[color:var(--stroke)]" />
                            </div>
                        ))}
                        {/* Add Button */}
                        <button
                            onClick={handleAddTab}
                            className="h-full px-3 text-[color:var(--muted-2)] hover:text-[color:var(--blue)] transition-colors"
                            title="Add Tab"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                {activeTab === "Signals" ? (
                    <SignalsView />
                ) : activeTab === "Decisions" ? (
                    <DecisionsView />
                ) : activeTab === "Prompts" ? (
                    <PromptsView />
                ) : activeTab === "Costs" ? (
                    <CostsView />
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-[color:var(--muted)]">
                        <div className="text-4xl mb-4 opacity-20">
                            📁
                        </div>
                        <div className="text-sm font-mono uppercase tracking-wider">
                            {activeTab} Module Not Loaded
                        </div>
                    </div>
                )}
            </div>
        </Panel>
    );
}
