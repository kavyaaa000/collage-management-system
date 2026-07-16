import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import NotificationPanel from './NotificationPanel';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import notificationService from '@/services/notificationService';

const NotificationBell: React.FC = () => {
  const [showPanel, setShowPanel] = useState(false);
  const user = useAuthStore((state) => state.user);
  const { unreadCount, setUnreadCount, setNotifications } = useNotificationStore();

  useEffect(() => {
    if (user && user.userType === 'STUDENT') {
      loadNotifications();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadNotifications = async () => {
    if (!user || user.userType !== 'STUDENT') return;

    try {
      const [notifications, count] = await Promise.all([
        notificationService.getStudentNotifications(
          user.referenceId,
          user.sectionId || 1,
          user.semesterId || 1
        ),
        notificationService.getUnreadCount(
          user.referenceId,
          user.sectionId || 1,
          user.semesterId || 1
        ),
      ]);

      setNotifications(notifications);
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  if (user?.userType !== 'STUDENT') {
    return null;
  }

  return (
    <>
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowPanel(!showPanel)}
          className="relative"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </div>

      <NotificationPanel
        isOpen={showPanel}
        onClose={() => setShowPanel(false)}
        onRefresh={loadNotifications}
      />
    </>
  );
};

export default NotificationBell;