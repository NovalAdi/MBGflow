export type Status = 'NotStarted' | 'Preparing' | 'Cooking' | 'Ready' | 'Success' | 'Waste' | 'Pending';

export interface Kitchen {
  id: string;
  name: string;
  address: string;
  capacity: number;
  latitude?: number;
  longitude?: number;
  maps_url?: string;
  city?: string;
}

export interface MenuItemIngredient {
  name: string;
  perPortion: number;
  unit: string;
}

export interface Menu {
  id: string;
  name: string;
  ingredients: MenuItemIngredient[];
}

export interface ProductionPlan {
  id: string;
  day: string;
  menuId: string;
  menuName: string; // redundant but useful for quick display
  kitchenId: string;
  kitchenName: string; 
  portions: number;
  note: string;
  status: Status;
  userId?: string | null;
  chefPenanggungJawab: string;
  chefName?: string;
}

export interface ProductionLog {
  id: string;
  menuId?: string;
  menu: string;
  kitchen: string;
  city: string;
  status: Status;
  servings: number;
  startTime: string;
  endTime?: string;
  chefPenanggungJawab?: string;
  qaNotes?: string;
}

export interface User {
  id: string;
  name: string;
  role: string;
  status: 'Active' | 'Inactive';
  avatar: string;
  kitchenId?: string | null;
  email?: string;
}

export type Staff = User;

export interface Shift {
  type: string;
  time: string;
  staffCount: number;
  avatars: string[];
}

export interface StockBatch {
  id: string;
  kitchenId: string;
  container: string;
  weight: string;
  weight_value?: number;
  unit?: string;
  qty_packed?: number;
  qty_loose?: number;
  package_capacity?: number;
  package_unit?: string;
  expiry: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  volume: number; // For progress bar/percentage
  totalWeight: string; // Formatted absolute weight
  batches: StockBatch[];
}

export interface ReportSummary {
  activeKitchens: number;
  successfulServings: number;
  currentlyCooking: number;
  totalDailyActivities: number;
  chefsOnDuty: number;
}
