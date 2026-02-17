"use client";

import { useState, useCallback } from 'react';
import { Document, Block, BlockType } from './editor/types';
import { INITIAL_DOCUMENTS } from './editor/data';
import { EditorSidebar } from './editor/EditorSidebar';
import { EditorArea } from './editor/EditorArea';

export function Editor() {
    const [documents] = useState<Document[]>(INITIAL_DOCUMENTS);
    const [activeDoc, setActiveDoc] = useState<Document | null>(documents[0]);
    const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const updateBlock = useCallback((blockId: string, content: string) => {
        if (!activeDoc) return;
        setActiveDoc({
            ...activeDoc,
            blocks: activeDoc.blocks.map(b =>
                b.id === blockId ? { ...b, content } : b
            )
        });
    }, [activeDoc]);

    const changeBlockType = useCallback((blockId: string, type: BlockType) => {
        if (!activeDoc) return;
        setActiveDoc({
            ...activeDoc,
            blocks: activeDoc.blocks.map(b =>
                b.id === blockId ? { ...b, type } : b
            )
        });
    }, [activeDoc]);

    const toggleTodo = useCallback((blockId: string) => {
        if (!activeDoc) return;
        setActiveDoc({
            ...activeDoc,
            blocks: activeDoc.blocks.map(b =>
                b.id === blockId ? { ...b, checked: !b.checked } : b
            )
        });
    }, [activeDoc]);

    const addBlock = useCallback((afterId?: string) => {
        if (!activeDoc) return;
        const newBlock: Block = {
            id: `block-${Date.now()}`,
            type: 'text', // Explicitly typed as BlockType
            content: '',
        };

        if (afterId) {
            const index = activeDoc.blocks.findIndex(b => b.id === afterId);
            const newBlocks = [...activeDoc.blocks];
            newBlocks.splice(index + 1, 0, newBlock);
            setActiveDoc({ ...activeDoc, blocks: newBlocks });
        } else {
            setActiveDoc({ ...activeDoc, blocks: [...activeDoc.blocks, newBlock] });
        }
        setActiveBlockId(newBlock.id);
    }, [activeDoc]);

    const deleteBlock = useCallback((blockId: string) => {
        if (!activeDoc) return;
        if (activeDoc.blocks.length <= 1) return;
        setActiveDoc({
            ...activeDoc,
            blocks: activeDoc.blocks.filter(b => b.id !== blockId)
        });
    }, [activeDoc]);

    const handleNewPage = useCallback(() => {
        // Mock new page logic for now
        alert("New Page creation not implemented in mock mode.");
    }, []);

    return (
        <div className="flex flex-col h-full bg-[var(--bg-0)] relative overflow-hidden">

            <div className="flex h-full">
                <EditorSidebar
                    documents={documents}
                    activeDoc={activeDoc}
                    setActiveDoc={setActiveDoc}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onNewPage={handleNewPage}
                />

                <EditorArea
                    activeDoc={activeDoc}
                    setActiveDoc={setActiveDoc}
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
