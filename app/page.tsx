'use client';

import { useEffect, useState, useRef } from 'react';
import {
  FirestoreCard,
  FirestoreCategory,
  subscribeToCards,
  subscribeToCategories,
  initializeDefaultCategoriesFirestore,
} from '@/lib/firestore';
import { useAppStore } from '@/lib/store';
import KanbanBoard from '@/components/dashboard/kanban/KanbanBoard';
import CalendarView from '@/components/dashboard/calendar/CalendarView';
import TimelineView from '@/components/dashboard/timeline/TimelineView';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import StatsBar from '@/components/StatsBar';
import EmptyState from '@/components/EmptyState';
import CardModal from '@/components/CardModal';
import CategoryModal from '@/components/CategoryModal';
import PortfolioView from '@/components/PortfolioView';
import DashboardView from '@/components/DashboardView';
import Inbox from '@/components/Inbox';
import { Editor } from '@/components/dashboard/Editor';
import { Studio } from '@/components/dashboard/Studio';

export default function Home() {
  const [cards, setCards] = useState<FirestoreCard[]>([]);
  const [categories, setCategories] = useState<FirestoreCategory[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCard, setEditingCard] = useState<FirestoreCard | null>(null);
  const [editingCategory, setEditingCategory] = useState<FirestoreCategory | null>(null);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);
  const { selectedCategory, viewMode, searchQuery, sidebarCollapsed, setSidebarCollapsed } = useAppStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const mainScrollRef = useRef<HTMLElement>(null);
  const parentScrollRef = useRef<HTMLDivElement>(null);

  // Reset scroll on view change
  useEffect(() => {
    // Immediate reset
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    if (mainScrollRef.current) mainScrollRef.current.scrollTop = 0;
    if (parentScrollRef.current) parentScrollRef.current.scrollTop = 0;

    // Delayed reset to handle render/mount race conditions (especially with Inbox)
    const timer = setTimeout(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
      if (mainScrollRef.current) mainScrollRef.current.scrollTop = 0;
      if (parentScrollRef.current) parentScrollRef.current.scrollTop = 0;
      window.scrollTo(0, 0);
    }, 50);

    return () => clearTimeout(timer);
  }, [viewMode, selectedCategory]);

  useEffect(() => {
    let unsubCards: (() => void) | null = null;
    let unsubCats: (() => void) | null = null;

    const timeout = setTimeout(() => {
      if (!isInitialized) {
        console.warn('Firebase connection timed out, showing app anyway');
        setIsInitialized(true);
      }
    }, 5000);

    async function init() {
      try {
        await initializeDefaultCategoriesFirestore();
      } catch (err: any) {
        console.error('Failed to initialize categories:', err);
        setFirebaseError(err?.message || 'Failed to connect to Firestore');
      }
      setIsInitialized(true);

      try {
        unsubCards = subscribeToCards((fireCards) => setCards(fireCards));
      } catch (err: any) {
        console.error('Failed to subscribe to cards:', err);
      }

      try {
        unsubCats = subscribeToCategories((fireCats) => setCategories(fireCats));
      } catch (err: any) {
        console.error('Failed to subscribe to categories:', err);
      }
    }

    init();

    return () => {
      clearTimeout(timeout);
      unsubCards?.();
      unsubCats?.();
    };
  }, []);

  // Filter cards
  const filteredCards = cards.filter((card) => {
    if (selectedCategory && card.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        card.title.toLowerCase().includes(q) ||
        card.description.toLowerCase().includes(q) ||
        card.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Loading state
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: 'var(--color-background)' }} suppressHydrationWarning>
        <div className="text-center">
          <div
            className="text-3xl font-bold mb-3 bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(135deg, var(--color-vermilion-400), var(--color-vermilion-600))',
              animation: 'pulseSubtle 2s ease-in-out infinite',
            }}
          >
            Mission Control
          </div>
          <div className="flex items-center justify-center gap-2" style={{ color: 'var(--color-text-tertiary)' }}>
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: 'var(--color-vermilion-500)', animation: 'pulseSubtle 1s ease-in-out infinite' }}
            />
            Connecting to cloud...
          </div>
        </div>
      </div>
    );
  }

  const handleNewCard = () => {
    setEditingCard(null);
    setShowCardModal(true);
  };

  const handleEditCard = (card: FirestoreCard) => {
    setEditingCard(card);
    setShowCardModal(true);
  };

  const handleCloseCardModal = () => {
    setShowCardModal(false);
    setEditingCard(null);
  };

  const handleNewCategory = () => {
    setEditingCategory(null);
    setShowCategoryModal(true);
  };

  const handleEditCategory = (cat: FirestoreCategory) => {
    setEditingCategory(cat);
    setShowCategoryModal(true);
  };

  const handleCloseCategoryModal = () => {
    setShowCategoryModal(false);
    setEditingCategory(null);
  };

  const sidebarCategories = categories.map((c) => ({
    id: c.id as any,
    name: c.name,
    icon: c.icon,
    color: c.color,
    order: c.order,
  }));

  const hasCards = filteredCards.length > 0;

  // Check if current selected category is "Production" or "Production Studio"
  const isProductionView = selectedCategory === 'Production' || selectedCategory === 'Production Studio';

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Mobile overlay */}
      {!sidebarCollapsed && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:relative z-40 h-full
        transition-transform duration-300
        ${sidebarCollapsed ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}
      `}>
        <Sidebar
          categories={sidebarCategories}
          onNewCategory={handleNewCategory}
          onEditCategory={handleEditCategory}
        />
      </div>

      <div
        ref={parentScrollRef}
        className="flex-1 flex flex-col overflow-hidden relative"
      >
        {/* Animated dot-grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 61, 46, 0.05) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Vermilion ambient glow */}
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(255, 61, 46, 0.05) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(255, 61, 46, 0.03) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        {viewMode !== 'dashboard' && <Header onNewCard={handleNewCard} />}

        <main
          ref={mainScrollRef}
          className="flex-1 overflow-hidden relative z-10 flex flex-col"
        >
          {/* Firebase error banner */}
          {firebaseError && (
            <div className="shrink-0 mb-4 px-4 py-3 rounded-lg text-sm mx-4 mt-4" style={{
              backgroundColor: 'rgba(255, 61, 46, 0.1)',
              border: '1px solid rgba(255, 61, 46, 0.3)',
              color: 'var(--color-vermilion-300)',
            }}>
              Cloud sync issue: {firebaseError}. Your data may not persist.
            </div>
          )}

          {/* If Production category is selected, show Airtable view */}
          {isProductionView ? (
            <Studio />
          ) : (
            <>
              {viewMode === 'dashboard' ? (
                <DashboardView onNewCard={handleNewCard} onEditCard={handleEditCard} />
              ) : (
                <div
                  className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6"
                  ref={scrollRef}
                >
                  {viewMode === 'inbox' && <Inbox />}
                  {viewMode === 'editor' && <Editor />}
                  {viewMode === 'studio' && <Studio />}
                  {viewMode === 'kanban' && (
                    <div className="h-full flex flex-col">
                      <StatsBar />
                      {hasCards ? (
                        <div className="flex-1 min-h-0">
                          <KanbanBoard cards={filteredCards as any} onEditCard={handleEditCard as any} onNewCard={handleNewCard} />
                        </div>
                      ) : (
                        <EmptyState onCreateCard={handleNewCard} />
                      )}
                    </div>
                  )}
                  {viewMode === 'timeline' && <TimelineView />}
                  {viewMode === 'portfolio' && <PortfolioView />}
                  {viewMode === 'calendar' && <CalendarView />}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Card Modal */}
      <CardModal
        isOpen={showCardModal}
        onClose={handleCloseCardModal}
        editCard={editingCard as any}
        defaultCategory={selectedCategory || undefined}
      />

      {/* Category Modal */}
      <CategoryModal
        isOpen={showCategoryModal}
        onClose={handleCloseCategoryModal}
        editCategory={editingCategory}
        existingCount={categories.length}
      />
    </div>
  );
}
