"use client";

import { useState, useEffect } from "react";
import { Flame, Trello, FileText, Video, Lightbulb, Calendar, Inbox, Layers } from "lucide-react";
import { Panel } from "./primitives";
import { sidebarGroups } from "../data";
import { useAppStore } from "@/lib/store";
import { BattleLabsLogo } from "./Logo";
import { ThemeSwitcher } from "./ThemeSwitcher";

export function TopHeader() {
    const { viewMode, setViewMode } = useAppStore();
    const [currentTime, setCurrentTime] = useState<Date | null>(null);

    // Update clock every second
    // Update clock every second
    useEffect(() => {
        // Initial set
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);


    // Count agents
    const agentCount = sidebarGroups.reduce((acc, g) => acc + g.items.length, 0);
    const overdueCount = sidebarGroups.reduce((acc, g) =>
        acc + g.items.filter(i => i.statusDot === "LATE").length, 0);

    // Format time
    const timeString = currentTime ? currentTime.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'America/New_York'
    }) : "--:--:--";

    const navLinks = [
        { id: "dashboard", label: "Dashboard", icon: Flame },
        { id: "editor", label: "Editor", icon: FileText },
        { id: "inbox", label: "Inbox", icon: Inbox },
        { id: "kanban", label: "Kanban", icon: Trello },
        { id: "timeline", label: "Timeline", icon: Layers },
        { id: "portfolio", label: "Portfolio", icon: Lightbulb },
        { id: "calendar", label: "Calendar", icon: Calendar },
    ] as const;

    return (
        <Panel className="h-[52px] bg-[color:var(--bg-1)] px-5">
            <div className="flex h-full items-center justify-between">
                <div className="flex items-center gap-6">
                    <button onClick={() => setViewMode('dashboard')} className="flex items-center gap-2 hover:opacity-80">
                        <BattleLabsLogo className="h-6 w-6" />
                        <div className="text-[17px] font-bold tracking-tight text-[color:var(--text)] font-[family-name:var(--font-orbitron)]">
                            BATTLE LABS <span className="text-[10px] bg-[var(--blue)] text-white px-1.5 py-0.5 rounded ml-2 align-middle">V2.0</span>
                        </div>
                    </button>

                    <ThemeSwitcher />

                    {/* Navigation Tabs */}

                </div>

                <div className="flex items-center gap-6 text-[14px] text-[color:var(--text-secondary)]">
                    <span className="font-medium">{agentCount} agents</span>
                    <span className="flex items-center gap-1.5">
                        <span className="inline-block h-2 w-2 rounded-full bg-[color:var(--late)] animate-pulse" />
                        <span className="font-medium">{overdueCount} issues</span>
                    </span>
                    <span className="text-[color:var(--text)] font-semibold text-[15px] font-mono">{timeString} EST</span>
                </div>
            </div>
        </Panel>
    );
}
