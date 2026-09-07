import React from 'react';
import { Info, Image as ImageIcon, Sparkles } from 'lucide-react';

interface LegalDisclaimerProps {
  imageMode: 'official' | 'cartoon';
  onToggleImageMode: (mode: 'official' | 'cartoon') => void;
}

export const LegalDisclaimer: React.FC<LegalDisclaimerProps> = ({
  imageMode,
  onToggleImageMode,
}) => {
  return (
    <footer className="mt-8 pt-6 border-t border-mk-border/60 text-center space-y-3 px-4">
      {/* Mode Switcher Toggle Bar */}
      <div className="inline-flex items-center p-1 bg-mk-card border border-mk-border rounded-2xl gap-1">
        <button
          onClick={() => onToggleImageMode('official')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active-press ${
            imageMode === 'official'
              ? 'bg-mk-red text-white shadow-glow-red'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>📸 รูปจริง MK (Courtesy)</span>
        </button>

        <button
          onClick={() => onToggleImageMode('cartoon')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active-press ${
            imageMode === 'cartoon'
              ? 'bg-amber-500 text-black font-bold shadow-glow-gold'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>🎨 ภาพการ์ตูน Vector</span>
        </button>
      </div>

      {/* Legal Disclaimer text */}
      <div className="max-w-md mx-auto text-[11px] text-gray-400 space-y-1">
        <p className="flex items-center justify-center gap-1 font-medium">
          <Info className="w-3.5 h-3.5 text-gray-500" />
          <span>คำชี้แจงลิขสิทธิ์ภาพถ่าย (Copyright & Disclaimer):</span>
        </p>
        <p className="leading-relaxed">
          ภาพถ่ายอาหารในโหมดรูปจริงใช้เพื่อความสะดวกในการระบุรายการและคำนวณแคลอรี ลิขสิทธิ์และเครื่องหมายการค้าทั้งหมดเป็นของ <strong>MK Restaurants Group</strong>
        </p>
      </div>
    </footer>
  );
};
