import { TaskStatus, TaskPriority } from '../types';
import { Clock, Play, Eye, CheckCircle, AlertCircle } from 'lucide-react';

export const KANBAN_COLUMNS: { id: TaskStatus; title: string; color: string; description: string }[] = [
    { id: 'backlog', title: 'Backlog', color: '#737373', description: 'Ideas & plans' },
    { id: 'in-progress', title: 'Start', color: '#3b82f6', description: 'Currently working' },
    { id: 'review', title: 'Review', color: '#8b5cf6', description: 'Needs attention' },
    { id: 'complete', title: 'Done', color: '#10b981', description: 'Mission accomplished' },
];

export const STATUS_CONFIG: Record<TaskStatus, { icon: any; label: string; color: string; bg?: string }> = {
    'backlog': { icon: Clock, label: 'Backlog', color: '#888888' },
    'in-progress': { icon: Play, label: 'In Progress', color: '#ffa198' },
    'review': { icon: Eye, label: 'Review', color: '#ff6b5e' },
    'complete': { icon: CheckCircle, label: 'Complete', color: '#ff3d2e' },
};

export const PRIORITY_CONFIG: Record<TaskPriority, { label: string; dot: string }> = {
    low: { label: 'Low', dot: '#94a3b8' },      // slate-400
    medium: { label: 'Medium', dot: '#3b82f6' }, // blue-500
    high: { label: 'High', dot: '#f97316' },     // orange-500
    urgent: { label: 'Urgent', dot: '#ef4444' }, // red-500
};
