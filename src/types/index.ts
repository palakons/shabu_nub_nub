export type Category = 'all' | 'meat' | 'balls' | 'veggies' | 'carbs' | 'sauce';

export interface MenuItem {
  id: string;
  name_th: string;
  name_en: string;
  category: Exclude<Category, 'all'>;
  cal_per_tray: number;
  protein_g: number;
  fat_g: number;
  carb_g: number;
  icon: string; // Emoji or SVG key
  image_url?: string;
  is_popular?: boolean;
}

export type TableOrders = Record<string, number>;

export interface MacroTotals {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  totalTrays: number;
}

export interface UserSettings {
  tdee: number;
  targetDeficit: number;
  mealBudget: number;
  imageMode?: 'official' | 'cartoon';
}

export interface AuthUser {
  id: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
}

export interface SessionItemDetail {
  id: string;
  name_th: string;
  count: number;
  calories: number;
}

export interface SavedDiningSession {
  id: string;
  sessionDate: string;
  totalTrays: number;
  totalCalories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  costThb: number;
  itemsJson: SessionItemDetail[];
  savedOnServer?: boolean;
}


