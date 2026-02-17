
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
            style={{ backgroundColor: 'var(--bg-1)', borderColor: 'var(--stroke)' }}
        >
            <div className="flex items-center gap-3 flex-1">
                {/* Mobile menu toggle */}
                <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="p-1.5 rounded-lg transition-colors md:hidden"
                    style={{ color: 'var(--text-secondary)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--panel)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                    <Menu className="w-5 h-5" />
                </button>

                {/* Search */}
                <div className="relative max-w-md flex-1">
                    <Search
                        className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                        style={{ color: 'var(--muted)' }}
                    />
                    <input
                        type="text"
                        placeholder="Search cards..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 text-sm rounded-lg transition-all focus:outline-none"
                        style={{
                            backgroundColor: 'var(--bg-0)',
                            border: '1px solid var(--stroke)',
                            color: 'var(--text)'
                        }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--blue)'; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--stroke)'; }}
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                {/* Help Button */}
                <button
                    onClick={() => setShowHelp(true)}
                    className="p-2 rounded-lg transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--panel)';
                        e.currentTarget.style.color = 'var(--text)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                    }}
                    title="User Guide"
                >
                    <HelpCircle className="w-5 h-5" />
                </button>

                {/* New Card Button */}
                <button
                    onClick={onNewCard}
                    className="flex items-center gap-2 text-sm ml-2 px-4 py-2 rounded-lg font-medium transition-all hover:brightness-110 active:scale-95"
                    style={{
                        backgroundColor: 'var(--blue)',
                        color: 'white',
                        boxShadow: '0 0 15px rgba(37, 99, 235, 0.3)'
                    }}
                >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">New Card</span>
                </button>
            </div>

            <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
        </header>
    );
}
