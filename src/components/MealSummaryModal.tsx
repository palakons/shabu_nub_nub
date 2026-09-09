import React, { useState } from 'react';
import { X, Copy, Check, Share2, Flame, Award, Utensils, Zap, Target, Save, LogIn, CheckCircle2 } from 'lucide-react';
import { TableOrders, MacroTotals, UserSettings, AuthUser } from '../types';
import { MK_MENU_ITEMS } from '../data/mkMenu';
import { trackEvent } from '../utils/telemetry';

interface MealSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: TableOrders;
  totals: MacroTotals;
  userSettings: UserSettings;
  authUser?: AuthUser | null;
  onSaveSession?: () => Promise<{ success: boolean; savedOnServer?: boolean }>;
  authServerUrl?: string;
}

export const MealSummaryModal: React.FC<MealSummaryModalProps> = ({
  isOpen,
  onClose,
  orders,
  totals,
  userSettings,
  authUser,
  onSaveSession,
  authServerUrl = 'http://localhost:4000',
}) => {
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const targetDailyCal = Math.max(500, userSettings.tdee - userSettings.targetDeficit);
  const remainingCal = targetDailyCal - totals.calories;
  const isOverTarget = remainingCal < 0;

  // Filter ordered items
  const activeItems = Object.entries(orders)
    .filter(([_, qty]) => qty > 0)
    .map(([itemId, qty]) => {
      const item = MK_MENU_ITEMS.find(m => m.id === itemId);
      return { item, qty };
    })
    .filter(entry => entry.item !== undefined);

  // Generate plain text summary for social sharing
  const generateSummaryText = () => {
    let text = `🍲 สรุปทาน MK บุฟเฟต์ 299 บาท 🍲\n`;
    text += `🎯 TDEE: ${userSettings.tdee.toLocaleString()} | Deficit Goal: -${userSettings.targetDeficit.toLocaleString()} | เป้าหมายวัน: ${targetDailyCal.toLocaleString()} kcal\n`;
    text += `---------------------------------\n`;
    activeItems.forEach(({ item, qty }) => {
      if (item) {
        text += `• ${item.name_th}: ${qty} ถาด (${item.cal_per_tray * qty} kcal)\n`;
      }
    });
    text += `---------------------------------\n`;
    text += `📊 รวมมื้อนี้: ${totals.totalTrays} ถาด | ${totals.calories.toLocaleString()} kcal (${Math.round((totals.calories / targetDailyCal) * 100)}% ของงบวัน)\n`;
    text += `💪 โปรตีน: ${totals.protein}g | คาร์บ: ${totals.carbs}g | ไขมัน: ${totals.fat}g\n`;
    text += `⚡ สถานะแคลอรี: ${isOverTarget ? `เกินเป้าขาดแคลอรี +${Math.abs(remainingCal).toLocaleString()} kcal` : `เหลืองบประจำวัน ${remainingCal.toLocaleString()} kcal`}\n`;
    text += `📱 คำนวณโดย MK Buffet Calorie Tracker`;
    return text;
  };

  const handleCopyText = () => {
    trackEvent('share_click', { action: 'receipt_export' });
    navigator.clipboard.writeText(generateSummaryText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#141417] border border-mk-border rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 bg-gradient-to-r from-mk-red to-mk-darkred text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <Utensils className="w-5 h-5" />
            <div>
              <h2 className="text-base font-bold">สรุปใบเสร็จมื้ออาหาร (299 THB)</h2>
              <p className="text-xs text-red-200">MK Buffet Calorie & Macro Receipt</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* Key Metrics Header */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-mk-card p-3 rounded-2xl border border-mk-border flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-mk-red/20 text-mk-red">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-gray-400 font-medium">พลังงานรวม</div>
                <div className="text-xl font-black text-white">{totals.calories.toLocaleString()} <span className="text-xs font-normal text-gray-400">kcal</span></div>
              </div>
            </div>

            <div className="bg-mk-card p-3 rounded-2xl border border-mk-border flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-gray-400 font-medium">โปรตีนรวม</div>
                <div className="text-xl font-black text-emerald-400">{totals.protein} <span className="text-xs font-normal text-gray-400">กรัม</span></div>
              </div>
            </div>
          </div>

          {/* TDEE & Deficit Analysis Card */}
          <div className="bg-mk-card p-3.5 rounded-2xl border border-mk-border space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-300 flex items-center gap-1.5">
                <Target className="w-4 h-4" />
                สรุป TDEE & เป้าหมายวัน
              </span>
              <span className="text-gray-400 text-[11px]">
                TDEE: {userSettings.tdee.toLocaleString()} | Deficit: -{userSettings.targetDeficit.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center text-gray-300 pt-1 border-t border-gray-800">
              <span>เป้าหมายแคลอรีต่อวันสุทธิ:</span>
              <span className="font-extrabold text-emerald-400">{targetDailyCal.toLocaleString()} kcal</span>
            </div>
            <div className="flex justify-between items-center text-gray-300">
              <span>มื้อนี้ทานคิดเป็น:</span>
              <span className="font-extrabold text-amber-400">
                {Math.round((totals.calories / targetDailyCal) * 100)}% ของงบประจำวัน
              </span>
            </div>
            <div className="flex justify-between items-center font-semibold pt-1 border-t border-gray-800/60">
              <span>สถานะเป้าหมาย:</span>
              <span className={isOverTarget ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                {isOverTarget
                  ? `เกินเป้า Deficit ไป +${Math.abs(remainingCal).toLocaleString()} kcal`
                  : `เหลืองบประจำวัน ${remainingCal.toLocaleString()} kcal`}
              </span>
            </div>
          </div>

          {/* Efficiency Score Banner */}
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-3.5 rounded-2xl border border-amber-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Zap className="w-5 h-5 text-amber-400" />
              <div>
                <div className="text-xs font-bold text-amber-300">ดัชนีโปรตีนต่อบาท</div>
                <div className="text-[11px] text-gray-300">
                  ได้รับโปรตีน <span className="font-bold text-amber-400">{(totals.protein / 2.99).toFixed(1)}g</span> ต่อทุกๆ 10 บาท
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded-lg border border-amber-500/40 font-bold">
                {totals.protein >= 80 ? '🔥 คุ้มค่าระดับเทพ' : totals.protein >= 40 ? '👍 คุ้มค่าดี' : '👌 ทานเพลินๆ'}
              </span>
            </div>
          </div>

          {/* Itemized Order Table */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex justify-between">
              <span>รายการอาหารที่สั่ง ({totals.totalTrays} ถาด)</span>
              <span>แคลอรีรวม</span>
            </h3>

            {activeItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-xs">
                ยังไม่มีการเพิ่มถาดอาหาร กด + บนการ์ดอาหารเพื่อเริ่มบันทึก
              </div>
            ) : (
              <div className="space-y-1.5">
                {activeItems.map(({ item, qty }) => (
                  <div
                    key={item!.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-mk-card border border-mk-border/60 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{item!.icon}</span>
                      <div>
                        <div className="font-bold text-gray-200">{item!.name_th}</div>
                        <div className="text-[10px] text-gray-400">
                          {qty} ถาด × {item!.cal_per_tray} kcal | P: {item!.protein_g * qty}g
                        </div>
                      </div>
                    </div>
                    <div className="text-right font-bold text-amber-400">
                      {(item!.cal_per_tray * qty).toLocaleString()} kcal
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User Account & Record Session Card */}
          <div className="bg-gradient-to-br from-mk-card to-[#1a1a22] p-4 rounded-2xl border border-mk-border space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <Save className="w-4 h-4 text-blue-400" />
                <span>บันทึกมื้ออาหารเข้าบัญชีผู้ใช้</span>
              </div>
              {authUser && (
                <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 px-2.5 py-1 rounded-xl">
                  {authUser.avatarUrl && (
                    <img src={authUser.avatarUrl} alt="User Avatar" className="w-4 h-4 rounded-full" />
                  )}
                  <span className="text-[11px] font-semibold text-blue-300">
                    {authUser.displayName || authUser.email}
                  </span>
                </div>
              )}
            </div>

            {authUser ? (
              <div className="space-y-2">
                {savedSuccess ? (
                  <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 animate-fade-in">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>บันทึกมื้ออาหารนี้เข้าโปรไฟล์เรียบร้อยแล้ว! 🎯</span>
                  </div>
                ) : (
                  <button
                    onClick={async () => {
                      if (!onSaveSession) return;
                      setIsSaving(true);
                      try {
                        const res = await onSaveSession();
                        if (res.success) {
                          setSavedSuccess(true);
                        }
                      } finally {
                        setIsSaving(false);
                      }
                    }}
                    disabled={isSaving || totals.totalTrays === 0}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30 active-press disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'กำลังบันทึกข้อมูล...' : 'บันทึกมื้อนี้เข้าโปรไฟล์ Google Account'}</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2.5">
                <p className="text-[11px] text-gray-400">
                  เข้าสู่ระบบเพื่อบันทึกประวัติการทาน MK บุฟเฟต์นี้ พร้อมสะสมโปรตีนและแคลอรีรวมในระบบ central account
                </p>
                <a
                  href={`${authServerUrl}/auth/google?redirect=${encodeURIComponent(window.location.href)}`}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 hover:brightness-110 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40 active-press"
                >
                  <LogIn className="w-4 h-4 text-blue-200" />
                  <span>เข้าสู่ระบบด้วย Google เพื่อบันทึกมื้อนี้</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-mk-card border-t border-mk-border flex items-center gap-3">
          <button
            onClick={handleCopyText}
            className="flex-1 py-3 px-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-gray-700 active-press"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'คัดลอกข้อความแล้ว!' : 'คัดลอกสรุปข้อความ'}</span>
          </button>

          <button
            onClick={handleCopyText}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-mk-red to-red-600 hover:brightness-110 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-glow-red active-press"
          >
            <Share2 className="w-4 h-4" />
            <span>แชร์ลง LINE / IG</span>
          </button>
        </div>
      </div>
    </div>
  );
};
