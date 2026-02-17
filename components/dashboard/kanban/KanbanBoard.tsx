'use client';

import { useState } from 'react';
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
    useDroppable,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { FirestoreCard, updateCard } from '@/lib/firestore';
import { Plus } from 'lucide-react';
import KanbanCard from './KanbanCard';
import { KANBAN_COLUMNS } from '../shared/constants';
import { TaskStatus } from '../types';

interface KanbanBoardProps {
    cards: FirestoreCard[];
    onEditCard: (card: FirestoreCard) => void;
    onNewCard: () => void;
}

function DroppableColumn({
    id, title, color, description, cards, onEditCard, onNewCard,
}: {
    id: string; title: string; color: string; description: string;
    cards: FirestoreCard[]; onEditCard: (card: FirestoreCard) => void; onNewCard: () => void;
}) {
    const { setNodeRef, isOver } = useDroppable({ id });

    return (
        <div
            ref={setNodeRef}
            className="kanban-column min-w-[280px] snap-center md:snap-align-none flex-shrink-0 md:flex-shrink md:min-w-0"
            style={{
                borderColor: isOver ? 'var(--blue)' : undefined,
                boxShadow: isOver ? '0 0 20px rgba(37, 99, 235, 0.15)' : undefined,
                transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
        >
            <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                    <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{title}</h3>
                    <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text-tertiary)' }}
                    >
                        {cards.length}
                    </span>
                </div>
                <button
                    onClick={onNewCard}
                    className="p-1 rounded transition-colors opacity-60 hover:opacity-100"
                    style={{ color: 'var(--color-text-tertiary)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>

            <p className="text-xs mb-3" style={{ color: 'var(--color-text-tertiary)' }}>{description}</p>

            <SortableContext items={cards.map((c) => c.id!)} strategy={verticalListSortingStrategy}>
                <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
                    {cards.map((card) => (
                        <KanbanCard key={card.id} card={card} onEdit={onEditCard} />
                    ))}
                    {cards.length === 0 && (
                        <div
                            className="text-center py-8 text-sm rounded-lg border border-dashed"
                            style={{ color: 'var(--color-text-tertiary)', borderColor: 'var(--color-border)' }}
                        >
                            Drop cards here
                        </div>
                    )}
                </div>
            </SortableContext>
        </div>
    );
}

export default function KanbanBoard({ cards, onEditCard, onNewCard }: KanbanBoardProps) {
    const [activeCard, setActiveCard] = useState<FirestoreCard | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
    );

    const handleDragStart = (event: DragStartEvent) => {
        const card = cards.find((c) => c.id === event.active.id);
        setActiveCard(card || null);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveCard(null);
        if (!over) return;

        const cardId = active.id as string;
        const targetId = over.id as string;

        const isColumn = KANBAN_COLUMNS.some((col) => col.id === targetId);
        const newStatus = isColumn
            ? (targetId as TaskStatus)
            : (cards.find((c) => c.id === targetId)?.status as TaskStatus);

        if (!newStatus) return;

        const card = cards.find((c) => c.id === cardId);
        if (!card || card.status === newStatus) return;

        await updateCard(cardId, {
            status: newStatus,
            ...(newStatus === 'complete' && { completedAt: null }),
        });
    };

    const getCardsForColumn = (status: TaskStatus) =>
        cards.filter((card) => card.status === status);

    return (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex gap-4 h-full overflow-x-auto pb-4 snap-x snap-mandatory md:snap-none">
                {KANBAN_COLUMNS.map((column) => (
                    <DroppableColumn
                        key={column.id}
                        id={column.id}
                        title={column.title}
                        color={column.color}
                        description={column.description}
                        cards={getCardsForColumn(column.id)}
                        onEditCard={onEditCard}
                        onNewCard={onNewCard}
                    />
                ))}
            </div>

            <DragOverlay>
                {activeCard ? (
                    <div className="kanban-card rotate-3 scale-105" style={{ boxShadow: '0 20px 40px rgba(255, 61, 46, 0.25)' }}>
                        <h4 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{activeCard.title}</h4>
                        {activeCard.description && (
                            <p className="text-sm mt-1 line-clamp-1" style={{ color: 'var(--color-text-secondary)' }}>{activeCard.description}</p>
                        )}
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
