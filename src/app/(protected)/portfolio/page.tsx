"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { ErrorState } from "@/components/atoms/error-state";
import { PortfolioSkeleton } from "@/components/atoms/skeleton";
import { HoldingsTable } from "@/components/portfolio/holdings-table";
import { PortfolioSummary } from "@/components/portfolio/portfolio-summary";
import { usePortfolio } from "@/hooks/use-portfolio";

export default function PortfolioPage() {
  const portfolio = usePortfolio();

  if (portfolio.isLoading) {
    return <PortfolioSkeleton />;
  }

  if (portfolio.isError || !portfolio.data) {
    return (
      <ErrorState
        title="Couldn't load your portfolio"
        description="Please check your network connection and try again."
        onRetry={() => portfolio.refetch()}
      />
    );
  }

  const { summary, holdings } = portfolio.data;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* ─── Executive Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border-primary pb-4 gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-text-primary">
            Portfolio Vault & P&L Matrix
          </h1>
          <p className="mt-1 text-xs text-text-secondary">
            Real-time mark-to-market valuations and risk allocations.
          </p>
        </div>

        <Link
          href="/markets"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border-primary bg-bg-secondary px-3.5 py-2 text-xs font-semibold text-text-primary hover:border-brand hover:text-brand transition-colors self-start sm:self-auto shadow-sm"
        >
          <span>Explore Markets</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* ─── Summary KPI Cards & Asset Allocation Breakdown Bar ───────────── */}
      <PortfolioSummary summary={summary} holdings={holdings} />

      {/* ─── Open Holdings Matrix ─────────────────────────────────────────── */}
      <div className="rounded-xl border border-border-primary bg-bg-secondary shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-border-primary px-5 py-4 bg-bg-secondary">
          <h2 className="text-xs font-bold uppercase tracking-wider text-text-primary font-sans">
            Open Holdings Matrix ({holdings.length})
          </h2>
          <span className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider font-mono">
            Live Valuations
          </span>
        </div>
        <HoldingsTable holdings={holdings} />
      </div>
    </div>
  );
}
