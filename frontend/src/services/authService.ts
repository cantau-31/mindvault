import api from './api';
import type { AuthResponse, LoginPayload, RegisterPayload } from '../types/auth';

const TOKEN_KEY = 'mindvault_token';

const extractToken = (data: unknown): string | null => {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const maybeToken = (data as Partial<AuthResponse>).access_token;
  return typeof maybeToken === 'string' ? maybeToken : null;
};

export const authService = {
  async login(payload: LoginPayload): Promise<string> {
    const response = await api.post('/auth/login', payload);
    const token = extractToken(response.data);

    if (!token) {
      throw new Error('Invalid login response from API.');
    }

    localStorage.setItem(TOKEN_KEY, token);
    return token;
  },

  async register(payload: RegisterPayload): Promise<string> {
    const response = await api.post('/auth/register', payload);
    const token = extractToken(response.data);

    if (!token) {
      throw new Error('Invalid register response from API.');
    }

    localStorage.setItem(TOKEN_KEY, token);
    return token;
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  isAuthenticated(): boolean {
    return Boolean(localStorage.getItem(TOKEN_KEY));
  },
};
