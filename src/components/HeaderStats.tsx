import React from 'react';
import { Flame, RefreshCw, Sun, SunDim, Receipt, UtensilsCrossed, Trophy, Target, Calculator, LogIn, LogOut, User as UserIcon, History } from 'lucide-react';
import { MacroTotals, UserSettings, AuthUser } from '../types';

interface HeaderStatsProps {
  totals: MacroTotals;
  userSettings: UserSettings;
  authUser: AuthUser | null;
  savedSessionsCount?: number;
  onLogout: () => void;
  authServerUrl: string;
  wakeLockActive: boolean;
  onToggleWakeLock: () => void;
  onResetTable: () => void;
  onOpenSummary: () => void;
  onOpenTdeeModal: () => void;
  onOpenHistory: () => void;
}

export const HeaderStats: React.FC<HeaderStatsProps> = ({
  totals,
  userSettings,
  authUser,
  savedSessionsCount = 0,
  onLogout,
  authServerUrl,
  wakeLockActive,
  onToggleWakeLock,
  onResetTable,
  onOpenSummary,
  onOpenTdeeModal,
  onOpenHistory,
}) => {
  const [showResetConfirm, setShowResetConfirm] = React.useState(false);

  // Calculate macro percentage split
  const totalMacroGrams = totals.protein + totals.fat + totals.carbs || 1;
  const pPct = Math.round((totals.protein / totalMacroGrams) * 100);
  const fPct = Math.round((totals.fat / totalMacroGrams) * 100);
  const cPct = Math.round((totals.carbs / totalMacroGrams) * 100);

  // Protein goal (default target: 100g protein)
  const proteinGoal = 100;
  const proteinProgress = Math.min(100, Math.round((totals.protein / proteinGoal) * 100));

  const handleResetClick = () => {
    if (showResetConfirm) {
      onResetTable();
      setShowResetConfirm(false);
    } else {
      setShowResetConfirm(true);
      setTimeout(() => setShowResetConfirm(false), 3000);
    }
  };

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-mk-border shadow-xl">
      <div className="max-w-4xl mx-auto px-4 py-3">
        {/* Top Title Bar & Action Icons */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-mk-red to-mk-darkred flex items-center justify-center text-white shadow-glow-red font-extrabold text-lg">
              MK
            </div>
            <div>
              <h1 className="text-base font-bold text-white leading-tight flex items-center gap-1.5">
                เอ็มเค บุฟเฟต์ <span className="text-xs bg-mk-red/20 text-mk-red px-2 py-0.5 rounded-full border border-mk-red/40 font-semibold">299 THB</span>
              </h1>
              <p className="text-xs text-gray-400">Tray & Calorie Real-Time Counter</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Central Google Auth Button / User Profile */}
            {authUser ? (
              <div className="flex items-center gap-1.5 bg-mk-card border border-mk-border p-1 rounded-xl">
                {authUser.avatarUrl ? (
                  <img src={authUser.avatarUrl} alt={authUser.displayName || 'User'} className="w-6 h-6 rounded-full" />
                ) : (
                  <UserIcon className="w-4 h-4 text-gray-300" />
                )}
                <span className="text-xs font-semibold text-gray-200 hidden md:inline">{authUser.displayName || authUser.email}</span>
                <button
                  onClick={onLogout}
                  className="p-1 text-gray-400 hover:text-red-400 rounded-lg transition-colors"
                  title="ออกจากระบบ (Sign Out)"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <a
                href={`${authServerUrl}/auth/google?redirect=${encodeURIComponent(window.location.href)}`}
                className="px-2.5 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-semibold flex items-center gap-1.5 transition-all active-press"
                title="เข้าสู่ระบบด้วย Google"
              >
                <LogIn className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">Sign in Google</span>
              </a>
            )}

            {/* TDEE & Deficit Planner Button */}
            <button
              onClick={onOpenTdeeModal}
              className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500/25 text-xs font-semibold flex items-center gap-1.5 transition-all active-press"
              title="ตั้งค่า TDEE & เป้าหมายขาดแคลอรี"
            >
              <Calculator className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">TDEE / เป้าหมาย</span>
            </button>

            {/* Screen Wake Lock Toggle */}
            <button
              onClick={onToggleWakeLock}
              className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1 transition-all active-press ${
                wakeLockActive
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-glow-gold'
                  : 'bg-mk-card border-mk-border text-gray-400 hover:text-gray-200'
              }`}
              title="เปิดหน้าจอค้างไว้ขณะรับประทานอาหาร"
            >
              {wakeLockActive ? <Sun className="w-4 h-4 text-amber-400 animate-pulse" /> : <SunDim className="w-4 h-4" />}
              <span className="hidden sm:inline">{wakeLockActive ? 'จอเปิดค้าง' : 'เปิดจอค้าง'}</span>
            </button>

            {/* Reset Table Button */}
            <button
              onClick={handleResetClick}
              className={`px-2.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all active-press ${
                showResetConfirm
                  ? 'bg-red-600 border-red-500 text-white animate-pulse'
                  : 'bg-mk-card border-mk-border text-gray-300 hover:border-red-500/50 hover:text-red-400'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${showResetConfirm ? 'animate-spin' : ''}`} />
              <span>{showResetConfirm ? 'ยืนยันล้างโต๊ะ?' : 'ล้างโต๊ะ'}</span>
            </button>

            {/* Saved Sessions History Trigger */}
            <button
              onClick={onOpenHistory}
              className="px-2.5 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 font-semibold text-xs flex items-center gap-1.5 transition-all active-press"
              title="ดูประวัติมื้ออาหารที่บันทึกไว้"
            >
              <History className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">ประวัติมื้อ</span>
              {savedSessionsCount > 0 && (
                <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {savedSessionsCount}
                </span>
              )}
            </button>

            {/* Summary Receipt Modal Trigger */}
            <button
              onClick={onOpenSummary}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-mk-red to-red-600 text-white font-semibold text-xs flex items-center gap-1.5 shadow-glow-red hover:brightness-110 active-press"
            >
              <Receipt className="w-4 h-4" />
              <span>สรุปมื้อ</span>
            </button>
          </div>
        </div>

        {/* TDEE & Target Deficit Calorie Gauge */}
        {(() => {
          const targetDailyCal = Math.max(500, userSettings.tdee - userSettings.targetDeficit);
          const remainingCal = targetDailyCal - totals.calories;
          const isOverDeficitBudget = remainingCal < 0;
          const progressPct = Math.min(100, Math.round((totals.calories / targetDailyCal) * 100));

          return (
            <div className="mb-3 p-2.5 rounded-xl bg-mk-card/90 border border-mk-border/80 flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <div className="flex items-center gap-1.5 text-gray-200">
                  <Target className="w-4 h-4 text-amber-400" />
                  <span>เป้าหมายแคลอรีประจำวัน (Deficit Goal)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-[11px]">
                    TDEE: {userSettings.tdee.toLocaleString()} | ขาด: -{userSettings.targetDeficit.toLocaleString()}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      isOverDeficitBudget
                        ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    {isOverDeficitBudget
                      ? `เกินเป้า Deficit +${Math.abs(remainingCal).toLocaleString()} kcal`
                      : `เหลืองบวัน ${remainingCal.toLocaleString()} kcal`}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden flex">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isOverDeficitBudget
                      ? 'bg-red-500 shadow-glow-red'
                      : progressPct > 80
                      ? 'bg-amber-400'
                      : 'bg-emerald-400'
                  }`}
                  style={{ width: `${progressPct}%` }}
                />
              </div>

              <div className="flex justify-between text-[10px] text-gray-400 font-medium">
                <span>มื้อนี้ทานไป: <strong className="text-white">{totals.calories.toLocaleString()} kcal</strong> ({progressPct}%)</span>
                <span>เป้าหมายสุทธิ: <strong className="text-emerald-400">{targetDailyCal.toLocaleString()} kcal/วัน</strong></span>
              </div>
            </div>
          );
        })()}

        {/* Live Counters Banner Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3">
          {/* Total Calories Ticker */}
          <div className="bg-gradient-to-br from-red-950/40 to-mk-card p-2.5 rounded-xl border border-mk-red/30 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-mk-red/20 text-mk-red">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-[11px] text-gray-400 font-medium">แคลอรีรวม</div>
              <div className="text-xl font-black text-white tracking-tight flex items-baseline gap-1">
                {totals.calories.toLocaleString()}
                <span className="text-[10px] text-gray-400 font-normal">kcal</span>
              </div>
            </div>
          </div>

          {/* Total Trays Counter */}
          <div className="bg-mk-card p-2.5 rounded-xl border border-mk-border flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-gray-400 font-medium">จำนวนถาดรวม</div>
              <div className="text-xl font-black text-amber-400 tracking-tight flex items-baseline gap-1">
                {totals.totalTrays}
                <span className="text-[10px] text-gray-400 font-normal">ถาด</span>
              </div>
            </div>
          </div>

          {/* Protein Count */}
          <div className="bg-mk-card p-2.5 rounded-xl border border-mk-border flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div className="w-full">
              <div className="text-[11px] text-gray-400 font-medium flex justify-between">
                <span>โปรตีน</span>
                <span className="text-emerald-400 font-bold">{totals.protein}g</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-1.5 mt-1 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${proteinProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Cost Efficiency */}
          <div className="bg-mk-card p-2.5 rounded-xl border border-mk-border flex flex-col justify-center">
            <div className="text-[11px] text-gray-400 font-medium">ความคุ้มค่า (299 THB)</div>
            <div className="text-sm font-bold text-gray-200 mt-0.5 flex items-center justify-between">
              <span>{(299 / (totals.calories || 1)).toFixed(2)} ฿/kcal</span>
              <span className="text-xs text-emerald-400 font-semibold">
                {totals.protein > 0 ? `~${(totals.protein / 2.99).toFixed(1)}g /10฿` : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Macro Progress Split Bar */}
        <div className="bg-mk-card/60 p-2 rounded-xl border border-mk-border/60">
          <div className="flex justify-between text-[11px] font-medium text-gray-400 mb-1">
            <span className="text-emerald-400 font-semibold">โปรตีน (P): {totals.protein}g ({pPct}%)</span>
            <span className="text-amber-400 font-semibold">คาร์บ (C): {totals.carbs}g ({cPct}%)</span>
            <span className="text-rose-400 font-semibold">ไขมัน (F): {totals.fat}g ({fPct}%)</span>
          </div>
          <div className="h-2 w-full bg-gray-800 rounded-full flex overflow-hidden">
            <div style={{ width: `${pPct}%` }} className="bg-emerald-500 transition-all duration-300" />
            <div style={{ width: `${cPct}%` }} className="bg-amber-500 transition-all duration-300" />
            <div style={{ width: `${fPct}%` }} className="bg-rose-500 transition-all duration-300" />
          </div>
        </div>
      </div>
    </header>
  );
};
