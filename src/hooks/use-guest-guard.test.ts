import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, beforeEach, vi } from "vitest";
import { useGuestGuard } from "@/hooks/use-guest-guard";
import { useAuthStore } from "@/store/auth.store";
import { authApi } from "@/api/auth.api";
import * as client from "@/api/client";

// Mock next/navigation
const mockReplace = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
    push: vi.fn(),
  }),
}));

// Mock authApi
vi.mock("@/api/auth.api", () => ({
  authApi: {
    getMe: vi.fn(),
  },
}));

describe("useGuestGuard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  });

  it("allows access (isReady = true) when no tokens are present in local storage", async () => {
    vi.spyOn(client, "getAccessToken").mockReturnValue(null);
    vi.spyOn(client, "getRefreshToken").mockReturnValue(null);

    const { result } = renderHook(() => useGuestGuard());

    await waitFor(() => {
      expect(result.current.isReady).toBe(true);
    });

    expect(mockReplace).not.toHaveBeenCalled();
    expect(authApi.getMe).not.toHaveBeenCalled();
  });

  it("redirects to /dashboard immediately if already authenticated in memory", async () => {
    useAuthStore.setState({
      user: {
        id: 1,
        email: "shubham@example.com",
        fullName: "Shubham Prakash",
        avatarUrl: null,
        roles: ["ROLE_USER"],
        createdAt: "2026-01-01T00:00:00Z",
      },
      isAuthenticated: true,
      isLoading: false,
    });

    const { result } = renderHook(() => useGuestGuard());

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/dashboard");
    });

    expect(result.current.isReady).toBe(false);
    expect(authApi.getMe).not.toHaveBeenCalled();
  });

  it("redirects to /dashboard and restores user if valid token exists in local storage", async () => {
    vi.spyOn(client, "getAccessToken").mockReturnValue("valid-access-token");
    vi.spyOn(client, "getRefreshToken").mockReturnValue("valid-refresh-token");

    const mockUser = {
      id: 1,
      email: "shubham@example.com",
      fullName: "Shubham Prakash",
      avatarUrl: null,
      roles: ["ROLE_USER"],
      createdAt: "2026-01-01T00:00:00Z",
    };
    vi.mocked(authApi.getMe).mockResolvedValueOnce(mockUser);

    const { result } = renderHook(() => useGuestGuard());

    await waitFor(() => {
      expect(authApi.getMe).toHaveBeenCalled();
      expect(mockReplace).toHaveBeenCalledWith("/dashboard");
    });

    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().user).toEqual(mockUser);
    expect(result.current.isReady).toBe(false);
  });

  it("clears tokens and allows access (isReady = true) if token verification fails", async () => {
    vi.spyOn(client, "getAccessToken").mockReturnValue("expired-access-token");
    vi.spyOn(client, "getRefreshToken").mockReturnValue("expired-refresh-token");
    const clearTokensSpy = vi.spyOn(client, "clearTokens");

    vi.mocked(authApi.getMe).mockRejectedValueOnce(new Error("Unauthorized"));

    const { result } = renderHook(() => useGuestGuard());

    await waitFor(() => {
      expect(authApi.getMe).toHaveBeenCalled();
      expect(result.current.isReady).toBe(true);
    });

    expect(mockReplace).not.toHaveBeenCalled();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(clearTokensSpy).toHaveBeenCalled();
  });
});
