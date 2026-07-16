import api from './api';
import type{ StudentComprehensiveAnalytics, SemesterAnalytics } from '../types/enhanced';

export const studentAnalyticsService = {
  // Get comprehensive analytics
  getComprehensiveAnalytics: async (studentId: number): Promise<StudentComprehensiveAnalytics> => {
    return api.get<StudentComprehensiveAnalytics>(`/student-analytics/${studentId}/comprehensive`);
  },

  // Get semester-wise analytics
  getSemesterWiseAnalytics: async (studentId: number): Promise<SemesterAnalytics[]> => {
    return api.get<SemesterAnalytics[]>(`/student-analytics/${studentId}/semester-wise`);
  },
};

export default studentAnalyticsService;