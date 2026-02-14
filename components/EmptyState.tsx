'use client';

import { Rocket, Plus } from 'lucide-react';

interface EmptyStateProps {
    onCreateCard: () => void;
}

const quickTemplates = [
    { name: 'YouTube Project', emoji: '🎥' },
    { name: 'Website Build', emoji: '🌐' },
    { name: 'New Idea', emoji: '💡' },
    { name: 'Learning Goal', emoji: '📚' },
];

export default function EmptyState({ onCreateCard }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-20" style={{ animation: 'fadeIn 0.5s ease-out' }}>
            {/* Icon */}
            <div
                className="relative w-24 h-24 rounded-full flex items-center justify-center mb-8"
                style={{
                    background: 'linear-gradient(135deg, rgba(255, 61, 46, 0.15), rgba(255, 61, 46, 0.05))',
                    boxShadow: '0 0 60px rgba(255, 61, 46, 0.15)',
                }}
            >
                <Rocket
                    className="w-10 h-10"
                    style={{ color: 'var(--color-vermilion-500)', animation: 'pulseSubtle 2s ease-in-out infinite' }}
                />
                {/* Orbiting dot */}
                <div
                    className="absolute w-3 h-3 rounded-full"
                    style={{
                        backgroundColor: 'var(--color-vermilion-400)',
                        top: '6px',
                        right: '10px',
                        boxShadow: '0 0 8px var(--color-vermilion-400)',
                    }}
                />
            </div>

            {/* Text */}
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                Launch Your First Project
            </h2>
            <p className="text-center max-w-md mb-8" style={{ color: 'var(--color-text-secondary)' }}>
                Start organizing your ideas, builds, and projects. Everything you create will be saved automatically.
            </p>

            {/* Main CTA */}
            <button
                onClick={onCreateCard}
                className="btn-vermilion flex items-center gap-2 text-lg px-6 py-3 mb-8"
            >
                <Plus className="w-5 h-5" />
                Create Your First Card
            </button>

            {/* Quick Templates */}
            <div className="flex gap-3">
                {quickTemplates.map((tpl) => (
                    <button
                        key={tpl.name}
                        onClick={onCreateCard}
                        className="px-4 py-2 rounded-lg text-sm transition-all duration-200"
                        style={{
                            backgroundColor: 'var(--color-surface-elevated)',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-text-secondary)',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(255, 61, 46, 0.3)';
                            e.currentTarget.style.color = 'var(--color-text-primary)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--color-border)';
                            e.currentTarget.style.color = 'var(--color-text-secondary)';
                        }}
                    >
                        {tpl.emoji} {tpl.name}
                    </button>
                ))}
            </div>
        </div>
    );
}
