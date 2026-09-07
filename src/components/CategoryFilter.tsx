import React from 'react';
import { Search, X } from 'lucide-react';
import { Category, TableOrders } from '../types';
import { CATEGORY_LABELS, MK_MENU_ITEMS } from '../data/mkMenu';

interface CategoryFilterProps {
  activeCategory: Category;
  onSelectCategory: (cat: Category) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  orders: TableOrders;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  orders,
}) => {
  const categories: Category[] = ['all', 'meat', 'balls', 'veggies', 'carbs', 'sauce'];

  // Helper to count active ordered items per category
  const getItemCountForCategory = (cat: Category) => {
    if (cat === 'all') {
      return Object.values(orders).reduce((sum, count) => sum + count, 0);
    }
    return MK_MENU_ITEMS.filter(item => item.category === cat).reduce((sum, item) => {
      return sum + (orders[item.id] || 0);
    }, 0);
  };

  return (
    <div className="space-y-2.5">
      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="ค้นหารายการอาหาร (เช่น หมูสไลซ์, บะหมี่หยก)..."
          className="w-full bg-mk-card border border-mk-border focus:border-mk-red text-sm text-gray-100 placeholder-gray-500 rounded-xl pl-10 pr-9 py-2.5 outline-none transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Scroll Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {categories.map(cat => {
          const label = CATEGORY_LABELS[cat];
          const count = getItemCountForCategory(cat);
          const isActive = activeCategory === cat;

          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all active-press border ${
                isActive
                  ? 'bg-mk-red border-mk-red text-white shadow-glow-red'
                  : 'bg-mk-card border-mk-border text-gray-400 hover:text-gray-200 hover:border-gray-700'
              }`}
            >
              <span>{label.icon}</span>
              <span>{label.th}</span>
              {count > 0 && (
                <span
                  className={`ml-1 px-1.5 py-0.5 text-[10px] rounded-full font-bold ${
                    isActive ? 'bg-white text-mk-red' : 'bg-mk-red/30 text-mk-red border border-mk-red/40'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
