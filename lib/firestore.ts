import {
    collection,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    Timestamp,
    serverTimestamp,
    setDoc,
    getDocs,
    getDoc,
    writeBatch
} from 'firebase/firestore';
import { firestore } from './firebase';
export const db = firestore;

// --- Types ---

export type Priority = 'urgent' | 'high' | 'medium' | 'low';

export const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; dot: string }> = {
    urgent: { label: 'Urgent', color: '#ef4444', dot: '#ef4444' }, // Red
    high: { label: 'High', color: '#f97316', dot: '#f97316' },     // Orange
    medium: { label: 'Medium', color: '#eab308', dot: '#eab308' },  // Yellow
    low: { label: 'Low', color: '#6b7280', dot: '#6b7280' },        // Gray
};

export interface ChecklistItem {
    text: string;
    done: boolean;
}

export interface VideoScene {
    id: string;
    script: string;
    visualPrompt: string;
    image: string; // URL
    video: string; // URL
    status: 'draft' | 'ready-review' | 'approved' | 'revision';
}

export interface FirestoreCard {
    id?: string;
    title: string;
    description: string;
    category: string;
    status: 'backlog' | 'in-progress' | 'review' | 'complete';
    priority: Priority;
    tags: string[];
    order: number;
    dueDate: Timestamp | null;
    checklist: ChecklistItem[];
    links: string[];
    scenes?: VideoScene[];
    createdAt: Timestamp | null;
    updatedAt: Timestamp | null;
    completedAt?: Timestamp | null;
}

export interface FirestoreCategory {
    id?: string;
    name: string;
    icon: string;
    color: string;
    order: number;
}

// --- Collections ---

const CARDS_COLLECTION = 'cards';
const CATEGORIES_COLLECTION = 'categories';

// --- Subscriptions ---

export function subscribeToCards(callback: (cards: FirestoreCard[]) => void) {
    const q = query(collection(db, CARDS_COLLECTION), orderBy('order', 'asc'));

    return onSnapshot(q, (snapshot) => {
        const cards = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as FirestoreCard[];
        callback(cards);
    });
}

export function subscribeToCategories(callback: (categories: FirestoreCategory[]) => void) {
    const q = query(collection(db, CATEGORIES_COLLECTION), orderBy('order', 'asc'));

    return onSnapshot(q, (snapshot) => {
        const categories = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as FirestoreCategory[];
        callback(categories);
    });
}

// --- Card Actions ---

export async function addCard(card: Omit<FirestoreCard, 'id' | 'createdAt' | 'updatedAt'>) {
    return addDoc(collection(db, CARDS_COLLECTION), {
        ...card,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
}

export async function updateCard(id: string, updates: Partial<FirestoreCard>) {
    const apiUpdates: any = { ...updates, updatedAt: serverTimestamp() };
    if (updates.status === 'complete') {
        apiUpdates.completedAt = serverTimestamp();
    } else if (updates.status) {
        apiUpdates.completedAt = null;
    }
    return updateDoc(doc(db, CARDS_COLLECTION, id), apiUpdates);
}

export async function deleteCard(id: string) {
    return deleteDoc(doc(db, CARDS_COLLECTION, id));
}

export async function updateCardOrder(cards: FirestoreCard[]) {
    const batch = writeBatch(db);
    cards.forEach((card, index) => {
        if (!card.id) return;
        const ref = doc(db, CARDS_COLLECTION, card.id);
        batch.update(ref, { order: index });
    });
    return batch.commit();
}

// --- Category Actions ---

export async function addCategory(category: Omit<FirestoreCategory, 'id'>) {
    return addDoc(collection(db, CATEGORIES_COLLECTION), category);
}

export async function updateCategory(id: string, updates: Partial<FirestoreCategory>) {
    return updateDoc(doc(db, CATEGORIES_COLLECTION, id), updates);
}

export async function deleteCategory(id: string) {
    return deleteDoc(doc(db, CATEGORIES_COLLECTION, id));
}

export async function initializeDefaultCategoriesFirestore() {
    const snapshot = await getDocs(collection(db, CATEGORIES_COLLECTION));
    if (!snapshot.empty) return;

    const defaults = [
        { name: 'Projects', icon: 'Rocket', color: '#ff3d2e', order: 0 },
        { name: 'Ideas', icon: 'Lightbulb', color: '#eab308', order: 1 },
        { name: 'YouTube', icon: 'Video', color: '#f97316', order: 2 },
        { name: 'Resources', icon: 'BookOpen', color: '#3b82f6', order: 3 },
    ];

    const batch = writeBatch(db);
    defaults.forEach((cat) => {
        const ref = doc(collection(db, CATEGORIES_COLLECTION));
        batch.set(ref, cat);
    });
    await batch.commit();
}

// --- Helpers ---

export function getDueDateInfo(dueDate: Timestamp | null): { text: string; color: string; overdue: boolean } | null {
    if (!dueDate) return null;
    const due = dueDate.toDate ? dueDate.toDate() : new Date(dueDate as any);
    const now = new Date();
    const diffMs = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: `${Math.abs(diffDays)}d overdue`, color: '#ef4444', overdue: true };
    if (diffDays === 0) return { text: 'Due today', color: '#f97316', overdue: false };
    if (diffDays === 1) return { text: 'Due tomorrow', color: '#eab308', overdue: false };
    if (diffDays <= 7) return { text: `${diffDays}d left`, color: '#eab308', overdue: false };
    return { text: `${diffDays}d left`, color: 'var(--color-text-tertiary)', overdue: false };
}
