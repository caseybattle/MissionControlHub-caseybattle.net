'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { FirestoreCard, FirestoreCategory, subscribeToCards, deleteCategory } from '@/lib/firestore';
import * as Icons from 'lucide-react';
import { LucideIcon, MessageSquare } from 'lucide-react';
import DictationModal from './DictationModal';
import { BattleLabsLogo } from '@/components/dashboard/ui/Logo';

interface SidebarProps {
    categories: { id?: string; name: string; icon: string; color: string; order: number }[];
    onNewCategory: () => void;
    onEditCategory: (cat: FirestoreCategory) => void;
}

export default function Sidebar({ categories, onNewCategory, onEditCategory }: SidebarProps) {
    const { selectedCategory, setSelectedCategory, viewMode, setViewMode, sidebarCollapsed, setSidebarCollapsed } = useAppStore();
    const [allCards, setAllCards] = useState<FirestoreCard[]>([]);
    const [contextMenu, setContextMenu] = useState<{ id: string; x: number; y: number } | null>(null);
    const [showDictation, setShowDictation] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const unsub = subscribeToCards(setAllCards);
        return unsub;
    }, []);

    // Close context menu on outside click
    useEffect(() => {
        const handleClick = () => setContextMenu(null);
        if (contextMenu) document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [contextMenu]);

    const getCategoryCount = (name: string) => allCards.filter((c) => c.category === name).length;
    const totalCount = allCards.length;

    const getIcon = (iconName: string): LucideIcon => {
        return (Icons as any)[iconName] || Icons.Folder;
    };

    const handleContextMenu = (e: React.MouseEvent, catId: string) => {
        e.preventDefault();
        setContextMenu({ id: catId, x: e.clientX, y: e.clientY });
    };

    const handleDeleteCategory = async (id: string) => {
        await deleteCategory(id);
        setContextMenu(null);
        if (selectedCategory) setSelectedCategory(null);
    };

    const viewModes: { key: typeof viewMode; label: string; icon: LucideIcon }[] = [
        { key: 'dashboard', label: 'Home', icon: Icons.Home },
        { key: 'editor', label: 'Editor', icon: Icons.FileText },
        { key: 'inbox', label: 'Inbox', icon: Icons.MessageSquare },
        { key: 'kanban', label: 'Kanban', icon: Icons.Columns3 },
        { key: 'calendar', label: 'Calendar', icon: Icons.CalendarDays },
        { key: 'timeline', label: 'Timeline', icon: Icons.Clock },
        { key: 'portfolio', label: 'Portfolio', icon: Icons.Grid3X3 },
    ];

    if (sidebarCollapsed) {
        return (
            <aside
                className="w-16 flex flex-col items-center border-r py-4 transition-all duration-300 shrink-0"
                style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
            >
                <button
                    onClick={() => setSidebarCollapsed(false)}
                    className="p-2 rounded-lg mb-6 transition-colors"
                    style={{ color: 'var(--blue)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                    <Icons.PanelLeftOpen className="w-5 h-5" />
                </button>

                <div className="space-y-1 mb-4">
                    {viewModes.map(({ key, icon: Icon, label }) => (
                        <button
                            key={key}
                            onClick={() => setViewMode(key)}
                            className="p-2 rounded-lg transition-colors"
                            style={viewMode === key
                                ? { backgroundColor: 'rgba(0, 86, 179, 0.15)', color: 'var(--blue)' }
                                : { color: 'var(--color-text-tertiary)' }
                            }
                            title={label}
                        >
                            <Icon className="w-5 h-5" />
                        </button>
                    ))}
                </div>

                <div className="w-8 h-px mb-4" style={{ backgroundColor: 'var(--color-border)' }} />

                <div className="space-y-2">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className="p-2 rounded-lg transition-colors"
                        style={
                            selectedCategory === null
                                ? { backgroundColor: 'rgba(255, 61, 46, 0.1)', color: 'var(--color-vermilion-400)' }
                                : { color: 'var(--color-text-tertiary)' }
                        }
                        title="All Projects"
                    >
                        <Icons.LayoutGrid className="w-5 h-5" />
                    </button>
                    {categories.map((category) => {
                        const Icon = getIcon(category.icon);
                        return (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.name)}
                                className="p-2 rounded-lg transition-colors"
                                style={
                                    selectedCategory === category.name
                                        ? { backgroundColor: 'rgba(0, 86, 179, 0.15)', color: 'var(--blue)' }
                                        : { color: 'var(--color-text-tertiary)' }
                                }
                                title={category.name}
                            >
                                <Icon className="w-5 h-5" />
                            </button>
                        );
                    })}
                </div>
            </aside>
        );
    }

    return (
        <>
            <aside
                className="w-64 flex flex-col border-r transition-all duration-300 shrink-0"
                style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
            >
                {/* Logo */}
                <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
                    <div className="flex items-center gap-3">
                        <BattleLabsLogo className="w-8 h-8" />
                        <div>
                            <h1
                                className="text-lg font-bold bg-clip-text text-transparent font-[family-name:var(--font-orbitron)] tracking-wider"
                                style={{ backgroundImage: 'linear-gradient(to right, var(--blue), #60a5fa)' }}
                            >
                                MISSION CONTROL
                            </h1>
                            <p className="text-[10px] mt-0.5 font-mono tracking-widest uppercase" style={{ color: 'var(--color-text-tertiary)' }}>
                                Command Center
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setSidebarCollapsed(true)}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ color: 'var(--color-text-tertiary)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                        <Icons.PanelLeftClose className="w-4 h-4" />
                    </button>
                </div>

                {/* Live Clock + Mic */}
                <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
                    <div className="flex items-center gap-2">
                        <Icons.Clock className="w-4 h-4" style={{ color: 'var(--blue)' }} />
                        <span className="text-sm font-mono font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                            {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                    </div>
                    <button
                        onClick={() => setShowDictation(true)}
                        className="p-2 rounded-lg transition-colors"
                        style={{ color: 'var(--blue)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0, 86, 179, 0.1)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                        title="Voice Dictation"
                    >
                        <Icons.Mic className="w-4 h-4" />
                    </button>
                </div>

                {/* View Mode Switcher */}
                <div className="p-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
                    <div className="space-y-0.5">
                        {viewModes.map(({ key, label, icon: Icon }) => (
                            <button
                                key={key}
                                onClick={() => { setViewMode(key); setSelectedCategory(null); if (window.innerWidth < 768) setSidebarCollapsed(true); }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                                style={
                                    viewMode === key
                                        ? { backgroundColor: 'rgba(0, 86, 179, 0.15)', color: 'var(--blue)' }
                                        : { color: 'var(--color-text-secondary)' }
                                }
                                onMouseEnter={(e) => {
                                    if (viewMode !== key) e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)';
                                }}
                                onMouseLeave={(e) => {
                                    if (viewMode !== key) e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                            >
                                <Icon className="w-4 h-4" />
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Categories */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="mb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>
                        Categories
                    </div>
                    <div className="space-y-1">
                        <button
                            onClick={() => { setSelectedCategory(null); setViewMode('kanban'); if (window.innerWidth < 768) setSidebarCollapsed(true); }}
                            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all"
                            style={
                                selectedCategory === null
                                    ? {
                                        backgroundColor: 'rgba(0, 86, 179, 0.15)',
                                        color: 'var(--blue)',
                                        borderLeft: '3px solid var(--blue)',
                                    }
                                    : { color: 'var(--color-text-secondary)', borderLeft: '3px solid transparent' }
                            }
                        >
                            <div className="flex items-center gap-3">
                                <Icons.LayoutGrid className="w-4 h-4" />
                                <span className="font-medium">All Projects</span>
                            </div>
                            <span
                                className="text-xs px-2 py-0.5 rounded-full"
                                style={{ backgroundColor: 'var(--color-surface-elevated)', color: 'var(--color-text-tertiary)' }}
                            >
                                {totalCount}
                            </span>
                        </button>

                        {categories.map((category) => {
                            const Icon = getIcon(category.icon);
                            const count = getCategoryCount(category.name);
                            return (
                                <button
                                    key={category.id}
                                    onClick={() => { setSelectedCategory(category.name); setViewMode('kanban'); if (window.innerWidth < 768) setSidebarCollapsed(true); }}
                                    onContextMenu={(e) => handleContextMenu(e, category.id!)}
                                    onDoubleClick={() => onEditCategory(category as FirestoreCategory)}
                                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all"
                                    style={
                                        selectedCategory === category.name
                                            ? {
                                                backgroundColor: 'rgba(0, 86, 179, 0.15)',
                                                color: 'var(--blue)',
                                                borderLeft: '3px solid var(--blue)',
                                            }
                                            : { color: 'var(--color-text-secondary)', borderLeft: '3px solid transparent' }
                                    }
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon className="w-4 h-4" style={{ color: 'var(--blue)' }} />
                                        <span className="font-medium text-sm">{category.name === 'Production' ? 'Production Studio' : category.name}</span>
                                    </div>
                                    {count > 0 && (
                                        <span
                                            className="text-xs px-2 py-0.5 rounded-full"
                                            style={{ backgroundColor: 'var(--color-surface-elevated)', color: 'var(--color-text-tertiary)' }}
                                        >
                                            {count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* New Category button */}
                <div className="p-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                    <button onClick={onNewCategory} className="w-full btn-vermilion flex items-center justify-center gap-2">
                        <Icons.Plus className="w-4 h-4" />
                        New Category
                    </button>
                </div>

                {/* Context menu */}
                {contextMenu && (
                    <div
                        className="fixed z-50 rounded-lg py-1 min-w-[140px]"
                        style={{
                            left: contextMenu.x,
                            top: contextMenu.y,
                            backgroundColor: 'var(--color-surface-elevated)',
                            border: '1.5px solid var(--color-border)',
                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                        }}
                    >
                        <button
                            onClick={() => {
                                const cat = categories.find((c) => c.id === contextMenu.id);
                                if (cat) onEditCategory(cat as FirestoreCategory);
                                setContextMenu(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors"
                            style={{ color: 'var(--color-text-secondary)' }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                        >
                            <Icons.Pencil className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                            onClick={() => handleDeleteCategory(contextMenu.id)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors"
                            style={{ color: '#ef4444' }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                        >
                            <Icons.Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                    </div>
                )}
            </aside>

            <DictationModal isOpen={showDictation} onClose={() => setShowDictation(false)} />
        </>
    );
}
