"use client";

import Link from "next/link";
import { useState } from "react";
import type { HoldingResponse } from "@/types/api.types";
import { useSellOrder } from "@/hooks/use-portfolio";
import { useLivePrices } from "@/hooks/use-live-prices";
import { useToast } from "@/components/atoms/toast";
import { formatCurrency, formatPercent, formatQuantity, cn } from "@/lib/utils";

interface HoldingsTableProps {
  holdings: HoldingResponse[];
}

export function HoldingsTable({ holdings }: HoldingsTableProps) {
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
        <p className="mt-1">Explore Markets to place your first paper trade and build your portfolio.</p>
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
            <th className="px-5 py-3.5 font-bold">Instrument</th>
            <th className="px-5 py-3.5 font-bold text-right">Shares</th>
            <th className="px-5 py-3.5 font-bold text-right">Avg. Price</th>
            <th className="px-5 py-3.5 font-bold text-right">Last / Live Price</th>
            <th className="px-5 py-3.5 font-bold text-right">Invested Value</th>
            <th className="px-5 py-3.5 font-bold text-right">Market Value</th>
            <th className="px-5 py-3.5 font-bold text-right">Unrealized P&L</th>
            <th className="px-5 py-3.5 font-bold text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-primary/50">
          {holdings.map((holding) => {
            const liveData = livePrices[holding.symbol];
            const currentPrice = liveData?.price ?? holding.lastPrice;
            const currentMarketVal = currentPrice * holding.quantity;
            const unrealizedPnl = currentMarketVal - holding.investedValue;
            const unrealizedPnlPct =
              holding.investedValue > 0 ? (unrealizedPnl / holding.investedValue) * 100 : 0;
            const isProfitable = unrealizedPnl >= 0;

            return (
              <tr key={holding.symbol} className="hover:bg-bg-tertiary/60 transition-colors">
                {/* Instrument */}
                <td className="px-5 py-4">
                  <Link
                    href={`/stocks/${encodeURIComponent(holding.symbol)}`}
                    className="font-extrabold text-sm text-text-primary hover:text-brand transition-colors"
                  >
                    {holding.symbol}
                  </Link>
                  <p className="max-w-[200px] truncate text-[11px] text-text-secondary font-sans mt-0.5">
                    {holding.stockName}
                  </p>
                </td>

                {/* Shares */}
                <td className="px-5 py-4 text-right font-medium text-text-primary tabular-nums">
                  {formatQuantity(holding.quantity)}
                </td>

                {/* Avg Price */}
                <td className="px-5 py-4 text-right text-text-secondary tabular-nums">
                  {formatCurrency(holding.averagePrice)}
                </td>

                {/* Live Price */}
                <td className="px-5 py-4 text-right font-semibold text-text-primary tabular-nums">
                  <span className="inline-flex items-center gap-1.5">
                    {liveData && <span className="h-1.5 w-1.5 rounded-full bg-profit animate-pulse" />}
                    {formatCurrency(currentPrice)}
                  </span>
                </td>

                {/* Invested Value */}
                <td className="px-5 py-4 text-right text-text-secondary tabular-nums">
                  {formatCurrency(holding.investedValue)}
                </td>

                {/* Market Value */}
                <td className="px-5 py-4 text-right font-medium text-text-primary tabular-nums">
                  {formatCurrency(currentMarketVal)}
                </td>

                {/* Unrealized P&L */}
                <td className="px-5 py-4 text-right tabular-nums">
                  <span className={cn("font-bold text-sm", isProfitable ? "text-profit" : "text-loss")}>
                    {formatCurrency(unrealizedPnl)}
                  </span>
                  <p className={cn("text-[11px] font-semibold mt-0.5", isProfitable ? "text-profit" : "text-loss")}>
                    {formatPercent(unrealizedPnlPct)}
                  </p>
                </td>

                {/* Actions */}
                <td className="px-5 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Link
                      href={`/stocks/${encodeURIComponent(holding.symbol)}`}
                      className="rounded-lg border border-border-primary bg-bg-tertiary px-3 py-1.5 text-xs font-semibold text-text-primary hover:border-brand hover:text-brand transition-colors"
                    >
                      Trade
                    </Link>
                    <button
                      type="button"
                      disabled={liquidatingSymbol === holding.symbol}
                      onClick={() => handleLiquidate(holding.symbol, holding.quantity, currentPrice)}
                      className="rounded-lg bg-loss px-3 py-1.5 text-xs font-bold text-white hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
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
