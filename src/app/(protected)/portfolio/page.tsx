"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { ErrorState } from "@/components/atoms/error-state";
import { Spinner } from "@/components/atoms/spinner";
import { HoldingsTable } from "@/components/portfolio/holdings-table";
import { PortfolioSummary } from "@/components/portfolio/portfolio-summary";
import { usePortfolio } from "@/hooks/use-portfolio";

export default function PortfolioPage() {
  const portfolio = usePortfolio();
  if (portfolio.isLoading) return <div className="flex min-h-64 items-center justify-center"><Spinner size="lg" /></div>;
  if (portfolio.isError || !portfolio.data) return <ErrorState title="Couldn't load your portfolio" description="Please try again in a moment." onRetry={() => portfolio.refetch()} />;
  return <div className="mx-auto max-w-7xl space-y-6"><div><h1 className="text-3xl font-bold text-text-primary">Portfolio</h1><p className="mt-1 text-text-secondary">Your paper-trading value and backend-calculated performance.</p></div><PortfolioSummary summary={portfolio.data.summary} /><Card className="p-0"><CardHeader className="mb-0 border-b border-border-primary px-5 py-4"><CardTitle>Holdings</CardTitle></CardHeader><CardContent><HoldingsTable holdings={portfolio.data.holdings} /></CardContent></Card></div>;
}
