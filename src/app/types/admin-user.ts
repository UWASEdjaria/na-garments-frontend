export type AdminUserRole = 'CUSTOMER' | 'ADMIN';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: AdminUserRole;
  isEmailVerified: boolean;
  createdAt: string;
  orderCount: number;
  customOrderCount: number;
  paidOrderSpend: number;
}

export interface AdminUserSummary {
  totalUsers: number;
  customerCount: number;
  adminCount: number;
  verifiedCount: number;
  unverifiedCount: number;
}

export interface AdminUserListResponse {
  success: boolean;
  message: string;
  data: AdminUser[];
  summary: AdminUserSummary;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface AdminUserFilters {
  search: string;
  role: 'ALL' | AdminUserRole;
  verified: 'ALL' | 'true' | 'false';
  page: number;
  pageSize: number;
}
