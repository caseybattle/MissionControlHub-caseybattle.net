'use client';

import { useState, useEffect } from 'react';
import { FirestoreCard, subscribeToCards } from '@/lib/firestore';
import { useAppStore } from '@/lib/store';
import {
    Grid3X3,
    List,
    Upload,
    X,
    Clock,
    CheckCircle,
    Play,
    Eye,
    Tag,
    FolderOpen,
} from 'lucide-react';

export default function PortfolioView() {
    const { selectedCategory } = useAppStore();
    const [viewStyle, setViewStyle] = useState<'grid' | 'list'>('grid');
    const [selectedCard, setSelectedCard] = useState<FirestoreCard | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [allCards, setAllCards] = useState<FirestoreCard[]>([]);

    useEffect(() => {
        const unsub = subscribeToCards(setAllCards);
        return unsub;
    }, []);

    const cards = allCards
        .filter((c) => !selectedCategory || c.category === selectedCategory)
        .sort((a, b) => {
            if (a.status === 'complete' && b.status !== 'complete') return -1;
            if (b.status === 'complete' && a.status !== 'complete') return 1;
            const aTime = a.updatedAt?.toDate?.()?.getTime() || 0;
            const bTime = b.updatedAt?.toDate?.()?.getTime() || 0;
            return bTime - aTime;
        });

    const filteredCards = cards.filter((card) => filterStatus === 'all' || card.status === filterStatus);

    if (cards.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20" style={{ animation: 'fadeIn 0.5s ease-out' }}>
                <FolderOpen className="w-12 h-12 mb-4" style={{ color: 'var(--color-vermilion-500)', opacity: 0.6 }} />
                <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>No Projects Yet</h2>
                <p style={{ color: 'var(--color-text-secondary)' }}>Create cards to see them in your portfolio gallery.</p>
            </div>
        );
    }

    const statusCounts: Record<string, number> = {
        all: cards.length,
        complete: cards.filter((c) => c.status === 'complete').length,
        'in-progress': cards.filter((c) => c.status === 'in-progress').length,
        review: cards.filter((c) => c.status === 'review').length,
        backlog: cards.filter((c) => c.status === 'backlog').length,
    };

    return (
        <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>Portfolio</h2>
                    <p style={{ color: 'var(--color-text-secondary)' }}>Showcase your projects and builds</p>
                </div>
                <div className="flex rounded-lg overflow-hidden" style={{ border: '1.5px solid var(--color-border)' }}>
                    <button onClick={() => setViewStyle('grid')} className="p-2 transition-colors" style={{
                        backgroundColor: viewStyle === 'grid' ? 'var(--color-vermilion-500)' : 'var(--color-surface-elevated)',
                        color: viewStyle === 'grid' ? '#fff' : 'var(--color-text-tertiary)',
                    }}>
                        <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => setViewStyle('list')} className="p-2 transition-colors" style={{
                        backgroundColor: viewStyle === 'list' ? 'var(--color-vermilion-500)' : 'var(--color-surface-elevated)',
                        color: viewStyle === 'list' ? '#fff' : 'var(--color-text-tertiary)',
                    }}>
                        <List className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {(['all', 'complete', 'in-progress', 'review', 'backlog'] as const).map((status) => {
                    const labels: Record<string, string> = { all: 'All', complete: 'Completed', 'in-progress': 'In Progress', review: 'In Review', backlog: 'Backlog' };
                    return (
                        <button key={status} onClick={() => setFilterStatus(status)}
                            className="px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap"
                            style={filterStatus === status ? {
                                background: 'linear-gradient(135deg, rgba(255, 61, 46, 0.15), rgba(255, 61, 46, 0.05))',
                                color: 'var(--color-vermilion-400)', border: '1px solid rgba(255, 61, 46, 0.3)',
                            } : {
                                backgroundColor: 'var(--color-surface-elevated)',
                                color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)',
                            }}
                        >
                            {labels[status]}<span className="ml-2 opacity-60">{statusCounts[status]}</span>
                        </button>
                    );
                })}
            </div>

            {viewStyle === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredCards.map((card) => (
                        <PortfolioGridCard key={card.id} card={card} onClick={() => setSelectedCard(card)} />
                    ))}
                </div>
            ) : (
                <div className="space-y-2">
                    {filteredCards.map((card) => (
                        <PortfolioListCard key={card.id} card={card} onClick={() => setSelectedCard(card)} />
                    ))}
                </div>
            )}

            {selectedCard && <PortfolioDetail card={selectedCard} onClose={() => setSelectedCard(null)} />}
        </div>
    );
}

function PortfolioGridCard({ card, onClick }: { card: FirestoreCard; onClick: () => void }) {
    const statusColors: Record<string, string> = { 'backlog': '#888', 'in-progress': '#ffa198', 'review': '#ff6b5e', 'complete': '#ff3d2e' };
    const getCategoryGradient = (category: string) => {
        const hue = [...category].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
        return `linear-gradient(135deg, hsl(${hue}, 60%, 15%), hsl(${hue + 30}, 50%, 10%))`;
    };
    const dateStr = card.updatedAt?.toDate ? card.updatedAt.toDate().toLocaleDateString() : '';

    return (
        <div className="portfolio-card cursor-pointer group" onClick={onClick}>
            <div className="h-32 relative flex items-center justify-center" style={{ background: getCategoryGradient(card.category) }}>
                <span className="text-4xl opacity-30 group-hover:opacity-50 transition-opacity">
                    {card.category === 'YouTube Projects' ? '🎥' : card.category === 'Ideas' ? '💡' : card.category === 'Websites' ? '🌐' : card.category === 'Builds' ? '🔨' : card.category === 'Memories' ? '❤️' : '📋'}
                </span>
                <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: statusColors[card.status], boxShadow: `0 0 8px ${statusColors[card.status]}` }} />
            </div>
            <div className="p-4">
                <h3 className="font-semibold mb-1 line-clamp-1" style={{ color: 'var(--color-text-primary)' }}>{card.title}</h3>
                {card.description && <p className="text-sm mb-3 line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>{card.description}</p>}
                <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{card.category}</span>
                    <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{dateStr}</span>
                </div>
                {card.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                        {card.tags.slice(0, 3).map((tag) => <span key={tag} className="tag">{tag}</span>)}
                        {card.tags.length > 3 && <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>+{card.tags.length - 3}</span>}
                    </div>
                )}
            </div>
        </div>
    );
}

function PortfolioListCard({ card, onClick }: { card: FirestoreCard; onClick: () => void }) {
    const statusLabels: Record<string, string> = { 'backlog': 'Backlog', 'in-progress': 'In Progress', 'review': 'Review', 'complete': 'Complete' };
    const statusColors: Record<string, string> = { 'backlog': '#888', 'in-progress': '#ffa198', 'review': '#ff6b5e', 'complete': '#ff3d2e' };
    const dateStr = card.updatedAt?.toDate ? card.updatedAt.toDate().toLocaleDateString() : '';

    return (
        <div className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200"
            style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1.5px solid var(--color-border)' }}
            onClick={onClick}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 61, 46, 0.3)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.3)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.boxShadow = 'none'; }}
        >
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: statusColors[card.status], boxShadow: `0 0 6px ${statusColors[card.status]}` }} />
            <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>{card.title}</h3>
                {card.description && <p className="text-sm truncate" style={{ color: 'var(--color-text-secondary)' }}>{card.description}</p>}
            </div>
            <span className="text-xs px-2 py-1 rounded-md flex-shrink-0" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text-tertiary)' }}>{card.category}</span>
            <span className="text-xs font-medium px-2 py-1 rounded-md flex-shrink-0" style={{ color: statusColors[card.status], backgroundColor: `${statusColors[card.status]}15`, border: `1px solid ${statusColors[card.status]}30` }}>{statusLabels[card.status]}</span>
            <span className="text-xs flex-shrink-0" style={{ color: 'var(--color-text-tertiary)' }}>{dateStr}</span>
        </div>
    );
}

function PortfolioDetail({ card, onClose }: { card: FirestoreCard; onClose: () => void }) {
    const statusLabels: Record<string, string> = { 'backlog': 'Backlog', 'in-progress': 'In Progress', 'review': 'Review', 'complete': 'Complete' };
    const statusColors: Record<string, string> = { 'backlog': '#888', 'in-progress': '#ffa198', 'review': '#ff6b5e', 'complete': '#ff3d2e' };

    const createdStr = card.createdAt?.toDate
        ? card.createdAt.toDate().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
        : 'Unknown';
    const updatedStr = card.updatedAt?.toDate
        ? card.updatedAt.toDate().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
        : 'Unknown';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ animation: 'fadeIn 0.2s ease-out' }}>
            <div className="absolute inset-0 backdrop-blur-sm" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }} onClick={onClose} />
            <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden max-h-[80vh] overflow-y-auto" style={{
                backgroundColor: 'var(--color-surface)',
                border: '1.5px solid var(--color-border)',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(255, 61, 46, 0.1)',
                animation: 'slideUp 0.3s ease-out',
            }}>
                <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b backdrop-blur-sm z-10" style={{ borderColor: 'var(--color-border)', backgroundColor: 'rgba(17, 17, 17, 0.9)' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: statusColors[card.status], boxShadow: `0 0 8px ${statusColors[card.status]}` }} />
                        <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>{card.title}</h2>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg transition-colors" style={{ color: 'var(--color-text-tertiary)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    ><X className="w-5 h-5" /></button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-sm font-medium px-3 py-1.5 rounded-lg" style={{
                            color: statusColors[card.status], backgroundColor: `${statusColors[card.status]}15`, border: `1px solid ${statusColors[card.status]}30`,
                        }}>{statusLabels[card.status]}</span>
                        <span className="text-sm px-3 py-1.5 rounded-lg" style={{
                            backgroundColor: 'var(--color-surface-elevated)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)',
                        }}>{card.category}</span>
                    </div>

                    {card.description && (
                        <div>
                            <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--color-text-tertiary)' }}>Description</h3>
                            <p className="leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{card.description}</p>
                        </div>
                    )}

                    {card.tags.length > 0 && (
                        <div>
                            <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--color-text-tertiary)' }}>Tags</h3>
                            <div className="flex flex-wrap gap-2">{card.tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}</div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)' }}>
                            <div className="text-xs mb-1" style={{ color: 'var(--color-text-tertiary)' }}>Created</div>
                            <div className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{createdStr}</div>
                        </div>
                        <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)' }}>
                            <div className="text-xs mb-1" style={{ color: 'var(--color-text-tertiary)' }}>Last Updated</div>
                            <div className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{updatedStr}</div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--color-text-tertiary)' }}>Assets & Files</h3>
                        <div className="flex flex-col items-center justify-center py-8 rounded-xl border-2 border-dashed"
                            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-tertiary)' }}>
                            <Upload className="w-8 h-8 mb-2 opacity-50" />
                            <p className="text-sm">Drop files here or click to upload</p>
                            <p className="text-xs mt-1 opacity-60">Images, thumbnails, documents</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
