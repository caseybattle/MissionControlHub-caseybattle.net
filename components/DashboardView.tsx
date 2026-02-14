'use client';

import { useEffect, useState } from 'react';
import { FirestoreCard, FirestoreCategory, subscribeToCards, subscribeToCategories, getDueDateInfo, PRIORITY_CONFIG } from '@/lib/firestore';
import { Rocket, AlertCircle, TrendingUp, CheckCircle, Clock, ArrowRight, Zap } from 'lucide-react';

interface DashboardViewProps {
    onNewCard: () => void;
    onEditCard: (card: FirestoreCard) => void;
}

export default function DashboardView({ onNewCard, onEditCard }: DashboardViewProps) {
    const [cards, setCards] = useState<FirestoreCard[]>([]);
    const [categories, setCategories] = useState<FirestoreCategory[]>([]);

    useEffect(() => {
        const unsub1 = subscribeToCards(setCards);
        const unsub2 = subscribeToCategories(setCategories);
        return () => { unsub1(); unsub2(); };
    }, []);

    // Computed data
    const inProgressCards = cards
        .filter((c) => c.status === 'in-progress')
        .sort((a, b) => {
            const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
            return (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2);
        })
        .slice(0, 3);

    const overdueCards = cards.filter((c) => {
        if (c.status === 'complete') return false;
        const info = getDueDateInfo(c.dueDate);
        return info?.overdue;
    });

    const completedCount = cards.filter((c) => c.status === 'complete').length;
    const totalCount = cards.length;
    const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    // Weekly completions (last 7 days)
    const now = new Date();
    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(now);
        d.setDate(d.getDate() - (6 - i));
        return d;
    });

    const weeklyCompletions = weekDays.map((day) => {
        return cards.filter((c) => {
            if (c.status !== 'complete' || !c.completedAt) return false;
            const completed = c.completedAt.toDate ? c.completedAt.toDate() : new Date(c.completedAt as any);
            return completed.toDateString() === day.toDateString();
        }).length;
    });
    const maxWeekly = Math.max(...weeklyCompletions, 1);

    // Category breakdown
    const categoryBreakdown = categories.map((cat) => {
        const catCards = cards.filter((c) => c.category === cat.name);
        const done = catCards.filter((c) => c.status === 'complete').length;
        return { ...cat, total: catCards.length, done, pct: catCards.length > 0 ? Math.round((done / catCards.length) * 100) : 0 };
    }).filter((c) => c.total > 0);

    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="space-y-6">
            {/* Top row — stats cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {[
                    { label: 'Total Cards', value: totalCount, icon: Rocket, color: '#ff3d2e' },
                    { label: 'In Progress', value: cards.filter((c) => c.status === 'in-progress').length, icon: Clock, color: '#f97316' },
                    { label: 'Completed', value: completedCount, icon: CheckCircle, color: '#10b981' },
                    { label: 'Overdue', value: overdueCards.length, icon: AlertCircle, color: overdueCards.length > 0 ? '#ef4444' : '#6b7280' },
                ].map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.label}
                            className="rounded-xl p-5 transition-all duration-200"
                            style={{
                                backgroundColor: 'var(--color-surface-elevated)',
                                border: '1.5px solid var(--color-border)',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = `${stat.color}60`;
                                e.currentTarget.style.boxShadow = `0 4px 20px ${stat.color}15`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'var(--color-border)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-lg" style={{ backgroundColor: `${stat.color}15` }}>
                                    <Icon className="w-5 h-5" style={{ color: stat.color }} />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
                                    <div className="text-xs font-medium" style={{ color: 'var(--color-text-tertiary)' }}>{stat.label}</div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Middle row — Focus + Weekly */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-4">
                {/* Today's Focus — 3 cols on desktop */}
                <div
                    className="md:col-span-3 rounded-xl p-4 md:p-5"
                    style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1.5px solid var(--color-border)' }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4" style={{ color: '#f97316' }} />
                            <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-primary)' }}>
                                Active Focus
                            </h3>
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{
                            backgroundColor: 'rgba(249, 115, 22, 0.1)',
                            color: '#f97316',
                        }}>
                            {inProgressCards.length} in progress
                        </span>
                    </div>

                    {inProgressCards.length > 0 ? (
                        <div className="space-y-3">
                            {inProgressCards.map((card) => {
                                const dueDateInfo = getDueDateInfo(card.dueDate);
                                const priority = PRIORITY_CONFIG[card.priority || 'medium'];
                                const checklistDone = (card.checklist || []).filter((i) => i.done).length;
                                const checklistTotal = (card.checklist || []).length;
                                return (
                                    <button
                                        key={card.id}
                                        onClick={() => onEditCard(card)}
                                        className="w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all group"
                                        style={{ backgroundColor: 'var(--color-surface)' }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)';
                                            e.currentTarget.style.borderColor = 'var(--color-border-bright)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'var(--color-surface)';
                                        }}
                                    >
                                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: priority.dot }} />
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-sm truncate" style={{ color: 'var(--color-text-primary)' }}>
                                                {card.title}
                                            </div>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{card.category}</span>
                                                {dueDateInfo && (
                                                    <span className="text-xs" style={{ color: dueDateInfo.color }}>{dueDateInfo.text}</span>
                                                )}
                                                {checklistTotal > 0 && (
                                                    <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                                                        {checklistDone}/{checklistTotal} done
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--color-text-tertiary)' }} />
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-sm mb-3" style={{ color: 'var(--color-text-tertiary)' }}>No cards in progress</p>
                            <button onClick={onNewCard} className="btn-vermilion text-sm">Create a Card</button>
                        </div>
                    )}
                </div>

                {/* Weekly Activity — 2 cols on desktop */}
                <div
                    className="md:col-span-2 rounded-xl p-4 md:p-5"
                    style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1.5px solid var(--color-border)' }}
                >
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-4 h-4" style={{ color: '#10b981' }} />
                        <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-primary)' }}>
                            Weekly Activity
                        </h3>
                    </div>

                    {/* Completion rate ring */}
                    <div className="flex items-center justify-center mb-5">
                        <div className="relative w-24 h-24">
                            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                                <circle cx="48" cy="48" r="40" fill="none" stroke="var(--color-surface)" strokeWidth="6" />
                                <circle
                                    cx="48" cy="48" r="40" fill="none"
                                    stroke="#10b981"
                                    strokeWidth="6"
                                    strokeLinecap="round"
                                    strokeDasharray={`${completionRate * 2.51} 251`}
                                    className="transition-all duration-1000"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{completionRate}%</span>
                                <span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>complete</span>
                            </div>
                        </div>
                    </div>

                    {/* Mini bar chart */}
                    <div className="flex items-end justify-between gap-1 h-12">
                        {weeklyCompletions.map((count, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                <div
                                    className="w-full rounded-sm transition-all duration-500"
                                    style={{
                                        height: `${Math.max(count > 0 ? (count / maxWeekly) * 100 : 8, 8)}%`,
                                        backgroundColor: count > 0 ? '#10b981' : 'var(--color-surface)',
                                        minHeight: '3px',
                                    }}
                                />
                                <span className="text-[9px]" style={{ color: 'var(--color-text-tertiary)' }}>
                                    {dayLabels[weekDays[i].getDay()]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom row — Overdue + Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {/* Overdue */}
                <div
                    className="rounded-xl p-5"
                    style={{ backgroundColor: 'var(--color-surface-elevated)', border: `1.5px solid ${overdueCards.length > 0 ? 'rgba(239, 68, 68, 0.3)' : 'var(--color-border)'}` }}
                >
                    <div className="flex items-center gap-2 mb-4">
                        <AlertCircle className="w-4 h-4" style={{ color: overdueCards.length > 0 ? '#ef4444' : 'var(--color-text-tertiary)' }} />
                        <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-primary)' }}>
                            Overdue
                        </h3>
                    </div>

                    {overdueCards.length > 0 ? (
                        <div className="space-y-2">
                            {overdueCards.slice(0, 4).map((card) => {
                                const dueDateInfo = getDueDateInfo(card.dueDate);
                                return (
                                    <button
                                        key={card.id}
                                        onClick={() => onEditCard(card)}
                                        className="w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-all"
                                        style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)' }}
                                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.05)'; }}
                                    >
                                        <span className="text-sm font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>{card.title}</span>
                                        <span className="text-xs shrink-0 ml-2" style={{ color: '#ef4444' }}>{dueDateInfo?.text}</span>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-sm text-center py-4" style={{ color: 'var(--color-text-tertiary)' }}>
                            All caught up — no overdue items
                        </p>
                    )}
                </div>

                {/* Category Breakdown */}
                <div
                    className="rounded-xl p-5"
                    style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1.5px solid var(--color-border)' }}
                >
                    <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--color-text-primary)' }}>
                        Category Progress
                    </h3>

                    {categoryBreakdown.length > 0 ? (
                        <div className="space-y-3">
                            {categoryBreakdown.map((cat) => (
                                <div key={cat.id}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>{cat.name}</span>
                                        <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{cat.done}/{cat.total}</span>
                                    </div>
                                    <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-surface)' }}>
                                        <div
                                            className="h-full rounded-full transition-all duration-700"
                                            style={{
                                                width: `${cat.pct}%`,
                                                backgroundColor: cat.color,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-center py-4" style={{ color: 'var(--color-text-tertiary)' }}>
                            Create cards to see category progress
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
