
'use client';

import { X, Layout, Film, MoreVertical, Plus } from 'lucide-react';

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ animation: 'fadeIn 0.2s ease-out' }}>
            {/* Backdrop */}
            <div className="absolute inset-0 backdrop-blur-sm bg-black/60" onClick={onClose} />

            {/* Modal Content */}
            <div
                className="relative w-full max-w-2xl bg-[#111] border border-[#333] rounded-2xl shadow-2xl overflow-hidden"
                style={{ animation: 'slideUp 0.3s ease-out' }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#333]">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="text-vermilion-500">Mission Control</span> User Guide
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-[#222] rounded-lg text-zinc-400 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 space-y-8 overflow-y-auto max-h-[70vh] custom-scrollbar">

                    {/* Section 1: The Board */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Layout className="w-5 h-5 text-vermilion-400" />
                            Managing Projects
                        </h3>
                        <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#333] space-y-2 text-zinc-300 text-sm">
                            <p><strong className="text-white">Create Card:</strong> Click the big <span className="inline-flex items-center px-2 py-0.5 rounded bg-vermilion-500/20 text-vermilion-400 text-xs border border-vermilion-500/30"><Plus className="w-3 h-3 mr-1" /> New Card</span> button in the sidebar.</p>
                            <p><strong className="text-white">Move Card:</strong> Drag and drop cards between status columns (Backlog → In Progress → Complete).</p>
                            <p><strong className="text-white">Delete/Edit:</strong> Hover over any card and click the <MoreVertical className="w-3 h-3 inline mx-1" /> menu icon in the top-right corner.</p>
                        </div>
                    </div>

                    {/* Section 2: Production Workflow */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Film className="w-5 h-5 text-blue-400" />
                            Production Assets (Scripts & Prompts)
                        </h3>
                        <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#333] space-y-3 text-zinc-300 text-sm">
                            <p>Every card has a hidden <strong>Production Studio</strong> built-in.</p>
                            <ol className="list-decimal list-inside space-y-2 ml-1">
                                <li>Click on any card to open it.</li>
                                <li>Look for the tabs at the top: <strong>Overview</strong> and <strong>Production</strong>.</li>
                                <li>Click <strong>Production</strong> to access the Scene Grid.</li>
                                <li>Here you can manage <strong>Scripts</strong>, <strong>Visual Prompts</strong>, and <strong>Media Links</strong> for each scene.</li>
                            </ol>
                        </div>
                    </div>

                    {/* Section 3: Pro Tips */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-white">Pro Tips</h3>
                        <ul className="grid grid-cols-2 gap-4">
                            <li className="bg-[#1a1a1a] p-3 rounded-lg border border-[#333] text-xs text-zinc-400">
                                <strong className="block text-zinc-200 mb-1">Force Refresh</strong>
                                If UI looks glitchy, use Ctrl+Shift+R (Cmd+Shift+R) to clear cache.
                            </li>
                            <li className="bg-[#1a1a1a] p-3 rounded-lg border border-[#333] text-xs text-zinc-400">
                                <strong className="block text-zinc-200 mb-1">Checklists</strong>
                                Track generic tasks in the Overview tab's checklist section.
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-6 border-t border-[#333] bg-[#151515] flex justify-end">
                    <button onClick={onClose} className="px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-zinc-200 transition-colors">
                        Got it
                    </button>
                </div>
            </div>
        </div>
    );
}
