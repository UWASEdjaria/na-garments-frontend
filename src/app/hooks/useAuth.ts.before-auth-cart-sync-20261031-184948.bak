'use client';

import { useEffect, useState } from 'react';
import { authService } from '@/app/services/auth.service';
import {
  AuthUser,
  LoginRequest,
  RegisterRequest,
} from '@/app/types/auth';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export default function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (storedToken && storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setIsLoading(false);
  }, []);

  const register = async (data: RegisterRequest) => {
    const response = await authService.register(data);

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    setUser(null);

    return response;
  };

  const login = async (data: LoginRequest) => {
    const response = await authService.login(data);

    localStorage.setItem(TOKEN_KEY, response.data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));

    setUser(response.data.user);

    return response;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  return {
    user,
    isLoading,
    isAuthenticated: Boolean(user),
    register,
    login,
    logout,
  };
}