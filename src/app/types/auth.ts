export type UserRole = 'CUSTOMER' | 'ADMIN';

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string | null;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: AuthUser;
  };
}
  export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface MessageResponse {
  success: boolean;
  message: string;
}

export interface GetMeResponse {
  success: boolean;
  data: AuthUser;
}