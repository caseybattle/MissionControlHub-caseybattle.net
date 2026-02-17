import { BlockType } from './types';
import { SLASH_COMMANDS } from './data';

interface SlashCommandMenuProps {
    onSelect: (type: BlockType) => void;
    onClose: () => void;
}

export function SlashCommandMenu({ onSelect, onClose }: SlashCommandMenuProps) {
    return (
        <div className="absolute left-0 top-full mt-1 z-50 w-72 bg-[var(--panel)] border border-[var(--stroke)] rounded-xl shadow-2xl overflow-hidden p-1">
            <div className="p-2 border-b border-[var(--stroke)]">
                <div className="text-[10px] text-[var(--muted)] font-medium uppercase tracking-wider">Basic Blocks</div>
            </div>
            <div className="max-h-64 overflow-y-auto custom-scrollbar">
                {SLASH_COMMANDS.map((cmd) => (
                    <button
                        key={cmd.type}
                        onClick={() => {
                            onSelect(cmd.type);
                            onClose();
                        }}
                        className="w-full flex items-center gap-3 p-2 hover:bg-[var(--panel-2)] rounded-lg transition-colors text-left"
                    >
                        <div className="w-8 h-8 bg-[var(--bg-1)] border border-[var(--stroke)] rounded-md flex items-center justify-center">
                            <cmd.icon className="w-4 h-4 text-[var(--text-secondary)]" />
                        </div>
                        <div>
                            <div className="font-medium text-sm text-[var(--text)]">{cmd.label}</div>
                            <div className="text-[11px] text-[var(--muted)]">{cmd.description}</div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
