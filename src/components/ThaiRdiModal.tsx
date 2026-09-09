import React from 'react';
import { X, Trophy, Flame, Utensils, HeartPulse, CheckCircle2, AlertCircle, Info, Sparkles, Scale } from 'lucide-react';
import { MacroTotals } from '../types';
import { trackEvent } from '../utils/telemetry';

interface ThaiRdiModalProps {
  isOpen: boolean;
  onClose: () => void;
  totals: MacroTotals;
}

// Official Thai Recommended Daily Intake (Thai RDI) standards based on 2,000 kcal adult diet
const THAI_RDI = {
  calories: 2000, // kcal
  protein: 50,    // grams (Standard adult RDA; 1g/kg)
  fat: 65,        // grams (30% of energy)
  carbs: 300,     // grams (60% of energy)
  sodium: 2000,   // mg
};

export const ThaiRdiModal: React.FC<ThaiRdiModalProps> = ({
  isOpen,
  onClose,
  totals,
}) => {
  if (!isOpen) return null;

  // Calculate percentages against Thai RDI
  const calRdiPct = Math.round((totals.calories / THAI_RDI.calories) * 100);
  const pRdiPct = Math.round((totals.protein / THAI_RDI.protein) * 100);
  const fRdiPct = Math.round((totals.fat / THAI_RDI.fat) * 100);
  const cRdiPct = Math.round((totals.carbs / THAI_RDI.carbs) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#141417] border border-mk-border rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 bg-gradient-to-r from-blue-950 via-mk-card to-[#1a1a24] text-white flex items-center justify-between border-b border-mk-border shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold text-lg">
              🇹🇭
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                <span>เทียบสัดส่วน Thai RDI</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30">
                  อย. กระทรวงสาธารณสุข
                </span>
              </h2>
              <p className="text-xs text-gray-400">Thai Recommended Daily Intakes (2,000 kcal/วัน)</p>
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
        <div className="p-4 space-y-4 overflow-y-auto custom-scrollbar">
          {/* Summary Banner */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-900/30 via-mk-card to-indigo-900/30 border border-blue-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Scale className="w-6 h-6 text-blue-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">มื้ออาหารนี้เทียบกับเกณฑ์คนไทย (1 วัน)</div>
                <div className="text-[11px] text-gray-400">ทานมื้อนี้มื้อเดียว ได้รับโภชนาการเท่าไหร่?</div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-amber-300">{totals.totalTrays}</span>
              <span className="text-xs text-gray-400 ml-1">ถาด</span>
            </div>
          </div>

          {/* Thai RDI Comparison Metrics Breakdown */}
          <div className="space-y-3">
            {/* 1. Protein Comparison */}
            <div className="p-3 rounded-2xl bg-mk-card border border-emerald-500/30 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white">โปรตีน (Protein)</span>
                    <span className="text-[10px] text-gray-400 ml-1.5">เกณฑ์แนะนำ 50g/วัน</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-emerald-400">{totals.protein}g</span>
                  <span className="text-xs text-emerald-300/80 font-bold ml-1.5">({pRdiPct}% RDI)</span>
                </div>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, pRdiPct)}%` }}
                />
              </div>
              <div className="text-[10px] text-emerald-300/90 font-medium">
                {pRdiPct >= 100
                  ? '🎉 มื้อนี้ให้โปรตีนเกิน 100% ของความต้องการพื้นฐานต่อวันของคนไทยเรียบร้อย!'
                  : `ขาดอีกเพียง ${(THAI_RDI.protein - totals.protein).toFixed(1)}g ก็ครบโภชนาการประจำวัน`}
              </div>
            </div>

            {/* 2. Calories Comparison */}
            <div className="p-3 rounded-2xl bg-mk-card border border-red-500/30 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-mk-red/20 text-mk-red">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white">พลังงานรวม (Calories)</span>
                    <span className="text-[10px] text-gray-400 ml-1.5">เกณฑ์แนะนำ 2,000 kcal/วัน</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-white">{totals.calories.toLocaleString()} kcal</span>
                  <span className="text-xs text-amber-300 font-bold ml-1.5">({calRdiPct}% RDI)</span>
                </div>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    calRdiPct > 80 ? 'bg-red-500' : 'bg-amber-400'
                  }`}
                  style={{ width: `${Math.min(100, calRdiPct)}%` }}
                />
              </div>
              <div className="text-[10px] text-gray-400">
                มื้อนี้คิดเป็น <strong className="text-amber-300">{calRdiPct}%</strong> ของพลังงานที่ร่างกายคนไทยต้องการทั้งวัน
              </div>
            </div>

            {/* 3. Carbohydrates Comparison */}
            <div className="p-3 rounded-2xl bg-mk-card border border-amber-500/30 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                    <Utensils className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white">คาร์โบไฮเดรต (Carbs)</span>
                    <span className="text-[10px] text-gray-400 ml-1.5">เกณฑ์แนะนำ 300g/วัน</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-amber-400">{totals.carbs}g</span>
                  <span className="text-xs text-amber-300/80 font-bold ml-1.5">({cRdiPct}% RDI)</span>
                </div>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, cRdiPct)}%` }}
                />
              </div>
            </div>

            {/* 4. Total Fat Comparison */}
            <div className="p-3 rounded-2xl bg-mk-card border border-rose-500/30 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
                    <HeartPulse className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white">ไขมันรวม (Total Fat)</span>
                    <span className="text-[10px] text-gray-400 ml-1.5">เกณฑ์แนะนำ 65g/วัน</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-rose-400">{totals.fat}g</span>
                  <span className="text-xs text-rose-300/80 font-bold ml-1.5">({fRdiPct}% RDI)</span>
                </div>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, fRdiPct)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Practical Health Tip */}
          <div className="p-3 rounded-2xl bg-blue-950/40 border border-blue-500/30 text-xs text-blue-200 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-blue-300">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>คำแนะนำโภชนาการสำหรับคนไทย (Thai Health Tips)</span>
            </div>
            <p className="text-[11px] text-gray-300 leading-relaxed">
              * เกณฑ์ Thai RDI คำนวณจากความต้องการสารอาหารขั้นต่ำสำหรับคนไทยอายุ 6 ปีขึ้นไป (พลังงาน 2,000 kcal/วัน) หากเน้นสร้างกล้ามเนื้อสามารถรับโปรตีนสูงกว่าเกณฑ์ RDI ได้โดยไม่อันตรายครับ
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-mk-card border-t border-mk-border flex items-center justify-between">
          <span className="text-[11px] text-gray-400 font-medium">อ้างอิง: สำนักโภชนาการ กรมอนามัย</span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-all active-press"
          >
            เข้าใจแล้ว
          </button>
        </div>
      </div>
    </div>
  );
};
