import { api } from '@/app/lib/api';
import type {
  AdminUserFilters,
  AdminUserListResponse,
} from '@/app/types/admin-user';

export const adminUserService = {
  async getUsers(
    filters: AdminUserFilters,
  ): Promise<AdminUserListResponse> {
    const response = await api.get<AdminUserListResponse>('/admin/users', {
      params: filters,
    });

    return response.data;
  },
};
