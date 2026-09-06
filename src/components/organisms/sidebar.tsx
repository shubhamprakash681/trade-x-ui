"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  Briefcase,
  List,
  Heart,
  Bell,
  BellDot,
  ArrowLeftRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/atoms/logo";
import { Avatar } from "@/components/atoms/avatar";
import { useAuthStore } from "@/store/auth.store";
import { useThemeStore } from "@/store/theme.store";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/markets", label: "Markets", icon: TrendingUp },
  { href: "/portfolio", label: "Portfolio", icon: Briefcase },
  { href: "/orders", label: "Orders", icon: List },
  { href: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/watchlist", label: "Watchlist", icon: Heart },
  { href: "/alerts", label: "Alerts", icon: BellDot },
  { href: "/notifications", label: "Notifications", icon: Bell },
];

export function Sidebar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const { sidebarOpen, toggleSidebar } = useThemeStore();

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-border-primary bg-bg-secondary",
          "transition-all duration-300 ease-in-out",
          "lg:relative lg:z-auto",
          sidebarOpen ? "w-64" : "w-0 lg:w-16",
          !sidebarOpen && "overflow-hidden lg:overflow-visible"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-border-primary px-4">
          <Logo showText={sidebarOpen} size="md" />
          <button
            onClick={toggleSidebar}
            className="hidden rounded-md p-1 text-text-tertiary hover:bg-bg-tertiary hover:text-text-primary lg:block"
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => {
                      // Close sidebar on mobile after clicking
                      if (window.innerWidth < 1024) {
                        toggleSidebar();
                      }
                    }}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-brand/10 text-brand"
                        : "text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
                    )}
                    title={!sidebarOpen ? item.label : undefined}
                  >
                    <item.icon className={cn("h-5 w-5 shrink-0")} />
                    {sidebarOpen && <span>{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User section */}
        {user && sidebarOpen && (
          <div className="border-t border-border-primary p-4">
            <Link
              href="/profile"
              className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-bg-tertiary transition-colors"
            >
              <Avatar
                src={user.avatarUrl}
                name={user.fullName}
                size="sm"
              />
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-text-primary">
                  {user.fullName}
                </p>
                <p className="truncate text-xs text-text-tertiary">
                  {user.email}
                </p>
              </div>
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
