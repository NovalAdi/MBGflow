import { ReportSummary, ProductionLog, Kitchen, InventoryItem } from "../types";

const BASE_URL = "http://localhost:5001/api";

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const token = localStorage.getItem("auth_token");
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const api = {
  login: async (credentials: { email: string; password?: string }): Promise<{ success: boolean; token: string; user: any }> => {
    const res = await request<{ success: boolean; token: string; user: any }>("/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    if (res.success && res.token) {
      localStorage.setItem("auth_token", res.token);
      localStorage.setItem("auth_user", JSON.stringify(res.user));
    }
    return res;
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

  requestStock: async (material: string, amount: string, urgency: string, kitchenId?: string, kitchenName?: string, supplierKitchenId?: string, supplierKitchenName?: string): Promise<any> => {
    return request<any>("/stock-requests", {
      method: "POST",
      body: JSON.stringify({ material, amount, urgency, kitchenId, kitchenName, supplierKitchenId, supplierKitchenName }),
    });
  },

  requestStockBatch: async (requests: { material: string; amount: string; urgency: string; supplierKitchenId?: string; supplierKitchenName?: string }[], kitchenId?: string, kitchenName?: string): Promise<any[]> => {
    return request<any[]>("/stock-requests/batch", {
      method: "POST",
      body: JSON.stringify({ requests, kitchenId, kitchenName }),
    });
  },

  getMaterialAvailability: async (material: string): Promise<any[]> => {
    return request<any[]>(`/inventory/material-availability?material=${encodeURIComponent(material)}`);
  },

  updateStockRequestStatus: async (id: string, status: string, adminNotes?: string): Promise<any> => {
    return request<any>(`/stock-requests/${encodeURIComponent(id)}/status`, {
      method: "PUT",
      body: JSON.stringify({ status, adminNotes }),
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

  getNotifications: async (kitchenId?: string): Promise<any[]> => {
    const query = kitchenId ? `?kitchenId=${encodeURIComponent(kitchenId)}` : "";
    return request<any[]>(`/notifications${query}`);
  },

  markNotificationRead: async (id: string): Promise<any> => {
    return request<any>(`/notifications/${encodeURIComponent(id)}/read`, {
      method: "PUT",
    });
  },

  deleteNotification: async (id: string): Promise<any> => {
    return request<any>(`/notifications/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  },
  
  createNotification: async (kitchenId: string, message: string): Promise<any> => {
    return request<any>("/notifications", {
      method: "POST",
      body: JSON.stringify({ kitchenId, message }),
    });
  },
};
