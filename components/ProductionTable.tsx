
'use client';

import { VideoScene } from '@/lib/firestore';
import { Plus, Trash2, Image as ImageIcon, Video, FileText, Sparkles, Eye, GripVertical } from 'lucide-react';

interface ProductionTableProps {
    scenes: VideoScene[];
    onChange: (scenes: VideoScene[]) => void;
}

const STATUS_CONFIG = {
    draft: { label: 'Draft', color: '#9ca3af', bg: 'rgba(156, 163, 175, 0.1)' },
    'ready-review': { label: 'Ready', color: '#f97316', bg: 'rgba(249, 115, 22, 0.1)' },
    approved: { label: 'Approved', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
    revision: { label: 'Revision', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
};

export default function ProductionTable({ scenes, onChange }: ProductionTableProps) {
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
        if (confirm('Delete this scene?')) {
            onChange(scenes.filter((s) => s.id !== id));
        }
    };

    return (
        <div className="space-y-4 h-full flex flex-col">
            {/* Header / Toolbar */}
            <div className="flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-vermilion-500/10 rounded overflow-hidden">
                        <table className="w-4 h-4 text-vermilion-500 border-collapse">
                            <tbody>
                                <tr><td className="border border-current w-1 h-1"></td><td className="border border-current w-1 h-1"></td></tr>
                                <tr><td className="border border-current w-1 h-1"></td><td className="border border-current w-1 h-1"></td></tr>
                            </tbody>
                        </table>
                    </div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>
                        Production Table
                    </h3>
                </div>
                <button
                    type="button"
                    onClick={handleAddScene}
                    className="btn-secondary text-xs flex items-center gap-2 py-1.5 px-3"
                >
                    <Plus className="w-3.5 h-3.5" /> Add Row
                </button>
            </div>

            {/* Table Container */}
            <div className="flex-1 overflow-auto border border-zinc-800 rounded-lg bg-[#0a0a0a] relative custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead className="sticky top-0 z-10 bg-[#151515] text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                        <tr>
                            <th className="p-3 border-b border-r border-zinc-800 w-[60px] text-center">#</th>
                            <th className="p-3 border-b border-r border-zinc-800 w-[120px]">Status</th>
                            <th className="p-3 border-b border-r border-zinc-800 min-w-[300px]">Script / Voiceover</th>
                            <th className="p-3 border-b border-r border-zinc-800 min-w-[300px]">Visual Prompt</th>
                            <th className="p-3 border-b border-r border-zinc-800 w-[200px]">Image Asset</th>
                            <th className="p-3 border-b border-zinc-800 w-[200px]">Video Asset</th>
                            <th className="p-3 border-b border-l border-zinc-800 w-[50px]"></th>
                        </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-zinc-800">
                        {scenes.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="p-12 text-center text-zinc-500">
                                    No scenes yet. Click "Add Row" to start.
                                </td>
                            </tr>
                        ) : (
                            scenes.map((scene, index) => (
                                <tr key={scene.id} className="group hover:bg-[#111] transition-colors">
                                    {/* ID */}
                                    <td className="p-3 border-r border-zinc-800 text-center text-zinc-500 font-mono text-xs">
                                        {index + 1}
                                    </td>

                                    {/* Status */}
                                    <td className="p-2 border-r border-zinc-800 align-top">
                                        <select
                                            value={scene.status}
                                            onChange={(e) => handleUpdate(scene.id, 'status', e.target.value)}
                                            className="w-full text-xs font-medium px-2 py-1.5 rounded cursor-pointer outline-none bg-transparent hover:bg-[#222]"
                                            style={{
                                                color: STATUS_CONFIG[scene.status]?.color || '#fff',
                                            }}
                                        >
                                            <option value="draft">Draft</option>
                                            <option value="ready-review">Ready</option>
                                            <option value="approved">Approved</option>
                                            <option value="revision">Revision</option>
                                        </select>
                                    </td>

                                    {/* Script */}
                                    <td className="p-0 border-r border-zinc-800 align-top">
                                        <textarea
                                            value={scene.script}
                                            onChange={(e) => handleUpdate(scene.id, 'script', e.target.value)}
                                            placeholder="Enter script..."
                                            className="w-full h-full min-h-[80px] p-3 bg-transparent outline-none resize-none text-zinc-300 placeholder-zinc-700 focus:bg-[#151515]"
                                        />
                                    </td>

                                    {/* Prompt */}
                                    <td className="p-0 border-r border-zinc-800 align-top bg-[#0f0f0f]">
                                        <textarea
                                            value={scene.visualPrompt}
                                            onChange={(e) => handleUpdate(scene.id, 'visualPrompt', e.target.value)}
                                            placeholder="Describe visuals..."
                                            className="w-full h-full min-h-[80px] p-3 bg-transparent outline-none resize-none text-zinc-400 font-mono text-xs placeholder-zinc-800 focus:bg-[#151515]"
                                            style={{ color: '#a78bfa' }}
                                        />
                                    </td>

                                    {/* Image */}
                                    <td className="p-2 border-r border-zinc-800 align-top">
                                        <div className="space-y-2">
                                            <input
                                                type="text"
                                                value={scene.image}
                                                onChange={(e) => handleUpdate(scene.id, 'image', e.target.value)}
                                                placeholder="Image URL..."
                                                className="w-full bg-[#151515] border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-300 focus:border-zinc-600 outline-none"
                                            />
                                            <div className="h-[60px] w-full bg-[#151515] rounded border border-zinc-800 border-dashed flex items-center justify-center overflow-hidden relative group/img">
                                                {scene.image ? (
                                                    <>
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img src={scene.image} alt="Preview" className="w-full h-full object-cover" />
                                                        <a href={scene.image} target="_blank" rel="noreferrer" className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                                                            <Eye className="w-4 h-4 text-white" />
                                                        </a>
                                                    </>
                                                ) : (
                                                    <ImageIcon className="w-4 h-4 text-zinc-700" />
                                                )}
                                            </div>
                                        </div>
                                    </td>

                                    {/* Video */}
                                    <td className="p-2 border-r border-zinc-800 align-top">
                                        <div className="space-y-2">
                                            <input
                                                type="text"
                                                value={scene.video}
                                                onChange={(e) => handleUpdate(scene.id, 'video', e.target.value)}
                                                placeholder="Video URL..."
                                                className="w-full bg-[#151515] border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-300 focus:border-zinc-600 outline-none"
                                            />
                                            <div className="h-[60px] w-full bg-[#151515] rounded border border-zinc-800 border-dashed flex items-center justify-center">
                                                <Video className="w-4 h-4 text-zinc-700" />
                                            </div>
                                        </div>
                                    </td>

                                    {/* Actions */}
                                    <td className="p-2 align-top text-center">
                                        <button
                                            onClick={() => handleDelete(scene.id)}
                                            className="p-1.5 rounded hover:bg-red-500/10 text-zinc-600 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
