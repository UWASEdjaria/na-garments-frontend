export interface CreateContactMessageRequest {
  names: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ContactMessageResponse {
  success: boolean;
  message: string;
}

export interface ContactMessage {
  id: string;
  names: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface ContactMessageSingleResponse {
  success: boolean;
  message: string;
  data: ContactMessage;
}

export interface ContactMessageListResponse {
  success: boolean;
  message: string;
  data: ContactMessage[];
}