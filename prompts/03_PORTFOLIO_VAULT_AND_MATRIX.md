# Step 3: Portfolio Vault & Risk Matrix (`/portfolio`)

Copy and paste this prompt to execute **Phase 3: Portfolio Vault & Risk Matrix**:

```markdown
# TASK: REDESIGN PORTFOLIO PAGE INTO AN EXECUTIVE WEALTH VAULT & MATRIX

## Context
You are working on `trade-x-ui`. The current portfolio page at `src/app/(protected)/portfolio/page.tsx` contains basic cards and a static table.
We need to elevate this page into an **Executive Portfolio Vault & Risk Matrix** that matches the capability shown in Screenshot 2, including:
1. 4 High-density KPI cards (Net Worth, Available Margin / Cash with % Liquidity Reserve, Invested Capital, Unrealized P&L).
2. Segmented **Asset Allocation Breakdown Bar** with interactive legend pills.
3. **Open Holdings Matrix Table** with live WebSocket price updates, real-time valuations, and row-level **Trade** and **Liquidate** actions.

---

## Deliverables & Exact Implementation

### 1. Overhaul `src/components/portfolio/portfolio-summary.tsx`
Update `src/components/portfolio/portfolio-summary.tsx`:

```tsx
"use client";

import { PieChart, ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { PortfolioSummaryResponse, HoldingResponse } from "@/types/api.types";
import { formatCurrency, formatPercent, getPnlColor, cn } from "@/lib/utils";

const ALLOCATION_COLORS = [
  "#06b6d4", // Cyan
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#6366f1", // Indigo
  "#ec4899", // Pink
  "#8b5cf6", // Violet
  "#3b82f6", // Blue
  "#f43f5e", // Coral
];

interface PortfolioSummaryProps {
  summary: PortfolioSummaryResponse;
  holdings?: HoldingResponse[];
}

export function PortfolioSummary({ summary, holdings = [] }: PortfolioSummaryProps) {
  const totalValue = summary.totalValue || 1;
  const cashPercent = ((summary.cashBalance / totalValue) * 100).toFixed(1);
  const isProfitable = summary.unrealizedPnl >= 0;

  // Calculate allocation weights
  const totalHoldingsValue = summary.holdingsValue || holdings.reduce((acc, h) => acc + h.marketValue, 0) || 1;
  const allocationItems = holdings.map((h, i) => ({
    symbol: h.symbol,
    color: ALLOCATION_COLORS[i % ALLOCATION_COLORS.length],
    percentage: Math.max(0.5, ((h.marketValue / totalHoldingsValue) * 100)),
    value: h.marketValue,
  }));

  return (
    <div className="space-y-4 font-mono">
      {/* ─── 4-Card Top KPI Bento Grid ─────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Net Worth */}
        <div className="rounded-xl border border-border-primary bg-bg-secondary p-5 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
            Portfolio Net Worth
          </span>
          <p className="text-2xl font-black text-text-primary mt-1.5 tabular-nums">
            {formatCurrency(summary.totalValue)}
          </p>
          <p className="text-xs text-text-secondary mt-2 font-sans">
            Cash + Open Equity positions
          </p>
        </div>

        {/* Card 2: Available Margin / Cash */}
        <div className="rounded-xl border border-border-primary bg-bg-secondary p-5 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
            Available Margin / Cash
          </span>
          <p className="text-2xl font-black text-text-primary mt-1.5 tabular-nums">
            {formatCurrency(summary.cashBalance)}
          </p>
          <p className="text-xs text-profit mt-2 font-semibold">
            {cashPercent}% Liquidity Reserve
          </p>
        </div>

        {/* Card 3: Invested Capital */}
        <div className="rounded-xl border border-border-primary bg-bg-secondary p-5 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
            Invested Capital
          </span>
          <p className="text-2xl font-black text-text-primary mt-1.5 tabular-nums">
            {formatCurrency(summary.investedValue)}
          </p>
          <p className="text-xs text-text-secondary mt-2">
            Market Value: {formatCurrency(summary.holdingsValue)}
          </p>
        </div>

        {/* Card 4: Unrealized P&L */}
        <div className="rounded-xl border border-border-primary bg-bg-secondary p-5 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
            Unrealized P&L
          </span>
          <p className={cn("text-2xl font-black mt-1.5 tabular-nums", isProfitable ? "text-profit" : "text-loss")}>
            {formatCurrency(summary.unrealizedPnl)}
          </p>
          <p className={cn("text-xs font-bold mt-2 tabular-nums flex items-center gap-1", isProfitable ? "text-profit" : "text-loss")}>
            {isProfitable ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {formatPercent(summary.unrealizedPnlPercent)} Return
          </p>
        </div>
      </div>

      {/* ─── Asset Allocation Visual Breakdown ──────────────────────────── */}
      {holdings.length > 0 && (
        <div className="rounded-xl border border-border-primary bg-bg-secondary p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-text-primary uppercase tracking-wider flex items-center gap-2 font-sans">
              <PieChart className="h-4 w-4 text-brand" />
              Asset Allocation Breakdown
            </span>
            <span className="text-text-secondary">
              {holdings.length} Active Positions · {formatCurrency(summary.holdingsValue)} Deployed
            </span>
          </div>

          {/* Segmented Multi-Color Bar */}
          <div className="h-3 w-full rounded-full bg-bg-tertiary flex overflow-hidden p-0.5 gap-0.5">
            {allocationItems.map((item) => (
              <div
                key={item.symbol}
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: item.color,
                }}
                title={`${item.symbol}: ${item.percentage.toFixed(1)}%`}
              />
            ))}
          </div>

          {/* Legend Items */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 pt-1 text-[11px]">
            {allocationItems.map((item) => (
              <div key={item.symbol} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="font-bold text-text-primary">{item.symbol}</span>
                <span className="text-text-secondary">({item.percentage.toFixed(1)}%)</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

---

### 2. Overhaul `src/components/portfolio/holdings-table.tsx`
Update `src/components/portfolio/holdings-table.tsx` to include live price subscriptions, Trade links, and row-level Liquidate actions:

```tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import type { HoldingResponse } from "@/types/api.types";
import { useSellOrder } from "@/hooks/use-portfolio";
import { useLivePrices } from "@/hooks/use-live-prices";
import { useToast } from "@/components/atoms/toast";
import { formatCurrency, formatPercent, formatQuantity, getPnlColor, cn } from "@/lib/utils";

interface HoldingsTableProps {
  holdings: HoldingResponse[];
}

export function HoldingsTable({ holdings }: { holdings: HoldingResponse[] }) {
  const { toast } = useToast();
  const sellMutation = useSellOrder();
  const [liquidatingSymbol, setLiquidatingSymbol] = useState<string | null>(null);

  const symbols = holdings.map((h) => h.symbol);
  const livePrices = useLivePrices(symbols);

  const handleLiquidate = async (symbol: string, quantity: number, price: number) => {
    try {
      setLiquidatingSymbol(symbol);
      await sellMutation.mutateAsync({ symbol, quantity });
      toast(
        "success",
        "Position Liquidated",
        `Liquidated ${formatQuantity(quantity)} shares of ${symbol} @ ${formatCurrency(price)}`
      );
    } catch {
      toast("error", "Liquidation Failed", `Could not liquidate position for ${symbol}.`);
    } finally {
      setLiquidatingSymbol(null);
    }
  };

  if (!holdings.length) {
    return (
      <div className="py-16 text-center text-sm text-text-secondary font-sans">
        <p className="text-base font-semibold text-text-primary">No active holdings</p>
        <p className="mt-1">Explore Markets to place your first trade and start building your portfolio.</p>
        <Link
          href="/markets"
          className="mt-4 inline-flex items-center justify-center rounded-lg bg-brand px-4 py-2 text-xs font-bold text-white hover:bg-brand-hover transition-colors"
        >
          Explore Markets
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[920px] text-left text-xs font-mono select-none">
        <thead className="border-b border-border-primary text-[11px] uppercase tracking-wider text-text-tertiary">
          <tr>
            <th className="px-4 py-3 font-bold">Instrument</th>
            <th className="px-4 py-3 font-bold text-right">Shares</th>
            <th className="px-4 py-3 font-bold text-right">Avg. Price</th>
            <th className="px-4 py-3 font-bold text-right">Last / Live Price</th>
            <th className="px-4 py-3 font-bold text-right">Invested Value</th>
            <th className="px-4 py-3 font-bold text-right">Market Value</th>
            <th className="px-4 py-3 font-bold text-right">Unrealized P&L</th>
            <th className="px-4 py-3 font-bold text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-primary/50">
          {holdings.map((holding) => {
            const liveData = livePrices[holding.symbol];
            const currentPrice = liveData?.price ?? holding.lastPrice;
            const currentMarketVal = currentPrice * holding.quantity;
            const unrealizedPnl = currentMarketVal - holding.investedValue;
            const unrealizedPnlPct = holding.investedValue > 0 ? (unrealizedPnl / holding.investedValue) * 100 : 0;
            const isProfitable = unrealizedPnl >= 0;

            return (
              <tr key={holding.symbol} className="hover:bg-bg-tertiary/60 transition-colors">
                {/* Instrument */}
                <td className="px-4 py-3.5">
                  <Link
                    href={`/stocks/${encodeURIComponent(holding.symbol)}`}
                    className="font-extrabold text-sm text-text-primary hover:text-brand transition-colors"
                  >
                    {holding.symbol}
                  </Link>
                  <p className="max-w-[180px] truncate text-[11px] text-text-secondary font-sans mt-0.5">
                    {holding.stockName}
                  </p>
                </td>

                {/* Shares */}
                <td className="px-4 py-3.5 text-right font-medium text-text-primary tabular-nums">
                  {formatQuantity(holding.quantity)}
                </td>

                {/* Avg Price */}
                <td className="px-4 py-3.5 text-right text-text-secondary tabular-nums">
                  {formatCurrency(holding.averagePrice)}
                </td>

                {/* Live Price */}
                <td className="px-4 py-3.5 text-right font-semibold text-text-primary tabular-nums">
                  <span className="inline-flex items-center gap-1.5">
                    {liveData && <span className="h-1.5 w-1.5 rounded-full bg-profit animate-pulse" />}
                    {formatCurrency(currentPrice)}
                  </span>
                </td>

                {/* Invested Value */}
                <td className="px-4 py-3.5 text-right text-text-secondary tabular-nums">
                  {formatCurrency(holding.investedValue)}
                </td>

                {/* Market Value */}
                <td className="px-4 py-3.5 text-right font-medium text-text-primary tabular-nums">
                  {formatCurrency(currentMarketVal)}
                </td>

                {/* Unrealized P&L */}
                <td className="px-4 py-3.5 text-right tabular-nums">
                  <span className={cn("font-bold", isProfitable ? "text-profit" : "text-loss")}>
                    {formatCurrency(unrealizedPnl)}
                  </span>
                  <p className={cn("text-[11px] font-semibold mt-0.5", isProfitable ? "text-profit" : "text-loss")}>
                    {formatPercent(unrealizedPnlPct)}
                  </p>
                </td>

                {/* Actions */}
                <td className="px-4 py-3.5 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Link
                      href={`/stocks/${encodeURIComponent(holding.symbol)}`}
                      className="rounded border border-border-primary bg-bg-tertiary px-2.5 py-1 text-xs font-semibold text-text-primary hover:border-brand hover:text-brand transition-colors"
                    >
                      Trade
                    </Link>
                    <button
                      type="button"
                      disabled={liquidatingSymbol === holding.symbol}
                      onClick={() => handleLiquidate(holding.symbol, holding.quantity, currentPrice)}
                      className="rounded bg-loss px-2.5 py-1 text-xs font-bold text-white hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
                    >
                      {liquidatingSymbol === holding.symbol ? "Selling..." : "Liquidate"}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
```

---

### 3. Update `src/app/(protected)/portfolio/page.tsx`
Update `src/app/(protected)/portfolio/page.tsx`:

```tsx
"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { ErrorState } from "@/components/atoms/error-state";
import { Spinner } from "@/components/atoms/spinner";
import { HoldingsTable } from "@/components/portfolio/holdings-table";
import { PortfolioSummary } from "@/components/portfolio/portfolio-summary";
import { usePortfolio } from "@/hooks/use-portfolio";

export default function PortfolioPage() {
  const portfolio = usePortfolio();

  if (portfolio.isLoading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
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
      {/* Executive Header */}
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
          className="inline-flex items-center gap-1.5 rounded-lg border border-border-primary bg-bg-secondary px-3 py-1.5 text-xs font-semibold text-text-primary hover:border-brand hover:text-brand transition-colors self-start sm:self-auto"
        >
          <span>Explore Markets</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Summary KPI Cards & Asset Allocation Bar */}
      <PortfolioSummary summary={summary} holdings={holdings} />

      {/* Holdings Matrix */}
      <div className="rounded-xl border border-border-primary bg-bg-secondary shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-border-primary px-5 py-3.5 bg-bg-secondary">
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
```

---

### 4. Verification
Run test suite and type check:
```bash
npm run test
```
```

