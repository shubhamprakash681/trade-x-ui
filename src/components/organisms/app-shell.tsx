"use client";

import type { ReactNode } from "react";
import { Sidebar } from "@/components/organisms/sidebar";
import { Navbar } from "@/components/organisms/navbar";
import { useThemeStore } from "@/store/theme.store";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const sidebarOpen = useThemeStore((s) => s.sidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden bg-bg-primary">
      <Sidebar />
      <div
        className={cn(
          "flex flex-1 flex-col overflow-hidden transition-all duration-300",
          sidebarOpen ? "lg:ml-0" : "lg:ml-0"
        )}
      >
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
