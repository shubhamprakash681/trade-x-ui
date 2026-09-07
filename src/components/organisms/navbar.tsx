"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  Moon,
  Sun,
  Monitor,
  LogOut,
  User,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/atoms/avatar";
import { useAuthStore } from "@/store/auth.store";
import { useThemeStore } from "@/store/theme.store";
import { authApi } from "@/api/auth.api";
import { getRefreshToken } from "@/api/client";
import { useQueryClient } from "@tanstack/react-query";
import { useUnreadNotificationCount } from "@/hooks/use-notification-features";

const themeOptions = [
  { value: "light" as const, icon: Sun, label: "Light" },
  { value: "dark" as const, icon: Moon, label: "Dark" },
  { value: "system" as const, icon: Monitor, label: "System" },
];

export function Navbar() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const { theme, setTheme, toggleSidebar } = useThemeStore();
  const unreadCount = useUnreadNotificationCount();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close user menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleLogout() {
    try {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch {
      // Logout should always proceed regardless of API errors
    } finally {
      clearAuth();
      queryClient.clear();
      router.push("/login");
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border-primary bg-bg-secondary/80 px-4 backdrop-blur-sm">
      {/* Left section */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="rounded-md p-2 text-text-secondary hover:bg-bg-tertiary hover:text-text-primary lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <button
          onClick={() => router.push("/notifications")}
          className="relative rounded-md p-2 text-text-secondary hover:bg-bg-tertiary hover:text-text-primary transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {!!unreadCount.data?.count && (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-loss px-1 text-[10px] font-bold text-white">
              {unreadCount.data.count > 99 ? "99+" : unreadCount.data.count}
            </span>
          )}
        </button>

        {/* Theme toggle */}
        <div className="flex items-center rounded-lg border border-border-primary bg-bg-primary p-0.5">
          {themeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTheme(opt.value)}
              className={cn(
                "rounded-md p-1.5 transition-colors",
                theme === opt.value
                  ? "bg-brand text-white"
                  : "text-text-tertiary hover:text-text-primary"
              )}
              title={opt.label}
              aria-label={`Switch to ${opt.label} mode`}
            >
              <opt.icon className="h-4 w-4" />
            </button>
          ))}
        </div>

        {/* User menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-bg-tertiary transition-colors"
            aria-label="User menu"
          >
            <Avatar
              src={user?.avatarUrl}
              name={user?.fullName}
              size="sm"
            />
          </button>

          {/* Dropdown */}
          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border-primary bg-bg-elevated p-2 shadow-xl">
              <div className="mb-2 border-b border-border-primary px-3 pb-2">
                <p className="text-sm font-medium text-text-primary">
                  {user?.fullName}
                </p>
                <p className="text-xs text-text-tertiary">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  router.push("/profile");
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-secondary hover:bg-bg-tertiary hover:text-text-primary transition-colors"
              >
                <User className="h-4 w-4" />
                Profile
              </button>
              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  handleLogout();
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-loss hover:bg-loss-bg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
