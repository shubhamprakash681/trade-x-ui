"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Zap,
  DollarSign,
  CheckCircle2,
  Sparkles,
  ChevronUp,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/atoms/button";
import { useAuthStore } from "@/store/auth.store";
import { useStocks } from "@/hooks/use-stocks";
import { useLivePrices } from "@/hooks/use-live-prices";
import { pricesApi } from "@/api/prices.api";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { useDemoTradingStore, INITIAL_DEMO_CASH } from "@/store/demo-trading.store";
import type { PriceResponse } from "@/types/api.types";

interface DemoStockItem {
  symbol: string;
  name: string;
  referencePrice: number;
  exchange: string;
  sector: string;
}

const FALLBACK_DEMO_STOCKS: DemoStockItem[] = [
  {
    symbol: "RELIANCE",
    name: "Reliance Industries Ltd",
    referencePrice: 2940.1,
    exchange: "NSE",
    sector: "Energy",
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy Services",
    referencePrice: 3890.7,
    exchange: "NSE",
    sector: "Technology",
  },
  {
    symbol: "INFY",
    name: "Infosys Limited",
    referencePrice: 1525.35,
    exchange: "NSE",
    sector: "Technology",
  },
];

export function HeroSection() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const stocksQuery = useStocks(0, 4);
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

  const stockList = useMemo<DemoStockItem[]>(() => {
    if (hasDynamicStocks && stocksQuery.data) {
      return stocksQuery.data.content.slice(0, 4).map((stock) => ({
        symbol: stock.symbol,
        name: stock.name,
        referencePrice: stock.referencePrice,
        exchange: stock.exchange,
        sector: stock.sector,
      }));
    }
    return FALLBACK_DEMO_STOCKS;
  }, [hasDynamicStocks, stocksQuery.data]);

  const cashBalance = useDemoTradingStore((s) => s.cashBalance);
  const holdings = useDemoTradingStore((s) => s.holdings);
  const executeTrade = useDemoTradingStore((s) => s.executeTrade);

  const symbols = useMemo(() => {
    const listSymbols = stockList.map((s) => s.symbol);
    const holdingSymbols = Object.keys(holdings);
    return Array.from(new Set([...listSymbols, ...holdingSymbols]));
  }, [stockList, holdings]);
  const livePrices = useLivePrices(symbols);

  const [selectedSymbol, setSelectedSymbol] = useState<string>("RELIANCE");
  const [orderSide, setOrderSide] = useState<"BUY" | "SELL">("BUY");
  const [demoOrderQty, setDemoOrderQty] = useState(10);
  const [tradeFeedback, setTradeFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const activeStock = useMemo(() => {
    return stockList.find((s) => s.symbol.toUpperCase() === selectedSymbol.toUpperCase()) ?? stockList[0];
  }, [stockList, selectedSymbol]);

  const currentSym = activeStock.symbol.toUpperCase();
  const liveData = livePrices[currentSym] ?? initialPricesMap[currentSym];
  const currentPriceNum = liveData?.price ?? activeStock.referencePrice;
  const currentChangeAmount = liveData?.changeAmount ?? 0;
  const currentChangePercent = liveData?.changePercent ?? 0;
  const isPositive = currentChangeAmount >= 0;

  const formattedPrice = formatCurrency(currentPriceNum);
  const formattedChange = `${currentChangeAmount >= 0 ? "+" : ""}${formatCurrency(currentChangeAmount).replace(
    "₹",
    "₹",
  )}`;
  const formattedPercent = formatPercent(currentChangePercent);

  // Approximate 24h High & Low based on live price reference
  const highPrice = formatCurrency(
    liveData?.previousPrice && liveData.previousPrice > currentPriceNum
      ? liveData.previousPrice * 1.01
      : currentPriceNum * 1.015,
  );
  const lowPrice = formatCurrency(
    liveData?.previousPrice && liveData.previousPrice < currentPriceNum
      ? liveData.previousPrice * 0.99
      : currentPriceNum * 0.985,
  );
  const stockExchange = activeStock.exchange || "NSE";

  const portfolioHoldingsValue = useMemo(() => {
    return Object.values(holdings).reduce((sum, h) => {
      const sym = h.symbol.toUpperCase();
      const price = livePrices[sym]?.price ?? initialPricesMap[sym]?.price ?? h.avgBuyPrice;
      return sum + h.qty * price;
    }, 0);
  }, [holdings, livePrices, initialPricesMap]);

  const totalPortfolioValue = cashBalance + portfolioHoldingsValue;
  const portfolioReturn = totalPortfolioValue - INITIAL_DEMO_CASH;
  const portfolioReturnPercent = (portfolioReturn / INITIAL_DEMO_CASH) * 100;
  const isReturnPositive = portfolioReturn >= 0;

  function handleSimulateTrade() {
    const result = executeTrade({
      symbol: activeStock.symbol,
      side: orderSide,
      qty: demoOrderQty,
      price: currentPriceNum,
    });

    if (result.success) {
      setTradeFeedback({
        type: "success",
        message: `✓ Simulated Order Filled: ${orderSide} ${demoOrderQty} ${activeStock.symbol} at ${formattedPrice} executed!`,
      });
    } else {
      setTradeFeedback({
        type: "error",
        message: result.message || "Failed to execute order",
      });
    }

    setTimeout(() => {
      setTradeFeedback(null);
    }, 4000);
  }

  return (
    <section className="relative overflow-hidden pt-10 pb-16 md:pt-20 md:pb-28 w-full min-w-0">
      {/* Background glowing gradients */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[350px] w-[500px] sm:h-[500px] sm:w-[700px] -translate-x-1/2 rounded-full bg-brand/15 blur-[120px] dark:bg-brand/10" />
      <div className="pointer-events-none absolute top-1/2 right-0 -z-10 h-[300px] w-[350px] sm:h-[400px] sm:w-[500px] rounded-full bg-brand-secondary/15 blur-[120px] dark:bg-brand-secondary/10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full min-w-0">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8 w-full min-w-0">
          {/* Left Column: Hero Pitch & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left min-w-0">
            {/* Pill Badge */}
            <div className="inline-flex max-w-full flex-wrap items-center justify-center gap-1.5 rounded-full border border-border-primary bg-bg-secondary px-3 py-1.5 text-[11px] sm:text-xs font-medium text-text-primary shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-profit animate-pulse shrink-0" />
              <span className="text-text-secondary">Simulated Stock Market</span>
              <span className="hidden sm:inline text-border-secondary">|</span>
              <span className="font-semibold text-brand flex items-center gap-1 shrink-0">
                <Sparkles className="h-3 w-3" /> 100% Risk-Free
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl font-extrabold tracking-tight text-text-primary sm:text-5xl lg:text-6xl leading-tight sm:leading-[1.15] break-words">
              Master Stock Trading Without Risking a{" "}
              <span className="bg-gradient-to-r from-brand via-brand-accent to-brand-secondary bg-clip-text text-transparent">
                Single Rupee
              </span>
            </h1>

            {/* Subheading */}
            <p className="mx-auto max-w-2xl text-base text-text-secondary sm:text-xl lg:mx-0 leading-relaxed">
              Trade simulated Indian and global stocks with{" "}
              <strong className="text-text-primary font-semibold">₹10,00,000</strong> in virtual capital. Real-time
              market data, institutional candlestick charts, and instant order matching inspired by Groww, INDmoney, and
              Delta Exchange.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2 w-full">
              <Link href={isAuthenticated ? "/dashboard" : "/register"} className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="primary"
                  className="w-full sm:w-auto px-6 sm:px-8 gap-2 shadow-lg shadow-brand/20"
                >
                  <span>{isAuthenticated ? "Go to Dashboard" : "Start Paper Trading Free"}</span>
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </Button>
              </Link>
              <Link href="#markets" className="w-full sm:w-auto">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto px-6 sm:px-8">
                  Explore Live Tickers
                </Button>
              </Link>
            </div>

            {/* Trust / Metric Badges */}
            <div className="pt-6 border-t border-border-primary/80 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="flex flex-col items-center lg:items-start min-w-0">
                <div className="flex items-center gap-1 text-[11px] sm:text-xs text-text-tertiary">
                  <DollarSign className="h-3.5 w-3.5 text-brand shrink-0" />
                  <span className="truncate">Virtual Capital</span>
                </div>
                <span className="text-base sm:text-lg font-bold text-text-primary">₹10 Lakhs</span>
              </div>

              <div className="flex flex-col items-center lg:items-start min-w-0">
                <div className="flex items-center gap-1 text-[11px] sm:text-xs text-text-tertiary">
                  <Zap className="h-3.5 w-3.5 text-warning shrink-0" />
                  <span className="truncate">Latency</span>
                </div>
                <span className="text-base sm:text-lg font-bold text-text-primary">Real-Time</span>
              </div>

              <div className="flex flex-col items-center lg:items-start min-w-0">
                <div className="flex items-center gap-1 text-[11px] sm:text-xs text-text-tertiary">
                  <ShieldCheck className="h-3.5 w-3.5 text-profit shrink-0" />
                  <span className="truncate">Broker KYC</span>
                </div>
                <span className="text-base sm:text-lg font-bold text-text-primary">Zero KYC</span>
              </div>

              <div className="flex flex-col items-center lg:items-start min-w-0">
                <div className="flex items-center gap-1 text-[11px] sm:text-xs text-text-tertiary">
                  <CheckCircle2 className="h-3.5 w-3.5 text-brand-secondary shrink-0" />
                  <span className="truncate">Cost</span>
                </div>
                <span className="text-base sm:text-lg font-bold text-text-primary">100% Free</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-Fidelity Interactive Trading Mockup */}
          <div className="lg:col-span-5 w-full min-w-0">
            <div className="relative mx-auto w-full max-w-lg rounded-2xl border border-border-primary bg-bg-secondary p-3.5 sm:p-5 shadow-2xl backdrop-blur-xl min-w-0">
              {/* Card Header & Stock Switcher */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-primary pb-3">
                <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto max-w-full py-0.5">
                  {stockList.map((s) => (
                    <button
                      key={s.symbol}
                      onClick={() => setSelectedSymbol(s.symbol)}
                      className={`rounded-lg px-2 py-1 text-[11px] sm:text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                        activeStock.symbol === s.symbol
                          ? "bg-brand text-white shadow-xs"
                          : "bg-bg-primary text-text-secondary hover:text-text-primary border border-border-primary"
                      }`}
                    >
                      {s.symbol}
                    </button>
                  ))}
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-profit-bg px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold text-profit shrink-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-profit animate-pulse" />
                  LIVE STREAM
                </span>
              </div>

              {/* Price & Trend Header */}
              <div className="mt-3 sm:mt-4 flex flex-wrap items-baseline justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="text-xl sm:text-2xl font-bold text-text-primary">{formattedPrice}</h3>
                  <p className="text-[11px] sm:text-xs text-text-tertiary truncate">{activeStock.name}</p>
                </div>
                <div
                  className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 sm:py-1 text-[11px] sm:text-xs font-semibold shrink-0 ${
                    isPositive ? "bg-profit-bg text-profit" : "bg-loss-bg text-loss"
                  }`}
                >
                  <ChevronUp className={`h-3.5 w-3.5 shrink-0 ${!isPositive ? "rotate-180" : ""}`} />
                  <span>
                    {formattedChange} ({formattedPercent})
                  </span>
                </div>
              </div>

              {/* Simulated Lightweight Area Chart Sparkline */}
              <div className="mt-3 sm:mt-4 h-24 sm:h-28 w-full overflow-hidden rounded-xl border border-border-primary bg-bg-primary/70 p-1.5 sm:p-2">
                <svg viewBox="0 0 300 80" className="h-full w-full overflow-visible" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366F1" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Area fill */}
                  <polygon
                    points="0,70 15,65 35,68 60,50 85,55 110,40 140,48 170,30 200,38 230,22 260,25 285,15 300,10 300,80 0,80"
                    fill="url(#chartGlow)"
                  />
                  {/* Line */}
                  <polyline
                    points="0,70 15,65 35,68 60,50 85,55 110,40 140,48 170,30 200,38 230,22 260,25 285,15 300,10"
                    fill="none"
                    stroke="#6366F1"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Stats Bar */}
              <div className="mt-2.5 sm:mt-3 grid grid-cols-3 gap-1.5 sm:gap-2 text-center text-xs">
                <div className="rounded-lg bg-bg-primary p-1.5 sm:p-2 border border-border-primary min-w-0">
                  <span className="block text-[9px] sm:text-[10px] text-text-tertiary">24h High</span>
                  <span className="font-semibold text-[11px] sm:text-xs text-text-primary truncate block">
                    {highPrice}
                  </span>
                </div>
                <div className="rounded-lg bg-bg-primary p-1.5 sm:p-2 border border-border-primary min-w-0">
                  <span className="block text-[9px] sm:text-[10px] text-text-tertiary">24h Low</span>
                  <span className="font-semibold text-[11px] sm:text-xs text-text-primary truncate block">
                    {lowPrice}
                  </span>
                </div>
                <div className="rounded-lg bg-bg-primary p-1.5 sm:p-2 border border-border-primary min-w-0">
                  <span className="block text-[9px] sm:text-[10px] text-text-tertiary">Exchange</span>
                  <span className="font-semibold text-[11px] sm:text-xs text-text-primary truncate block">
                    {stockExchange}
                  </span>
                </div>
              </div>

              {/* Quick Trade Simulation Box */}
              <div className="mt-3 sm:mt-4 rounded-xl border border-border-primary bg-bg-primary p-2.5 sm:p-3 min-w-0">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex rounded-lg bg-bg-secondary p-0.5 border border-border-primary">
                    <button
                      onClick={() => setOrderSide("BUY")}
                      className={`rounded-md px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-semibold transition-colors cursor-pointer ${
                        orderSide === "BUY" ? "bg-profit text-white" : "text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      Buy (Long)
                    </button>
                    <button
                      onClick={() => setOrderSide("SELL")}
                      className={`rounded-md px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-semibold transition-colors cursor-pointer ${
                        orderSide === "SELL" ? "bg-loss text-white" : "text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      Sell (Short)
                    </button>
                  </div>
                  <span className="text-[10px] sm:text-[11px] text-text-tertiary">Market Order</span>
                </div>

                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-[11px] sm:text-xs text-text-secondary">Quantity:</span>
                  <div className="flex gap-1">
                    {[1, 5, 10, 25].map((qty) => (
                      <button
                        key={qty}
                        onClick={() => setDemoOrderQty(qty)}
                        className={`rounded px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium border cursor-pointer ${
                          demoOrderQty === qty
                            ? "border-brand bg-brand/10 text-brand"
                            : "border-border-primary text-text-secondary hover:text-text-primary"
                        }`}
                      >
                        {qty}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleSimulateTrade}
                  className={`w-full rounded-lg py-2 sm:py-2.5 text-xs font-bold text-white transition-all cursor-pointer truncate px-2 ${
                    orderSide === "BUY" ? "bg-profit hover:opacity-90" : "bg-loss hover:opacity-90"
                  }`}
                >
                  Simulate {orderSide === "BUY" ? "Buy" : "Sell"} {demoOrderQty} {activeStock.symbol} (≈
                  {formatCurrency(demoOrderQty * currentPriceNum)})
                </button>

                {tradeFeedback && (
                  <div
                    className={`mt-2 rounded-lg border p-1.5 text-center text-[11px] font-semibold ${
                      tradeFeedback.type === "success"
                        ? "border-profit/30 bg-profit-bg text-profit"
                        : "border-loss/30 bg-loss-bg text-loss"
                    }`}
                  >
                    {tradeFeedback.message}
                  </div>
                )}
              </div>

              {/* Floating notification badge */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-1 text-[10px] sm:text-[11px] text-text-tertiary">
                <span className="flex items-center gap-1 truncate">
                  {isReturnPositive ? (
                    <TrendingUp className="h-3 w-3 shrink-0 text-profit" />
                  ) : (
                    <TrendingDown className="h-3 w-3 shrink-0 text-loss" />
                  )}
                  Portfolio: {formatCurrency(totalPortfolioValue)}
                </span>
                <span className={`font-medium shrink-0 ${isReturnPositive ? "text-profit" : "text-loss"}`}>
                  {portfolioReturn >= 0 ? "+" : ""}
                  {formatCurrency(portfolioReturn)} ({formatPercent(portfolioReturnPercent)})
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
