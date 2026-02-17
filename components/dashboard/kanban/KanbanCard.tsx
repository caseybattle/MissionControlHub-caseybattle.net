'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FirestoreCard, deleteCard, getDueDateInfo } from '@/lib/firestore';
import { Calendar, Tag as TagIcon, Pencil, Trash2, MoreVertical, CheckSquare, Link2, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import Portal from '../../Portal';
// Fix import path for Portal if it's in components/dashboard/Portal.tsx or components/Portal.tsx
// Portal is currently in components/KanbanCard.tsx imports as './Portal', meaning components/Portal.tsx
// So from components/dashboard/kanban/KanbanCard.tsx it is ../../Portal.tsx ? No, wait.
// Original file was components/KanbanCard.tsx importing ./Portal. So Portal is components/Portal.tsx.
// New path: components/dashboard/kanban/KanbanCard.tsx -> ../../Portal.tsx.

import { PRIORITY_CONFIG } from '../shared/constants';
import { getTimeAgo } from '../shared/utils';
import { TaskPriority } from '../types';

interface KanbanCardProps {
    card: FirestoreCard;
    onEdit: (card: FirestoreCard) => void;
}

export default function KanbanCard({ card, onEdit }: KanbanCardProps) {
    const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: card.id! });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    // Close menu on scroll or resize or outside click
    useEffect(() => {
        if (!menuPosition) return;

        const handleClose = () => setMenuPosition(null);

        window.addEventListener('scroll', handleClose, { capture: true }); // Capture to detect any scroll
        window.addEventListener('resize', handleClose);
        document.addEventListener('mousedown', handleClose);

        return () => {
            window.removeEventListener('scroll', handleClose, { capture: true });
            window.removeEventListener('resize', handleClose);
            document.removeEventListener('mousedown', handleClose);
        };
    }, [menuPosition]);

    const handleMenuClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent drag start
        e.preventDefault();

        // Toggle logic
        if (menuPosition) {
            setMenuPosition(null);
            return;
        }

        const rect = e.currentTarget.getBoundingClientRect();
        const menuHeight = 90; // Approx height
        const menuWidth = 140;
        const spaceBelow = window.innerHeight - rect.bottom;

        let top = rect.bottom + 5;
        // If near bottom, show above
        if (spaceBelow < menuHeight) {
            top = rect.top - menuHeight - 5;
        }

        // Align right edge
        let left = rect.right - menuWidth;
        if (left < 10) left = 10; // Margin safety

        setMenuPosition({ top, left });
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (card.id) {
            if (confirm('Are you sure you want to delete this card?')) {
                await deleteCard(card.id);
            }
        }
        setMenuPosition(null);
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit(card);
        setMenuPosition(null);
    };

    const priorityConfig = PRIORITY_CONFIG[(card.priority || 'medium') as TaskPriority];
    const dueDateInfo = getDueDateInfo(card.dueDate);
    const checklistDone = (card.checklist || []).filter((i) => i.done).length;
    const checklistTotal = (card.checklist || []).length;
    const linkCount = (card.links || []).length;

    return (
        <>
            <div
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                className="kanban-card group relative"
            >
                {/* Priority stripe */}
                <div
                    className="absolute top-0 left-0 right-0 h-[3px] rounded-t-lg"
                    style={{ backgroundColor: priorityConfig.dot }}
                />

                {/* Menu button */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onPointerDown={(e) => e.stopPropagation()} // Prevent drag functionality stealing click
                        onClick={handleMenuClick}
                        className="p-1 rounded transition-colors"
                        style={{ color: 'var(--color-text-tertiary)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                        <MoreVertical className="w-4 h-4" />
                    </button>
                </div>

                {/* Priority dot + Title */}
                <div className="flex items-start gap-2 mb-2 pr-6">
                    <div
                        className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                        style={{ backgroundColor: priorityConfig.dot }}
                        title={priorityConfig.label}
                    />
                    <h4 className="font-semibold line-clamp-2" style={{ color: 'var(--color-text-primary)' }}>
                        {card.title}
                    </h4>
                </div>

                {card.description && (
                    <p className="text-sm mb-3 line-clamp-2 ml-4" style={{ color: 'var(--color-text-secondary)' }}>
                        {card.description}
                    </p>
                )}

                {/* Due date badge */}
                {dueDateInfo && (
                    <div
                        className="flex items-center gap-1.5 mb-3 ml-4 text-xs font-medium px-2 py-1 rounded-md w-fit"
                        style={{
                            color: dueDateInfo.color,
                            backgroundColor: `${dueDateInfo.color}15`,
                            border: dueDateInfo.overdue ? `1px solid ${dueDateInfo.color}40` : 'none',
                        }}
                    >
                        {dueDateInfo.overdue ? <AlertCircle className="w-3 h-3" /> : <Calendar className="w-3 h-3" />}
                        {dueDateInfo.text}
                    </div>
                )}

                {/* Checklist progress */}
                {checklistTotal > 0 && (
                    <div className="flex items-center gap-2 mb-3 ml-4">
                        <CheckSquare className="w-3 h-3" style={{ color: checklistDone === checklistTotal ? '#10b981' : 'var(--color-text-tertiary)' }} />
                        <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-surface)' }}>
                            <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                    width: `${(checklistDone / checklistTotal) * 100}%`,
                                    backgroundColor: checklistDone === checklistTotal ? '#10b981' : 'var(--color-vermilion-500)',
                                }}
                            />
                        </div>
                        <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                            {checklistDone}/{checklistTotal}
                        </span>
                    </div>
                )}

                {/* Tags */}
                {card.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3 ml-4">
                        {card.tags.map((tag) => (
                            <span key={tag} className="tag">{tag}</span>
                        ))}
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between text-xs ml-4" style={{ color: 'var(--color-text-tertiary)' }}>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{getTimeAgo(card.createdAt)}</span>
                        </div>
                        {linkCount > 0 && (
                            <div className="flex items-center gap-1">
                                <Link2 className="w-3 h-3" />
                                <span>{linkCount}</span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        <TagIcon className="w-3 h-3" />
                        <span>{card.category}</span>
                    </div>
                </div>
            </div>

            {/* Render Menu via Portal */}
            {menuPosition && (
                <Portal>
                    <div
                        className="fixed z-[9999] rounded-lg py-1 min-w-[140px]"
                        style={{
                            top: menuPosition.top,
                            left: menuPosition.left,
                            backgroundColor: 'var(--color-surface-elevated)',
                            border: '1.5px solid var(--color-border)',
                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                            animation: 'fadeIn 0.15s ease-out',
                        }}
                        onMouseDown={(e) => e.stopPropagation()} // Prevent closing immediately
                    >
                        <button
                            onClick={handleEdit}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors"
                            style={{ color: 'var(--color-text-secondary)' }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                        >
                            <Pencil className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                            onClick={handleDelete}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors"
                            style={{ color: '#ef4444' }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                        >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                    </div>
                </Portal>
            )}
        </>
    );
}
