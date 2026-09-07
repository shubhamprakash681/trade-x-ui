"use client";

import Link from "next/link";
import { Logo } from "@/components/atoms/logo";
import { Footer } from "@/components/organisms/footer";
import { useGuestGuard } from "@/hooks/use-guest-guard";
import { FullPageSpinner } from "@/components/atoms/spinner";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { isReady } = useGuestGuard();

  if (!isReady) {
    return <FullPageSpinner />;
  }
  return (
    <div className="flex min-h-screen flex-col bg-bg-primary text-text-primary overflow-x-clip w-full min-w-0">
      <div className="flex flex-1 items-center justify-center p-4 py-12 sm:px-6 lg:px-8 w-full min-w-0">
        <div className="w-full max-w-md min-w-0">
          <div className="mb-8 flex justify-center">
            <Link href="/" aria-label="TradeX Home" className="transition-transform hover:scale-105">
              <Logo size="lg" />
            </Link>
          </div>
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
}
