"use client";

import { useState, useCallback, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Document, Block, BlockType } from './editor/types';
import { INITIAL_DOCUMENTS } from './editor/data';
import { EditorSidebar } from './editor/EditorSidebar';
import { EditorArea } from './editor/EditorArea';
import { CheckCircle2, RotateCw } from 'lucide-react';

const STORAGE_KEY = 'mission-control-editor-data';

export function Editor() {
    // State
    const [documents, setDocuments] = useState<Document[]>(INITIAL_DOCUMENTS);
    const [activeDocId, setActiveDocId] = useState<string | null>(null);

    // Initialize activeDocId once documents are loaded (or if using default)
    useEffect(() => {
        if (!activeDocId && documents.length > 0) {
            setActiveDocId(documents[0].id);
        }
    }, [documents, activeDocId]);

    const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { setEditorStatus } = useAppStore();
    const [lastSaved, setLastSaved] = useState<Date | null>(null); // Keep local for initial load/logic if needed, but we rely on store for UI
    const [isSaving, setIsSaving] = useState(false);

    // Derived active document
    const activeDoc = documents.find(d => d.id === activeDocId) || null;

    // Load from LocalStorage on mount
    useEffect(() => {
        try {
            const savedData = localStorage.getItem(STORAGE_KEY);
            if (savedData) {
                const parsed = JSON.parse(savedData);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setDocuments(parsed);
                    // If we have saved documents, default to the first one if none selected
                    if (!activeDocId) setActiveDocId(parsed[0].id);
                }
            }
        } catch (error) {
            console.error('Failed to load editor data:', error);
        }
    }, []);

    // Save to LocalStorage whenever documents change
    useEffect(() => {
        if (documents === INITIAL_DOCUMENTS) return; // Don't save initial state immediately if unaltered

        setIsSaving(true);
        setEditorStatus({ isSaving: true });
        const timer = setTimeout(() => {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
                const now = new Date();
                setLastSaved(now);
                setIsSaving(false);
                setEditorStatus({ isSaving: false, lastSaved: now.getTime() });
            } catch (error) {
                console.error('Failed to save editor data:', error);
                setIsSaving(false);
                setEditorStatus({ isSaving: false });
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [documents]);

    // Unified handler for setting/updating active doc
    // This handles BOTH switching documents (Sidebar) and updating titles (EditorArea input)
    const handleSetActiveDoc = useCallback((doc: Document) => {
        if (doc.id !== activeDocId) {
            // Switching documents
            setActiveDocId(doc.id);
        } else {
            // Updating current document (e.g. title)
            setDocuments(prev => prev.map(d => d.id === doc.id ? doc : d));
        }
    }, [activeDocId]);

    // Update block content
    const updateBlock = useCallback((blockId: string, content: string) => {
        if (!activeDocId) return;
        setDocuments(prev => prev.map(doc => {
            if (doc.id !== activeDocId) return doc;
            return {
                ...doc,
                blocks: doc.blocks.map(b => b.id === blockId ? { ...b, content } : b)
            };
        }));
    }, [activeDocId]);

    // Change block type
    const changeBlockType = useCallback((blockId: string, type: BlockType) => {
        if (!activeDocId) return;
        setDocuments(prev => prev.map(doc => {
            if (doc.id !== activeDocId) return doc;
            return {
                ...doc,
                blocks: doc.blocks.map(b => b.id === blockId ? { ...b, type } : b)
            };
        }));
    }, [activeDocId]);

    // Toggle todo check
    const toggleTodo = useCallback((blockId: string) => {
        if (!activeDocId) return;
        setDocuments(prev => prev.map(doc => {
            if (doc.id !== activeDocId) return doc;
            return {
                ...doc,
                blocks: doc.blocks.map(b => b.id === blockId ? { ...b, checked: !b.checked } : b)
            };
        }));
    }, [activeDocId]);

    // Add new block
    const addBlock = useCallback((afterId?: string) => {
        if (!activeDocId) return;

        const newBlock: Block = {
            id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: 'text',
            content: '',
        };

        setDocuments(prev => prev.map(doc => {
            if (doc.id !== activeDocId) return doc;

            let newBlocks = [...doc.blocks];
            if (afterId) {
                const index = doc.blocks.findIndex(b => b.id === afterId);
                if (index !== -1) {
                    newBlocks.splice(index + 1, 0, newBlock);
                } else {
                    newBlocks.push(newBlock);
                }
            } else {
                newBlocks.push(newBlock);
            }
            return { ...doc, blocks: newBlocks };
        }));

        setActiveBlockId(newBlock.id);
    }, [activeDocId]);

    // Delete block
    const deleteBlock = useCallback((blockId: string) => {
        if (!activeDocId) return;
        setDocuments(prev => prev.map(doc => {
            if (doc.id !== activeDocId) return doc;
            if (doc.blocks.length <= 1) return doc; // Don't delete last block
            return {
                ...doc,
                blocks: doc.blocks.filter(b => b.id !== blockId)
            };
        }));
    }, [activeDocId]);

    const handleNewPage = useCallback(() => {
        const newDoc: Document = {
            id: `doc-${Date.now()}`,
            title: 'Untitled Page',
            icon: '📄',
            starred: false,
            updatedAt: new Date().toISOString(),
            blocks: [{
                id: `block-${Date.now()}`,
                type: 'text',
                content: ''
            }]
        };
        setDocuments(prev => [...prev, newDoc]);
        setActiveDocId(newDoc.id);
    }, []);

    // Helper to delete pages passed to Sidebar if needed (not in original mock but good to have)
    // const handleDeletePage = ...

    return (
        <div className="flex flex-col h-full bg-[var(--bg-0)] relative overflow-hidden">

            {/* Auto-Save Indicator Overlay */}
            {/* Auto-Save Indicator Overlay - REMOVED (Moved to Header) */}
            {/* <div className="absolute top-4 right-6 z-50 ..."> ... </div> */}

            <div className="flex h-full">
                <EditorSidebar
                    documents={documents}
                    activeDoc={activeDoc}
                    setActiveDoc={handleSetActiveDoc}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onNewPage={handleNewPage}
                />

                <EditorArea
                    activeDoc={activeDoc}
                    setActiveDoc={handleSetActiveDoc}
                    activeBlockId={activeBlockId}
                    setActiveBlockId={setActiveBlockId}
                    updateBlock={updateBlock}
                    changeBlockType={changeBlockType}
                    toggleTodo={toggleTodo}
                    deleteBlock={deleteBlock}
                    addBlock={addBlock}
                />
            </div>
        </div>
    );
}
