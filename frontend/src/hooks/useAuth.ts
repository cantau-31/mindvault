import { useMemo } from 'react';
import { authService } from '../services/authService';

export const useAuth = () => {
  const token = authService.getToken();

  return useMemo(
    () => ({
      isAuthenticated: Boolean(token),
      token,
      logout: authService.logout,
    }),
    [token],
  );
};
