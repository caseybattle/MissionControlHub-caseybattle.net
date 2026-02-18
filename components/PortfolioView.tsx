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
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PortfolioView() {
    const { selectedCategory } = useAppStore();
    const [viewStyle, setViewStyle] = useState<'list'>('list'); // Forced to list
    const [selectedCard, setSelectedCard] = useState<FirestoreCard | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [allCards, setAllCards] = useState<FirestoreCard[]>([]);
    const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

    const toggleCategory = (category: string) => {
        setCollapsedCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    useEffect(() => {
        const unsub = subscribeToCards(setAllCards);
        return unsub;
    }, []);

    // Filter and Sort
    const filteredCards = allCards
        .filter((c) => !selectedCategory || c.category === selectedCategory)
        .filter((c) => filterStatus === 'all' || c.status === filterStatus)
        .filter((c) =>
            searchQuery ? (
                c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.tags.includes(searchQuery.toLowerCase())
            ) : true
        )
        .sort((a, b) => {
            // Sort by status (active first), then date
            if (a.status === 'complete' && b.status !== 'complete') return 1;
            if (b.status === 'complete' && a.status !== 'complete') return -1;
            const aTime = a.updatedAt?.toDate?.()?.getTime() || 0;
            const bTime = b.updatedAt?.toDate?.()?.getTime() || 0;
            return bTime - aTime;
        });

    // Group by Category
    const groupedCards = filteredCards.reduce((acc, card) => {
        const category = card.category || 'Uncategorized';
        if (!acc[category]) acc[category] = [];
        acc[category].push(card);
        return acc;
    }, {} as Record<string, FirestoreCard[]>);

    // Fixed order for specific categories if they exist, others alphabetical
    const priorityCategories = ['Builds', 'Websites', 'YouTube Projects', 'Ideas'];
    const sortedCategories = Object.keys(groupedCards).sort((a, b) => {
        const indexA = priorityCategories.indexOf(a);
        const indexB = priorityCategories.indexOf(b);
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return a.localeCompare(b);
    });

    const statusCounts: Record<string, number> = {
        all: allCards.length,
        'in-progress': allCards.filter((c) => c.status === 'in-progress').length,
        review: allCards.filter((c) => c.status === 'review').length,
        backlog: allCards.filter((c) => c.status === 'backlog').length,
        complete: allCards.filter((c) => c.status === 'complete').length,
    };

    if (allCards.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-32 text-center overflow-hidden">
                <div className="relative mb-6">
                    <FolderOpen className="w-16 h-16 text-[var(--text-secondary)] opacity-50" />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[var(--blue)] rounded-full flex items-center justify-center">
                        <Plus className="w-4 h-4 text-white" />
                    </div>
                </div>
                <h2 className="text-xl font-bold text-[var(--text)] mb-2">Portfolio Empty</h2>
                <p className="text-[var(--text-secondary)] max-w-sm">
                    Start by creating a new project card to populate your portfolio.
                </p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col overflow-hidden animate-fade-in">
            {/* Header Section */}
            <div className="flex-shrink-0 px-6 pt-1 pb-3 border-b border-[var(--stroke)] bg-[var(--bg-1)]/50 backdrop-blur-md z-10">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-[var(--text)] tracking-tight">Portfolio</h2>
                            <p className="text-sm text-[var(--text-secondary)] mt-0.5">Showcase & Management</p>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* New Project Button - Only Action needed now */}
                            <button className="flex items-center gap-2 px-4 py-2 bg-[var(--blue)] hover:bg-[var(--color-vermilion-600)] text-white rounded-lg font-medium transition-colors shadow-lg shadow-[var(--blue)]/20">
                                <Plus className="w-4 h-4" />
                                <span>New Project</span>
                            </button>
                        </div>
                    </div>

                    {/* Filters & Search */}
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar mask-gradient-r">
                            {(['all', 'in-progress', 'review', 'backlog', 'complete'] as const).map((status) => {
                                const labels: Record<string, string> = { all: 'All', complete: 'Completed', 'in-progress': 'In Progress', review: 'Review', backlog: 'Backlog' };
                                const isActive = filterStatus === status;
                                return (
                                    <button
                                        key={status}
                                        onClick={() => setFilterStatus(status)}
                                        className={`
                                            px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap flex items-center gap-2 border
                                            ${isActive
                                                ? 'bg-[var(--blue)]/10 border-[var(--blue)]/30 text-[var(--blue)]'
                                                : 'bg-transparent border-transparent text-[var(--text-secondary)] hover:bg-[var(--panel-2)] hover:text-[var(--text)]'
                                            }
                                        `}
                                    >
                                        <span>{labels[status]}</span>
                                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-[var(--blue)] text-white' : 'bg-[var(--panel-2)] text-[var(--text-tertiary)]'}`}>
                                            {statusCounts[status]}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="relative group min-w-[200px]">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] group-focus-within:text-[var(--blue)] transition-colors" />
                            <input
                                type="text"
                                placeholder="Search projects..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-3 py-1.5 bg-[var(--panel-2)] border border-[var(--stroke)] rounded-lg text-sm text-[var(--text)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--blue)] focus:ring-1 focus:ring-[var(--blue)] transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content - Grouped Table Sections */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-8 custom-scrollbar">
                {sortedCategories.length > 0 ? (
                    sortedCategories.map((category) => (
                        <div key={category} className="space-y-3 animate-slide-up">
                            {/* Section Header - Clickable to Collapse */}
                            <button
                                onClick={() => toggleCategory(category)}
                                className="flex items-center gap-3 w-full group focus:outline-none"
                            >
                                <div className={`
                                    p-1 rounded-md transition-transform duration-200 
                                    ${collapsedCategories[category] ? '-rotate-90' : 'rotate-0'}
                                    text-[var(--text-tertiary)] group-hover:text-[var(--text)]
                                `}>
                                    <ChevronDown className="w-4 h-4" />
                                </div>
                                <h3 className="text-sm font-bold text-[var(--text-secondary)] tracking-wider uppercase px-3 py-1 bg-[var(--panel-2)] border border-[var(--stroke)] rounded-lg shadow-sm group-hover:border-[var(--blue)] group-hover:text-[var(--text)] transition-all flex items-center gap-2">
                                    {category}
                                    <span className="text-[10px] opacity-60 bg-[var(--bg-1)] px-1.5 py-0.5 rounded-full border border-[var(--stroke)]">
                                        {groupedCards[category].length}
                                    </span>
                                </h3>
                                {/* The user specifically likes the line going all the way across */}
                                <div className="h-px flex-1 bg-[var(--stroke)] group-hover:bg-[var(--blue)]/30 transition-colors" />
                            </button>

                            {/* Section List (Table Rows) */}
                            <AnimatePresence>
                                {!collapsedCategories[category] && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="space-y-1 pl-2 border-l border-[var(--stroke)]/30 ml-2.5">
                                            {/* Table Header Row (Only show if open) */}
                                            <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider bg-[var(--bg-1)]/30 rounded-t-lg mb-1">
                                                <div className="col-span-5 md:col-span-4">Project</div>
                                                <div className="hidden md:block col-span-2">Tags</div>
                                                <div className="hidden md:block col-span-2">Status</div>
                                                <div className="hidden md:block col-span-2">Updated</div>
                                                <div className="col-span-7 md:col-span-2 text-right">Actions</div>
                                            </div>

                                            {groupedCards[category].map((card) => (
                                                <PortfolioListCard key={card.id} card={card} onClick={() => setSelectedCard(card)} />
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-[var(--text-secondary)] opacity-60">
                        <Search className="w-8 h-8 mb-2" />
                        <p>No projects match your filter</p>
                    </div>
                )}
                {/* Bottom spacer */}
                <div className="h-20" />
            </div>

            <AnimatePresence>
                {selectedCard && <PortfolioDetail card={selectedCard} onClose={() => setSelectedCard(null)} />}
            </AnimatePresence>
        </div>
    );
}

// ----------------------------------------------------------------------------
// Components
// ----------------------------------------------------------------------------

function PortfolioListCard({ card, onClick }: { card: FirestoreCard; onClick: () => void }) {
    const statusColors: Record<string, string> = {
        'backlog': 'var(--text-tertiary)',
        'in-progress': 'var(--blue)',
        'review': 'var(--late)',
        'complete': 'var(--ok)'
    };
    const statusLabels: Record<string, string> = {
        'backlog': 'Backlog',
        'in-progress': 'In Progress',
        'review': 'Review',
        'complete': 'Complete'
    };

    return (
        <div
            onClick={onClick}
            className="group grid grid-cols-12 gap-4 items-center p-3 sm:px-4 bg-[var(--panel)] border border-[var(--stroke)] rounded-lg cursor-pointer hover:border-[var(--blue)] hover:bg-[var(--panel-2)] transition-all"
        >
            {/* Project (Icon + Title) */}
            <div className="col-span-5 md:col-span-4 flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded bg-[var(--bg-1)] border border-[var(--stroke)] flex items-center justify-center text-sm flex-shrink-0 group-hover:border-[var(--blue)] transition-colors">
                    {card.category.includes('YouTube') ? '📺' :
                        card.category.includes('Idea') ? '💡' :
                            card.category.includes('Web') ? '🌐' : '📦'}
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-[var(--text)] truncate group-hover:text-[var(--blue)] transition-colors">
                        {card.title}
                    </h4>
                    {/* Desc only visible on larger screens to save space usually, but here we keep it clean */}
                    <p className="hidden sm:block text-[11px] text-[var(--text-secondary)] truncate">
                        {card.description || "No description."}
                    </p>
                </div>
            </div>

            {/* Tags (Hidden on mobile) */}
            <div className="hidden md:flex col-span-2 items-center gap-1 overflow-hidden">
                {card.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="px-1.5 py-0.5 rounded bg-[var(--bg-1)] border border-[var(--stroke)] text-[10px] text-[var(--text-secondary)] whitespace-nowrap">
                        {tag}
                    </span>
                ))}
                {card.tags.length > 2 && <span className="text-[10px] text-[var(--text-tertiary)]">+{card.tags.length - 2}</span>}
            </div>

            {/* Status */}
            <div className="hidden md:flex col-span-2 items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColors[card.status] }} />
                <span className="text-xs text-[var(--text-secondary)]">{statusLabels[card.status]}</span>
            </div>

            {/* Date */}
            <div className="hidden md:flex col-span-2 items-center gap-1 text-xs text-[var(--text-tertiary)]">
                <Clock className="w-3 h-3" />
                <span>{card.updatedAt?.toDate?.().toLocaleDateString() || '-'}</span>
            </div>

            {/* Actions / Mobile Status */}
            <div className="col-span-7 md:col-span-2 flex items-center justify-end gap-3 text-[var(--text-tertiary)]">
                {/* Mobile-only status indicator */}
                <div className="md:hidden w-2 h-2 rounded-full" style={{ backgroundColor: statusColors[card.status] }} />

                <div className="p-1 rounded hover:bg-[var(--bg-1)] group-hover:text-[var(--blue)] transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                </div>
            </div>
        </div>
    );
}

function PortfolioDetail({ card, onClose }: { card: FirestoreCard; onClose: () => void }) {
    // Reusing standard Detail view logic but with improved styles if needed
    // For brevity, keeping it similar to previous but ensuring it matches theme variables

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
                layoutId={`card-${card.id}`}
                className="relative w-full max-w-2xl bg-[var(--panel)] border border-[var(--stroke)] rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] overflow-y-auto custom-scrollbar"
                style={{
                    boxShadow: '0 0 50px -12px rgba(0, 0, 0, 0.5)'
                }}
            >
                {/* Header Image/Gradient */}
                <div className="h-32 bg-gradient-to-r from-[var(--blue)]/20 to-[var(--color-vermilion-500)]/20 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    <div className="absolute -bottom-8 left-8">
                        <div className="w-16 h-16 rounded-xl bg-[var(--bg-0)] border-2 border-[var(--stroke)] flex items-center justify-center text-3xl shadow-lg">
                            {card.category.includes('YouTube') ? '📺' :
                                card.category.includes('Idea') ? '💡' :
                                    card.category.includes('Web') ? '🌐' : '📦'}
                        </div>
                    </div>
                </div>

                <div className="pt-10 px-8 pb-8">
                    <h2 className="text-2xl font-bold text-[var(--text)] mb-2">{card.title}</h2>
                    <div className="flex items-center gap-2 mb-6 text-sm">
                        <span className="px-2 py-0.5 rounded-full bg-[var(--panel-2)] border border-[var(--stroke)] text-[var(--text-secondary)]">
                            {card.category}
                        </span>
                        <span className="text-[var(--text-tertiary)]">•</span>
                        <span className="text-[var(--text-secondary)]">
                            Updated {card.updatedAt?.toDate?.().toLocaleDateString()}
                        </span>
                    </div>

                    <div className="prose prose-invert max-w-none text-[var(--text-secondary)] text-sm leading-relaxed mb-8">
                        {card.description || "No description provided for this project."}
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-[var(--text)] uppercase tracking-wider">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            {card.tags.length > 0 ? card.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-[var(--panel-2)] hover:bg-[var(--blue)]/10 hover:text-[var(--blue)] hover:border-[var(--blue)]/30 border border-[var(--stroke)] rounded-lg text-sm transition-all cursor-default text-[var(--text-secondary)]">
                                    {tag}
                                </span>
                            )) : <span className="text-[var(--text-tertiary)] text-xs italic">No tags</span>}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
