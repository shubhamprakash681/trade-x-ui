"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { authApi } from "@/api/auth.api";
import { getAccessToken, getRefreshToken } from "@/api/client";

/**
 * Hook to guard auth routes (/login, /register, /forgot-password).
 * If a valid token is present in local storage or the user is already authenticated,
 * the user is redirected to /dashboard and the auth route does not open.
 * If no token is present (or token verification fails), access to the auth route is allowed.
 */
export function useGuestGuard() {
  const router = useRouter();
  const { isAuthenticated, restoreAuth, clearAuth } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // 1. If already authenticated in memory, redirect to dashboard immediately
    if (isAuthenticated) {
      router.replace("/dashboard");
      return;
    }

    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();

    // 2. If no tokens exist in local storage, allow guest access immediately
    if (!accessToken && !refreshToken) {
      setIsReady(true);
      return;
    }

    // 3. Tokens exist in local storage — verify if they are valid
    let isCancelled = false;

    async function validateSession() {
      try {
        const userData = await authApi.getMe();
        if (isCancelled) return;
        restoreAuth(userData);
        router.replace("/dashboard");
      } catch {
        if (isCancelled) return;
        // Invalid or expired tokens: clear them and allow auth route to open
        clearAuth();
        setIsReady(true);
      }
    }

    void validateSession();

    return () => {
      isCancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return { isReady };
}
