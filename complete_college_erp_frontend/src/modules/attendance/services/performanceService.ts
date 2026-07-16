import api from './api';
import type{ StudentDetailedPerformance } from '../types';

export const performanceService = {
  // Get detailed performance for a student
  getDetailedPerformance: async (
    studentId: number,
    semesterId: number,
    academicSessionId: number
  ): Promise<StudentDetailedPerformance> => {
    return api.get<StudentDetailedPerformance>(
      `/performance/student/${studentId}/detailed?semesterId=${semesterId}&academicSessionId=${academicSessionId}`
    );
  },

  // Get class performance
  getClassPerformance: async (
    semesterId: number,
    sectionId: number,
    academicSessionId: number
  ): Promise<StudentDetailedPerformance[]> => {
    return api.get<StudentDetailedPerformance[]>(
      `/performance/class?semesterId=${semesterId}&sectionId=${sectionId}&academicSessionId=${academicSessionId}`
    );
  },
};

export default performanceService;