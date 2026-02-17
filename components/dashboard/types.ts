export type Status = "OK" | "LATE" | "IDLE" | "ERROR";

export type TaskStatus = 'backlog' | 'in-progress' | 'review' | 'complete';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface TaskLimit {
    status: TaskStatus;
    max?: number;
}


export interface CronJob {
    status: Status;
    job: string;
    sub: string;
    schedule: string;
    lastRun: string;
    next: string;
}

export interface DecisionItem {
    id: string;
    title: string;
    priority: "HIGH" | "MEDIUM" | "LOW";
    status: "WAITING" | "APPROVED" | "REJECTED";
    due: string;
    author: string;
}

export interface PromptItem {
    id: string;
    title: string;
    usage: string;
    lastUsed: string;
    tags: string[];
}

export interface CostItem {
    id: string;
    service: string;
    cost: string;
    trend: string;
    status: "OK" | "WARNING" | "CRITICAL";
}

export interface SidebarItem {
    title: string;
    model: string;
    cadence: string;
    files: string;
    size: string;
    tag: string;
    last: string;
    state: string;
    statusDot: Status;
}

export interface SidebarGroup {
    label: string;
    items: SidebarItem[];
}

export type AgentItem = SidebarItem;
export type Agent = SidebarItem;
