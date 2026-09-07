"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { authApi } from "@/api/auth.api";
import { getAccessToken, getRefreshToken } from "@/api/client";

export function useAuthGuard() {
  const router = useRouter();
  const { user, isAuthenticated, restoreAuth, clearAuth } = useAuthStore();
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
        restoreAuth(userData);
        setIsReady(true);
      } catch {
        // The API client attempts a refresh before this request rejects.
        clearAuth();
        setIsReady(true);
        router.replace("/login");
      }
    }

    const handleUnauthorized = () => {
      clearAuth();
      setIsReady(true);
      router.replace("/login");
    };

    window.addEventListener("tradex:unauthorized", handleUnauthorized);
    void Promise.resolve().then(restoreSession);

    return () => window.removeEventListener("tradex:unauthorized", handleUnauthorized);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { user, isAuthenticated, isReady };
}
