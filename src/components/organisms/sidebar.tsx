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
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={toggleSidebar} aria-hidden="true" />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-dvh flex-col border-r border-border-primary bg-bg-secondary select-none",
          "transition-all duration-300 ease-in-out",
          "lg:sticky lg:top-0 lg:z-30 shrink-0 lg:overflow-visible",
          sidebarOpen ? "w-64" : "w-0 lg:w-16",
          !sidebarOpen && "overflow-hidden lg:overflow-visible",
        )}
      >
        {/* Interactive right border trigger line */}
        <div
          onClick={toggleSidebar}
          className="hidden lg:block absolute right-0 top-0 bottom-0 w-2.5 translate-x-1/2 cursor-pointer z-30 group"
          title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          aria-hidden="true"
        >
          <div className="h-full w-0.5 mx-auto transition-colors group-hover:bg-brand" />
        </div>

        {/* Center toggle button positioned on the right border */}
        <button
          onClick={toggleSidebar}
          className={cn(
            "hidden lg:flex absolute right-0 translate-x-1/2 top-1/2 -translate-y-1/2 z-40",
            "h-7 w-7 items-center justify-center rounded-full",
            "border border-border-primary bg-bg-elevated shadow-md",
            "text-text-secondary hover:text-brand hover:border-brand hover:scale-110",
            "transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand",
          )}
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>

        {/* Logo */}
        <div
          className={cn(
            "flex h-16 items-center border-b border-border-primary",
            sidebarOpen ? "justify-start px-4" : "justify-center px-0",
          )}
        >
          <Link href="/dashboard" className="flex items-center">
            <Logo showText={sidebarOpen} size="md" />
          </Link>
        </div>

        {/* Navigation */}
        <nav aria-label="Primary navigation" className="flex-1 overflow-y-auto px-2 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

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
                      "flex items-center rounded-lg py-2.5 text-sm font-medium transition-colors",
                      sidebarOpen ? "gap-3 px-3" : "justify-center px-0",
                      isActive
                        ? "bg-brand/10 text-brand"
                        : "text-text-secondary hover:bg-bg-tertiary hover:text-text-primary",
                    )}
                    title={!sidebarOpen ? item.label : undefined}
                  >
                    <item.icon className={cn("h-5 w-5 shrink-0")} />
                    {sidebarOpen && <span className="truncate">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User section */}
        {user && (
          <div className={cn("border-t border-border-primary", sidebarOpen ? "p-4" : "p-2 flex justify-center")}>
            <Link
              href="/profile"
              className={cn(
                "flex items-center rounded-lg hover:bg-bg-tertiary transition-colors",
                sidebarOpen ? "gap-3 px-2 py-2" : "p-2 justify-center",
              )}
              title={!sidebarOpen ? user.fullName : undefined}
            >
              <Avatar src={user.avatarUrl} name={user.fullName} size="sm" />
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-text-primary">{user.fullName}</p>
                  <p className="truncate text-xs text-text-tertiary">{user.email}</p>
                </div>
              )}
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
