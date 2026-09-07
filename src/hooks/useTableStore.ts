import { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { TableOrders, MacroTotals, UserSettings } from '../types';
import { MK_MENU_ITEMS } from '../data/mkMenu';

const LOCAL_STORAGE_KEY = 'mk_buffet_299_table_orders_v1';
const SETTINGS_STORAGE_KEY = 'mk_buffet_299_user_settings_v1';

const DEFAULT_SETTINGS: UserSettings = {
  tdee: 2000,
  targetDeficit: 500,
  mealBudget: 1000,
  imageMode: 'official',
};

export function useTableStore() {
  const [orders, setOrders] = useState<TableOrders>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [userSettings, setUserSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [wakeLockActive, setWakeLockActive] = useState(false);
  const [wakeLockSentinel, setWakeLockSentinel] = useState<WakeLockSentinel | null>(null);

  // Sync orders to local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders to localStorage', e);
    }
  }, [orders]);

  // Sync userSettings to local storage
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(userSettings));
    } catch (e) {
      console.error('Failed to save settings to localStorage', e);
    }
  }, [userSettings]);

  const updateUserSettings = useCallback((newSettings: Partial<UserSettings>) => {
    setUserSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  // Screen wake lock handler
  const toggleWakeLock = useCallback(async () => {
    if (!('wakeLock' in navigator)) {
      alert('Screen Wake Lock API ไม่รองรับในเบราว์เซอร์นี้');
      return;
    }
    if (wakeLockActive && wakeLockSentinel) {
      await wakeLockSentinel.release();
      setWakeLockSentinel(null);
      setWakeLockActive(false);
    } else {
      try {
        const sentinel = await navigator.wakeLock.request('screen');
        setWakeLockSentinel(sentinel);
        setWakeLockActive(true);
        sentinel.addEventListener('release', () => {
          setWakeLockActive(false);
          setWakeLockSentinel(null);
        });
      } catch (err) {
        console.error('Wake lock request failed', err);
      }
    }
  }, [wakeLockActive, wakeLockSentinel]);

  // Order Operations
  const addItem = useCallback((itemId: string) => {
    setOrders(prev => {
      const current = prev[itemId] || 0;
      return { ...prev, [itemId]: current + 1 };
    });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setOrders(prev => {
      const current = prev[itemId] || 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[itemId];
        return next;
      }
      return { ...prev, [itemId]: current - 1 };
    });
  }, []);

  const quickAddFive = useCallback((itemId: string) => {
    setOrders(prev => {
      const current = prev[itemId] || 0;
      return { ...prev, [itemId]: current + 5 };
    });
  }, []);

  const setQuantity = useCallback((itemId: string, qty: number) => {
    setOrders(prev => {
      if (qty <= 0) {
        const next = { ...prev };
        delete next[itemId];
        return next;
      }
      return { ...prev, [itemId]: qty };
    });
  }, []);

  const resetTable = useCallback(() => {
    setOrders({});
  }, []);

  // Compute live macro metrics
  const totals: MacroTotals = useMemo(() => {
    let calories = 0;
    let protein = 0;
    let fat = 0;
    let carbs = 0;
    let totalTrays = 0;

    Object.entries(orders).forEach(([itemId, qty]) => {
      if (qty <= 0) return;
      const item = MK_MENU_ITEMS.find(m => m.id === itemId);
      if (item) {
        calories += item.cal_per_tray * qty;
        protein += item.protein_g * qty;
        fat += item.fat_g * qty;
        carbs += item.carb_g * qty;
        totalTrays += qty;
      }
    });

    return { calories, protein, fat, carbs, totalTrays };
  }, [orders]);

  // Confetti trigger when protein hits milestones (e.g. 100g)
  const triggerConfetti = useCallback(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  return {
    orders,
    totals,
    userSettings,
    updateUserSettings,
    addItem,
    removeItem,
    quickAddFive,
    setQuantity,
    resetTable,
    wakeLockActive,
    toggleWakeLock,
    triggerConfetti
  };
}
