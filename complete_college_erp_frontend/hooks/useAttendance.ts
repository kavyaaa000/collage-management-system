import { useState, useEffect } from 'react';
import type { AttendanceSession, StudentAttendanceResponse } from '@/types';
import attendanceService from '@/services/attendanceService';

export const useAttendance = (studentId?: number, semesterId?: number, academicSessionId?: number) => {
  const [attendance, setAttendance] = useState<StudentAttendanceResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (studentId && semesterId && academicSessionId) {
      fetchAttendance();
    }
  }, [studentId, semesterId, academicSessionId]);

  const fetchAttendance = async () => {
    if (!studentId || !semesterId || !academicSessionId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await attendanceService.getStudentAttendance(
        studentId,
        semesterId,
        academicSessionId
      );
      setAttendance(data);
    } catch (err) {
      setError('Failed to fetch attendance data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { attendance, loading, error, refetch: fetchAttendance };
};

export const useStaffSessions = (staffId: number, date: string) => {
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (staffId && date) {
      fetchSessions();
    }
  }, [staffId, date]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await attendanceService.getStaffSessions(staffId, date);
      setSessions(data);
    } catch (err) {
      setError('Failed to fetch sessions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { sessions, loading, error, refetch: fetchSessions };
};