import React, { useState } from 'react';
import { X, Calculator, Target, Flame, Check, Scale } from 'lucide-react';
import { UserSettings } from '../types';

interface TdeeSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userSettings: UserSettings;
  onUpdateSettings: (settings: Partial<UserSettings>) => void;
}

export const TdeeSettingsModal: React.FC<TdeeSettingsModalProps> = ({
  isOpen,
  onClose,
  userSettings,
  onUpdateSettings,
}) => {
  const [tdeeInput, setTdeeInput] = useState(userSettings.tdee.toString());
  const [deficitInput, setDeficitInput] = useState(userSettings.targetDeficit.toString());
  const [mealBudgetInput, setMealBudgetInput] = useState(userSettings.mealBudget.toString());
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const tdee = Math.max(500, parseInt(tdeeInput, 10) || 2000);
  const deficit = Math.max(0, parseInt(deficitInput, 10) || 0);
  const mealBudget = Math.max(100, parseInt(mealBudgetInput, 10) || 1000);
  const targetDailyCal = Math.max(500, tdee - deficit);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      tdee,
      targetDeficit: deficit,
      mealBudget,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#141417] border border-mk-border rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="p-4 bg-gradient-to-r from-gray-900 via-mk-card to-gray-900 border-b border-mk-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">ตั้งค่า TDEE & เป้าหมายแคลอรี</h2>
              <p className="text-xs text-gray-400">TDEE & Calorie Deficit Planner</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSave} className="p-5 space-y-5">
          {/* 1. TDEE Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400" />
                TDEE (อัตราการเผาผลาญพลังงานต่อวัน)
              </span>
              <span className="text-amber-400 font-extrabold">{tdee.toLocaleString()} kcal</span>
            </label>
            <input
              type="number"
              value={tdeeInput}
              onChange={e => setTdeeInput(e.target.value)}
              className="w-full bg-mk-card border border-mk-border focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-sm text-white font-bold outline-none transition-colors"
              placeholder="2000"
              step="50"
            />
            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[10px] text-gray-500 font-medium">ค่าแนะนำ:</span>
              {[1600, 1800, 2000, 2200, 2500].map(val => (
                <button
                  type="button"
                  key={val}
                  onClick={() => setTdeeInput(val.toString())}
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold border transition-all ${
                    tdee === val
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-mk-card border-mk-border text-gray-400 hover:text-white'
                  }`}
                >
                  {val.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Target Deficit Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Target className="w-4 h-4 text-mk-red" />
                เป้าหมายขาดแคลอรีต่อวัน (Target Deficit)
              </span>
              <span className="text-mk-red font-extrabold">-{deficit.toLocaleString()} kcal</span>
            </label>
            <input
              type="number"
              value={deficitInput}
              onChange={e => setDeficitInput(e.target.value)}
              className="w-full bg-mk-card border border-mk-border focus:border-mk-red rounded-xl px-3.5 py-2.5 text-sm text-white font-bold outline-none transition-colors"
              placeholder="500"
              step="50"
            />
            {/* Deficit Presets */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[10px] text-gray-500 font-medium">ระดับลดน้ำหนัก:</span>
              {[
                { label: 'คงที่ (0)', val: 0 },
                { label: 'ชิลๆ (300)', val: 300 },
                { label: 'มาตรฐาน (500)', val: 500 },
                { label: 'เร่งด่วน (750)', val: 750 },
              ].map(preset => (
                <button
                  type="button"
                  key={preset.val}
                  onClick={() => setDeficitInput(preset.val.toString())}
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold border transition-all ${
                    deficit === preset.val
                      ? 'bg-mk-red/20 border-mk-red text-mk-red'
                      : 'bg-mk-card border-mk-border text-gray-400 hover:text-white'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Meal Budget Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-emerald-400" />
                งบแคลอรีสำหรับมื้อบุฟเฟต์นี้ (Buffet Meal Budget)
              </span>
              <span className="text-emerald-400 font-extrabold">{mealBudget.toLocaleString()} kcal</span>
            </label>
            <input
              type="number"
              value={mealBudgetInput}
              onChange={e => setMealBudgetInput(e.target.value)}
              className="w-full bg-mk-card border border-mk-border focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-sm text-white font-bold outline-none transition-colors"
              placeholder="1000"
              step="50"
            />
          </div>

          {/* Calculated Summary Box */}
          <div className="p-3.5 bg-mk-card rounded-2xl border border-mk-border space-y-2 text-xs">
            <div className="flex justify-between items-center text-gray-300">
              <span>พลังงานรับได้ต่อวัน (TDEE - Deficit):</span>
              <span className="font-extrabold text-emerald-400 text-sm">
                {targetDailyCal.toLocaleString()} kcal
              </span>
            </div>
            <div className="flex justify-between items-center text-gray-400 text-[11px]">
              <span>งบมื้อนี้ คิดเป็น:</span>
              <span className="font-semibold text-gray-200">
                {Math.round((mealBudget / targetDailyCal) * 100)}% ของเป้าหมายต่อวัน
              </span>
            </div>
          </div>

          {/* Form Action Submit */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-glow-gold active-press"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>บันทึกเป้าหมายเรียบร้อย!</span>
              </>
            ) : (
              <span>บันทึกการตั้งค่า TDEE</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
