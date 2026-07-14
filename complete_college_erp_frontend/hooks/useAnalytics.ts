import { useState, useEffect } from 'react';
import type{ DashboardStatsResponse, AtRiskStudentResponse } from '@/types';
import analyticsService from '@/services/analyticsService';

export const useStaffDashboard = (staffId: number, date: string) => {
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (staffId && date) {
      fetchDashboard();
    }
  }, [staffId, date]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await analyticsService.getStaffDashboard(staffId, date);
      setStats(data);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, error, refetch: fetchDashboard };
};

export const useAtRiskStudents = (semesterId: number, academicSessionId: number) => {
  const [students, setStudents] = useState<AtRiskStudentResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (semesterId && academicSessionId) {
      fetchAtRiskStudents();
    }
  }, [semesterId, academicSessionId]);

  const fetchAtRiskStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await analyticsService.getAtRiskStudents(semesterId, academicSessionId);
      setStudents(data);
    } catch (err) {
      setError('Failed to fetch at-risk students');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { students, loading, error, refetch: fetchAtRiskStudents };
};