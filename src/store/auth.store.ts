import { create } from "zustand";
import type { UserResponse } from "@/types/api.types";
import { clearTokens, setTokens, getAccessToken, getRefreshToken } from "@/api/client";

interface AuthState {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setAuth: (user: UserResponse, accessToken: string, refreshToken: string) => void;
  setUser: (user: UserResponse) => void;
  setLoading: (loading: boolean) => void;
  clearAuth: () => void;
  hasStoredTokens: () => boolean;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: (user, accessToken, refreshToken) => {
    setTokens(accessToken, refreshToken);
    set({ user, isAuthenticated: true, isLoading: false });
  },

  setUser: (user) => {
    set({ user });
  },

  setLoading: (isLoading) => {
    set({ isLoading });
  },

  clearAuth: () => {
    clearTokens();
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  hasStoredTokens: () => {
    return !!getAccessToken() || !!getRefreshToken();
  },
}));
