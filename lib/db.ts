import Dexie, { Table } from 'dexie';

export interface Card {
    id?: number;
    title: string;
    description: string;
    category: string;
    status: 'backlog' | 'in-progress' | 'review' | 'complete';
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
    completedAt?: Date;
    order: number;
}

export interface Category {
    id?: number;
    name: string;
    color: string;
    icon: string;
    order: number;
}

export class MissionControlDB extends Dexie {
    cards!: Table<Card>;
    categories!: Table<Category>;

    constructor() {
        super('MissionControlDB');
        this.version(1).stores({
            cards: '++id, category, status, createdAt, updatedAt',
            categories: '++id, name, order'
        });
    }
}

export const db = new MissionControlDB();

// Initialize default categories
export async function initializeDefaultCategories() {
    const count = await db.categories.count();
    if (count === 0) {
        await db.categories.bulkAdd([
            { name: 'YouTube Projects', color: '#ff3d2e', icon: 'Video', order: 0 },
            { name: 'Ideas', color: '#ffa198', icon: 'Lightbulb', order: 1 },
            { name: 'Websites', color: '#ff6b5e', icon: 'Globe', order: 2 },
            { name: 'Builds', color: '#ed1c0c', icon: 'Hammer', order: 3 },
            { name: 'Memories', color: '#c81409', icon: 'Heart', order: 4 },
            { name: 'Tasks', color: '#a5140d', icon: 'CheckSquare', order: 5 },
        ]);
    }
}
