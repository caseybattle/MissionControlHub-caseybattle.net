'use client';

import { useEffect, useState } from 'react';
import { FirestoreCard, subscribeToCards, updateCard, VideoScene } from '@/lib/firestore';
import { Film, Plus, Trash2, Eye, Save, ChevronDown, ChevronRight } from 'lucide-react';

const STATUS_OPTIONS = [
    { value: 'draft', label: 'Draft', color: '#6b7280' },
    { value: 'ready-review', label: 'Ready', color: '#f97316' },
    { value: 'approved', label: 'Approved', color: '#10b981' },
    { value: 'revision', label: 'Revision', color: '#ef4444' },
];

export default function ProductionView() {
    const [cards, setCards] = useState<FirestoreCard[]>([]);
    const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
    const [saving, setSaving] = useState<string | null>(null);

    useEffect(() => {
        const unsub = subscribeToCards((allCards) => {
            const prodCards = allCards.filter(c => c.category === 'Production');
            setCards(prodCards);
            // Auto-expand all cards on first load
            setExpandedCards(new Set(prodCards.map(c => c.id!)));
        });
        return () => unsub();
    }, []);

    const updateScene = (cardId: string, sceneId: string, field: keyof VideoScene, value: string) => {
        setCards(prev => prev.map(card => {
            if (card.id !== cardId) return card;
            return {
                ...card,
                scenes: (card.scenes || []).map(s =>
                    s.id === sceneId ? { ...s, [field]: value } : s
                )
            };
        }));
    };

    const addScene = (cardId: string) => {
        setCards(prev => prev.map(card => {
            if (card.id !== cardId) return card;
            const newScene: VideoScene = {
                id: crypto.randomUUID(),
                script: '',
                visualPrompt: '',
                image: '',
                video: '',
                status: 'draft',
            };
            return { ...card, scenes: [...(card.scenes || []), newScene] };
        }));
    };

    const deleteScene = (cardId: string, sceneId: string) => {
        setCards(prev => prev.map(card => {
            if (card.id !== cardId) return card;
            return { ...card, scenes: (card.scenes || []).filter(s => s.id !== sceneId) };
        }));
    };

    const saveCard = async (card: FirestoreCard) => {
        if (!card.id) return;
        setSaving(card.id);
        try {
            await updateCard(card.id, { scenes: card.scenes || [] });
        } catch (err) {
            console.error('Save failed:', err);
        }
        setSaving(null);
    };

    const toggleCard = (cardId: string) => {
        setExpandedCards(prev => {
            const next = new Set(prev);
            if (next.has(cardId)) next.delete(cardId);
            else next.add(cardId);
            return next;
        });
    };

    const totalScenes = cards.reduce((sum, c) => sum + (c.scenes?.length || 0), 0);

    return (
        <div className="h-full flex flex-col gap-4">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                        <Film className="w-5 h-5 md:w-6 md:h-6 text-vermilion-500" />
                        Production Studio
                    </h1>
                    <p className="text-xs md:text-sm text-zinc-500 mt-1">
                        {cards.length} project{cards.length !== 1 ? 's' : ''} · {totalScenes} total scene{totalScenes !== 1 ? 's' : ''}
                    </p>
                </div>
            </div>

            {/* Projects */}
            <div className="flex-1 space-y-4 overflow-auto pb-8">
                {cards.length === 0 && (
                    <div className="text-center py-20 text-zinc-600">
                        <Film className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p className="font-medium">No production projects yet.</p>
                        <p className="text-sm">Move cards to the "Production" category to see them here.</p>
                    </div>
                )}

                {cards.map(card => {
                    const isExpanded = expandedCards.has(card.id!);
                    const scenes = card.scenes || [];

                    return (
                        <div key={card.id} className="border border-zinc-800 rounded-xl overflow-hidden bg-[#0c0c0c]">
                            {/* Project Header Bar */}
                            <div
                                className="flex flex-col sm:flex-row sm:items-center justify-between px-3 md:px-4 py-3 bg-[#111] cursor-pointer hover:bg-[#161616] transition-colors gap-2"
                                onClick={() => toggleCard(card.id!)}
                            >
                                <div className="flex items-center gap-2 md:gap-3 min-w-0">
                                    {isExpanded
                                        ? <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" />
                                        : <ChevronRight className="w-4 h-4 text-zinc-500 shrink-0" />
                                    }
                                    <h2 className="font-bold text-white text-sm truncate">{card.title}</h2>
                                    <span className="text-xs text-zinc-600 bg-zinc-800 px-2 py-0.5 rounded-full shrink-0">
                                        {scenes.length} scene{scenes.length !== 1 ? 's' : ''}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 ml-6 sm:ml-0">
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); addScene(card.id!); }}
                                        className="text-xs text-zinc-400 hover:text-white px-2 py-1.5 rounded hover:bg-zinc-800 flex items-center gap-1"
                                    >
                                        <Plus className="w-3 h-3" /> Add Row
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); saveCard(card); }}
                                        className="text-xs px-3 py-1.5 rounded font-medium flex items-center gap-1 bg-vermilion-500/10 text-vermilion-400 hover:bg-vermilion-500/20 border border-vermilion-500/20"
                                    >
                                        <Save className="w-3 h-3" />
                                        {saving === card.id ? 'Saving...' : 'Save'}
                                    </button>
                                </div>
                            </div>

                            {/* Airtable Grid */}
                            {isExpanded && (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse min-w-[1100px]">
                                        <thead className="bg-[#1a1a1a] text-xs font-bold text-zinc-400 uppercase tracking-wider">
                                            <tr>
                                                <th className="p-3 border-b border-r border-zinc-700 w-[50px] text-center">#</th>
                                                <th className="p-3 border-b border-r border-zinc-700 w-[100px]">Status</th>
                                                <th className="p-3 border-b border-r border-zinc-700 min-w-[280px]">Script / Voiceover</th>
                                                <th className="p-3 border-b border-r border-zinc-700 min-w-[280px]">Visual Prompt</th>
                                                <th className="p-3 border-b border-r border-zinc-700 w-[180px]">Image</th>
                                                <th className="p-3 border-b border-r border-zinc-700 w-[180px]">Video</th>
                                                <th className="p-3 border-b border-zinc-700 w-[50px]"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {scenes.length === 0 ? (
                                                <tr>
                                                    <td colSpan={7} className="p-8 text-center text-zinc-500 text-sm">
                                                        No scenes. Click "Add Row" above.
                                                    </td>
                                                </tr>
                                            ) : (
                                                scenes.map((scene, idx) => (
                                                    <tr key={scene.id} className="group hover:bg-[#111] border-b border-zinc-700/50 transition-colors">
                                                        {/* Row Number */}
                                                        <td className="p-3 border-r border-zinc-700 text-center text-zinc-400 font-mono text-sm">
                                                            {idx + 1}
                                                        </td>

                                                        {/* Status */}
                                                        <td className="p-2 border-r border-zinc-700">
                                                            <select
                                                                value={scene.status}
                                                                onChange={(e) => updateScene(card.id!, scene.id, 'status', e.target.value)}
                                                                className="w-full text-xs font-semibold px-2 py-1.5 rounded cursor-pointer outline-none bg-transparent"
                                                                style={{
                                                                    color: STATUS_OPTIONS.find(s => s.value === scene.status)?.color || '#fff',
                                                                }}
                                                            >
                                                                {STATUS_OPTIONS.map(s => (
                                                                    <option key={s.value} value={s.value}>{s.label}</option>
                                                                ))}
                                                            </select>
                                                        </td>

                                                        {/* Script */}
                                                        <td className="p-0 border-r border-zinc-700">
                                                            <textarea
                                                                value={scene.script}
                                                                onChange={(e) => updateScene(card.id!, scene.id, 'script', e.target.value)}
                                                                placeholder="Script text..."
                                                                className="w-full min-h-[70px] p-3 bg-transparent outline-none resize-none text-zinc-200 text-sm placeholder-zinc-600 focus:bg-[#151515] transition-colors"
                                                            />
                                                        </td>

                                                        {/* Visual Prompt */}
                                                        <td className="p-0 border-r border-zinc-700">
                                                            <textarea
                                                                value={scene.visualPrompt}
                                                                onChange={(e) => updateScene(card.id!, scene.id, 'visualPrompt', e.target.value)}
                                                                placeholder="Describe visuals..."
                                                                className="w-full min-h-[70px] p-3 bg-transparent outline-none resize-none text-purple-300 font-mono text-xs placeholder-zinc-600 focus:bg-[#151515] transition-colors"
                                                            />
                                                        </td>

                                                        {/* Image */}
                                                        <td className="p-2 border-r border-zinc-700">
                                                            <input
                                                                type="text"
                                                                value={scene.image}
                                                                onChange={(e) => updateScene(card.id!, scene.id, 'image', e.target.value)}
                                                                placeholder="Image URL..."
                                                                className="w-full bg-[#151515] border border-zinc-700 rounded px-2 py-1.5 text-xs text-zinc-200 focus:border-zinc-500 outline-none mb-1"
                                                            />
                                                            <div className="h-[40px] w-full bg-[#0a0a0a] rounded border border-dashed border-zinc-700 flex items-center justify-center overflow-hidden">
                                                                {scene.image ? (
                                                                    <a href={scene.image} target="_blank" rel="noreferrer" className="w-full h-full">
                                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                        <img src={scene.image} alt="" className="w-full h-full object-cover" />
                                                                    </a>
                                                                ) : (
                                                                    <span className="text-[10px] text-zinc-500">No image</span>
                                                                )}
                                                            </div>
                                                        </td>

                                                        {/* Video */}
                                                        <td className="p-2 border-r border-zinc-700">
                                                            <input
                                                                type="text"
                                                                value={scene.video}
                                                                onChange={(e) => updateScene(card.id!, scene.id, 'video', e.target.value)}
                                                                placeholder="Video URL..."
                                                                className="w-full bg-[#151515] border border-zinc-700 rounded px-2 py-1.5 text-xs text-zinc-200 focus:border-zinc-500 outline-none mb-1"
                                                            />
                                                            <div className="h-[40px] w-full bg-[#0a0a0a] rounded border border-dashed border-zinc-700 flex items-center justify-center">
                                                                <span className="text-[10px] text-zinc-500">No video</span>
                                                            </div>
                                                        </td>

                                                        {/* Delete */}
                                                        <td className="p-1 text-center">
                                                            <button
                                                                type="button"
                                                                onClick={() => deleteScene(card.id!, scene.id)}
                                                                className="p-1 rounded hover:bg-red-500/10 text-zinc-700 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
