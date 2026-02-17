"use client";

import { useState, useEffect } from "react";
import { Panel, Hairline } from "./primitives";
import { inspector } from "../data";
import { AgentItem } from "../types";
import StatusBadge from "../StatusBadge";
import { CheckSquare2, Folder, FileText, Activity, Clock, Database, Network, Cpu, Trash2, Download, Eye, MoreHorizontal, Terminal, HardDrive } from "lucide-react";

function InspectorTab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="relative flex h-full items-center px-4 hover:bg-[color:var(--panel)] transition-colors"
        >
            <div className={["text-[14px] font-medium", active ? "text-[color:var(--tab-active)]" : "text-[color:var(--tab-inactive)]"].join(" ")}>
                {label}
            </div>
            {active ? (
                <div className="absolute bottom-0 left-1/2 h-[2px] w-[80%] -translate-x-1/2 bg-[color:var(--blue)] shadow-[0_0_8px_rgba(37,99,237,0.3)]" />
            ) : null}
        </button>
    );
}

interface FileItem {
    name: string;
    kind: "folder" | "file";
    meta: string;
    size?: string;
    modified?: string;
}

export function RightInspector({ agent }: { agent?: AgentItem | null }) {
    const [activeTab, setActiveTab] = useState("Overview");
    const [files, setFiles] = useState<FileItem[]>(inspector.items as unknown as FileItem[]);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [showMenu, setShowMenu] = useState<string | null>(null);

    // Reset tab when agent changes
    useEffect(() => {
        if (agent) {
            const timer = setTimeout(() => setActiveTab("Overview"), 0);
            return () => clearTimeout(timer);
        }
    }, [agent]);

    // System metrics (for when no agent is selected)
    const [metrics] = useState({
        status: "Running",
        uptime: "2d 14h 32m",
        memory: { used: 2.4, total: 8 },
        network: 45.2,
        cpu: 23,
        requests: 1247,
        errors: 3,
        lastSync: "2 min ago"
    });

    // Mock logs for the agent
    const mockLogs = [
        "[info] Starting process...",
        "[info] Connected to database",
        "[warn] Response time > 500ms",
        "[info] Processing batch 1024",
        "[info] Task completed successfully"
    ];

    const handleDeleteFile = (fileName: string) => {
        setFiles(prev => prev.filter(f => f.name !== fileName));
        setShowMenu(null);
    };

    const handleViewFile = (fileName: string) => {
        alert(`Opening ${fileName}...`);
        setShowMenu(null);
    };

    const handleDownloadFile = (fileName: string) => {
        alert(`Downloading ${fileName}...`);
        setShowMenu(null);
    };

    const title = agent ? agent.title : inspector.title;
    const meta = agent ? `${agent.model} · ${agent.statusDot}` : inspector.meta;

    return (
        <Panel className="h-full overflow-hidden flex flex-col">
            {/* header */}
            <div className="px-4 pt-4 pb-0">
                <div className="flex items-start gap-3">
                    <div className="mt-[2px] flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[color:var(--panel-2)] to-[color:var(--panel)] shadow-inner border border-[var(--stroke)]">
                        {agent ? <Activity className="h-5 w-5 text-[var(--blue)]" /> : <CheckSquare2 className="h-5 w-5 text-[var(--ok)]" />}
                    </div>

                    <div className="flex-1">
                        <div className="text-[16px] text-[color:var(--text)] font-bold tracking-tight">{agent ? agent.title : "System Overview"}</div>
                        <div className="mt-0.5 flex items-center gap-2">
                            {agent ? <StatusBadge status={agent.statusDot} /> : <div className="text-[13px] text-[color:var(--text-secondary)]">Monitoring active</div>}
                        </div>
                    </div>
                </div>
            </div>

            {/* tabs */}
            <div className="mt-4 h-[44px] border-b border-[color:var(--stroke)] px-2">
                <div className="flex h-full items-center gap-1">
                    {["Overview", "Files", "Logs"].map((tab) => (
                        <InspectorTab
                            key={tab}
                            label={tab}
                            active={activeTab === tab}
                            onClick={() => setActiveTab(tab)}
                        />
                    ))}
                </div>
            </div>

            {/* content */}
            <div className="flex-1 overflow-auto px-4 py-4">
                {activeTab === "Overview" ? (
                    <div className="space-y-4">
                        {/* Details Card */}
                        <div className="rounded-xl bg-[color:var(--panel)] p-4 border border-[color:var(--stroke)] shadow-sm">
                            <h3 className="text-[12px] uppercase tracking-wider font-bold text-[var(--text-tertiary)] mb-3">
                                {agent ? "Performance" : "System Status"}
                            </h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-[12px] text-[var(--text-secondary)] mb-1">CPU Usage</div>
                                    <div className="text-[18px] font-mono font-semibold text-[var(--text)]">{agent ? "12%" : metrics.cpu + "%"}</div>
                                    <div className="h-1 bg-[var(--panel-2)] rounded-full mt-1.5 overflow-hidden"><div className="h-full bg-[var(--blue)] w-[12%]" /></div>
                                </div>
                                <div>
                                    <div className="text-[12px] text-[var(--text-secondary)] mb-1">Memory</div>
                                    <div className="text-[18px] font-mono font-semibold text-[var(--text)]">{agent ? "256MB" : metrics.memory.used + "GB"}</div>
                                    <div className="h-1 bg-[var(--panel-2)] rounded-full mt-1.5 overflow-hidden"><div className="h-full bg-[var(--purple)] w-[40%]" /></div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-[var(--bg-1)] rounded-lg border border-[var(--stroke)] flex flex-col justify-center items-center text-center">
                                <Clock className="w-5 h-5 text-[var(--text-tertiary)] mb-2" />
                                <div className="text-[11px] text-[var(--text-secondary)] uppercase tracking-wide">Last Run</div>
                                <div className="text-[13px] font-medium mt-0.5">{agent ? agent.last : metrics.lastSync}</div>
                            </div>
                            <div className="p-3 bg-[var(--bg-1)] rounded-lg border border-[var(--stroke)] flex flex-col justify-center items-center text-center">
                                <HardDrive className="w-5 h-5 text-[var(--text-tertiary)] mb-2" />
                                <div className="text-[11px] text-[var(--text-secondary)] uppercase tracking-wide">Storage</div>
                                <div className="text-[13px] font-medium mt-0.5">{agent ? agent.size : "85%"}</div>
                            </div>
                        </div>

                        {agent && (
                            <div className="rounded-xl bg-[color:var(--panel)] p-4 border border-[color:var(--stroke)]">
                                <h3 className="text-[12px] uppercase tracking-wider font-bold text-[var(--text-tertiary)] mb-2">Capabilities</h3>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-2 py-1 rounded bg-[var(--bg-1)] border border-[var(--stroke)] text-[11px] text-[var(--text-secondary)]">File Access</span>
                                    <span className="px-2 py-1 rounded bg-[var(--bg-1)] border border-[var(--stroke)] text-[11px] text-[var(--text-secondary)]">Network</span>
                                    <span className="px-2 py-1 rounded bg-[var(--bg-1)] border border-[var(--stroke)] text-[11px] text-[var(--text-secondary)]">Compute</span>
                                </div>
                            </div>
                        )}
                    </div>
                ) : activeTab === "Files" ? (
                    <div className="space-y-1">
                        {files.map((it) => (
                            <div
                                key={it.name}
                                onClick={() => setSelectedFile(it.name === selectedFile ? null : it.name)}
                                className={[
                                    "flex h-[40px] items-center justify-between rounded-lg px-3 text-[13px] cursor-pointer transition-all group relative",
                                    selectedFile === it.name
                                        ? "bg-[color:var(--panel)] border border-[color:var(--blue)]"
                                        : "hover:bg-[color:var(--panel)]"
                                ].join(" ")}
                            >
                                <div className="flex items-center gap-2">
                                    {it.kind === "folder" ? (
                                        <Folder className="h-4 w-4 text-[color:var(--late)]" />
                                    ) : (
                                        <FileText className="h-4 w-4 text-[color:var(--blue)]" />
                                    )}
                                    <span className="text-[color:var(--text)]">{it.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[color:var(--text-secondary)]">{it.meta}</span>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setShowMenu(showMenu === it.name ? null : it.name); }}
                                        className="p-1 rounded hover:bg-[color:var(--panel-2)] opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <MoreHorizontal className="w-4 h-4 text-[color:var(--muted)]" />
                                    </button>
                                </div>

                                {/* Context Menu */}
                                {showMenu === it.name && (
                                    <div className="absolute right-2 top-full mt-1 bg-[color:var(--panel)] border border-[color:var(--stroke)] rounded-lg shadow-xl z-10 py-1 min-w-[120px]">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleViewFile(it.name); }}
                                            className="flex items-center gap-2 w-full px-3 py-2 text-[12px] text-[color:var(--text-secondary)] hover:bg-[color:var(--panel-2)] hover:text-[color:var(--text)]"
                                        >
                                            <Eye className="w-3.5 h-3.5" /> View
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDownloadFile(it.name); }}
                                            className="flex items-center gap-2 w-full px-3 py-2 text-[12px] text-[color:var(--text-secondary)] hover:bg-[color:var(--panel-2)] hover:text-[color:var(--text)]"
                                        >
                                            <Download className="w-3.5 h-3.5" /> Download
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDeleteFile(it.name); }}
                                            className="flex items-center gap-2 w-full px-3 py-2 text-[12px] text-[color:var(--err)] hover:bg-[color:var(--status-err-bg)]"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" /> Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}

                        {files.length === 0 && (
                            <div className="text-center py-8 text-[13px] text-[color:var(--muted)]">
                                No files in this agent
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="h-full bg-[var(--bg-0)] rounded-lg border border-[var(--stroke)] p-3 font-mono text-[12px] overflow-auto">
                        <div className="text-[var(--text-tertiary)] mb-2">Session started...</div>
                        {mockLogs.map((log, i) => (
                            <div key={i} className="mb-1">
                                <span className={log.includes("[warn]") ? "text-[var(--late)]" : log.includes("[error]") ? "text-[var(--err)]" : "text-[var(--blue)]"}>{log.split(' ')[0]}</span>
                                <span className="text-[var(--text-secondary)] opacity-80 pl-2">{log.substring(log.indexOf(' ') + 1)}</span>
                            </div>
                        ))}
                        <div className="animate-pulse text-[var(--blue)]">_</div>
                    </div>
                )}
            </div>

            <MailboxStatusFooter />
        </Panel>
    );
}

function MailboxStatusFooter() {
    return (
        <div className="h-8 border-t border-[var(--stroke)] flex items-center px-4 justify-between bg-[var(--bg-1)]">
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--ok)] animate-pulse" />
                <span className="text-[10px] font-medium text-[var(--text-secondary)]">Connected to Mainnet</span>
            </div>
            <Terminal className="w-3 h-3 text-[var(--text-tertiary)]" />
        </div>
    );
}
