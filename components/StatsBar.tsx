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
        { label: 'PROJECTS', value: totalCards, suffix: '', icon: Layers, color: 'var(--blue)' },
        { label: 'ACTIVE', value: inProgress, suffix: '', icon: Clock, color: 'var(--text-secondary)' },
        { label: 'DONE', value: completionRate, suffix: '%', icon: CheckCircle, color: 'var(--ok)' },
        { label: 'OVERDUE', value: overdueCount, suffix: '', icon: AlertCircle, color: overdueCount > 0 ? 'var(--err)' : 'var(--muted)' },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                    <div
                        key={stat.label}
                        className="group relative overflow-hidden rounded-lg p-3 transition-all duration-200 hover:bg-[var(--panel)]"
                        style={{
                            backgroundColor: 'var(--bg-1)',
                            border: '1px solid var(--stroke)',
                        }}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-[10px] font-bold tracking-widest mb-1" style={{ color: 'var(--muted)' }}>
                                    {stat.label}
                                </div>
                                <div className="text-2xl font-bold font-mono" style={{ color: stat.color, fontFamily: 'var(--font-orbitron)' }}>
                                    {stat.value}{stat.suffix}
                                </div>
                            </div>
                            <div
                                className="p-2 rounded-md transition-colors group-hover:bg-[var(--surface-elevated)]"
                                style={{ color: stat.color, opacity: 0.8 }}
                            >
                                <Icon className="w-5 h-5" />
                            </div>
                        </div>

                        {/* Decorative corner accent */}
                        <div
                            className="absolute bottom-0 right-0 w-8 h-8 opacity-10 pointer-events-none"
                            style={{
                                background: `radial-gradient(circle at bottom right, ${stat.color}, transparent 70%)`
                            }}
                        />
                    </div>
                );
            })}
        </div>
    );
}
