'use client';

import { useState } from 'react';
import { VideoScene } from '@/lib/firestore';
import { Plus, Trash2, Image as ImageIcon, Film, FileText, Sparkles, CheckCircle, AlertCircle, Eye } from 'lucide-react';

interface ProductionGridProps {
    scenes: VideoScene[];
    onChange: (scenes: VideoScene[]) => void;
}

const STATUS_CONFIG = {
    draft: { label: 'Draft', color: '#9ca3af', bg: 'rgba(156, 163, 175, 0.1)' },
    'ready-review': { label: 'Ready', color: '#f97316', bg: 'rgba(249, 115, 22, 0.1)' },
    approved: { label: 'Approved', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
    revision: { label: 'Revision', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
};

export default function ProductionGrid({ scenes, onChange }: ProductionGridProps) {
    const handleAddScene = () => {
        const newScene: VideoScene = {
            id: crypto.randomUUID(),
            script: '',
            visualPrompt: '',
            image: '',
            video: '',
            status: 'draft',
        };
        onChange([...scenes, newScene]);
    };

    const handleUpdate = (id: string, field: keyof VideoScene, value: any) => {
        const updated = scenes.map((s) => (s.id === id ? { ...s, [field]: value } : s));
        onChange(updated);
    };

    const handleDelete = (id: string) => {
        onChange(scenes.filter((s) => s.id !== id));
    };

    return (
        <div className="space-y-6">
            {/* Header / Toolbar */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Film className="w-4 h-4 text-zinc-500" />
                    <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>
                        Production Scenes ({scenes.length})
                    </h3>
                </div>
                <button
                    type="button"
                    onClick={handleAddScene}
                    className="btn-secondary text-xs flex items-center gap-2 py-1.5 px-3"
                >
                    <Plus className="w-3.5 h-3.5" /> Add Scene
                </button>
            </div>

            {/* Scenes List */}
            <div className="space-y-4">
                {scenes.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-zinc-800 rounded-xl bg-zinc-900/30">
                        <FileText className="w-10 h-10 mx-auto mb-3 text-zinc-700" />
                        <p className="text-sm text-zinc-500 font-medium">No scenes yet</p>
                        <p className="text-xs text-zinc-600 mb-4">Start by adding your first scene script and prompt</p>
                        <button
                            type="button"
                            onClick={handleAddScene}
                            className="btn-secondary text-xs"
                        >
                            Create Scene 1
                        </button>
                    </div>
                ) : (
                    scenes.map((scene, index) => (
                        <div
                            key={scene.id}
                            className="rounded-xl border transition-all duration-200 group"
                            style={{
                                backgroundColor: 'var(--color-surface-elevated)',
                                borderColor: STATUS_CONFIG[scene.status]?.color ? `${STATUS_CONFIG[scene.status].color}30` : 'var(--color-border)',
                                boxShadow: scene.status === 'ready-review' ? `0 0 20px -5px ${STATUS_CONFIG['ready-review'].color}20` : 'none'
                            }}
                        >
                            {/* Scene Header */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/30 rounded-t-xl">
                                <div className="flex items-center gap-3">
                                    <span
                                        className="flex items-center justify-center w-6 h-6 rounded-md text-xs font-bold font-mono"
                                        style={{
                                            backgroundColor: 'var(--color-surface)',
                                            color: 'var(--color-text-secondary)',
                                            border: '1px solid var(--color-border)',
                                        }}
                                    >
                                        {index + 1}
                                    </span>
                                    <div className="h-4 w-[1px] bg-zinc-800"></div>
                                    <select
                                        value={scene.status}
                                        onChange={(e) => handleUpdate(scene.id, 'status', e.target.value)}
                                        className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded cursor-pointer outline-none border-none hover:opacity-80 transition-opacity appearance-none text-center min-w-[100px]"
                                        style={{
                                            backgroundColor: STATUS_CONFIG[scene.status].bg,
                                            color: STATUS_CONFIG[scene.status].color,
                                            border: `1px solid ${STATUS_CONFIG[scene.status].color}30`
                                        }}
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="ready-review">Ready for Review</option>
                                        <option value="approved">Approved</option>
                                        <option value="revision">Needs Revision</option>
                                    </select>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(scene.id)}
                                    className="p-1.5 rounded text-zinc-600 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                                    title="Delete Scene"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Content Grid */}
                            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column: Script & Prompt */}
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 flex items-center gap-1.5 pl-1">
                                            <FileText className="w-3 h-3" /> Script / Voiceover
                                        </label>
                                        <textarea
                                            value={scene.script}
                                            onChange={(e) => handleUpdate(scene.id, 'script', e.target.value)}
                                            placeholder="Enter spoken text..."
                                            rows={2}
                                            className="input-field w-full text-sm resize-y min-h-[80px]"
                                            style={{ backgroundColor: 'var(--color-surface)', lineHeight: '1.5' }}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 flex items-center gap-1.5 pl-1">
                                            <Sparkles className="w-3 h-3 text-purple-400" /> Visual Prompt
                                        </label>
                                        <textarea
                                            value={scene.visualPrompt}
                                            onChange={(e) => handleUpdate(scene.id, 'visualPrompt', e.target.value)}
                                            placeholder="Describe the image/video to generate..."
                                            rows={2}
                                            className="input-field w-full text-xs font-mono resize-y min-h-[80px]"
                                            style={{
                                                backgroundColor: 'rgba(147, 51, 234, 0.03)',
                                                color: 'var(--color-text-secondary)',
                                                borderColor: 'rgba(147, 51, 234, 0.2)'
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Right Column: Assets */}
                                <div className="space-y-4">
                                    {/* Image Logic */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 flex items-center gap-1.5 pl-1">
                                            <ImageIcon className="w-3 h-3" /> Image Asset
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={scene.image}
                                                onChange={(e) => handleUpdate(scene.id, 'image', e.target.value)}
                                                placeholder="Paste Image URL..."
                                                className="input-field flex-1 text-xs"
                                            />
                                            {scene.image && (
                                                <a
                                                    href={scene.image}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-9 h-9 rounded-lg flex items-center justify-center bg-zinc-800 border border-zinc-700 hover:border-vermilion-500 transition-colors shrink-0"
                                                    title="Open Link"
                                                >
                                                    <Eye className="w-4 h-4 text-zinc-400 hover:text-white" />
                                                </a>
                                            )}
                                        </div>
                                        {/* Image Preview Area */}
                                        <div className="mt-2 w-full aspect-video rounded-lg border-2 border-dashed border-zinc-800 bg-zinc-900/50 flex items-center justify-center overflow-hidden relative group/img">
                                            {scene.image ? (
                                                /* eslint-disable-next-line @next/next/no-img-element */
                                                <>
                                                    <img src={scene.image} alt="Preview" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                                        <span className="text-xs font-medium text-white bg-black/50 px-2 py-1 rounded">Preview</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="text-center p-4">
                                                    <ImageIcon className="w-6 h-6 text-zinc-700 mx-auto mb-1" />
                                                    <span className="text-[10px] text-zinc-600 block">No Image</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
