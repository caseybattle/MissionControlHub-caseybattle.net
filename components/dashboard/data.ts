import { Status, CronJob, DecisionItem, PromptItem, CostItem, SidebarGroup } from "./types";

export type { Status };

export const topRightMeta = {
    agents: "10 agents",
    machine: "Mac Mini",
    issues: "6 issues",
    time: "21:01:30",
    date: "2023-10-25",
};

export const tickerText =
    "6 agents overdue: Maps Research, Radars Research, Builder, Training PM, NLW Tasks, AIDB Finance  * 2 high-priority decisions waiting";

export const sidebarGroups: SidebarGroup[] = [
    {
        label: "RESEARCH",
        items: [
            {
                title: "Maps Research",
                model: "opus-4.5",
                cadence: "30min",
                files: "117 files",
                size: "648.6KB",
                tag: "Unknown",
                last: "6d 19h ago",
                state: "Overdue",
                statusDot: "LATE",
            },
            {
                title: "Radars Research",
                model: "opus-4.5",
                cadence: "30min",
                files: "95 files",
                size: "881.1KB",
                tag: "Unknown",
                last: "6d 2h ago",
                state: "Overdue",
                statusDot: "LATE",
            },
        ],
    },
    {
        label: "BUILDER",
        items: [
            {
                title: "Builder",
                model: "opus-4.5",
                cadence: "60min",
                files: "10 files",
                size: "15.7KB",
                tag: "Unknown",
                last: "4d 10h ago",
                state: "Overdue",
                statusDot: "LATE",
            },
        ],
    },
    {
        label: "PROJECT MANAGERS",
        items: [
            {
                title: "Intel PM",
                model: "N",
                cadence: "daily",
                files: "8 files",
                size: "28.9KB",
                tag: "",
                last: "",
                state: "",
                statusDot: "IDLE",
            },
            {
                title: "Compass PM",
                model: "N",
                cadence: "daily",
                files: "8 files",
                size: "28.9KB",
                tag: "",
                last: "",
                state: "",
                statusDot: "OK",
            },
        ],
    },
];

export const centerTabs: { label: string; badge?: number; active?: boolean }[] = [
    { label: "Decisions", badge: 2 },
    { label: "Signals", active: true },
    { label: "Prompts" },
    { label: "Costs" },
];

export const cronRows: CronJob[] = [
    { status: "LATE", job: "Maps Research Heartbeat", sub: "Maps Research", schedule: "*/30  * * * *", lastRun: "6d 19h ago", next: "overdue  6d 18h ago" },
    { status: "LATE", job: "Radars Research Heartbeat", sub: "Radars Research", schedule: "*/30  * * * *", lastRun: "6d 2h ago", next: "overdue  6d 1h ago" },
    { status: "LATE", job: "Builder Heartbeat", sub: "Builder", schedule: "*/60  * * * *", lastRun: "4d 10h ago", next: "overdue  4d 9h ago" },
    { status: "OK", job: "Intel PM Heartbeat", sub: "Intel PM", schedule: "0 9 * * *", lastRun: "1d 8h ago", next: "overdue  8h 19m ago" },
    { status: "OK", job: "Compass PM Heartbeat", sub: "Compass PM", schedule: "0 9 * * *", lastRun: "1d 8h ago", next: "overdue  8h 21m ago" },
    { status: "OK", job: "Growth PM Heartbeat", sub: "Growth PM", schedule: "0 9 * * *", lastRun: "1d 8h ago", next: "overdue  8h 22m ago" },
    { status: "LATE", job: "Training PM Heartbeat", sub: "Training PM", schedule: "0 9 * * *", lastRun: "2d 6h ago", next: "overdue  1d 6h ago" },
    { status: "LATE", job: "NLW Tasks Heartbeat", sub: "NLW Tasks", schedule: "0 9 * * *", lastRun: "2d 2h ago", next: "overdue  1d 2h ago" },
    { status: "LATE", job: "AIDB Finance Heartbeat", sub: "AIDB Finance", schedule: "0 9 * * *", lastRun: "3d 2h ago", next: "overdue  2d 2h ago" },
    { status: "OK", job: "Chief of Staff Heartbeat", sub: "Chief of Staff", schedule: "0 9 * * *", lastRun: "1d 8h ago", next: "overdue  8h 17m ago" },
];

export const inspector = {
    title: "NLW Tasks",
    meta: "sonnet-4.5 · Overdue",
    tabs: ["Overview", "Files"],
    activeTab: "Files",
    items: [
        { kind: "folder", name: "completed", meta: "2d 1h ago" },
        { kind: "folder", name: "daily", meta: "2d 1h ago" },
        { kind: "folder", name: "memory", meta: "2d 1h ago" },
        { kind: "file", name: "AGENTS.md", meta: "2.6KB  2d 1h ago" },
        { kind: "file", name: "CONTENT_IDEAS.md", meta: "122B  22h 10m ago" },
        { kind: "file", name: "HEARTBEAT.md", meta: "1088B  2d 1h ago" },
        { kind: "file", name: "ICEBOX.md", meta: "1998B  23h 33m ago" },
        { kind: "file", name: "IDENTITY.md", meta: "1738B  2d 1h ago" },
        { kind: "file", name: "PACKING.md", meta: "1268B  1d 4h ago" },
        { kind: "file", name: "SOUL.md", meta: "2.4KB  2d 1h ago" },
        { kind: "file", name: "STATUS.md", meta: "748B  1d 7h ago" },
        { kind: "file", name: "TODO.md", meta: "1.4KB  3h 1m ago" },
        { kind: "file", name: "TOOLS.md", meta: "568B  2d 1h ago" },
        { kind: "file", name: "USER.md", meta: "959B  2d 1h ago" },
    ],
};

export const decisionRows: DecisionItem[] = [
    {
        id: "dec-1",
        title: "Approve Q4 Marketing Budget",
        priority: "HIGH",
        status: "WAITING",
        due: "2h remaining",
        author: "Growth PM"
    },
    {
        id: "dec-2",
        title: "Merge 'Feature/Auth-v2' Branch",
        priority: "MEDIUM",
        status: "WAITING",
        due: "5h remaining",
        author: "Builder"
    }
];

export const promptRows: PromptItem[] = [
    {
        id: "p-1",
        title: "Daily Standup Summary",
        usage: "Used 142 times",
        lastUsed: "2h ago",
        tags: ["Productivity", "Team"]
    },
    {
        id: "p-2",
        title: "Code Review Assistant",
        usage: "Used 89 times",
        lastUsed: "5h ago",
        tags: ["Dev", "Quality"]
    },
    {
        id: "p-3",
        title: "Tweet Generator",
        usage: "Used 24 times",
        lastUsed: "1d ago",
        tags: ["Marketing", "Social"]
    }
];

export const costRows: CostItem[] = [
    {
        id: "c-1",
        service: "OpenAI API",
        cost: "$42.50",
        trend: "+12%",
        status: "OK"
    },
    {
        id: "c-2",
        service: "Anthropic API",
        cost: "$28.10",
        trend: "-5%",
        status: "OK"
    },
    {
        id: "c-3",
        service: "Firebase",
        cost: "$14.22",
        trend: "+2%",
        status: "OK"
    },
    {
        id: "c-4",
        service: "Vercel",
        cost: "$0.00",
        trend: "0%",
        status: "OK"
    }
];
