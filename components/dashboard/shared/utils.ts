import { TaskStatus } from '../types';

export function getStatusColor(status: string): string {
    switch (status) {
        case 'complete': return '#10b981';
        case 'in-progress': return '#f97316';
        case 'review': return '#8b5cf6';
        default: return '#6b7280';
    }
}

export function toDate(value: any): Date | null {
    try {
        if (!value) return null;
        if (typeof value?.toDate === 'function') return value.toDate();
        const d = new Date(value);
        return Number.isNaN(d.getTime()) ? null : d;
    } catch {
        return null;
    }
}

export function formatDateKey(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getTimeAgo(timestamp: any): string {
    if (!timestamp) return 'Just now';
    const date = toDate(timestamp);
    if (!date) return 'Unknown';

    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const mins = Math.floor(diff / 60000);

    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString();
}
