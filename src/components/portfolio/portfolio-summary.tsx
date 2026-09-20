"use client";

import { PieChart, ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { PortfolioSummaryResponse, HoldingResponse } from "@/types/api.types";
import { formatCurrency, formatPercent, cn } from "@/lib/utils";

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
  const totalHoldingsValue =
    summary.holdingsValue || holdings.reduce((acc, h) => acc + h.marketValue, 0) || 1;

  const allocationItems = holdings.map((h, i) => {
    const rawPct = (h.marketValue / totalHoldingsValue) * 100;
    return {
      symbol: h.symbol,
      color: ALLOCATION_COLORS[i % ALLOCATION_COLORS.length],
      percentage: Math.max(0.5, rawPct),
      displayPct: rawPct.toFixed(1),
      value: h.marketValue,
    };
  });

  return (
    <div className="space-y-4 font-mono select-none">
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
          <p
            className={cn(
              "text-2xl font-black mt-1.5 tabular-nums",
              isProfitable ? "text-profit" : "text-loss"
            )}
          >
            {formatCurrency(summary.unrealizedPnl)}
          </p>
          <p
            className={cn(
              "text-xs font-bold mt-2 tabular-nums flex items-center gap-1",
              isProfitable ? "text-profit" : "text-loss"
            )}
          >
            {isProfitable ? (
              <ArrowUpRight className="h-3.5 w-3.5" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5" />
            )}
            {formatPercent(summary.unrealizedPnlPercent)} Return
          </p>
        </div>
      </div>

      {/* ─── Asset Allocation Visual Breakdown ──────────────────────────── */}
      {holdings.length > 0 && (
        <div className="rounded-xl border border-border-primary bg-bg-secondary p-5 shadow-sm space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-bold text-text-primary uppercase tracking-wider flex items-center gap-2 font-sans">
              <PieChart className="h-4 w-4 text-brand" />
              Asset Allocation Breakdown
            </span>
            <span className="text-text-secondary">
              {holdings.length} Active Positions · {formatCurrency(summary.holdingsValue)} Deployed
            </span>
          </div>

          {/* Segmented Multi-Color Bar */}
          <div className="h-3 w-full rounded-full bg-bg-tertiary flex overflow-hidden p-0.5 gap-0.5 border border-border-primary/60">
            {allocationItems.map((item) => (
              <div
                key={item.symbol}
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: item.color,
                }}
                title={`${item.symbol}: ${item.displayPct}%`}
              />
            ))}
          </div>

          {/* Legend Items */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 pt-1 text-[11px]">
            {allocationItems.map((item) => (
              <div key={item.symbol} className="flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-bold text-text-primary">{item.symbol}</span>
                <span className="text-text-secondary">({item.displayPct}%)</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
