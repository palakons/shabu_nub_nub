import React from 'react';
import { Flame, RefreshCw, Sun, SunDim, Receipt, UtensilsCrossed, Trophy, Target, Calculator, LogIn, LogOut, User as UserIcon, History, MessageSquare } from 'lucide-react';
import { MacroTotals, UserSettings, AuthUser } from '../types';
import { getAuthBaseUrl } from '../utils/telemetry';

interface HeaderStatsProps {
  totals: MacroTotals;
  userSettings: UserSettings;
  authUser: AuthUser | null;
  savedSessionsCount?: number;
  onLogout: () => void;
  authServerUrl?: string;
  wakeLockActive: boolean;
  onToggleWakeLock: () => void;
  onResetTable: () => void;
  onOpenSummary: () => void;
  onOpenTdeeModal: () => void;
  onOpenHistory: () => void;
  onOpenFeedback: () => void;
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
  onOpenFeedback,
}) => {
  const targetAuthUrl = authServerUrl || getAuthBaseUrl();
  const [showResetConfirm, setShowResetConfirm] = React.useState(false);

  // Calculate macro percentage split
  const totalMacroGrams = totals.protein + totals.fat + totals.carbs || 1;
  const pPct = Math.round((totals.protein / totalMacroGrams) * 100);
  const fPct = Math.round((totals.fat / totalMacroGrams) * 100);
  const cPct = Math.round((totals.carbs / totalMacroGrams) * 100);

  // TDEE Deficit Calculations
  const targetDailyCal = Math.max(500, userSettings.tdee - userSettings.targetDeficit);
  const remainingCal = targetDailyCal - totals.calories;
  const isOverDeficitBudget = remainingCal < 0;
  const progressPct = Math.min(100, Math.round((totals.calories / targetDailyCal) * 100));

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
    <header className="sticky top-0 z-40 glass-panel border-b border-mk-border shadow-xl backdrop-blur-md">
      <div className="max-w-4xl mx-auto px-2.5 py-2 sm:px-4 sm:py-2.5 space-y-2">
        {/* Top Branding & Action Controls */}
        <div className="flex items-center justify-between gap-2">
          {/* Logo & Branding: My Kal */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-mk-red via-red-600 to-amber-600 flex items-center justify-center text-white shadow-glow-red font-black text-sm sm:text-base tracking-tight">
              🔥
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-extrabold text-white leading-none flex items-center gap-1.5">
                <span>My Kal</span>
                <span className="text-[10px] sm:text-xs bg-mk-red/20 text-mk-red px-1.5 py-0.5 rounded-full border border-mk-red/40 font-semibold">
                  MK 299
                </span>
              </h1>
              <p className="text-[10px] sm:text-xs text-gray-400 font-medium hidden sm:block">My Calorie & Tray Tracker</p>
            </div>
          </div>

          {/* Action Button Strip (Scrollable on small mobile screens) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 max-w-full justify-end">
            {/* Screen Wake Lock */}
            <button
              onClick={onToggleWakeLock}
              className={`p-1.5 sm:px-2 py-1.5 rounded-xl border text-[11px] font-medium flex items-center gap-1 shrink-0 transition-all active-press ${
                wakeLockActive
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-glow-gold'
                  : 'bg-mk-card border-mk-border text-gray-400 hover:text-gray-200'
              }`}
              title="เปิดหน้าจอค้างไว้ขณะรับประทานอาหาร"
            >
              {wakeLockActive ? <Sun className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> : <SunDim className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{wakeLockActive ? 'จอเปิด' : 'เปิดจอ'}</span>
            </button>

            {/* Reset Table */}
            <button
              onClick={handleResetClick}
              className={`px-2 py-1.5 rounded-xl border text-[11px] font-semibold flex items-center gap-1 shrink-0 transition-all active-press ${
                showResetConfirm
                  ? 'bg-red-600 border-red-500 text-white animate-pulse'
                  : 'bg-mk-card border-mk-border text-gray-300 hover:border-red-500/50 hover:text-red-400'
              }`}
            >
              <RefreshCw className={`w-3 h-3 ${showResetConfirm ? 'animate-spin' : ''}`} />
              <span>{showResetConfirm ? 'ยืนยัน?' : 'ล้างโต๊ะ'}</span>
            </button>

            {/* Feedback */}
            <button
              onClick={onOpenFeedback}
              className="p-1.5 sm:px-2 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 font-semibold text-[11px] flex items-center gap-1 shrink-0 transition-all active-press"
              title="ส่งข้อเสนอแนะ / แจ้งปัญหา"
            >
              <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden lg:inline">ข้อเสนอแนะ</span>
            </button>

            {/* User Profile / Login (Grouped right next to History) */}
            {authUser ? (
              <div className="flex items-center gap-1 bg-mk-card border border-mk-border p-1 rounded-xl shrink-0">
                {authUser.avatarUrl ? (
                  <img src={authUser.avatarUrl} alt={authUser.displayName || 'User'} className="w-5 h-5 rounded-full" />
                ) : (
                  <UserIcon className="w-3.5 h-3.5 text-gray-300" />
                )}
                <span className="text-[11px] font-semibold text-gray-200 hidden md:inline truncate max-w-[80px]">
                  {authUser.displayName?.split(' ')[0] || authUser.email}
                </span>
                <button
                  onClick={onLogout}
                  className="p-1 text-gray-400 hover:text-red-400 rounded-lg transition-colors"
                  title="ออกจากระบบ"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <a
                href={`${targetAuthUrl}/auth/google?redirect=${encodeURIComponent(window.location.href)}`}
                className="px-2 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-[11px] font-semibold flex items-center gap-1 shrink-0 transition-all active-press"
                title="เข้าสู่ระบบด้วย Google"
              >
                <LogIn className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">Sign in</span>
              </a>
            )}

            {/* Saved History */}
            <button
              onClick={onOpenHistory}
              className="px-2 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 font-semibold text-[11px] flex items-center gap-1 shrink-0 transition-all active-press"
              title="ดูประวัติมื้ออาหาร"
            >
              <History className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">ประวัติมื้อ</span>
              {savedSessionsCount > 0 && (
                <span className="bg-blue-500 text-white text-[9px] font-bold px-1 rounded-full">
                  {savedSessionsCount}
                </span>
              )}
            </button>

            {/* Standout Primary Action: สรุป & บันทึกมื้อ */}
            <button
              onClick={onOpenSummary}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-mk-red via-red-600 to-amber-600 hover:brightness-110 text-white font-extrabold text-[11px] sm:text-xs flex items-center gap-1.5 shadow-glow-red border border-red-400/50 active-press shrink-0"
              title="ดูสรุปแคลอรีและบันทึกมื้ออาหาร"
            >
              <Receipt className="w-4 h-4 text-amber-200" />
              <span>สรุป & บันทึกมื้อ</span>
            </button>
          </div>
        </div>

        {/* Ultra-Compact Unified Dashboard Card */}
        <div className="p-2 sm:p-2.5 rounded-2xl bg-mk-card/95 border border-mk-border/90 shadow-inner space-y-1.5">
          {/* Row 1: Calorie Deficit Ticker & Progress Gauge & TDEE Goal Trigger */}
          <div className="flex items-center justify-between gap-1.5 text-xs font-extrabold">
            {/* Live Calorie Ticker */}
            <div className="flex items-center gap-1 shrink-0">
              <Flame className="w-4 h-4 text-mk-red animate-pulse" />
              <span className="text-base sm:text-lg text-white font-black tracking-tight leading-none">
                {totals.calories.toLocaleString()}
              </span>
              <span className="text-[10px] text-gray-400 font-normal">kcal</span>
            </div>

            {/* Deficit Progress Bar */}
            <div className="flex-1 mx-1.5 flex flex-col justify-center gap-0.5">
              <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden flex">
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
              <div className="flex justify-between text-[9px] text-gray-400 font-medium leading-none">
                <span>เป้า: {targetDailyCal.toLocaleString()} kcal</span>
                <span className={isOverDeficitBudget ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {isOverDeficitBudget ? `เกิน +${Math.abs(remainingCal)}` : `เหลืองบ ${remainingCal}`}
                </span>
              </div>
            </div>

            {/* TDEE Settings Button right next to total cal bar */}
            <button
              onClick={onOpenTdeeModal}
              className="p-1 px-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-[10px] font-bold flex items-center gap-1 shrink-0 transition-all active-press"
              title="ตั้งค่า TDEE & เป้าหมายแคลอรี"
            >
              <Calculator className="w-3.5 h-3.5 text-amber-400" />
              <span>TDEE</span>
            </button>

            {/* Tray Count Badge */}
            <div className="flex items-center gap-1 bg-amber-500/15 border border-amber-500/30 px-1.5 py-1 rounded-xl text-amber-300 shrink-0">
              <UtensilsCrossed className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-black">{totals.totalTrays}</span>
              <span className="text-[10px] font-medium text-amber-200/80">ถาด</span>
            </div>
          </div>

          {/* Row 2: 4 Key Macro & Value Badges Grid */}
          <div className="grid grid-cols-4 gap-1 sm:gap-2 pt-0.5 border-t border-mk-border/40">
            {/* Protein */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-1 text-center">
              <div className="text-[9px] text-gray-400 font-medium">โปรตีน</div>
              <div className="text-xs font-extrabold text-emerald-400">{totals.protein}g <span className="text-[9px] text-emerald-300/70 font-normal">({pPct}%)</span></div>
            </div>

            {/* Carbs */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-1 text-center">
              <div className="text-[9px] text-gray-400 font-medium">คาร์บ</div>
              <div className="text-xs font-extrabold text-amber-400">{totals.carbs}g <span className="text-[9px] text-amber-300/70 font-normal">({cPct}%)</span></div>
            </div>

            {/* Fat */}
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-1 text-center">
              <div className="text-[9px] text-gray-400 font-medium">ไขมัน</div>
              <div className="text-xs font-extrabold text-rose-400">{totals.fat}g <span className="text-[9px] text-rose-300/70 font-normal">({fPct}%)</span></div>
            </div>

            {/* Cost Efficiency */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-1 text-center">
              <div className="text-[9px] text-gray-400 font-medium">คุ้มค่า 299฿</div>
              <div className="text-xs font-extrabold text-blue-300">{(299 / (totals.calories || 1)).toFixed(2)} <span className="text-[9px] text-blue-200/70 font-normal">฿/kcal</span></div>
            </div>
          </div>

          {/* Row 3: Ultra-thin Macro Split Bar */}
          <div className="w-full bg-gray-800 rounded-full h-1 overflow-hidden flex">
            <div style={{ width: `${pPct}%` }} className="bg-emerald-500 transition-all duration-300" title={`Protein: ${totals.protein}g (${pPct}%)`} />
            <div style={{ width: `${cPct}%` }} className="bg-amber-500 transition-all duration-300" title={`Carbs: ${totals.carbs}g (${cPct}%)`} />
            <div style={{ width: `${fPct}%` }} className="bg-rose-500 transition-all duration-300" title={`Fat: ${totals.fat}g (${fPct}%)`} />
          </div>
        </div>
      </div>
    </header>
  );
};
