import { api } from '@/app/lib/api';
import {
  AdminNotificationCountResponse,
  AdminNotificationListResponse,
} from '@/app/types/notification';

export const notificationService = {
  async getUnreadCount(): Promise<{ count: number }> {
    const response = await api.get<AdminNotificationCountResponse>(
      '/admin/notifications/unread-count'
    );
    return response.data.data;
  },

  async getNotifications(): Promise<AdminNotificationListResponse['data']> {
    const response = await api.get<AdminNotificationListResponse>(
      '/admin/notifications'
    );
    return response.data.data;
  },

  async markAsRead(id: string): Promise<void> {
    await api.patch(`/admin/notifications/${id}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await api.patch('/admin/notifications/mark-all-read');
  },
};
