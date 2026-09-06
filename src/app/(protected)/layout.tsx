"use client";

import { useAuthGuard } from "@/hooks/use-auth-guard";
import { AppShell } from "@/components/organisms/app-shell";
import { FullPageSpinner } from "@/components/atoms/spinner";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isReady, isAuthenticated } = useAuthGuard();

  if (!isReady) {
    return <FullPageSpinner />;
  }

  if (!isAuthenticated) {
    return <FullPageSpinner />;
  }

  return <AppShell>{children}</AppShell>;
}
