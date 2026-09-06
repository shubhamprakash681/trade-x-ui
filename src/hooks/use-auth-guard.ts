"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { authApi } from "@/api/auth.api";
import { getAccessToken, getRefreshToken } from "@/api/client";

export function useAuthGuard() {
  const router = useRouter();
  const { user, isAuthenticated, setAuth, setUser, setLoading, clearAuth } =
    useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function restoreSession() {
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();

      // No tokens stored — redirect to login
      if (!accessToken && !refreshToken) {
        clearAuth();
        setIsReady(true);
        router.replace("/login");
        return;
      }

      try {
        // Try fetching user with existing access token
        const userData = await authApi.getMe();
        setUser(userData);
        setLoading(false);
        setIsReady(true);
      } catch {
        // Access token expired — try refreshing
        if (refreshToken) {
          try {
            const authData = await authApi.refresh(refreshToken);
            setAuth(authData.user, authData.accessToken, authData.refreshToken);
            setIsReady(true);
          } catch {
            // Refresh also failed — force re-login
            clearAuth();
            setIsReady(true);
            router.replace("/login");
          }
        } else {
          clearAuth();
          setIsReady(true);
          router.replace("/login");
        }
      }
    }

    if (!isAuthenticated) {
      restoreSession();
    } else {
      setLoading(false);
      setIsReady(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { user, isAuthenticated, isReady };
}
