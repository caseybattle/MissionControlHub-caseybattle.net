import {
    Type, Heading1, Heading2, Heading3, List, ListOrdered, CheckSquare,
    Quote, Code, Minus
} from 'lucide-react';
import { SlashCommand, Document } from './types';

export const SLASH_COMMANDS: SlashCommand[] = [
    { type: 'text', label: 'Text', icon: Type, description: 'Just start writing with plain text' },
    { type: 'h1', label: 'Heading 1', icon: Heading1, description: 'Big section heading' },
    { type: 'h2', label: 'Heading 2', icon: Heading2, description: 'Medium section heading' },
    { type: 'h3', label: 'Heading 3', icon: Heading3, description: 'Small section heading' },
    { type: 'bullet', label: 'Bulleted List', icon: List, description: 'Create a simple bulleted list' },
    { type: 'numbered', label: 'Numbered List', icon: ListOrdered, description: 'Create a numbered list' },
    { type: 'todo', label: 'To-do List', icon: CheckSquare, description: 'Track tasks with a to-do list' },
    { type: 'quote', label: 'Quote', icon: Quote, description: 'Capture a quote' },
    { type: 'code', label: 'Code', icon: Code, description: 'Capture a code snippet' },
    { type: 'divider', label: 'Divider', icon: Minus, description: 'Visually divide blocks' },
];

export const INITIAL_DOCUMENTS: Document[] = [
    {
        id: '1',
        title: 'Mission Briefing',
        icon: '🚀',
        starred: true,
        updatedAt: '2 hours ago',
        blocks: [
            { id: 'b1', type: 'h1', content: 'Mission Briefing' },
            { id: 'b2', type: 'text', content: 'Objectives for the current deployment cycle.' },
            { id: 'b3', type: 'h2', content: 'Primary Goals' },
            { id: 'b4', type: 'todo', content: 'Initialize drone swarm', checked: true },
            { id: 'b5', type: 'todo', content: 'Verify comms uplink', checked: false },
            { id: 'b6', type: 'todo', content: 'Deploy recon units', checked: false },
        ]
    },
    {
        id: '2',
        title: 'System Logs',
        icon: '📝',
        starred: false,
        updatedAt: '1 day ago',
        blocks: [
            { id: 'b1', type: 'h1', content: 'System Logs - Sector 7' },
            { id: 'b2', type: 'code', content: 'WARN: Signal degradation in quadrant 4\nINFO: Re-routing via satellite link...' },
        ]
    },
];
