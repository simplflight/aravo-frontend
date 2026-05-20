import { create } from 'zustand';
import { StorageUtil } from '../utils/storage';
import { User, TokenResponse } from '../types/auth';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  
  // Ações
  authenticate: (tokens: TokenResponse, user: User) => Promise<void>;
  setUser: (user: User) => void;
  updateToken: (newToken: string) => Promise<void>;
  logout: () => Promise<void>;
  setLoading: (status: boolean) => void;
}

/**
 * Store global de Autenticação.
 * Centraliza o estado do usuário e os tokens em memória.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: true, // Começa carregando para a Splash Screen

  authenticate: async (tokens, user) => {
    await StorageUtil.setToken(tokens.accessToken);
    await StorageUtil.setRefreshToken(tokens.refreshToken);
    
    set({ 
      user, 
      accessToken: tokens.accessToken, 
      refreshToken: tokens.refreshToken 
    });
  },

  setUser: (user) => {
    set({ user });
  },

  updateToken: async (newToken) => {
    await StorageUtil.setToken(newToken);
    set({ accessToken: newToken });
  },

  logout: async () => {
    await StorageUtil.clearTokens();
    set({ user: null, accessToken: null, refreshToken: null });
  },

  setLoading: (status) => {
    set({ isLoading: status });
  },
}));
