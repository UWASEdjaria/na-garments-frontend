'use client';

import { useEffect, useState } from 'react';
import { authService } from '@/app/services/auth.service';
import { cartService } from '@/app/services/cart.service';
import {
  AuthUser,
  LoginRequest,
  RegisterRequest,
} from '@/app/types/auth';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

function readStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;

  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (!token || !storedUser) return null;

    return JSON.parse(storedUser) as AuthUser;
  } catch {
    return null;
  }
}

function notifyAuthUpdated(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('auth_updated'));
  }
}

export default function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const syncAuthState = () => {
      setUser(readStoredUser());
      setIsLoading(false);
    };

    syncAuthState();

    window.addEventListener('auth_updated', syncAuthState);
    window.addEventListener('storage', syncAuthState);

    return () => {
      window.removeEventListener('auth_updated', syncAuthState);
      window.removeEventListener('storage', syncAuthState);
    };
  }, []);

  const register = async (data: RegisterRequest) => {
    const response = await authService.register(data);

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    setUser(null);
    notifyAuthUpdated();

    return response;
  };

  const login = async (data: LoginRequest) => {
    const response = await authService.login(data);

    localStorage.setItem(TOKEN_KEY, response.data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));

    if (response.data.user.role === 'CUSTOMER') {
      try {
        await cartService.mergeGuestCart();
      } catch (error) {
        console.error('Guest cart merge failed; guest items were retained:', error);
      }
    }
    setUser(response.data.user);
    notifyAuthUpdated();

    return response;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    setUser(null);
    notifyAuthUpdated();
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