"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { useAuthStore } from "@/store/auth.store";

export function CtaBanner() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <section className="py-16 bg-bg-secondary/60 border-t border-border-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-brand/30 bg-gradient-to-br from-brand/20 via-brand-accent/15 to-brand-secondary/20 p-5 sm:p-10 lg:p-14 text-center shadow-xl min-w-0">
          {/* Subtle glowing orb */}
          <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-brand/30 blur-3xl" />

          <div className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-bg-primary/80 px-3 py-1 text-xs font-semibold text-brand mb-4 sm:mb-6 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">Instant Virtual Capital Access</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary tracking-tight max-w-2xl mx-auto leading-tight break-words">
            Ready to Build Your Edge in the Stock Market?
          </h2>

          <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg text-text-secondary max-w-xl mx-auto">
            Trade simulated stocks with ₹10,00,000 in virtual cash. No real money required, no credit card, no KYC.
          </p>

          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full">
            <Link href={isAuthenticated ? "/dashboard" : "/register"} className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="primary"
                className="w-full sm:w-auto px-6 sm:px-8 gap-2 shadow-lg shadow-brand/20 justify-center"
              >
                <span>{isAuthenticated ? "Go to Dashboard" : "Start Paper Trading Free"}</span>
                <ArrowRight className="h-4 w-4 shrink-0" />
              </Button>
            </Link>

            <Link href="/about" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto px-6 sm:px-8 justify-center">
                Learn More About TradeX
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
