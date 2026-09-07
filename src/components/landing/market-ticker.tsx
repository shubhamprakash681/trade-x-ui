"use client";

import Link from "next/link";
import { TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react";

interface TickerItem {
  symbol: string;
  name: string;
  price: string;
  change: string;
  percent: string;
  isPositive: boolean;
  type: "INDEX" | "EQUITY";
}

const TICKER_DATA: TickerItem[] = [
  {
    symbol: "NIFTY 50",
    name: "NSE Benchmark",
    price: "₹24,852.15",
    change: "+145.20",
    percent: "+0.59%",
    isPositive: true,
    type: "INDEX",
  },
  {
    symbol: "SENSEX",
    name: "BSE Benchmark",
    price: "₹81,332.72",
    change: "+410.50",
    percent: "+0.51%",
    isPositive: true,
    type: "INDEX",
  },
  {
    symbol: "RELIANCE",
    name: "Reliance Industries",
    price: "₹2,984.50",
    change: "+68.20",
    percent: "+2.34%",
    isPositive: true,
    type: "EQUITY",
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy",
    price: "₹4,120.80",
    change: "+45.60",
    percent: "+1.12%",
    isPositive: true,
    type: "EQUITY",
  },
  {
    symbol: "INFY",
    name: "Infosys Ltd",
    price: "₹1,842.15",
    change: "-12.40",
    percent: "-0.67%",
    isPositive: false,
    type: "EQUITY",
  },
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank Ltd",
    price: "₹1,648.90",
    change: "+18.75",
    percent: "+1.15%",
    isPositive: true,
    type: "EQUITY",
  },
  {
    symbol: "TATAMOTORS",
    name: "Tata Motors Ltd",
    price: "₹1,024.40",
    change: "+32.10",
    percent: "+3.23%",
    isPositive: true,
    type: "EQUITY",
  },
  {
    symbol: "ICICIBANK",
    name: "ICICI Bank Ltd",
    price: "₹1,215.60",
    change: "+11.30",
    percent: "+0.94%",
    isPositive: true,
    type: "EQUITY",
  },
];

export function MarketTicker() {
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
          {TICKER_DATA.map((ticker) => (
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
                <span className={`text-[11px] font-medium shrink-0 ${ticker.isPositive ? "text-profit" : "text-loss"}`}>
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
