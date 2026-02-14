
'use client';

import { useAppStore } from '@/lib/store';
import { Search, Plus, Menu, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import HelpModal from './HelpModal';

interface HeaderProps {
    onNewCard: () => void;
}

export default function Header({ onNewCard }: HeaderProps) {
    const { searchQuery, setSearchQuery, sidebarCollapsed, setSidebarCollapsed } = useAppStore();
    const [showHelp, setShowHelp] = useState(false);

    return (
        <header
            className="h-14 md:h-16 border-b backdrop-blur-sm flex items-center justify-between px-4 md:px-6 relative z-20 shrink-0"
            style={{ backgroundColor: 'rgba(20, 20, 20, 0.7)', borderColor: 'var(--color-border)' }}
        >
            <div className="flex items-center gap-3 flex-1">
                {/* Mobile menu toggle */}
                <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="p-1.5 rounded-lg transition-colors md:hidden"
                    style={{ color: 'var(--color-text-secondary)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                    <Menu className="w-5 h-5" />
                </button>

                {/* Search */}
                <div className="relative max-w-md flex-1">
                    <Search
                        className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                        style={{ color: 'var(--color-text-tertiary)' }}
                    />
                    <input
                        type="text"
                        placeholder="Search cards..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-field w-full text-sm pl-10"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                {/* Help Button */}
                <button
                    onClick={() => setShowHelp(true)}
                    className="p-2 rounded-lg transition-colors text-zinc-400 hover:text-white hover:bg-zinc-800"
                    title="User Guide"
                >
                    <HelpCircle className="w-5 h-5" />
                </button>

                {/* New Card Button */}
                <button onClick={onNewCard} className="btn-vermilion flex items-center gap-2 text-sm ml-2">
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">New Card</span>
                </button>
            </div>

            <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
        </header>
    );
}
