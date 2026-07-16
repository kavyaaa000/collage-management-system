import api from './api';
import type{ Notification, SendNotificationRequest } from '@/types';

export const notificationService = {
  // Send notification
  sendNotification: async (request: SendNotificationRequest): Promise<void> => {
    return api.post<void>('/notifications/send', request);
  },

  // Get student notifications
  getStudentNotifications: async (
    studentId: number,
    sectionId: number,
    semesterId: number
  ): Promise<Notification[]> => {
    return api.get<Notification[]>(
      `/notifications/student/${studentId}?sectionId=${sectionId}&semesterId=${semesterId}`
    );
  },

  // Get unread count
  getUnreadCount: async (
    studentId: number,
    sectionId: number,
    semesterId: number
  ): Promise<number> => {
    return api.get<number>(
      `/notifications/student/${studentId}/unread-count?sectionId=${sectionId}&semesterId=${semesterId}`
    );
  },

  // Mark as read
  markAsRead: async (notificationId: number): Promise<void> => {
    return api.put<void>(`/notifications/${notificationId}/mark-read`);
  },
};

export default notificationService;