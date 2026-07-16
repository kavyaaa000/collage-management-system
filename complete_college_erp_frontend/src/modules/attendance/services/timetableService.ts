import api from './api';
import type{ Timetable } from '../types';

export const timetableService = {
  // Get weekly timetable
  getWeeklyTimetable: async (semesterId: number, sectionId: number): Promise<Timetable[]> => {
    return api.get<Timetable[]>(`/timetable/week?semesterId=${semesterId}&sectionId=${sectionId}`);
  },

  // Get today's schedule for staff
  getTodaySchedule: async (staffId: number): Promise<Timetable[]> => {
    return api.get<Timetable[]>(`/timetable/today/${staffId}`);
  },

  // Get day schedule
  getDaySchedule: async (
    semesterId: number,
    sectionId: number,
    dayOfWeek: string
  ): Promise<Timetable[]> => {
    return api.get<Timetable[]>(
      `/timetable/day?semesterId=${semesterId}&sectionId=${sectionId}&dayOfWeek=${dayOfWeek}`
    );
  },
};

export default timetableService;