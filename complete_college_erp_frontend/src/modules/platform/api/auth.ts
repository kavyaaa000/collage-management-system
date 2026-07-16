import { http } from './http';
import type { LoginRequest, RegisterRequest, AuthResponse } from '../types';

export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await http.post('/api/auth/login', credentials);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await http.post('/api/auth/register', data);
    return response.data;
  },

  me: async (): Promise<AuthResponse> => {
    const response = await http.get('/api/auth/me');
    return response.data;
  },
};