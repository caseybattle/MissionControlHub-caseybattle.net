import { useState } from 'react';
import { Plus, GripVertical } from 'lucide-react';
import { Block, BlockType } from './types';
import { SlashCommandMenu } from './SlashCommandMenu';

interface BlockComponentProps {
    block: Block;
    isActive: boolean;
    onFocus: () => void;
    onUpdate: (content: string) => void;
    onTypeChange: (type: BlockType) => void;
    onToggleCheck?: () => void;
    onDelete: () => void;
    onAddBelow: () => void;
}

export const BlockComponent = ({
    block,
    isActive,
    onFocus,
    onUpdate,
    onTypeChange,
    onToggleCheck,
    onDelete,
    onAddBelow
}: BlockComponentProps) => {
    const [showMenu, setShowMenu] = useState(false);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onAddBelow();
        } else if (e.key === 'Backspace' && block.content === '') {
            e.preventDefault();
            onDelete();
        } else if (e.key === '/' && block.content === '') {
            setShowMenu(true);
        }
    };

    const renderTextParams = {
        value: block.content,
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onUpdate(e.target.value),
        onFocus,
        onKeyDown: handleKeyDown,
        className: "bg-transparent border-none outline-none placeholder-[var(--muted)] text-[var(--text)]"
    };

    const renderBlock = () => {
        switch (block.type) {
            case 'h1':
                return (
                    <input
                        type="text"
                        {...renderTextParams}
                        placeholder="Heading 1"
                        className={`w-full text-3xl font-bold ${renderTextParams.className}`}
                    />
                );
            case 'h2':
                return (
                    <input
                        type="text"
                        {...renderTextParams}
                        placeholder="Heading 2"
                        className={`w-full text-2xl font-semibold ${renderTextParams.className}`}
                    />
                );
            case 'h3':
                return (
                    <input
                        type="text"
                        {...renderTextParams}
                        placeholder="Heading 3"
                        className={`w-full text-xl font-semibold ${renderTextParams.className}`}
                    />
                );
            case 'bullet':
                return (
                    <div className="flex items-start gap-2">
                        <span className="text-[var(--muted)] mt-1">•</span>
                        <input
                            type="text"
                            {...renderTextParams}
                            placeholder="List item"
                            className={`flex-1 ${renderTextParams.className}`}
                        />
                    </div>
                );
            case 'numbered':
                return (
                    <div className="flex items-start gap-2">
                        <span className="text-[var(--muted)] mt-0.5 min-w-[20px]">1.</span>
                        <input
                            type="text"
                            {...renderTextParams}
                            placeholder="List item"
                            className={`flex-1 ${renderTextParams.className}`}
                        />
                    </div>
                );
            case 'todo':
                return (
                    <div className="flex items-start gap-2">
                        <button
                            onClick={onToggleCheck}
                            className={`w-4 h-4 rounded border mt-1 flex-shrink-0 flex items-center justify-center transition-colors ${block.checked
                                ? 'bg-[var(--blue)] border-[var(--blue)]'
                                : 'border-[var(--muted)] hover:border-[var(--blue)]'
                                }`}
                        >
                            {block.checked && <div className="w-2 h-2 bg-white rounded-sm" />}
                        </button>
                        <input
                            type="text"
                            {...renderTextParams}
                            placeholder="To-do"
                            className={`flex-1 ${renderTextParams.className} ${block.checked ? 'line-through text-[var(--muted)]' : ''}`}
                        />
                    </div>
                );
            case 'quote':
                return (
                    <div className="border-l-2 border-[var(--blue)] pl-4">
                        <input
                            type="text"
                            {...renderTextParams}
                            placeholder="Quote"
                            className={`w-full ${renderTextParams.className} italic text-[var(--text-secondary)]`}
                        />
                    </div>
                );
            case 'code':
                return (
                    <div className="bg-[var(--panel-2)] rounded-lg p-4 font-mono text-sm border border-[var(--stroke)]">
                        <textarea
                            {...renderTextParams}
                            placeholder="Code"
                            className={`w-full ${renderTextParams.className} resize-none`}
                            rows={3}
                        />
                    </div>
                );
            case 'divider':
                return <hr className="border-[var(--stroke)] my-2" />;
            default:
                return (
                    <input
                        type="text"
                        {...renderTextParams}
                        placeholder="Type '/' for commands"
                        className={`w-full ${renderTextParams.className}`}
                    />
                );
        }
    };

    return (
        <div
            className={`group relative py-1 px-3 -mx-2 rounded-lg transition-colors border ${isActive
                ? 'bg-[var(--panel-2)] border-[var(--stroke-2)]'
                : 'bg-transparent border-transparent hover:bg-[var(--panel)]'
                }`}
        >
            {/* Block Handle */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 pr-2">
                <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-1 hover:bg-[var(--panel-2)] rounded text-[var(--muted)] hover:text-[var(--text)]"
                >
                    <Plus className="w-4 h-4" />
                </button>
                <div className="p-1 cursor-grab text-[var(--muted)]">
                    <GripVertical className="w-4 h-4" />
                </div>
            </div>

            {/* Block Content */}
            {renderBlock()}

            {/* Slash Command Menu */}
            {showMenu && (
                <SlashCommandMenu
                    onSelect={(type) => {
                        onTypeChange(type);
                        setShowMenu(false);
                        // Focus back on input after selection? logic handled by parent state update mostly
                    }}
                    onClose={() => setShowMenu(false)}
                />
            )}
        </div>
    );
};
