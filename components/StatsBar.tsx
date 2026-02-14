'use client';

import { useEffect, useState } from 'react';
import { FirestoreCard, subscribeToCards, getDueDateInfo } from '@/lib/firestore';
import { TrendingUp, Clock, CheckCircle, Layers, AlertCircle } from 'lucide-react';

export default function StatsBar() {
    const [cards, setCards] = useState<FirestoreCard[]>([]);

    useEffect(() => {
        const unsub = subscribeToCards(setCards);
        return unsub;
    }, []);

    const totalCards = cards.length;
    const inProgress = cards.filter((c) => c.status === 'in-progress').length;
    const completed = cards.filter((c) => c.status === 'complete').length;
    const overdueCount = cards.filter((c) => {
        if (c.status === 'complete') return false;
        const info = getDueDateInfo(c.dueDate);
        return info?.overdue;
    }).length;
    const completionRate = totalCards > 0 ? Math.round((completed / totalCards) * 100) : 0;

    const stats = [
        { label: 'Total Projects', value: totalCards, suffix: '', icon: Layers, color: '#ff3d2e' },
        { label: 'In Progress', value: inProgress, suffix: '', icon: Clock, color: '#f97316' },
        { label: 'Completion Rate', value: completionRate, suffix: '%', icon: CheckCircle, color: '#10b981' },
        { label: 'Overdue', value: overdueCount, suffix: '', icon: AlertCircle, color: overdueCount > 0 ? '#ef4444' : '#6b7280' },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                    <div
                        key={stat.label}
                        className="rounded-xl p-4 transition-all duration-200"
                        style={{
                            backgroundColor: 'var(--color-surface-elevated)',
                            border: '1.5px solid var(--color-border)',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = `${stat.color}60`;
                            e.currentTarget.style.boxShadow = `0 4px 16px ${stat.color}15`;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--color-border)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg" style={{ backgroundColor: `${stat.color}15` }}>
                                <Icon className="w-4 h-4" style={{ color: stat.color }} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold" style={{ color: stat.color }}>
                                    {stat.value}{stat.suffix}
                                </div>
                                <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{stat.label}</div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
