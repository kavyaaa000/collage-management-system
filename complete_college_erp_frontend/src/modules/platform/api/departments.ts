import { http } from './http';
import type{ Department } from '../types';

export const departmentApi= {
  getAll: async (): Promise<Department[]> => {
    const response = await http.get('/api/departments');
    return response.data;
  },

  getAllAdmin: async (): Promise<Department[]> => {
    const response = await http.get('/api/admin/departments');
    return response.data;
  },

  create: async (data: { name: string; code: string }): Promise<Department> => {
    const response = await http.post('/api/admin/departments', data);
    return response.data;
  },
};