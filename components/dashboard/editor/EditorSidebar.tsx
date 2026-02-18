import { motion } from 'framer-motion';
import { Search, ChevronRight, Plus, Star, Clock, ChevronDown } from 'lucide-react';
import { Document } from './types';

interface EditorSidebarProps {
    documents: Document[];
    activeDoc: Document | null;
    setActiveDoc: (doc: Document) => void;
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    onNewPage: () => void;
}

export function EditorSidebar({
    documents,
    activeDoc,
    setActiveDoc,
    sidebarOpen,
    setSidebarOpen,
    searchQuery,
    setSearchQuery,
    onNewPage
}: EditorSidebarProps) {
    const filteredDocs = documents.filter(doc =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <motion.div
                initial={{ width: sidebarOpen ? 220 : 0 }}
                animate={{ width: sidebarOpen ? 220 : 0 }}
                className="bg-[var(--bg-1)] border-r border-[var(--stroke)] flex-shrink-0 overflow-hidden h-full"
            >
                <div className="w-[220px] h-full flex flex-col">
                    {/* Sidebar Header */}
                    <div className="p-4 border-b border-[var(--stroke)]">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-xs tracking-widest text-[var(--muted)]">DOCUMENTS</h2>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="p-1 hover:bg-[var(--panel)] rounded transition-colors"
                            >
                                <ChevronRight className="w-4 h-4 text-[var(--muted)]" />
                            </button>
                        </div>

                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--muted)]" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-3 py-1.5 bg-[var(--panel)] rounded text-sm border border-transparent focus:border-[var(--blue)] focus:outline-none transition-colors placeholder-[var(--muted)] text-[var(--text)]"
                            />
                        </div>
                    </div>

                    {/* Document List */}
                    <div className="flex-1 overflow-y-auto p-2 space-y-0.5 custom-scrollbar">
                        {filteredDocs.map((doc, index) => (
                            <motion.button
                                key={doc.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => setActiveDoc(doc)}
                                className={`w-full text-left p-2 rounded-md transition-colors group flex items-center gap-3 ${activeDoc?.id === doc.id
                                    ? 'bg-[var(--panel-2)] text-[var(--text)]'
                                    : 'hover:bg-[var(--panel)] text-[var(--text-secondary)]'
                                    }`}
                            >
                                <span className="text-lg">{doc.icon}</span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-medium text-sm truncate">
                                            {doc.title}
                                        </h3>
                                        {doc.starred && <Star className="w-3 h-3 text-[var(--late)] fill-[var(--late)] flex-shrink-0" />}
                                    </div>
                                    <p className="text-[10px] text-[var(--muted)] flex items-center gap-1">
                                        <Clock className="w-2.5 h-2.5" />
                                        {doc.updatedAt}
                                    </p>
                                </div>
                            </motion.button>
                        ))}
                    </div>

                    {/* Sidebar Footer */}
                    <div className="p-3 border-t border-[var(--stroke)]">
                        <button
                            onClick={onNewPage}
                            className="w-full py-2 bg-[var(--panel)] hover:bg-[var(--panel-2)] rounded border border-[var(--stroke)] hover:border-[var(--stroke-2)] text-sm font-medium transition-colors flex items-center justify-center gap-2 text-[var(--text)]"
                        >
                            <Plus className="w-4 h-4" />
                            New Page
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Toggle Sidebar Button - Fixed positioning to ensure visibility */}
            {!sidebarOpen && (
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="absolute left-4 top-[88px] z-[100] p-2 bg-[var(--panel)] border border-[var(--stroke)] rounded-lg hover:bg-[var(--panel-2)] hover:border-[var(--blue)] hover:text-[var(--blue)] transition-all shadow-xl flex items-center gap-2 group"
                >
                    <ChevronRight className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--blue)]" />
                    <span className="text-xs font-medium text-[var(--text-secondary)] group-hover:text-[var(--blue)]">Open Sidebar</span>
                </button>
            )}
        </>
    );
}
