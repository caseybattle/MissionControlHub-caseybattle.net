import { useState, useRef, useEffect, useCallback } from 'react';
import { FirestoreCard, VideoScene, updateCard } from '@/lib/firestore';
import { Reorder, useDragControls } from 'framer-motion';
import { ChevronDown, Clock, Plus, Video as VideoIcon } from 'lucide-react';
import { StudioRow } from './StudioRow';
import { StudioRowProps } from './types';

// Wrapper for DragControls hook
const DraggableRowWrapper = (props: Omit<StudioRowProps, 'dragControls'>) => {
    const dragControls = useDragControls();
    return <StudioRow {...props} dragControls={dragControls} />;
};

export const ProjectTable = ({ card }: { card: FirestoreCard }) => {
    const [scenes, setScenes] = useState<VideoScene[]>(card.scenes || []);
    const [isExpanded, setIsExpanded] = useState(true);
    const [saving, setSaving] = useState(false);
    const tableContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setScenes(card.scenes || []);
    }, [card.id]);

    const handleScenesReorder = (newOrder: VideoScene[]) => {
        setScenes(newOrder); // Optimistic
        debouncedSave(newOrder);
    };

    const updateScene = (id: string, field: keyof VideoScene, value: any) => {
        const timestamp = Date.now();
        const newScenes = scenes.map(s =>
            s.id === id ? { ...s, [field]: value, modifiedAt: timestamp } : s
        );
        setScenes(newScenes);
        debouncedSave(newScenes);
    };

    const addScene = () => {
        const timestamp = Date.now();
        const newScene: VideoScene = {
            id: crypto.randomUUID(),
            script: '',
            visualPrompt: '',
            image: '',
            video: '',
            title: '',
            author: '',
            status: 'draft',
            priority: 'medium',
            type: 'youtube',
            tags: [],
            notes: '',
            createdAt: timestamp,
            modifiedAt: timestamp
        };
        const newScenes = [...scenes, newScene];
        setScenes(newScenes);
        debouncedSave(newScenes);
    };

    const deleteScene = (id: string) => {
        const newScenes = scenes.filter(s => s.id !== id);
        setScenes(newScenes);
        debouncedSave(newScenes);
    };

    const debouncedSave = useCallback((newScenes: VideoScene[]) => {
        setSaving(true);
        updateCard(card.id!, { scenes: newScenes }).then(() => setSaving(false));
    }, [card.id]);

    const scrollTable = (direction: 'left' | 'right') => {
        if (tableContainerRef.current) {
            const scrollAmount = 400; // Scroll by a decent chunk
            tableContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="border border-[var(--stroke)] rounded-xl overflow-hidden bg-[#0c0c0c] mb-8 shadow-lg">
            {/* Card Header */}
            <div
                className="flex items-center justify-between px-6 py-4 bg-[var(--panel)] cursor-pointer hover:bg-[var(--panel-2)] transition-colors select-none border-b border-[var(--stroke)]"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-4">
                    {isExpanded ? <ChevronDown className="w-5 h-5 text-[var(--muted)]" /> : <ChevronDown className="w-5 h-5 -rotate-90 text-[var(--muted)]" />}
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-[var(--blue)] shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                        <h2 className="font-bold text-base tracking-wide text-white">{card.title}</h2>
                    </div>
                    <span className="text-xs text-[var(--muted)] bg-[var(--bg-0)] px-3 py-1 rounded-full border border-[var(--stroke)] font-medium">
                        {scenes.length} Scenes
                    </span>
                    {saving && <span className="text-xs text-[var(--text-tertiary)] flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 animate-spin" /> Saving...</span>}
                </div>
                <div className="flex items-center gap-3">
                    {/* Scroll Controls (Visible when expanded) */}
                    {isExpanded && (
                        <div className="flex items-center bg-[var(--bg-0)] rounded-lg border border-[var(--stroke)] p-0.5 mr-2" onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={() => scrollTable('left')}
                                className="p-1.5 hover:bg-[var(--panel-2)] text-[var(--text-secondary)] rounded transition-colors"
                                title="Scroll Left"
                            >
                                <ChevronDown className="w-4 h-4 rotate-90" />
                            </button>
                            <div className="w-px h-4 bg-[var(--stroke)] mx-0.5" />
                            <button
                                onClick={() => scrollTable('right')}
                                className="p-1.5 hover:bg-[var(--panel-2)] text-[var(--text-secondary)] rounded transition-colors"
                                title="Scroll Right"
                            >
                                <ChevronDown className="w-4 h-4 -rotate-90" />
                            </button>
                        </div>
                    )}

                    <button
                        onClick={(e) => { e.stopPropagation(); addScene(); }}
                        className="px-4 py-2 rounded-lg bg-[var(--blue)]/10 text-[var(--blue)] border border-[var(--blue)]/20 hover:bg-[var(--blue)]/20 text-sm font-semibold max-lg:hidden flex items-center gap-2 transition-all"
                    >
                        <Plus className="w-4 h-4" /> Add Scene
                    </button>
                </div>
            </div>

            {isExpanded && (
                <div ref={tableContainerRef} className="overflow-x-auto custom-scrollbar">
                    <Reorder.Group axis="y" values={scenes} onReorder={handleScenesReorder} className="min-w-max">
                        {/* Table Header */}
                        <div className="grid grid-cols-[50px_140px_120px_200px_120px_150px_150px_150px_80px_100px_120px_120px_150px_200px_60px] 
                            bg-[var(--bg-1)] border-b border-[var(--stroke)] text-xs font-bold text-[var(--muted)] uppercase tracking-wider sticky top-0 z-10 text-left">
                            <div className="p-3 border-r border-[var(--stroke)] text-center">#</div>
                            <div className="p-3 border-r border-[var(--stroke)]">Status</div>
                            <div className="p-3 border-r border-[var(--stroke)]">Type</div>
                            <div className="p-3 border-r border-[var(--stroke)]">Title</div>
                            <div className="p-3 border-r border-[var(--stroke)]">Author</div>
                            <div className="p-3 border-r border-[var(--stroke)]">Thumbnail</div>
                            <div className="p-3 border-r border-[var(--stroke)]">Video</div>
                            <div className="p-3 border-r border-[var(--stroke)]">Script</div>
                            <div className="p-3 border-r border-[var(--stroke)]">Size</div>
                            <div className="p-3 border-r border-[var(--stroke)]">Duration</div>
                            <div className="p-3 border-r border-[var(--stroke)]">Visibility</div>
                            <div className="p-3 border-r border-[var(--stroke)]">Priority</div>
                            <div className="p-3 border-r border-[var(--stroke)]">Tags</div>
                            <div className="p-3 border-r border-[var(--stroke)]">Dates</div>
                            <div className="p-3 text-center"></div>
                        </div>

                        {/* Rows */}
                        {scenes.map((scene) => (
                            <DraggableRowWrapper
                                key={scene.id}
                                scene={scene}
                                onUpdate={(field, val) => updateScene(scene.id, field, val)}
                                onDelete={() => deleteScene(scene.id)}
                            />
                        ))}

                        {scenes.length === 0 && (
                            <div className="p-16 text-center text-[var(--muted)] flex flex-col items-center">
                                <VideoIcon className="w-10 h-10 mb-4 opacity-20" />
                                <p className="text-base font-medium mb-1">No content yet</p>
                                <p className="text-sm mb-4">Start by adding a scene/row to this project.</p>
                                <button onClick={addScene} className="text-[var(--blue)] hover:underline text-sm font-medium">Create first scene</button>
                            </div>
                        )}
                    </Reorder.Group>

                    <button
                        onClick={addScene}
                        className="w-full py-3 flex items-center justify-center gap-2 text-sm text-[var(--muted)] hover:bg-[var(--panel)] border-t border-[var(--stroke)] transition-colors font-medium sticky left-0"
                    >
                        <Plus className="w-4 h-4" /> Add Scene
                    </button>
                </div>
            )}
        </div>
    );
};
