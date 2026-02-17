import { useState } from 'react';
import { FirestoreCard } from '@/lib/firestore';
import { Folder, ChevronDown } from 'lucide-react';

export const ProjectDropdown = ({ cards, onSelect, selectedId }: { cards: FirestoreCard[], onSelect: (id: string | null) => void, selectedId: string | null }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="px-4 py-2 bg-[var(--panel)] hover:bg-[var(--panel-2)] rounded-lg border border-[var(--stroke)] text-sm font-medium text-[var(--text-secondary)] shadow-sm flex items-center gap-2 transition-all"
            >
                <div className="bg-[var(--blue)]/20 p-1 rounded">
                    <Folder className="w-4 h-4 text-[var(--blue)]" />
                </div>
                <span>
                    {selectedId ? cards.find(c => c.id === selectedId)?.title : `${cards.length} Projects`}
                </span>
                <ChevronDown className={`w-4 h-4 text-[var(--muted)] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full right-0 mt-2 w-56 bg-[var(--panel-2)] border border-[var(--stroke)] rounded-xl shadow-xl z-50 overflow-hidden flex flex-col py-1">
                        <button
                            onClick={() => { onSelect(null); setIsOpen(false); }}
                            className={`px-4 py-2.5 text-left text-sm hover:bg-[var(--bg-0)] transition-colors flex items-center gap-2 ${!selectedId ? 'text-[var(--blue)] bg-[var(--blue)]/10' : 'text-[var(--text)]'}`}
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            All Projects
                        </button>
                        <div className="h-px bg-[var(--stroke)] my-1 mx-2" />
                        <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                            {cards.map(card => (
                                <button
                                    key={card.id}
                                    onClick={() => { if (card.id) { onSelect(card.id); setIsOpen(false); } }}
                                    className={`w-full px-4 py-2.5 text-left text-sm hover:bg-[var(--bg-0)] transition-colors flex items-center gap-2 ${selectedId === card.id ? 'text-[var(--blue)] bg-[var(--blue)]/10' : 'text-[var(--text-secondary)]'}`}
                                >
                                    <Folder className="w-3.5 h-3.5 opacity-70" />
                                    <span className="truncate">{card.title}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
