import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
    selectedCategory: string | null;
    setSelectedCategory: (category: string | null) => void;

    searchQuery: string;
    setSearchQuery: (query: string) => void;

    viewMode: 'dashboard' | 'kanban' | 'timeline' | 'portfolio' | 'inbox' | 'calendar';
    setViewMode: (mode: 'dashboard' | 'kanban' | 'timeline' | 'portfolio' | 'inbox' | 'calendar') => void;

    selectedTags: string[];
    toggleTag: (tag: string) => void;
    clearTags: () => void;

    sidebarCollapsed: boolean;
    setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            selectedCategory: null,
            setSelectedCategory: (category) => set({ selectedCategory: category }),

            searchQuery: '',
            setSearchQuery: (query) => set({ searchQuery: query }),

            viewMode: 'dashboard',
            setViewMode: (mode) => set({ viewMode: mode }),

            selectedTags: [],
            toggleTag: (tag) =>
                set((state) => ({
                    selectedTags: state.selectedTags.includes(tag)
                        ? state.selectedTags.filter((t) => t !== tag)
                        : [...state.selectedTags, tag],
                })),
            clearTags: () => set({ selectedTags: [] }),

            sidebarCollapsed: false,
            setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
        }),
        {
            name: 'mission-control-storage',
        }
    )
);
