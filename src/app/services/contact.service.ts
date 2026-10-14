import { api } from '@/app/lib/api';
import {
  ContactMessage,
  ContactMessageListResponse,
  ContactMessageSingleResponse,
  ContactMessageResponse,
  CreateContactMessageRequest,
} from '@/app/types/contact';

export const contactService = {
  createMessage: async (
    data: CreateContactMessageRequest
  ): Promise<ContactMessageResponse> => {
    const response = await api.post<ContactMessageResponse>('/contact', data);
    return response.data;
  },

  getMessages: async (): Promise<ContactMessage[]> => {
    const response = await api.get<ContactMessageListResponse>('/contact');
    return response.data.data;
  },

  getMessageById: async (id: string): Promise<ContactMessage> => {
    const response = await api.get<ContactMessageSingleResponse>(`/contact/${id}`);
    return response.data.data;
  },

  updateReadStatus: async (id: string, isRead: boolean): Promise<ContactMessage> => {
    const response = await api.patch<ContactMessageSingleResponse>(`/contact/${id}/read`, { isRead });
    return response.data.data;
  },

  deleteMessage: async (id: string): Promise<void> => {
    await api.delete(`/contact/${id}`);
  },
};