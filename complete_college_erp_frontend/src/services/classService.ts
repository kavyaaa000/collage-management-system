import api from './api';
import type { ClassInfo, ClassAnalytics } from '@/types/enhanced';

export const classService = {
  // Get staff classes
  getStaffClasses: async (staffId: number): Promise<ClassInfo[]> => {
    return api.get<ClassInfo[]>(`/class/staff/${staffId}/classes`);
  },

  // Get all classes (for HOD)
  getAllClasses: async (): Promise<ClassInfo[]> => {
    return api.get<ClassInfo[]>('/class/all');
  },

  // Get class analytics
  getClassAnalytics: async (classId: number, academicSessionId: number = 25): Promise<ClassAnalytics> => {
    return api.get<ClassAnalytics>(`/class/${classId}/analytics?academicSessionId=${academicSessionId}`);
  },
};

export default classService;