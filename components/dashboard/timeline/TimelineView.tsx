'use client';

import { useEffect, useState } from 'react';
import { FirestoreCard, subscribeToCards } from '@/lib/firestore';
import { useAppStore } from '@/lib/store';
import { Clock, Tag } from 'lucide-react';
import { STATUS_CONFIG } from '../shared/constants';
import { TaskStatus } from '../types';

export default function TimelineView() {
    const { selectedCategory } = useAppStore();
    const [allCards, setAllCards] = useState<FirestoreCard[]>([]);

    useEffect(() => {
        const unsub = subscribeToCards(setAllCards);
        return unsub;
    }, []);

    const cards = allCards
        .filter((c) => !selectedCategory || c.category === selectedCategory)
        .sort((a, b) => {
            const aTime = a.updatedAt?.toDate?.() || new Date(0);
            const bTime = b.updatedAt?.toDate?.() || new Date(0);
            return bTime.getTime() - aTime.getTime();
        });

    if (cards.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20" style={{ animation: 'fadeIn 0.5s ease-out' }}>
                <Clock className="w-12 h-12 mb-4" style={{ color: 'var(--color-vermilion-500)', opacity: 0.6 }} />
                <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>No Activity Yet</h2>
                <p style={{ color: 'var(--color-text-secondary)' }}>Create some cards and they&apos;ll appear here chronologically.</p>
            </div>
        );
    }

    const grouped = groupByDate(cards);

    return (
        <div className="max-w-3xl mx-auto" style={{ animation: 'fadeIn 0.4s ease-out' }}>
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>Timeline</h2>
                <p style={{ color: 'var(--color-text-secondary)' }}>Your project history, chronologically organized</p>
            </div>

            <div className="space-y-8">
                {Object.entries(grouped).map(([dateLabel, dateCards]) => (
                    <div key={dateLabel}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="px-3 py-1.5 rounded-lg text-sm font-semibold" style={{
                                background: 'linear-gradient(135deg, rgba(255, 61, 46, 0.15), rgba(255, 61, 46, 0.05))',
                                color: 'var(--color-vermilion-400)',
                                border: '1px solid rgba(255, 61, 46, 0.2)',
                            }}>
                                {dateLabel}
                            </div>
                            <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
                            <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                                {dateCards.length} item{dateCards.length > 1 ? 's' : ''}
                            </span>
                        </div>

                        <div className="space-y-3">
                            {dateCards.map((card) => (
                                <TimelineCard key={card.id} card={card} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function TimelineCard({ card }: { card: FirestoreCard }) {
    const statusKey = (card.status || 'backlog') as TaskStatus;
    // Fallback to backlog if status is unknown in config
    const config = STATUS_CONFIG[statusKey] || STATUS_CONFIG['backlog'];
    const StatusIcon = config.icon;
    const time = card.updatedAt?.toDate
        ? card.updatedAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : '';

    return (
        <div className="timeline-node pb-6">
            <div
                className="rounded-xl p-4 transition-all duration-200"
                style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1.5px solid var(--color-border)' }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 61, 46, 0.3)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-border)';
                    e.currentTarget.style.boxShadow = 'none';
                }}
            >
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{card.title}</h3>
                    <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{time}</span>
                </div>

                {card.description && (
                    <p className="text-sm mb-3 line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>{card.description}</p>
                )}

                <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md" style={{
                        backgroundColor: `${config.color}15`,
                        color: config.color,
                        border: `1px solid ${config.color}30`,
                    }}>
                        <StatusIcon className="w-3 h-3" />{config.label}
                    </div>
                    <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                        <Tag className="w-3 h-3" />{card.category}
                    </div>
                    {card.tags.length > 0 && (
                        <div className="flex gap-1 ml-auto">
                            {card.tags.slice(0, 3).map((tag) => <span key={tag} className="tag">{tag}</span>)}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function groupByDate(cards: FirestoreCard[]): Record<string, FirestoreCard[]> {
    const groups: Record<string, FirestoreCard[]> = {};
    const now = new Date();
    const today = now.toDateString();
    const yesterday = new Date(now.getTime() - 86400000).toDateString();

    cards.forEach((card) => {
        const date = card.updatedAt?.toDate ? card.updatedAt.toDate() : new Date();
        const dateStr = date.toDateString();
        let label: string;

        if (dateStr === today) label = 'Today';
        else if (dateStr === yesterday) label = 'Yesterday';
        else label = date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

        if (!groups[label]) groups[label] = [];
        groups[label].push(card);
    });

    return groups;
}
