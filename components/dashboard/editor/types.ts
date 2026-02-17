import { LucideIcon } from 'lucide-react';

export type BlockType = 'text' | 'h1' | 'h2' | 'h3' | 'bullet' | 'numbered' | 'todo' | 'quote' | 'code' | 'divider';

export interface Block {
    id: string;
    type: BlockType;
    content: string;
    checked?: boolean;
}

export interface Document {
    id: string;
    title: string;
    icon: string;
    starred: boolean;
    updatedAt: string;
    blocks: Block[];
}

export interface SlashCommand {
    type: BlockType;
    label: string;
    icon: LucideIcon;
    description: string;
}
