'use client';

import { useState, useEffect } from 'react';
import { FirestoreCard, addCard, updateCard, subscribeToCategories, FirestoreCategory, Priority, PRIORITY_CONFIG, ChecklistItem, VideoScene } from '@/lib/firestore';
import { Trash2, X, Plus, Calendar, AlertCircle, CheckCircle, Video, Image as ImageIcon, Link2, Film, MessageSquare, Layout, CheckSquare } from 'lucide-react';
import ProductionTable from './ProductionTable';

interface CardModalProps {
    isOpen: boolean;
    onClose: () => void;
    editCard?: FirestoreCard;
    defaultCategory?: string;
}

type Tab = 'overview' | 'production';

export default function CardModal({ isOpen, onClose, editCard, defaultCategory }: CardModalProps) {
    const [activeTab, setActiveTab] = useState<Tab>('overview');

    // Overview Fields
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState<FirestoreCard['status']>('backlog');
    const [priority, setPriority] = useState<Priority>('medium');
    const [dueDate, setDueDate] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
    const [checklistInput, setChecklistInput] = useState('');
    const [links, setLinks] = useState<string[]>([]);
    const [linkInput, setLinkInput] = useState('');

    // Production Fields
    const [scenes, setScenes] = useState<VideoScene[]>([]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [availableCategories, setAvailableCategories] = useState<FirestoreCategory[]>([]);

    // Expandable sections state
    const [activeSection, setActiveSection] = useState<'checklist' | 'links' | null>(null);

    useEffect(() => {
        const unsub = subscribeToCategories(setAvailableCategories);
        return unsub;
    }, []);

    useEffect(() => {
        if (isOpen) {
            setTitle(editCard?.title || '');
            setDescription(editCard?.description || '');
            setCategory(editCard?.category || defaultCategory || 'Projects');
            setStatus(editCard?.status || 'backlog');
            setPriority(editCard?.priority || 'medium');

            // Handle Timestamp to Date string conversion
            if (editCard?.dueDate) {
                const d = editCard.dueDate.toDate ? editCard.dueDate.toDate() : new Date(editCard.dueDate as any);
                setDueDate(d.toISOString().split('T')[0]);
            } else {
                setDueDate('');
            }

            setTags(editCard?.tags || []);
            setChecklist(editCard?.checklist || []);
            setLinks(editCard?.links || []);
            setScenes(editCard?.scenes || []);

            setActiveTab(editCard?.scenes?.length ? 'production' : 'overview');
        }
    }, [isOpen, editCard, defaultCategory]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setIsSubmitting(true);
        try {
            const dueDateTimestamp = dueDate ? { seconds: Math.floor(new Date(dueDate + 'T23:59:59').getTime() / 1000), nanoseconds: 0 } : null;

            const cardData = {
                title: title.trim(),
                description: description.trim(),
                category,
                status,
                priority,
                tags,
                checklist,
                links,
                scenes, // Production scenes
                dueDate: dueDateTimestamp as any,
            };

            if (editCard?.id) {
                await updateCard(editCard.id, cardData);
            } else {
                await addCard({
                    ...cardData,
                    order: Date.now(), // Simple ordering
                });
            }
            onClose();
        } catch (err) {
            console.error('Failed to save card:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const addTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(t => t !== tagToRemove));
    };

    const addChecklistItem = () => {
        if (checklistInput.trim()) {
            setChecklist([...checklist, { text: checklistInput.trim(), done: false }]);
            setChecklistInput('');
        }
    };

    const toggleChecklistItem = (index: number) => {
        const newChecklist = [...checklist];
        newChecklist[index].done = !newChecklist[index].done;
        setChecklist(newChecklist);
    };

    const removeChecklistItem = (index: number) => {
        setChecklist(checklist.filter((_, i) => i !== index));
    };

    const addLink = () => {
        if (linkInput.trim()) {
            setLinks([...links, linkInput.trim()]);
            setLinkInput('');
        }
    };

    const removeLink = (index: number) => {
        setLinks(links.filter((_, i) => i !== index));
    };

    const checklistDone = checklist.filter(i => i.done).length;
    const checklistTotal = checklist.length;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 mobile-modal-wrapper" style={{ animation: 'fadeIn 0.2s ease-out' }}>
            {/* Backdrop */}
            <div className="absolute inset-0 backdrop-blur-sm" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }} onClick={onClose} />

            {/* Modal Content */}
            <form
                onSubmit={handleSubmit}
                className="relative w-full max-w-4xl h-[85vh] flex flex-col rounded-2xl overflow-hidden glass-card"
                style={{
                    backgroundColor: 'var(--color-surface)',
                    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(255, 61, 46, 0.1)',
                    animation: 'slideUp 0.3s ease-out'
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b shrink-0" style={{ borderColor: 'var(--color-border)' }}>
                    <div className="flex items-center gap-4">
                        {/* Tabs */}
                        <div className="flex bg-zinc-800/50 p-1 rounded-lg">
                            <button
                                type="button"
                                onClick={() => setActiveTab('overview')}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'overview' ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
                            >
                                <div className="flex items-center gap-2">
                                    <Layout className="w-4 h-4" />
                                    Overview
                                </div>
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('production')}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'production' ? 'bg-vermilion-500/20 text-vermilion-400 border border-vermilion-500/30' : 'text-zinc-400 hover:text-zinc-200'}`}
                            >
                                <div className="flex items-center gap-2">
                                    <Film className="w-4 h-4" />
                                    Production ({scenes.length})
                                </div>
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {isSubmitting && <span className="text-xs text-zinc-500 animate-pulse">Saving...</span>}
                        <button type="button" onClick={onClose} className="p-1.5 rounded-lg transition-colors hover:bg-zinc-800 text-zinc-400">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
                    {activeTab === 'overview' ? (
                        <div className="space-y-6 max-w-2xl mx-auto">
                            {/* Title Input */}
                            <div>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Card Title"
                                    className="w-full bg-transparent text-2xl font-bold placeholder-zinc-600 focus:outline-none"
                                    autoFocus
                                />
                            </div>

                            {/* Priority Grid */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">Priority</label>
                                <div className="flex gap-2">
                                    {(Object.keys(PRIORITY_CONFIG) as Priority[]).map((p) => (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => setPriority(p)}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${priority === p ? 'bg-zinc-800 border-zinc-600 ring-1 ring-zinc-500' : 'bg-transparent border border-zinc-800 hover:bg-zinc-900'}`}
                                            style={{ color: priority === p ? PRIORITY_CONFIG[p].color : 'var(--color-text-secondary)' }}
                                        >
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PRIORITY_CONFIG[p].dot }} />
                                            {PRIORITY_CONFIG[p].label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Main Info Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Category</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="input-field w-full"
                                    >
                                        {availableCategories.map((cat) => (
                                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Status</label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value as any)}
                                        className="input-field w-full"
                                    >
                                        <option value="backlog">Backlog</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="review">Review</option>
                                        <option value="complete">Complete</option>
                                    </select>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Add details..."
                                    rows={4}
                                    className="input-field w-full resize-none"
                                />
                            </div>

                            {/* Due Date */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Due Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                    <input
                                        type="date"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        className="input-field w-full pl-10"
                                        style={{ colorScheme: 'dark' }}
                                    />
                                </div>
                            </div>

                            {/* Checklist & Links Toggles */}
                            <div className="flex gap-4 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setActiveSection(activeSection === 'checklist' ? null : 'checklist')}
                                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${activeSection === 'checklist' ? 'text-vermilion-500' : 'text-zinc-400 hover:text-white'}`}
                                >
                                    <CheckSquare className="w-4 h-4" />
                                    Checklist {checklistTotal > 0 && `(${checklistDone}/${checklistTotal})`}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveSection(activeSection === 'links' ? null : 'links')}
                                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${activeSection === 'links' ? 'text-vermilion-500' : 'text-zinc-400 hover:text-white'}`}
                                >
                                    <Link2 className="w-4 h-4" />
                                    Links {links.length > 0 && `(${links.length})`}
                                </button>
                            </div>

                            {/* Checklist Section */}
                            {activeSection === 'checklist' && (
                                <div className="bg-zinc-900/30 p-4 rounded-xl border border-zinc-800 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="flex gap-2 mb-3">
                                        <input
                                            type="text"
                                            value={checklistInput}
                                            onChange={(e) => setChecklistInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addChecklistItem())}
                                            placeholder="Add subtask..."
                                            className="input-field flex-1 text-sm bg-zinc-900"
                                        />
                                        <button type="button" onClick={addChecklistItem} className="btn-secondary px-3">
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {checklist.map((item, i) => (
                                            <div key={i} className="flex items-center gap-3 group">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleChecklistItem(i)}
                                                    className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${item.done ? 'bg-vermilion-500 border-vermilion-500' : 'border-zinc-700 hover:border-zinc-500'}`}
                                                >
                                                    {item.done && <CheckSquare className="w-3.5 h-3.5 text-white" />}
                                                </button>
                                                <span className={`flex-1 text-sm ${item.done ? 'text-zinc-500 line-through' : 'text-zinc-300'}`}>
                                                    {item.text}
                                                </span>
                                                <button type="button" onClick={() => removeChecklistItem(i)} className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    {checklistTotal > 0 && (
                                        <div className="mt-3 h-1 bg-zinc-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-vermilion-500 transition-all duration-500"
                                                style={{ width: `${(checklistDone / checklistTotal) * 100}%` }}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Links Section */}
                            {activeSection === 'links' && (
                                <div className="bg-zinc-900/30 p-4 rounded-xl border border-zinc-800 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="flex gap-2 mb-3">
                                        <input
                                            type="url"
                                            value={linkInput}
                                            onChange={(e) => setLinkInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLink())}
                                            placeholder="Paste URL..."
                                            className="input-field flex-1 text-sm bg-zinc-900"
                                        />
                                        <button type="button" onClick={addLink} className="btn-secondary px-3">
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {links.map((link, i) => (
                                            <div key={i} className="flex items-center gap-3 group bg-zinc-900 p-2 rounded-lg border border-zinc-800">
                                                <div className="p-1.5 bg-zinc-800 rounded">
                                                    <Link2 className="w-3.5 h-3.5 text-zinc-400" />
                                                </div>
                                                <a href={link} target="_blank" rel="noopener noreferrer" className="flex-1 text-sm text-blue-400 hover:underline truncate">
                                                    {link}
                                                </a>
                                                <button type="button" onClick={() => removeLink(i)} className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    ) : (
                        <div className="h-full overflow-hidden">
                            <ProductionTable scenes={scenes} onChange={setScenes} />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t shrink-0" style={{ borderColor: 'var(--color-border)' }}>
                    {activeTab === 'overview' && scenes.length > 0 && (
                        <button
                            type="button"
                            onClick={() => setActiveTab('production')}
                            className="mr-auto px-4 py-2 rounded-lg text-sm font-bold bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700 flex items-center gap-2"
                            style={{ color: 'var(--color-vermilion-400)', borderColor: 'var(--color-vermilion-500)' }}
                        >
                            <Film className="w-4 h-4" />
                            Go to Production Studio ({scenes.length})
                        </button>
                    )}
                    <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="btn-vermilion disabled:opacity-50 min-w-[100px]">
                        {isSubmitting ? 'Saving...' : editCard ? 'Save Changes' : 'Create Card'}
                    </button>
                </div>
            </form>
        </div>
    );
}
