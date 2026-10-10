import { api } from '@/app/lib/api';
import {
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
};