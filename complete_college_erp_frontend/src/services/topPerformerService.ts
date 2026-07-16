import api from './api';
import type{ TopPerformer } from '@/types/enhanced';

export const topPerformerService = {
  // Get top performers for class
  getTopPerformers: async (
    classId: number,
    semesterId: number,
    academicSessionId: number = 25
  ): Promise<TopPerformer[]> => {
    return api.get<TopPerformer[]>(
      `/top-performers/class/${classId}?semesterId=${semesterId}&academicSessionId=${academicSessionId}`
    );
  },

  // Get top performers by category
  getTopPerformersByCategory: async (classId: number, category: string): Promise<TopPerformer[]> => {
    return api.get<TopPerformer[]>(`/top-performers/class/${classId}/category/${category}`);
  },
};

export default topPerformerService;