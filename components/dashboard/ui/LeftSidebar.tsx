"use client";

import { useState } from "react";
import { Panel, Hairline } from "./primitives";
import { sidebarGroups } from "../data";
import { Folder, Radar, Hammer, UserCircle2, GripVertical, Trash2 } from "lucide-react";

function GroupLabel({ children }: { children: string }) {
    return (
        <div className="px-5 pt-6 pb-2 text-[11px] uppercase tracking-[0.1em] text-[var(--color-text-tertiary)] font-bold">
            {children}
        </div>
    );
}



function AgentIcon({ title }: { title: string }) {
    const cls = "h-4 w-4 text-[color:var(--text-secondary)]";
    if (title.includes("Maps")) return <Folder className={cls} />;
    if (title.includes("Radars")) return <Radar className={cls} />;
    if (title === "Builder") return <Hammer className={cls} />;
    return <UserCircle2 className={cls} />;
}

interface AgentItem {
    title: string;
    model: string;
    cadence: string;
    files: string;
    size: string;
    tag: string;
    last: string;
    state: string;
    statusDot: "OK" | "LATE" | "IDLE" | "ERROR";
}

interface AgentGroup {
    label: string;
    items: AgentItem[];
}

import StatusBadge from "../StatusBadge";

export function LeftSidebar({
    onSelectAgent,
    selectedAgent
}: {
    onSelectAgent?: (agent: AgentItem) => void;
    selectedAgent?: string | null;
}) {
    // Local state for groups only
    const [groups, setGroups] = useState<AgentGroup[]>(sidebarGroups as unknown as AgentGroup[]);
    const [draggedItem, setDraggedItem] = useState<{ groupIndex: number; itemIndex: number } | null>(null);

    // If parent doesn't provide selection, we can optionally track it locally,
    // but better to rely on parent. For now, if prop is missing, we use local to avoid breaking.
    const [localSelected, setLocalSelected] = useState<string | null>(null);

    const activeSelected = selectedAgent !== undefined ? selectedAgent : localSelected;

    const handleAgentClick = (item: AgentItem) => {
        if (onSelectAgent) {
            onSelectAgent(item);
        } else {
            setLocalSelected(prev => prev === item.title ? null : item.title);
        }
    };

    const handleDragStart = (e: React.DragEvent, groupIndex: number, itemIndex: number) => {
        setDraggedItem({ groupIndex, itemIndex });
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, targetGroupIndex: number, targetItemIndex: number) => {
        e.preventDefault();
        if (!draggedItem) return;

        const { groupIndex: sourceGroupIndex, itemIndex: sourceItemIndex } = draggedItem;
        if (sourceGroupIndex === targetGroupIndex && sourceItemIndex === targetItemIndex) return;

        setGroups(prev => {
            const newGroups = [...prev.map(g => ({ ...g, items: [...g.items] }))];
            const [movedItem] = newGroups[sourceGroupIndex].items.splice(sourceItemIndex, 1);
            newGroups[targetGroupIndex].items.splice(targetItemIndex, 0, movedItem);
            return newGroups;
        });

        setDraggedItem(null);
    };

    const handleDelete = (groupIndex: number, itemIndex: number) => {
        setGroups(prev => prev.map((g, gi) => {
            if (gi === groupIndex) {
                return {
                    ...g,
                    items: g.items.filter((_, i) => i !== itemIndex)
                };
            }
            return g;
        }));
    };

    // Helper to count statuses in a group
    const getGroupStats = (items: AgentItem[]) => {
        const stats = { ok: 0, idle: 0, late: 0, err: 0 };
        items.forEach(it => {
            if (it.statusDot === "OK") stats.ok++;
            else if (it.statusDot === "IDLE") stats.idle++;
            else if (it.statusDot === "LATE") stats.late++;
            else if (it.statusDot === "ERROR") stats.err++;
        });
        return stats;
    };

    return (
        <Panel className="h-full overflow-hidden flex flex-col">
            {/* Removed top legend as requested */}

            {/* scroll area */}
            <div className="flex-1 overflow-auto py-2">
                {groups.map((g, groupIndex) => {
                    const stats = getGroupStats(g.items);
                    return (
                        <div key={g.label} className="mb-4 last:mb-0">
                            <div className="flex items-center justify-between px-4 pb-2 pt-2">
                                <span className="text-[11px] uppercase tracking-[0.1em] text-[var(--color-text-tertiary)] font-bold">{g.label}</span>
                                <div className="flex gap-2">
                                    {stats.ok > 0 && <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[var(--blue)] shadow-[0_0_4px_var(--blue)]" /><span className="text-[10px] text-[var(--muted)]">{stats.ok}</span></div>}
                                    {stats.late > 0 && <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[var(--late)]" /><span className="text-[10px] text-[var(--muted)]">{stats.late}</span></div>}
                                    {stats.err > 0 && <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[var(--err)]" /><span className="text-[10px] text-[var(--muted)]">{stats.err}</span></div>}
                                    {stats.idle > 0 && <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[var(--text-secondary)] opacity-50" /><span className="text-[10px] text-[var(--muted)]">{stats.idle}</span></div>}
                                </div>
                            </div>

                            <div className="mt-1 space-y-1 px-2">
                                {g.items.map((it, itemIndex) => {
                                    const isSelected = activeSelected === it.title;
                                    const isDragging = draggedItem?.groupIndex === groupIndex && draggedItem?.itemIndex === itemIndex;

                                    return (
                                        <div
                                            key={it.title}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, groupIndex, itemIndex)}
                                            onDragOver={handleDragOver}
                                            onDrop={(e) => handleDrop(e, groupIndex, itemIndex)}
                                            onClick={() => handleAgentClick(it)}
                                            className={[
                                                "rounded-[var(--r)] border bg-[color:var(--panel)] cursor-pointer transition-all group p-2.5",
                                                isSelected
                                                    ? "border-[color:var(--blue)] shadow-lg shadow-[color:var(--blue)]/10"
                                                    : "border-[color:var(--stroke)] hover:border-[rgba(125,164,220,0.25)] hover:bg-[rgba(255,255,255,0.02)]",
                                                isDragging ? "opacity-50" : ""
                                            ].join(" ")}
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <GripVertical className="w-3.5 h-3.5 text-[color:var(--muted)] cursor-grab shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    <AgentIcon title={it.title} />
                                                    <div className="text-[13px] text-[color:var(--text)] font-semibold truncate">{it.title}</div>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    {/* Simple dot status for compact view in card */}
                                                    <div className={`w-2 h-2 rounded-full ${it.statusDot === 'OK' ? 'bg-[var(--blue)] shadow-[0_0_6px_var(--blue)] animate-pulse' : it.statusDot === 'LATE' ? 'bg-[var(--late)] animate-pulse' : it.statusDot === 'ERROR' ? 'bg-[var(--err)] animate-pulse' : 'bg-[var(--text-secondary)] opacity-50'}`} />
                                                </div>
                                            </div>

                                            <div className="mt-2 text-[11px] text-[color:var(--text-secondary)] pl-[26px] flex flex-wrap gap-x-3 gap-y-0.5 opacity-80">
                                                <span>{it.model}</span>
                                                <span className="opacity-30">|</span>
                                                <span>{it.cadence}</span>
                                                <span className="opacity-30">|</span>
                                                <span>{it.files}</span>
                                                {it.last && (
                                                    <>
                                                        <span className="opacity-30">|</span>
                                                        <span className={it.statusDot === 'LATE' ? 'text-[var(--late)]' : ''}>{it.last}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </Panel>
    );
}
