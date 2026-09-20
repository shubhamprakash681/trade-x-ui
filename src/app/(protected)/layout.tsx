"use client";

import { useAuthGuard } from "@/hooks/use-auth-guard";
import { AppShell } from "@/components/organisms/app-shell";
import { FullPageSkeleton } from "@/components/atoms/skeleton";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isReady, isAuthenticated } = useAuthGuard();

  if (!isReady) {
    return <FullPageSkeleton />;
  }

  if (!isAuthenticated) {
    return <FullPageSkeleton />;
  }

  return <AppShell>{children}</AppShell>;
}
