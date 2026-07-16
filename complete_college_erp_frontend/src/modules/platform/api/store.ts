// src/api/store.ts
import { http } from './http';

export interface StoreItem {
  id: number;
  name: string;
  description: string;
  category: 'PHYSICAL' | 'DIGITAL' | 'PRIVILEGE' | 'POWER_UP';
  price: number;
  stock: number;
  imageUrl?: string;
  isActive: boolean;
  requiresApproval: boolean;
  cooldownHours?: number;
  metadata?: string; // JSON string for additional data
}

export interface StoreItemRequest {
  name: string;
  description: string;
  category: 'PHYSICAL' | 'DIGITAL' | 'PRIVILEGE' | 'POWER_UP';
  price: number;
  stock: number;
  imageUrl?: string;
  isActive: boolean;
  requiresApproval: boolean;
  cooldownHours?: number;
  metadata?: string;
}

export interface Purchase {
  id: number;
  itemId: number;
  itemName: string;
  itemCategory: string;
  quantity: number;
  totalPrice: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'USED';
  purchasedAt: string;
  approvedAt?: string;
  approvedByName?: string;
  rejectionReason?: string;
  redemptionCode?: string;
  expiresAt?: string;
  usedAt?: string;
}

export interface PurchaseRequest {
  itemId: number;
  quantity: number;
}

export interface PurchaseApprovalRequest {
  approved: boolean;
  rejectionReason?: string;
}

export interface CartItem {
  item: StoreItem;
  quantity: number;
}

export const storeApi = {
  // Public endpoints
  getItems: async (): Promise<StoreItem[]> => {
    const response = await http.get('/api/store/items');
    return response.data;
  },

  getItemById: async (id: number): Promise<StoreItem> => {
    const response = await http.get(`/api/store/items/${id}`);
    return response.data;
  },

  getItemsByCategory: async (category: string): Promise<StoreItem[]> => {
    const response = await http.get(`/api/store/items/category/${category}`);
    return response.data;
  },

  // Purchase endpoints
  purchaseItem: async (request: PurchaseRequest): Promise<Purchase> => {
    const response = await http.post('/api/store/purchase', request);
    return response.data;
  },

  getMyPurchases: async (): Promise<Purchase[]> => {
    const response = await http.get('/api/store/purchases/my');
    return response.data;
  },

  getPurchaseById: async (id: number): Promise<Purchase> => {
    const response = await http.get(`/api/store/purchases/${id}`);
    return response.data;
  },

  redeemItem: async (purchaseId: number): Promise<Purchase> => {
    const response = await http.post(`/api/store/purchases/${purchaseId}/redeem`);
    return response.data;
  },

  // Admin endpoints
  createItem: async (request: StoreItemRequest): Promise<StoreItem> => {
    const response = await http.post('/api/admin/store/items', request);
    return response.data;
  },

  updateItem: async (id: number, request: StoreItemRequest): Promise<StoreItem> => {
    const response = await http.put(`/api/admin/store/items/${id}`, request);
    return response.data;
  },

  deleteItem: async (id: number): Promise<void> => {
    await http.delete(`/api/admin/store/items/${id}`);
  },

  updateStock: async (id: number, stock: number): Promise<StoreItem> => {
    const response = await http.patch(`/api/admin/store/items/${id}/stock`, { stock });
    return response.data;
  },

  getAllPurchases: async (): Promise<Purchase[]> => {
    const response = await http.get('/api/admin/store/purchases');
    return response.data;
  },

  getPendingPurchases: async (): Promise<Purchase[]> => {
    const response = await http.get('/api/admin/store/purchases/pending');
    return response.data;
  },

  approvePurchase: async (id: number, request: PurchaseApprovalRequest): Promise<Purchase> => {
    const response = await http.post(`/api/admin/store/purchases/${id}/approve`, request);
    return response.data;
  },
};