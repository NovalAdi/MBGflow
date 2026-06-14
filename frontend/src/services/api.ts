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
  
  getDailyRecap: async (): Promise<any[]> => {
    return request<any[]>("/daily-recap");
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
  getUsers: async (): Promise<any[]> => {
    return request<any[]>("/users");
  },
  getStaff: async (): Promise<any[]> => {
    return request<any[]>("/users");
  },

  updateUser: async (id: string, data: { name?: string; email?: string; role?: string; password?: string }): Promise<any> => {
    return request<any>(`/users/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  updateStaff: async (id: string, data: { name?: string; email?: string; role?: string; password?: string }): Promise<any> => {
    return request<any>(`/users/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteUser: async (id: string): Promise<any> => {
    return request<any>(`/users/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  },
  deleteStaff: async (id: string): Promise<any> => {
    return request<any>(`/users/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  },
  parseMapsUrl: async (url: string): Promise<{ success: boolean; latitude: number; longitude: number; address?: string }> => {
    return request<{ success: boolean; latitude: number; longitude: number; address?: string }>("/kitchens/parse-maps-url", {
      method: "POST",
      body: JSON.stringify({ url }),
    });
  },

  createKitchen: async (data: Omit<Kitchen, "id"> & { city?: string; staffIds?: string[] }): Promise<Kitchen> => {
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

  addKitchenStaff: async (kitchenId: string, data: { staffId?: string; name?: string; role?: string; email?: string; password?: string }): Promise<any> => {
    return request<any>(`/kitchens/${encodeURIComponent(kitchenId)}/staff`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  requestStock: async (material: string, amount: string, urgency: string, kitchenId?: string, supplierKitchenId?: string): Promise<any> => {
    return request<any>("/stock-requests", {
      method: "POST",
      body: JSON.stringify({ material, amount, urgency, kitchenId, supplierKitchenId }),
    });
  },

  requestStockBatch: async (requests: { material: string; amount: string; urgency: string; supplierKitchenId?: string }[], kitchenId?: string): Promise<any[]> => {
    return request<any[]>("/stock-requests/batch", {
      method: "POST",
      body: JSON.stringify({ requests, kitchenId }),
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

  checkStockVerificationStatus: async (kitchenId: string): Promise<{ verified: boolean }> => {
    return request<{ verified: boolean }>(`/stock-verifications/status?kitchenId=${encodeURIComponent(kitchenId)}`);
  },

  getLastCookedMenu: async (kitchenId: string): Promise<{ lastMenu: string | null; detailedIngredients: any[]; otherIngredients: any[] }> => {
    return request<{ lastMenu: string | null; detailedIngredients: any[]; otherIngredients: any[] }>(`/stock-verifications/last-cooked?kitchenId=${encodeURIComponent(kitchenId)}`);
  },

  submitStockVerification: async (data: { kitchenId: string; verifiedBy: string; items: { batchId: string; qty_packed?: number; qty_loose?: number }[] }): Promise<{ success: boolean; verificationId: string }> => {
    return request<{ success: boolean; verificationId: string }>("/stock-verifications", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
