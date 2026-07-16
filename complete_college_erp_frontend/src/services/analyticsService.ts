import api from './api';
import type { DashboardStatsResponse, AtRiskStudentResponse } from '@/types';


export const analyticsService = {
  // Get staff dashboard
  getStaffDashboard: async (staffId: number, date: string): Promise<DashboardStatsResponse> => {
    return api.get<DashboardStatsResponse>(`/analytics/dashboard/staff/${staffId}?date=${date}`);
  },

  // Get student dashboard
  getStudentDashboard: async (
    studentId: number,
    semesterId: number,
    academicSessionId: number
  ): Promise<DashboardStatsResponse> => {
    return api.get<DashboardStatsResponse>(
      `/analytics/dashboard/student/${studentId}?semesterId=${semesterId}&academicSessionId=${academicSessionId}`
    );
  },

  // Get at-risk students
  getAtRiskStudents: async (
    semesterId: number,
    academicSessionId: number
  ): Promise<AtRiskStudentResponse[]> => {
    return api.get<AtRiskStudentResponse[]>(
      `/analytics/at-risk-students?semesterId=${semesterId}&academicSessionId=${academicSessionId}`
    );
  },
};

export default analyticsService;