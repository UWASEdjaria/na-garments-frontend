import { api } from '@/app/lib/api';
import {
  AuthResponse,
  AuthUser,
  ForgotPasswordRequest,
  LoginRequest,
  MessageResponse,
  RegisterRequest,
  ResetPasswordRequest,
} from '@/app/types/auth';

export const authService = {
  register: async (
    data: RegisterRequest
  ): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(
      '/auth/register',
      data
    );

    return response.data;
  },

  login: async (
    data: LoginRequest
  ): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(
      '/auth/login',
      data
    );

    return response.data;
  },

  getMe: async (): Promise<{
    success: boolean;
    data: AuthUser;
  }> => {
    const response = await api.get<{
      success: boolean;
      data: AuthUser;
    }>('/auth/me');

    return response.data;
  },

  forgotPassword: async (
    data: ForgotPasswordRequest
  ): Promise<MessageResponse> => {
    const response = await api.post<MessageResponse>(
      '/auth/forgot-password',
      data
    );

    return response.data;
  },

  resetPassword: async (
    data: ResetPasswordRequest
  ): Promise<MessageResponse> => {
    const response = await api.post<MessageResponse>(
      '/auth/reset-password',
      data
    );

    return response.data;
  },
};