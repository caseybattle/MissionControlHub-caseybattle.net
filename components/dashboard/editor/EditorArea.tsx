import { useRef } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus } from 'lucide-react';
import { Document, BlockType } from './types';
import { BlockComponent } from './BlockComponent';
import { PerspectiveGrid } from '../ui/PerspectiveGrid';

interface EditorAreaProps {
    activeDoc: Document | null;
    setActiveDoc: (doc: Document) => void;
    activeBlockId: string | null;
    setActiveBlockId: (id: string | null) => void;
    updateBlock: (blockId: string, content: string) => void;
    changeBlockType: (blockId: string, type: BlockType) => void;
    toggleTodo: (blockId: string) => void;
    deleteBlock: (blockId: string) => void;
    addBlock: (afterId?: string) => void;
}

export function EditorArea({
    activeDoc,
    setActiveDoc,
    activeBlockId,
    setActiveBlockId,
    updateBlock,
    changeBlockType,
    toggleTodo,
    deleteBlock,
    addBlock
}: EditorAreaProps) {
    const editorRef = useRef<HTMLDivElement>(null);

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-[var(--bg-0)] relative">
            {/* Background Effects */}
            <PerspectiveGrid />
            <div
                className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none z-0"
                style={{
                    background: 'radial-gradient(circle, rgba(37, 99, 235, 0.05) 0%, transparent 70%)',
                    filter: 'blur(80px)',
                }}
            />

            <div className="flex-1 overflow-auto p-8 md:p-12 relative z-10 custom-scrollbar">
                {activeDoc ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto"
                    >
                        {/* Document Icon & Title */}
                        <div className="flex items-center gap-4 mb-8 group">
                            <button className="text-5xl hover:bg-[var(--panel)] p-2 rounded-xl transition-colors">
                                {activeDoc.icon}
                            </button>
                            <input
                                type="text"
                                value={activeDoc.title}
                                onChange={(e) => setActiveDoc({ ...activeDoc, title: e.target.value })}
                                placeholder="Untitled"
                                className="flex-1 text-4xl font-bold bg-transparent border-none outline-none text-[var(--text)] placeholder-[var(--muted)]"
                            />
                        </div>

                        {/* Blocks */}
                        <div ref={editorRef} className="space-y-1 pb-32">
                            {activeDoc.blocks.map((block) => (
                                <BlockComponent
                                    key={block.id}
                                    block={block}
                                    isActive={activeBlockId === block.id}
                                    onFocus={() => setActiveBlockId(block.id)}
                                    onUpdate={(content) => updateBlock(block.id, content)}
                                    onTypeChange={(type) => changeBlockType(block.id, type)}
                                    onToggleCheck={() => toggleTodo(block.id)}
                                    onDelete={() => deleteBlock(block.id)}
                                    onAddBelow={() => addBlock(block.id)}
                                />
                            ))}

                            {/* Add Block Button */}
                            <button
                                onClick={() => addBlock()}
                                className="mt-4 w-full py-2 border border-dashed border-[var(--stroke)] rounded opacity-0 group-hover:opacity-100 hover:opacity-100 text-[var(--muted)] hover:border-[var(--blue)] hover:text-[var(--blue)] transition-all flex items-center justify-center gap-2 text-sm"
                            >
                                <Plus className="w-4 h-4" />
                                Click to add a block
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-[var(--muted)]">
                        <FileText className="w-12 h-12 mb-4 opacity-20" />
                        <p>Select a document to start editing</p>
                    </div>
                )}
            </div>
        </div>
    );
}
