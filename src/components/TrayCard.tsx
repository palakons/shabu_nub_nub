import React from 'react';
import { Plus, Minus, Flame, Sparkles, Gift, Tag } from 'lucide-react';
import { ExtendedMenuItem } from '../data/mkMenu';

interface TrayCardProps {
  item: ExtendedMenuItem;
  quantity: number;
  imageMode?: 'official' | 'cartoon';
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  onAddFive: (id: string) => void;
}

export const TrayCard: React.FC<TrayCardProps> = ({
  item,
  quantity,
  imageMode = 'official',
  onAdd,
  onRemove,
  onAddFive,
}) => {
  const isSelected = quantity > 0;

  return (
    <div
      className={`relative rounded-2xl bg-mk-card border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
        isSelected
          ? 'border-mk-red shadow-glow-red ring-1 ring-mk-red/50 bg-gradient-to-b from-mk-card to-[#231719]'
          : 'border-mk-border hover:border-gray-700 hover:bg-mk-cardHover'
      }`}
    >
      {/* Badges Container */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 items-start">
        {item.is_popular && (
          <div className="bg-amber-500/90 text-black font-extrabold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md backdrop-blur-md">
            <Sparkles className="w-3 h-3 fill-black" />
            <span>ยอดฮิต</span>
          </div>
        )}
        {item.is_addon && (
          <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md border border-white/20">
            <Tag className="w-3 h-3" />
            <span>+{item.addon_price || 59}฿ โปรเพิ่ม</span>
          </div>
        )}
        {item.promo_free && (
          <div className="bg-emerald-500 text-black font-extrabold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
            <Gift className="w-3 h-3" />
            <span>ฟรีไม่อั้น</span>
          </div>
        )}
      </div>

      {/* Selected Tray Counter Badge */}
      {isSelected && (
        <div className="absolute top-2 right-2 z-10 bg-mk-red text-white font-black text-xs px-2.5 py-1 rounded-full shadow-lg border border-white/20 animate-bounce">
          {quantity} ถาด
        </div>
      )}

      {/* Card Header: Official Photo vs Cartoon Vector Mode */}
      <div className="relative h-28 w-full bg-gray-900/60 overflow-hidden flex items-center justify-center">
        {imageMode === 'official' && item.image_url ? (
          <>
            <img
              src={item.image_url}
              alt={item.name_th}
              className={`w-full h-full object-cover transition-transform duration-300 ${
                isSelected ? 'scale-105 brightness-105' : 'opacity-85 hover:scale-105'
              }`}
              loading="lazy"
            />
            <div className="absolute bottom-1 left-2 text-[9px] text-gray-300 font-semibold bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm">
              Courtesy of MK
            </div>
          </>
        ) : (
          /* Cartoon Vector Graphic Shabu Tray Card */
          <div className="w-full h-full bg-gradient-to-br from-[#231e21] via-mk-card to-[#19181c] flex flex-col items-center justify-center p-2 relative overflow-hidden">
            {/* Red Suki Tray Outline Frame */}
            <div className="w-20 h-20 rounded-2xl border-2 border-mk-red/60 bg-gradient-to-b from-mk-red/20 to-mk-darkred/40 flex flex-col items-center justify-center shadow-glow-red relative">
              <span className="text-3xl filter drop-shadow-md animate-bounce-subtle">{item.icon}</span>
              <span className="text-[9px] font-black text-mk-red uppercase tracking-wider mt-0.5">SHABU CONDO</span>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-mk-card via-transparent to-black/20 pointer-events-none" />
      </div>

      {/* Item Body Info */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-baseline justify-between gap-1">
            <h3 className="text-sm font-bold text-white leading-tight line-clamp-1">
              {item.name_th}
            </h3>
          </div>
          <p className="text-[11px] text-gray-400 line-clamp-1">{item.name_en}</p>

          {/* Calories per tray */}
          <div className="mt-1.5 flex items-center gap-1 text-xs font-bold text-amber-400">
            <Flame className="w-3.5 h-3.5 fill-amber-400/20" />
            <span>{item.cal_per_tray} kcal</span>
            <span className="text-[10px] text-gray-400 font-normal">/ถาด</span>
          </div>

          {/* Macro Breakdown Pills */}
          <div className="mt-2 flex items-center gap-1 flex-wrap text-[10px]">
            <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded-md font-semibold">
              P {item.protein_g}g
            </span>
            <span className="bg-amber-500/15 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded-md font-semibold">
              C {item.carb_g}g
            </span>
            <span className="bg-rose-500/15 text-rose-400 border border-rose-500/30 px-1.5 py-0.5 rounded-md font-semibold">
              F {item.fat_g}g
            </span>
          </div>
        </div>

        {/* Tactile Stepper Controls */}
        <div className="mt-3.5 pt-2 border-t border-mk-border/60 flex items-center justify-between gap-1">
          {/* Decrement (-) Button */}
          <button
            onClick={() => onRemove(item.id)}
            disabled={!isSelected}
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base transition-all active-press ${
              isSelected
                ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-600'
                : 'bg-gray-900/50 text-gray-600 cursor-not-allowed border border-transparent'
            }`}
            title="ลด 1 ถาด"
          >
            <Minus className="w-4 h-4" />
          </button>

          {/* Quick Add +5 Button */}
          <button
            onClick={() => onAddFive(item.id)}
            className="px-2 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-amber-300 font-bold text-xs border border-gray-700 hover:border-amber-500/40 active-press"
            title="บวกทีเดียว 5 ถาด"
          >
            +5
          </button>

          {/* Increment (+) Button */}
          <button
            onClick={() => onAdd(item.id)}
            className="flex-1 h-9 rounded-xl bg-gradient-to-r from-mk-red to-red-600 hover:brightness-110 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-glow-red active-press"
            title="เพิ่ม 1 ถาด"
          >
            <Plus className="w-4 h-4" />
            <span>ถาด</span>
          </button>
        </div>
      </div>
    </div>
  );
};
