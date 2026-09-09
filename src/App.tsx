import { useState, useMemo } from 'react';
import { HeaderStats } from './components/HeaderStats';
import { CategoryFilter } from './components/CategoryFilter';
import { TrayCard } from './components/TrayCard';
import { MealSummaryModal } from './components/MealSummaryModal';
import { SavedSessionsModal } from './components/SavedSessionsModal';
import { TdeeSettingsModal } from './components/TdeeSettingsModal';
import { LegalDisclaimer } from './components/LegalDisclaimer';
import { useTableStore } from './hooks/useTableStore';
import { MK_MENU_ITEMS } from './data/mkMenu';
import { Category } from './types';
import { ShoppingBag, Flame, Sparkles } from 'lucide-react';
import { trackEvent } from './utils/telemetry';

export default function App() {
  const {
    orders,
    totals,
    userSettings,
    updateUserSettings,
    authUser,
    handleLogout,
    AUTH_SERVER_URL,
    addItem,
    removeItem,
    quickAddFive,
    resetTable,
    wakeLockActive,
    toggleWakeLock,
    saveDiningSession,
    savedSessions,
    fetchSavedSessions,
    loadSessionToTable,
    deleteSavedSession,
  } = useTableStore();

  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isTdeeModalOpen, setIsTdeeModalOpen] = useState(false);

  const imageMode = userSettings.imageMode || 'official';

  // Filter items based on selected category & search input
  const filteredItems = useMemo(() => {
    return MK_MENU_ITEMS.filter(item => {
      const matchCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchSearch =
        searchQuery.trim() === '' ||
        item.name_th.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.name_en.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#0f0f11] text-gray-100 flex flex-col pb-24">
      {/* Sticky Header with real-time counters */}
      <HeaderStats
        totals={totals}
        userSettings={userSettings}
        authUser={authUser}
        savedSessionsCount={savedSessions.length}
        onLogout={handleLogout}
        authServerUrl={AUTH_SERVER_URL}
        wakeLockActive={wakeLockActive}
        onToggleWakeLock={toggleWakeLock}
        onResetTable={resetTable}
        onOpenSummary={() => {
          trackEvent('macro_tab_view');
          setIsSummaryOpen(true);
        }}
        onOpenTdeeModal={() => setIsTdeeModalOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      {/* Main Content Body */}
      <main className="max-w-4xl mx-auto w-full px-4 pt-4 flex-1 space-y-4">
        {/* Category Filters & Search */}
        <CategoryFilter
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          orders={orders}
        />

        {/* Results Banner Info */}
        <div className="flex items-center justify-between text-xs text-gray-400 font-medium px-1">
          <span>แสดง {filteredItems.length} รายการอาหาร</span>
          {totals.totalTrays > 0 && (
            <span className="text-amber-400 font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              สั่งแล้ว {totals.totalTrays} ถาด ({totals.calories.toLocaleString()} kcal)
            </span>
          )}
        </div>

        {/* Food Items Tactile Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
          {filteredItems.map(item => (
            <TrayCard
              key={item.id}
              item={item}
              quantity={orders[item.id] || 0}
              imageMode={imageMode}
              onAdd={addItem}
              onRemove={removeItem}
              onAddFive={quickAddFive}
            />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16 bg-mk-card/40 rounded-3xl border border-mk-border/40 space-y-2">
            <div className="text-4xl">🔍</div>
            <h3 className="text-sm font-bold text-gray-300">ไม่พบรายการอาหารที่ค้นหา</h3>
            <p className="text-xs text-gray-500">ลองค้นหาด้วยชื่ออื่น หรือเปลี่ยนหมวดหมู่</p>
          </div>
        )}

        {/* Legal Disclaimer & Image Mode Switcher */}
        <LegalDisclaimer
          imageMode={imageMode}
          onToggleImageMode={mode => updateUserSettings({ imageMode: mode })}
        />
      </main>

      {/* Sticky Bottom Floating Bar for Mobile Quick Summary */}
      {totals.totalTrays > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-30 max-w-lg mx-auto animate-bounce-subtle">
          <button
            onClick={() => {
              trackEvent('macro_tab_view');
              setIsSummaryOpen(true);
            }}
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-mk-red to-red-600 text-white font-extrabold text-sm flex items-center justify-between shadow-2xl border border-white/20 hover:brightness-110 active-press"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-black/20">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-xs font-normal text-red-200">ดูสรุปมื้ออาหาร</div>
                <div className="text-sm font-bold">{totals.totalTrays} ถาดบนโต๊ะ</div>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-black/25 px-3 py-1.5 rounded-xl border border-white/10">
              <Flame className="w-4 h-4 text-amber-300" />
              <span>{totals.calories.toLocaleString()} kcal</span>
            </div>
          </button>
        </div>
      )}

      {/* Meal Summary Modal */}
      <MealSummaryModal
        isOpen={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
        orders={orders}
        totals={totals}
        userSettings={userSettings}
        authUser={authUser}
        onSaveSession={saveDiningSession}
        authServerUrl={AUTH_SERVER_URL}
      />

      {/* TDEE & Target Deficit Settings Modal */}
      <TdeeSettingsModal
        isOpen={isTdeeModalOpen}
        onClose={() => setIsTdeeModalOpen(false)}
        userSettings={userSettings}
        onUpdateSettings={updateUserSettings}
      />

      {/* Saved Meal Sessions History Modal */}
      <SavedSessionsModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        sessions={savedSessions}
        onLoadSession={loadSessionToTable}
        onDeleteSession={deleteSavedSession}
        onRefresh={fetchSavedSessions}
      />
    </div>
  );
}
