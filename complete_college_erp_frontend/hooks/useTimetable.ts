import { useState, useEffect } from 'react';
import type{ Timetable } from '@/types';
import timetableService from '@/services/timetableService';

export const useTimetable = (semesterId?: number, sectionId?: number) => {
  const [timetable, setTimetable] = useState<Timetable[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (semesterId && sectionId) {
      fetchTimetable();
    }
  }, [semesterId, sectionId]);

  const fetchTimetable = async () => {
    if (!semesterId || !sectionId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await timetableService.getWeeklyTimetable(semesterId, sectionId);
      setTimetable(data);
    } catch (err) {
      setError('Failed to fetch timetable');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { timetable, loading, error, refetch: fetchTimetable };
};

export const useTodaySchedule = (staffId: number) => {
  const [schedule, setSchedule] = useState<Timetable[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (staffId) {
      fetchSchedule();
    }
  }, [staffId]);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await timetableService.getTodaySchedule(staffId);
      setSchedule(data);
    } catch (err) {
      setError('Failed to fetch schedule');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { schedule, loading, error, refetch: fetchSchedule };
};