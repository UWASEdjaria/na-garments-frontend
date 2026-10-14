export interface AdminNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  resourceType: string | null;
  resourceId: string | null;
  actorName: string | null;
  actorEmail: string | null;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminNotificationListResponse {
  success: boolean;
  message: string;
  data: AdminNotification[];
}

export interface AdminNotificationCountResponse {
  success: boolean;
  message: string;
  data: {
    count: number;
  };
}
