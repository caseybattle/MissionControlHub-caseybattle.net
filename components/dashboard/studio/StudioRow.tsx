import { useState, useRef } from 'react';
import { VideoScene } from '@/lib/firestore';
import {
    GripVertical,
    Image as ImageIcon,
    Video as VideoIcon,
    Trash2,
    Play,
    Tag,
    AlertCircle,
    Clock,
    User,
    Monitor,
    Maximize2,
    Type,
    Loader2
} from 'lucide-react';
import { Reorder } from 'framer-motion';
import { uploadFile } from '@/lib/storage';
import { StudioRowProps, STATUS_CONFIG, PRIORITY_CONFIG, ContentStatus, Priority } from './types';

const DragHandle = ({ dragControls }: { dragControls: any }) => {
    return (
        <div
            onPointerDown={(e) => dragControls.start(e)}
            className="cursor-grab active:cursor-grabbing p-2 hover:bg-[var(--panel-2)] rounded text-[var(--muted)] hover:text-[var(--text)] transition-colors"
        >
            <GripVertical className="w-5 h-5" />
        </div>
    );
};

export const StudioRow = ({ scene, onUpdate, onDelete, dragControls }: StudioRowProps) => {
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadingVideo, setUploadingVideo] = useState(false);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);

    // Helper for date formatting
    const formatDate = (timestamp?: number) => {
        if (!timestamp) return '-';
        return new Date(timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };

    const handleFileUpload = async (file: File, type: 'image' | 'video') => {
        try {
            if (type === 'image') setUploadingImage(true);
            else setUploadingVideo(true);

            // Upload to 'studio/images' or 'studio/videos'
            const path = `studio/${type}s`;
            const downloadURL = await uploadFile(file, path);

            onUpdate(type, downloadURL);
        } catch (error) {
            console.error(`Failed to upload ${type}:`, error);
            alert(`Failed to upload ${type}. Please try again.`);
        } finally {
            if (type === 'image') setUploadingImage(false);
            else setUploadingVideo(false);
        }
    };

    return (
        <Reorder.Item
            value={scene}
            dragListener={false}
            dragControls={dragControls}
            className="group border-b border-[var(--stroke)] bg-[var(--panel)] hover:bg-[var(--panel-2)] transition-colors 
            grid grid-cols-[50px_140px_120px_200px_120px_150px_150px_150px_80px_100px_120px_120px_150px_200px_60px] 
            items-start gap-0 text-sm min-w-max"
        >
            {/* 1. Drag Handle */}
            <div className="p-3 h-full flex items-center justify-center border-r border-[var(--stroke)]">
                <DragHandle dragControls={dragControls} />
            </div>

            {/* 2. Status */}
            <div className="p-3 h-full border-r border-[var(--stroke)]">
                <select
                    value={scene.status}
                    onChange={(e) => onUpdate('status', e.target.value)}
                    className="w-full bg-transparent font-medium outline-none cursor-pointer h-full"
                    style={{ color: STATUS_CONFIG[scene.status as ContentStatus]?.color || 'inherit' }}
                >
                    {Object.entries(STATUS_CONFIG).map(([key, conf]) => (
                        <option key={key} value={key} className="bg-[var(--bg-1)] text-[var(--text)] text-sm">
                            {conf.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* 3. Type */}
            <div className="p-3 h-full border-r border-[var(--stroke)]">
                <div className="flex items-center gap-2 h-full">
                    <Type className="w-4 h-4 text-[var(--text-tertiary)]" />
                    <select
                        value={scene.type || 'youtube'}
                        onChange={(e) => onUpdate('type', e.target.value)}
                        className="w-full bg-transparent outline-none cursor-pointer text-[var(--text-secondary)] hover:text-[var(--text)]"
                    >
                        <option value="youtube" className="bg-[var(--bg-1)]">YouTube</option>
                        <option value="tiktok" className="bg-[var(--bg-1)]">TikTok</option>
                        <option value="reel" className="bg-[var(--bg-1)]">Reel</option>
                    </select>
                </div>
            </div>

            {/* 4. Title (New) */}
            <div className="p-0 border-r border-[var(--stroke)] h-full">
                <input
                    type="text"
                    value={scene.title || ''}
                    onChange={(e) => onUpdate('title', e.target.value)}
                    placeholder="Video Title..."
                    className="w-full h-full p-3 bg-transparent outline-none text-[var(--text)] placeholder-[var(--muted)] hover:bg-[var(--bg-0)]/20 transition-colors"
                />
            </div>

            {/* 5. Author (New) */}
            <div className="p-3 h-full border-r border-[var(--stroke)] flex items-center gap-2">
                <User className="w-4 h-4 text-[var(--text-tertiary)] shrink-0" />
                <input
                    type="text"
                    value={scene.author || ''}
                    onChange={(e) => onUpdate('author', e.target.value)}
                    placeholder="Author..."
                    className="w-full bg-transparent outline-none text-[var(--text-secondary)] placeholder-[var(--muted)]"
                />
            </div>

            {/* 6. Thumbnail (New/Improved) */}
            <div className="p-3 border-r border-[var(--stroke)] h-full flex flex-col gap-2 justify-center">
                <div
                    className="relative h-[60px] w-full bg-[var(--bg-0)] rounded border border-[var(--stroke)] overflow-hidden flex items-center justify-center shrink-0 cursor-pointer hover:border-[var(--blue)] transition-colors group/thumb"
                    onClick={() => imageInputRef.current?.click()}
                >
                    {uploadingImage ? (
                        <Loader2 className="w-5 h-5 text-[var(--blue)] animate-spin" />
                    ) : scene.image ? (
                        <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={scene.image} alt="Thumb" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                                <ImageIcon className="w-4 h-4 text-white" />
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center gap-1 text-[var(--muted)] group-hover/thumb:text-[var(--text-secondary)] transition-colors">
                            <ImageIcon className="w-4 h-4" />
                            <span className="text-[10px]">Upload</span>
                        </div>
                    )}
                    <input
                        type="file"
                        ref={imageInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, 'image');
                        }}
                    />
                </div>
                <input
                    type="text"
                    value={scene.image || ''}
                    onChange={(e) => onUpdate('image', e.target.value)}
                    placeholder="or Paste URL..."
                    className="w-full bg-[var(--bg-0)] border border-[var(--stroke)] rounded px-2 py-1 text-xs text-[var(--text-secondary)] focus:ring-1 focus:ring-[var(--blue)] outline-none"
                    onClick={(e) => e.stopPropagation()}
                />
            </div>

            {/* 7. Video (New/Improved) */}
            <div className="p-3 border-r border-[var(--stroke)] h-full flex flex-col gap-2 justify-center">
                <div
                    className="relative h-[60px] w-full bg-[var(--bg-0)] rounded border border-[var(--stroke)] overflow-hidden flex items-center justify-center shrink-0 cursor-pointer hover:border-[var(--blue)] transition-colors group/video"
                    onClick={() => videoInputRef.current?.click()}
                >
                    {uploadingVideo ? (
                        <Loader2 className="w-5 h-5 text-[var(--blue)] animate-spin" />
                    ) : scene.video ? (
                        <div className="flex flex-col items-center gap-1 text-[var(--blue)] group-hover/video:text-white transition-colors">
                            <Play className="w-6 h-6 fill-current" />
                            <span className="text-[10px]">Change</span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-1 text-[var(--muted)] group-hover/video:text-[var(--text-secondary)] transition-colors">
                            <VideoIcon className="w-4 h-4" />
                            <span className="text-[10px]">Upload</span>
                        </div>
                    )}
                    <input
                        type="file"
                        ref={videoInputRef}
                        className="hidden"
                        accept="video/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, 'video');
                        }}
                    />
                </div>
                {scene.video && (
                    <a href={scene.video} target="_blank" rel="noreferrer" className="text-[10px] text-[var(--blue)] hover:underline text-center truncate px-1">
                        Open Link
                    </a>
                )}
                {!scene.video && (
                    <input
                        type="text"
                        value={scene.video || ''}
                        onChange={(e) => onUpdate('video', e.target.value)}
                        placeholder="or Paste URL..."
                        className="w-full bg-[var(--bg-0)] border border-[var(--stroke)] rounded px-2 py-1 text-xs text-[var(--text-secondary)] focus:ring-1 focus:ring-[var(--blue)] outline-none"
                        onClick={(e) => e.stopPropagation()}
                    />
                )}
            </div>

            {/* 8. Script */}
            <div className="p-0 border-r border-[var(--stroke)] h-full">
                <textarea
                    value={scene.script}
                    onChange={(e) => onUpdate('script', e.target.value)}
                    placeholder="Script content..."
                    className="w-full h-full min-h-[100px] p-3 bg-transparent outline-none resize-none text-[var(--text)] placeholder-[var(--muted)] focus:bg-[var(--bg-0)]/30 transition-colors"
                />
            </div>

            {/* 9. Size (New) */}
            <div className="p-3 h-full border-r border-[var(--stroke)] flex items-center gap-2">
                <Maximize2 className="w-4 h-4 text-[var(--text-tertiary)] shrink-0" />
                <input
                    type="text"
                    value={scene.size || ''}
                    onChange={(e) => onUpdate('size', e.target.value)}
                    placeholder="e.g. 1080p"
                    className="w-full bg-transparent outline-none text-[var(--text-secondary)] placeholder-[var(--muted)]"
                />
            </div>

            {/* 10. Duration */}
            <div className="p-3 h-full border-r border-[var(--stroke)] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[var(--text-tertiary)] shrink-0" />
                <input
                    type="text"
                    value={scene.duration || ''}
                    onChange={(e) => onUpdate('duration', e.target.value)}
                    placeholder="00:00"
                    className="w-full bg-transparent outline-none text-[var(--text-secondary)] placeholder-[var(--muted)]"
                />
            </div>

            {/* 11. Visibility (New) */}
            <div className="p-3 h-full border-r border-[var(--stroke)] flex items-center gap-2">
                <Monitor className="w-4 h-4 text-[var(--text-tertiary)] shrink-0" />
                <select
                    value={scene.visibility || 'public'}
                    onChange={(e) => onUpdate('visibility', e.target.value)}
                    className="w-full bg-transparent outline-none cursor-pointer text-[var(--text-secondary)] hover:text-[var(--text)]"
                >
                    <option value="public" className="bg-[var(--bg-1)]">Public</option>
                    <option value="unlisted" className="bg-[var(--bg-1)]">Unlisted</option>
                    <option value="private" className="bg-[var(--bg-1)]">Private</option>
                </select>
            </div>

            {/* 12. Priority */}
            <div className="p-3 h-full border-r border-[var(--stroke)] flex items-center">
                <div className="flex items-center gap-2 w-full p-1.5 rounded hover:bg-[var(--bg-0)] cursor-pointer">
                    <AlertCircle className={`w-4 h-4 shrink-0 ${PRIORITY_CONFIG[(scene.priority || 'medium') as Priority]?.color}`} />
                    <select
                        value={scene.priority || 'medium'}
                        onChange={(e) => onUpdate('priority', e.target.value)}
                        className="bg-transparent font-medium outline-none cursor-pointer w-full text-[var(--text)]"
                    >
                        {Object.entries(PRIORITY_CONFIG).map(([key, conf]) => (
                            <option key={key} value={key} className="bg-[var(--bg-1)]">{conf.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* 13. Tags */}
            <div className="p-3 border-r border-[var(--stroke)] h-full">
                <div className="flex items-center gap-2 mb-2">
                    <Tag className="w-4 h-4 text-[var(--text-tertiary)]" />
                    <input
                        type="text"
                        value={(scene.tags || []).join(', ')}
                        onChange={(e) => onUpdate('tags', e.target.value.split(',').map(s => s.trim()))}
                        placeholder="Tags..."
                        className="w-full bg-transparent outline-none text-[var(--text-secondary)] placeholder-[var(--muted)]"
                    />
                </div>
                <div className="flex flex-wrap gap-1.5">
                    {(scene.tags || []).filter(t => t).map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 bg-[var(--panel-2)] rounded text-xs text-[var(--text-tertiary)] flex items-center border border-[var(--stroke)]">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* 14. Dates (New - Read-only) */}
            <div className="p-3 border-r border-[var(--stroke)] h-full flex flex-col justify-center text-xs text-[var(--text-tertiary)] gap-1">
                <div className="flex justify-between">
                    <span>Created:</span>
                    <span className="text-[var(--text-secondary)]">{formatDate(scene.createdAt)}</span>
                </div>
                {scene.modifiedAt && (
                    <div className="flex justify-between">
                        <span>Updated:</span>
                        <span className="text-[var(--text-secondary)]">{formatDate(scene.modifiedAt)}</span>
                    </div>
                )}
            </div>

            {/* 15. Actions */}
            <div className="p-3 h-full flex items-center justify-center">
                <button
                    onClick={onDelete}
                    className="p-2 hover:bg-[var(--err)]/20 hover:text-[var(--err)] rounded transition-colors text-[var(--muted)]"
                    title="Delete Row"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </Reorder.Item>
    );
};
