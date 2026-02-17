import { VideoScene } from "@/lib/firestore";

export type ContentStatus = 'draft' | 'ready-review' | 'approved' | 'revision';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type ContentType = 'youtube' | 'tiktok' | 'reel';
export type Visibility = 'public' | 'private' | 'unlisted';

export const STATUS_CONFIG: Record<ContentStatus, { label: string; color: string; bg: string }> = {
    draft: { label: 'Draft', color: 'text-[var(--text-tertiary)]', bg: 'bg-[var(--text-tertiary)]/10' },
    'ready-review': { label: 'Ready', color: 'text-[var(--warning)]', bg: 'bg-[var(--warning)]/10' },
    approved: { label: 'Approved', color: 'text-[var(--success)]', bg: 'bg-[var(--success)]/10' },
    revision: { label: 'Revision', color: 'text-[var(--err)]', bg: 'bg-[var(--err)]/10' },
};

export const PRIORITY_CONFIG: Record<Priority, { label: string; color: string }> = {
    low: { label: 'Low', color: 'text-[var(--text-tertiary)]' },
    medium: { label: 'Medium', color: 'text-[var(--warning)]' },
    high: { label: 'High', color: 'text-[var(--orange)]' },
    urgent: { label: 'Urgent', color: 'text-[var(--err)]' },
};

export interface StudioRowProps {
    scene: VideoScene;
    onUpdate: (field: keyof VideoScene, value: any) => void;
    onDelete: () => void;
    dragControls: any;
}
