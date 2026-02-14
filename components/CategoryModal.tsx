'use client';

import { useState, useEffect } from 'react';
import { addCategory, updateCategory, FirestoreCategory } from '@/lib/firestore';
import { X, Sparkles } from 'lucide-react';
import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    editCategory?: FirestoreCategory | null;
    existingCount: number;
}

const ICON_OPTIONS = [
    'Rocket', 'Lightbulb', 'Globe', 'BookOpen', 'Video', 'CheckSquare',
    'Code', 'Palette', 'Music', 'Camera', 'Briefcase', 'Heart',
    'Star', 'Zap', 'Target', 'Flag', 'Award', 'Coffee',
    'Hammer', 'PenTool', 'Layers', 'Database', 'Mail', 'Settings',
];

const COLOR_OPTIONS = [
    '#ff3d2e', '#f97316', '#eab308', '#10b981',
    '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
];

export default function CategoryModal({ isOpen, onClose, editCategory, existingCount }: CategoryModalProps) {
    const [name, setName] = useState('');
    const [icon, setIcon] = useState('Rocket');
    const [color, setColor] = useState('#ff3d2e');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setName(editCategory?.name || '');
            setIcon(editCategory?.icon || 'Rocket');
            setColor(editCategory?.color || '#ff3d2e');
        }
    }, [isOpen, editCategory]);

    if (!isOpen) return null;

    const getIcon = (iconName: string): LucideIcon => {
        return (Icons as any)[iconName] || Icons.Folder;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsSubmitting(true);
        try {
            if (editCategory?.id) {
                await updateCategory(editCategory.id, { name: name.trim(), icon, color });
            } else {
                await addCategory({ name: name.trim(), icon, color, order: existingCount });
            }
            onClose();
        } catch (err) {
            console.error('Failed to save category:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ animation: 'fadeIn 0.2s ease-out' }}>
            <div className="absolute inset-0 backdrop-blur-sm" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }} onClick={onClose} />

            <form
                onSubmit={handleSubmit}
                className="relative w-full max-w-md rounded-2xl overflow-hidden"
                style={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1.5px solid var(--color-border)',
                    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(255, 61, 46, 0.1)',
                    animation: 'slideUp 0.3s ease-out',
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5" style={{ color: 'var(--color-vermilion-500)' }} />
                        <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                            {editCategory ? 'Edit Category' : 'New Category'}
                        </h2>
                    </div>
                    <button type="button" onClick={onClose} className="p-1.5 rounded-lg transition-colors" style={{ color: 'var(--color-text-tertiary)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-5">
                    {/* Name */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-tertiary)' }}>
                            Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Category name..."
                            className="input-field w-full"
                            autoFocus
                            required
                        />
                    </div>

                    {/* Preview */}
                    <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--color-surface-elevated)' }}>
                        {(() => { const Icon = getIcon(icon); return <Icon className="w-5 h-5" style={{ color }} />; })()}
                        <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>{name || 'Preview'}</span>
                    </div>

                    {/* Icon Grid */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-tertiary)' }}>
                            Icon
                        </label>
                        <div className="grid grid-cols-8 gap-1.5">
                            {ICON_OPTIONS.map((iconName) => {
                                const Icon = getIcon(iconName);
                                return (
                                    <button
                                        key={iconName}
                                        type="button"
                                        onClick={() => setIcon(iconName)}
                                        className="p-2 rounded-lg transition-all"
                                        style={{
                                            backgroundColor: icon === iconName ? `${color}20` : 'transparent',
                                            border: `1.5px solid ${icon === iconName ? color : 'transparent'}`,
                                            color: icon === iconName ? color : 'var(--color-text-tertiary)',
                                        }}
                                        title={iconName}
                                    >
                                        <Icon className="w-4 h-4" />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Color Palette */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-tertiary)' }}>
                            Color
                        </label>
                        <div className="flex gap-2">
                            {COLOR_OPTIONS.map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setColor(c)}
                                    className="w-8 h-8 rounded-full transition-all"
                                    style={{
                                        backgroundColor: c,
                                        boxShadow: color === c ? `0 0 0 2px var(--color-surface), 0 0 0 4px ${c}` : 'none',
                                        transform: color === c ? 'scale(1.1)' : 'scale(1)',
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                    <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
                    <button type="submit" disabled={!name.trim() || isSubmitting} className="btn-vermilion disabled:opacity-50 disabled:cursor-not-allowed">
                        {isSubmitting ? 'Saving...' : editCategory ? 'Save Changes' : 'Create Category'}
                    </button>
                </div>
            </form>
        </div>
    );
}
