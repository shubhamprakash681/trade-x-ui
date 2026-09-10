"use client";

import { useMemo } from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useStocks } from "@/hooks/use-stocks";
import { useLivePrices } from "@/hooks/use-live-prices";
import { pricesApi } from "@/api/prices.api";
import { formatCurrency, formatPercent } from "@/lib/utils";
import type { PriceResponse } from "@/types/api.types";

interface FallbackTickerItem {
  symbol: string;
  name: string;
  price: number;
  changeAmount: number;
  changePercent: number;
  type: "INDEX" | "EQUITY" | "ETF";
}

const FALLBACK_TICKER_DATA: FallbackTickerItem[] = [
  {
    symbol: "RELIANCE",
    name: "Reliance Industries Limited",
    price: 2940.1,
    changeAmount: 68.2,
    changePercent: 2.34,
    type: "EQUITY",
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy Services Limited",
    price: 3890.7,
    changeAmount: 45.6,
    changePercent: 1.12,
    type: "EQUITY",
  },
  {
    symbol: "INFY",
    name: "Infosys Limited",
    price: 1525.35,
    changeAmount: -12.4,
    changePercent: -0.67,
    type: "EQUITY",
  },
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank Limited",
    price: 1695.4,
    changeAmount: 18.75,
    changePercent: 1.15,
    type: "EQUITY",
  },
  {
    symbol: "ICICIBANK",
    name: "ICICI Bank Limited",
    price: 1120.25,
    changeAmount: 11.3,
    changePercent: 0.94,
    type: "EQUITY",
  },
  {
    symbol: "SBIN",
    name: "State Bank of India",
    price: 835.8,
    changeAmount: 9.4,
    changePercent: 1.14,
    type: "EQUITY",
  },
  {
    symbol: "BHARTIARTL",
    name: "Bharti Airtel Limited",
    price: 1418.75,
    changeAmount: 22.5,
    changePercent: 1.61,
    type: "EQUITY",
  },
  {
    symbol: "NIFTYBEES",
    name: "Nippon India ETF Nifty 50 BeES",
    price: 275.5,
    changeAmount: 2.1,
    changePercent: 0.77,
    type: "ETF",
  },
];

export function MarketTicker() {
  const stocksQuery = useStocks(0, 8);
  const latestPricesQuery = useQuery({
    queryKey: ["prices", "latest"],
    queryFn: pricesApi.getLatestPrices,
    staleTime: 30_000,
  });

  const initialPricesMap = useMemo(() => {
    const map: Record<string, PriceResponse> = {};
    if (latestPricesQuery.data) {
      for (const p of latestPricesQuery.data) {
        map[p.symbol.toUpperCase()] = p;
      }
    }
    return map;
  }, [latestPricesQuery.data]);

  const hasDynamicStocks = Boolean(stocksQuery.data?.content && stocksQuery.data.content.length > 0);

  const symbols = useMemo(() => {
    if (hasDynamicStocks && stocksQuery.data) {
      return stocksQuery.data.content.map((s) => s.symbol);
    }
    return FALLBACK_TICKER_DATA.map((t) => t.symbol);
  }, [hasDynamicStocks, stocksQuery.data]);

  const livePrices = useLivePrices(symbols);

  const items = useMemo(() => {
    if (hasDynamicStocks && stocksQuery.data) {
      return stocksQuery.data.content.map((stock) => {
        const sym = stock.symbol.toUpperCase();
        const live = livePrices[sym] ?? initialPricesMap[sym];
        const price = live?.price ?? stock.referencePrice;
        const changeAmount = live?.changeAmount ?? 0;
        const changePercent = live?.changePercent ?? 0;
        const isPositive = changeAmount >= 0;
        const typeBadge = stock.sector === "ETF" ? "ETF" : "EQUITY";

        return {
          symbol: stock.symbol,
          name: stock.name,
          price: formatCurrency(price),
          change: `${changeAmount >= 0 ? "+" : ""}${changeAmount.toFixed(2)}`,
          percent: formatPercent(changePercent),
          isPositive,
          type: typeBadge,
        };
      });
    }

    return FALLBACK_TICKER_DATA.map((fallback) => {
      const sym = fallback.symbol.toUpperCase();
      const live = livePrices[sym] ?? initialPricesMap[sym];
      const price = live?.price ?? fallback.price;
      const changeAmount = live?.changeAmount ?? fallback.changeAmount;
      const changePercent = live?.changePercent ?? fallback.changePercent;
      const isPositive = changeAmount >= 0;

      return {
        symbol: fallback.symbol,
        name: fallback.name,
        price: formatCurrency(price),
        change: `${changeAmount >= 0 ? "+" : ""}${changeAmount.toFixed(2)}`,
        percent: formatPercent(changePercent),
        isPositive,
        type: fallback.type,
      };
    });
  }, [hasDynamicStocks, stocksQuery.data, livePrices, initialPricesMap]);

  return (
    <section id="markets" className="border-y border-border-primary bg-bg-secondary/60 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-profit animate-ping" />
              <h2 className="text-xl font-bold text-text-primary">Popular Simulated Markets</h2>
            </div>
            <p className="text-xs text-text-secondary mt-0.5">
              Live prices updated in real-time with simulated exchange matching
            </p>
          </div>
          <Link
            href="/markets"
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
          >
            <span>View All Stock Tickers</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
          {stocksQuery.isLoading
            ? Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  data-testid="ticker-skeleton"
                  className="flex flex-col justify-between rounded-xl border border-border-primary bg-bg-primary p-3 sm:p-3.5 shadow-xs animate-pulse min-w-0"
                >
                  <div className="flex items-start justify-between gap-2 min-w-0">
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex items-center gap-1.5">
                        <div className="h-4 w-20 bg-bg-tertiary rounded" />
                        <div className="h-3 w-10 bg-bg-tertiary rounded" />
                      </div>
                      <div className="h-3 w-32 bg-bg-tertiary rounded" />
                    </div>
                    <div className="h-5 w-14 bg-bg-tertiary rounded" />
                  </div>
                  <div className="mt-4 flex items-baseline justify-between gap-2">
                    <div className="h-5 w-24 bg-bg-tertiary rounded" />
                    <div className="h-3 w-12 bg-bg-tertiary rounded" />
                  </div>
                </div>
              ))
            : items.map((ticker) => (
                <Link
                  key={ticker.symbol}
                  href="/markets"
                  className="group flex flex-col justify-between rounded-xl border border-border-primary bg-bg-primary p-3 sm:p-3.5 shadow-xs transition-all hover:border-brand/50 hover:shadow-md min-w-0"
                >
                  <div className="flex items-start justify-between gap-2 min-w-0">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-bold text-sm text-text-primary group-hover:text-brand transition-colors truncate">
                          {ticker.symbol}
                        </span>
                        <span className="rounded bg-bg-tertiary px-1 py-0.2 text-[9px] font-semibold text-text-tertiary shrink-0">
                          {ticker.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-text-tertiary truncate">{ticker.name}</p>
                    </div>

                    <div
                      className={`flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[11px] font-semibold shrink-0 ${
                        ticker.isPositive ? "bg-profit-bg text-profit" : "bg-loss-bg text-loss"
                      }`}
                    >
                      {ticker.isPositive ? (
                        <TrendingUp className="h-3 w-3 shrink-0" />
                      ) : (
                        <TrendingDown className="h-3 w-3 shrink-0" />
                      )}
                      <span>{ticker.percent}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-baseline justify-between gap-2 min-w-0">
                    <span className="text-base font-bold text-text-primary truncate">{ticker.price}</span>
                    <span
                      className={`text-[11px] font-medium shrink-0 ${ticker.isPositive ? "text-profit" : "text-loss"}`}
                    >
                      {ticker.change}
                    </span>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
}
