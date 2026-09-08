import { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { TableOrders, MacroTotals, UserSettings, AuthUser, SavedDiningSession } from '../types';
import { MK_MENU_ITEMS } from '../data/mkMenu';

const LOCAL_STORAGE_KEY = 'mk_buffet_299_table_orders_v1';
const SETTINGS_STORAGE_KEY = 'mk_buffet_299_user_settings_v1';
const AUTH_SERVER_URL = (import.meta as unknown as { env: Record<string, string> }).env?.VITE_AUTH_SERVER_URL || 'http://localhost:4000';

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

  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [sessionSaved, setSessionSaved] = useState(false);
  const [wakeLockActive, setWakeLockActive] = useState(false);
  const [wakeLockSentinel, setWakeLockSentinel] = useState<WakeLockSentinel | null>(null);

  // Check Central Auth Session & URL params on Mount
  useEffect(() => {
    // 1. Check URL query parameters for OAuth redirect payload
    const urlParams = new URLSearchParams(window.location.search);
    const userParam = urlParams.get('user');
    const tokenParam = urlParams.get('token');

    if (userParam) {
      try {
        const decodedUser = JSON.parse(decodeURIComponent(userParam));
        setAuthUser(decodedUser);
        localStorage.setItem('mk_buffet_auth_user', JSON.stringify(decodedUser));
        if (tokenParam) {
          localStorage.setItem('mk_buffet_auth_token', tokenParam);
        }
        // Clean URL query string without reloading page
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      } catch (e) {
        console.error('Failed to parse user from URL', e);
      }
    }

    // 2. Restore saved user & token from local storage
    const savedToken = localStorage.getItem('mk_buffet_auth_token');
    const savedUser = localStorage.getItem('mk_buffet_auth_user');
    if (savedUser) {
      try {
        setAuthUser(JSON.parse(savedUser));
      } catch {}
    }

    // 3. Verify active session with central auth server
    const headers: Record<string, string> = {};
    if (savedToken) {
      headers['Authorization'] = `Bearer ${savedToken}`;
    }

    fetch(`${AUTH_SERVER_URL}/auth/me`, {
      headers,
      credentials: 'include',
    })
      .then(res => {
        if (res.status === 401) {
          // If session expired or unauthorized, clear local auth cache
          if (savedUser || savedToken) {
            localStorage.removeItem('mk_buffet_auth_user');
            localStorage.removeItem('mk_buffet_auth_token');
            setAuthUser(null);
          }
          return null;
        }
        return res.ok ? res.json() : null;
      })
      .then(data => {
        if (data && data.authenticated && data.user) {
          setAuthUser(data.user);
          localStorage.setItem('mk_buffet_auth_user', JSON.stringify(data.user));
        }
      })
      .catch(() => {
        // Guest mode fallback on network failure
      });
  }, []);

  const handleLogout = useCallback(async () => {
    const token = localStorage.getItem('mk_buffet_auth_token');
    try {
      await fetch(`${AUTH_SERVER_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
      });
    } catch (e) {
      console.error('Logout failed', e);
    }
    localStorage.removeItem('mk_buffet_auth_user');
    localStorage.removeItem('mk_buffet_auth_token');
    localStorage.removeItem('mk_buffet_saved_sessions_v1');
    setAuthUser(null);
    setSavedSessions([]);
  }, []);

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

  // Save Dining Session to Server & Local History
  const saveDiningSession = useCallback(async () => {
    if (totals.totalTrays <= 0) return { success: false, message: 'ไม่มีรายการอาหาร' };

    const activeItems = Object.entries(orders)
      .filter(([_, qty]) => qty > 0)
      .map(([itemId, qty]) => {
        const item = MK_MENU_ITEMS.find(m => m.id === itemId);
        return {
          id: itemId,
          name_th: item?.name_th || itemId,
          count: qty,
          calories: (item?.cal_per_tray || 0) * qty,
        };
      });

    const payload = {
      totalTrays: totals.totalTrays,
      totalCalories: totals.calories,
      proteinG: totals.protein,
      carbsG: totals.carbs,
      fatG: totals.fat,
      costThb: 299,
      itemsJson: activeItems,
    };

    let savedOnServer = false;
    let serverSessionId: string | null = null;

    try {
      const token = localStorage.getItem('mk_buffet_auth_token');
      const res = await fetch(`${AUTH_SERVER_URL}/api/shabu/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        savedOnServer = true;
        const resData = await res.json().catch(() => ({}));
        serverSessionId = resData.sessionId || resData.id || resData.session?.id || null;
      }
    } catch (e) {
      console.warn('Server session save fallback to local history', e);
    }

    // Always save to local history in localStorage as backup
    try {
      const historyKey = 'mk_buffet_saved_sessions_v1';
      const existing: SavedDiningSession[] = JSON.parse(localStorage.getItem(historyKey) || '[]');
      const assignedId = serverSessionId || `local_${Date.now()}`;
      
      const filtered = existing.filter(s => s.id !== assignedId);
      filtered.unshift({
        id: assignedId,
        sessionDate: new Date().toISOString(),
        ...payload,
        savedOnServer,
      });
      localStorage.setItem(historyKey, JSON.stringify(filtered));
    } catch (err) {}

    setSessionSaved(true);
    triggerConfetti();
    // Refresh sessions list after saving
    fetchSavedSessions();
    return { success: true, savedOnServer };
  }, [orders, totals, triggerConfetti]);

  // Saved Sessions History Management
  const [savedSessions, setSavedSessions] = useState<SavedDiningSession[]>(() => {
    try {
      const historyKey = 'mk_buffet_saved_sessions_v1';
      return JSON.parse(localStorage.getItem(historyKey) || '[]');
    } catch {
      return [];
    }
  });

  const fetchSavedSessions = useCallback(async () => {
    // 1. Read local history
    let localSessions: SavedDiningSession[] = [];
    try {
      const historyKey = 'mk_buffet_saved_sessions_v1';
      localSessions = JSON.parse(localStorage.getItem(historyKey) || '[]');
    } catch (e) {}

    // 2. Fetch from server if authenticated
    const token = localStorage.getItem('mk_buffet_auth_token');
    try {
      const res = await fetch(`${AUTH_SERVER_URL}/api/shabu/sessions`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        const serverSessions: SavedDiningSession[] = data.sessions || data.data || (Array.isArray(data) ? data : []);
        if (Array.isArray(serverSessions)) {
          const mergedMap = new Map<string, SavedDiningSession>();

          // Add server sessions first (canonical server IDs)
          serverSessions.forEach(s => {
            const sid = s.id || String(s.sessionDate);
            mergedMap.set(sid, { ...s, savedOnServer: true });
          });

          // Add local sessions ONLY if not already present on server (by ID or matching timestamp/totals)
          localSessions.forEach(loc => {
            if (!loc.id) return;
            if (mergedMap.has(loc.id)) return;

            // Deduplicate local sessions that match a server session by close timestamp (within 60s) & macros
            const locTime = new Date(loc.sessionDate).getTime();
            const isDuplicate = Array.from(mergedMap.values()).some(srv => {
              const srvTime = new Date(srv.sessionDate).getTime();
              const timeDiffMs = Math.abs(locTime - srvTime);
              return (
                timeDiffMs < 60000 &&
                loc.totalCalories === srv.totalCalories &&
                loc.totalTrays === srv.totalTrays
              );
            });

            if (!isDuplicate) {
              mergedMap.set(loc.id, loc);
            }
          });

          const merged = Array.from(mergedMap.values()).sort(
            (a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime()
          );

          setSavedSessions(merged);
          try {
            localStorage.setItem('mk_buffet_saved_sessions_v1', JSON.stringify(merged));
          } catch {}
          return;
        }
      }
    } catch (e) {
      // Server fetch error fallback to local history
    }

    // Deduplicate localSessions among themselves if no server response
    const localMap = new Map<string, SavedDiningSession>();
    localSessions.forEach(s => {
      if (s.id && !localMap.has(s.id)) {
        localMap.set(s.id, s);
      }
    });
    const cleanLocal = Array.from(localMap.values()).sort(
      (a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime()
    );

    setSavedSessions(cleanLocal);
  }, []);

  // Sync saved sessions on mount & auth change
  useEffect(() => {
    fetchSavedSessions();
  }, [authUser, fetchSavedSessions]);

  const loadSessionToTable = useCallback((session: SavedDiningSession) => {
    const newOrders: TableOrders = {};
    if (session.itemsJson && Array.isArray(session.itemsJson)) {
      session.itemsJson.forEach(item => {
        if (item.id && item.count > 0) {
          newOrders[item.id] = item.count;
        }
      });
    }
    setOrders(newOrders);
  }, []);

  const deleteSavedSession = useCallback((sessionId: string) => {
    setSavedSessions(prev => {
      const next = prev.filter(s => s.id !== sessionId);
      try {
        localStorage.setItem('mk_buffet_saved_sessions_v1', JSON.stringify(next));
      } catch {}
      return next;
    });

    // Send DELETE request to server only if valid server ID (not starting with 'local_')
    if (sessionId && !sessionId.startsWith('local_')) {
      const token = localStorage.getItem('mk_buffet_auth_token');
      fetch(`${AUTH_SERVER_URL}/api/shabu/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
      })
        .then(res => {
          if (!res.ok && res.status !== 404) {
            console.warn(`Server session delete returned ${res.status}`);
          }
        })
        .catch(() => {});
    }
  }, []);

  return {
    orders,
    totals,
    userSettings,
    updateUserSettings,
    authUser,
    handleLogout,
    AUTH_SERVER_URL,
    sessionSaved,
    saveDiningSession,
    savedSessions,
    fetchSavedSessions,
    loadSessionToTable,
    deleteSavedSession,
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
