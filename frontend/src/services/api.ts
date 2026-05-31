import { ReportSummary, ProductionLog, Kitchen, InventoryItem } from "../types";

const BASE_URL = "http://localhost:5001/api";

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const api = {
  login: async (credentials: { email: string; password?: string }): Promise<{ success: boolean; user: any }> => {
    return request<{ success: boolean; user: any }>("/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  getStats: async (): Promise<ReportSummary> => {
    return request<ReportSummary>("/stats");
  },

  getActivity: async (kitchenId?: string): Promise<ProductionLog[]> => {
    const query = kitchenId ? `?kitchenId=${encodeURIComponent(kitchenId)}` : "";
    return request<ProductionLog[]>(`/activity${query}`);
  },

  getProductionPlans: async (kitchenId?: string): Promise<any[]> => {
    const query = kitchenId ? `?kitchenId=${encodeURIComponent(kitchenId)}` : "";
    return request<any[]>(`/production-plans${query}`);
  },

  createProductionPlan: async (plan: {
    id?: string;
    day: string;
    menu: string;
    kitchenId: string;
    portions: number;
    note?: string;
  }): Promise<any> => {
    return request<any>("/production-plans", {
      method: "POST",
      body: JSON.stringify(plan),
    });
  },

  updateProductionPlan: async (id: string, plan: {
    day?: string;
    menu?: string;
    kitchenId?: string;
    portions?: number;
    note?: string;
  }): Promise<any> => {
    return request<any>(`/production-plans/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(plan),
    });
  },

  deleteProductionPlan: async (id: string): Promise<any> => {
    return request<any>(`/production-plans/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  },

  getKitchens: async (): Promise<Kitchen[]> => {
    return request<Kitchen[]>("/kitchens");
  },

  getInventory: async (): Promise<any[]> => {
    return request<any[]>("/inventory");
  },

  getMenus: async (): Promise<any[]> => {
    return request<any[]>("/menus");
  },

  getStaff: async (): Promise<any[]> => {
    return request<any[]>("/staff");
  },

  createKitchen: async (data: Omit<Kitchen, "id"> & { city?: string }): Promise<Kitchen> => {
    return request<Kitchen>("/kitchens", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateKitchen: async (id: string, data: Partial<Kitchen> & { city?: string }): Promise<Kitchen> => {
    return request<Kitchen>(`/kitchens/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteKitchen: async (id: string): Promise<Kitchen> => {
    return request<Kitchen>(`/kitchens/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  },

  getKitchenDetail: async (id: string): Promise<Kitchen & { staff: any[]; shifts: any[]; stock: InventoryItem[]; activeProductions: any[] }> => {
    return request<Kitchen & { staff: any[]; shifts: any[]; stock: InventoryItem[]; activeProductions: any[] }>(
      `/kitchens/${encodeURIComponent(id)}/detail`
    );
  },

  requestStock: async (material: string, amount: string, urgency: string, kitchenId?: string, kitchenName?: string): Promise<any> => {
    return request<any>("/stock-requests", {
      method: "POST",
      body: JSON.stringify({ material, amount, urgency, kitchenId, kitchenName }),
    });
  },

  requestStockBatch: async (requests: { material: string; amount: string; urgency: string }[], kitchenId?: string, kitchenName?: string): Promise<any[]> => {
    return request<any[]>("/stock-requests/batch", {
      method: "POST",
      body: JSON.stringify({ requests, kitchenId, kitchenName }),
    });
  },

  getChefDashboardData: async (kitchenId: string): Promise<any> => {
    return request<any>(`/chef/dashboard/${encodeURIComponent(kitchenId)}`);
  },

  getStockRequests: async (kitchenId?: string): Promise<any[]> => {
    const query = kitchenId ? `?kitchenId=${encodeURIComponent(kitchenId)}` : "";
    return request<any[]>(`/stock-requests${query}`);
  },

  finishTask: async (data: { productionId: string }): Promise<{ success: boolean; handoverId: string }> => {
    return request<{ success: boolean; handoverId: string }>("/production-logs/finish", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  startTask: async (id: string): Promise<ProductionLog> => {
    return request<ProductionLog>("/production-logs/start", {
      method: "POST",
      body: JSON.stringify({ id }),
    });
  },

  reportWastage: async (data: {
    batchId: string;
    kitchenId: string;
    materialName: string;
    container: string;
    weight: number;
    reason: string;
    notes?: string;
  }): Promise<any> => {
    return request<any>("/wastage", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getWastage: async (): Promise<any[]> => {
    return request<any[]>("/wastage");
  },
};
