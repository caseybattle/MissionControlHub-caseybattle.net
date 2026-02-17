"use client";

import { useState, useEffect } from 'react';
import {
    FirestoreCard,
    subscribeToCards,
} from '@/lib/firestore';
import {
    Video as VideoIcon,
} from 'lucide-react';
import { ProjectTable } from './studio/ProjectTable';
import { ProjectDropdown } from './studio/ProjectDropdown';

export function Studio() {
    const [cards, setCards] = useState<FirestoreCard[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

    useEffect(() => {
        const unsub = subscribeToCards((allCards) => {
            setCards(allCards.filter(c => c.category === 'Production' || c.category === 'Production Studio'));
        });
        return () => unsub();
    }, []);

    const filteredCards = selectedProjectId
        ? cards.filter(c => c.id === selectedProjectId)
        : cards;

    return (
        <div className="h-full flex flex-col px-6 md:px-10 pb-6 md:pb-10 pt-2 overflow-hidden bg-[var(--bg-0)]">
            <div className="flex items-center justify-between mb-8 shrink-0">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-orbitron)] text-white mb-2 tracking-wide">
                        PRODUCTION STUDIO
                    </h1>
                    <p className="text-[var(--text-secondary)] text-base">
                        Manage your content pipeline, scripts, and media assets.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <ProjectDropdown cards={cards} onSelect={setSelectedProjectId} selectedId={selectedProjectId} />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pb-24 custom-scrollbar">
                {filteredCards.length > 0 ? (
                    filteredCards.map(card => (
                        <ProjectTable key={card.id} card={card} />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-[500px] border-2 border-dashed border-[var(--stroke)] rounded-2xl bg-[var(--panel)]/30">
                        <VideoIcon className="w-16 h-16 text-[var(--muted)] mb-6 opacity-80" />
                        <h3 className="text-[var(--text)] text-xl font-bold mb-2">No Projects Found</h3>
                        <p className="text-[var(--text-secondary)] text-base mb-6 max-w-md text-center">
                            {selectedProjectId ? "This project has no data." : "Create a card in the \"Production Studio\" category using the sidebar to see it here."}
                        </p>
                        {selectedProjectId && (
                            <button onClick={() => setSelectedProjectId(null)} className="text-[var(--blue)] hover:underline text-sm">Return to All Projects</button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
