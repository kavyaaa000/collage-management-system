// src/services/api.js
import axios from 'axios';
import authService from './authService';

const API_BASE_URL = 'http://localhost:8080/api/erp';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authService.logout();
    }
    return Promise.reject(error);
  }
);

// Generic CRUD operations - ADD /admin prefix
export const getAll = (endpoint) => api.get(`/admin/${endpoint}`);
export const getById = (endpoint, id) => api.get(`/admin/${endpoint}/${id}`);
export const create = (endpoint, data) => api.post(`/admin/${endpoint}`, data);
export const update = (endpoint, id, data) => api.put(`/admin/${endpoint}/${id}`, data);
export const remove = (endpoint, id) => api.delete(`/admin/${endpoint}/${id}`);

// Specific endpoints
export const getStudentJourney = (studentId) => 
  api.get(`/admin/students/${studentId}/journey`);
export const lockSession = (sessionId) => 
  api.put(`/admin/sessions/${sessionId}/lock`);
export const unlockSession = (sessionId) => 
  api.put(`/admin/sessions/${sessionId}/unlock`);

export default api;