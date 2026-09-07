"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, TrendingUp, ShieldCheck, Zap, DollarSign, CheckCircle2, Sparkles, ChevronUp } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { useAuthStore } from "@/store/auth.store";

interface DemoStock {
  symbol: string;
  name: string;
  price: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
  high: string;
  low: string;
  volume: string;
}

const DEMO_STOCKS: DemoStock[] = [
  {
    symbol: "RELIANCE",
    name: "Reliance Industries Ltd",
    price: "₹2,984.50",
    change: "+₹68.20",
    changePercent: "+2.34%",
    isPositive: true,
    high: "₹3,012.00",
    low: "₹2,925.00",
    volume: "14.2M",
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy Services",
    price: "₹4,120.80",
    change: "+₹45.60",
    changePercent: "+1.12%",
    isPositive: true,
    high: "₹4,160.00",
    low: "₹4,080.00",
    volume: "8.6M",
  },
  {
    symbol: "INFY",
    name: "Infosys Limited",
    price: "₹1,842.15",
    change: "-₹12.40",
    changePercent: "-0.67%",
    isPositive: false,
    high: "₹1,865.00",
    low: "₹1,830.00",
    volume: "11.1M",
  },
];

export function HeroSection() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [selectedStock, setSelectedStock] = useState<DemoStock>(DEMO_STOCKS[0]);
  const [orderSide, setOrderSide] = useState<"BUY" | "SELL">("BUY");
  const [demoOrderQty, setDemoOrderQty] = useState(10);
  const [simulatedSuccess, setSimulatedSuccess] = useState(false);

  function handleSimulateTrade() {
    setSimulatedSuccess(true);
    setTimeout(() => {
      setSimulatedSuccess(false);
    }, 4000);
  }

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Background glowing gradients */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-brand/15 blur-[120px] dark:bg-brand/10" />
      <div className="pointer-events-none absolute top-1/2 right-0 -z-10 h-[400px] w-[500px] rounded-full bg-brand-secondary/15 blur-[120px] dark:bg-brand-secondary/10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Hero Pitch & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-border-primary bg-bg-secondary px-3.5 py-1.5 text-xs font-medium text-text-primary shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-profit animate-pulse" />
              <span className="text-text-secondary">Simulated Stock Market</span>
              <span className="text-border-secondary">|</span>
              <span className="font-semibold text-brand flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> 100% Risk-Free
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl lg:text-6xl leading-[1.15]">
              Master Stock Trading Without Risking a{" "}
              <span className="bg-gradient-to-r from-brand via-brand-accent to-brand-secondary bg-clip-text text-transparent">
                Single Rupee
              </span>
            </h1>

            {/* Subheading */}
            <p className="mx-auto max-w-2xl text-lg text-text-secondary sm:text-xl lg:mx-0 leading-relaxed">
              Trade simulated Indian and global stocks with{" "}
              <strong className="text-text-primary font-semibold">₹10,00,000</strong> in virtual capital. Real-time
              market data, institutional candlestick charts, and instant order matching inspired by Groww, INDmoney, and
              Delta Exchange.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link href={isAuthenticated ? "/dashboard" : "/register"} className="w-full sm:w-auto">
                <Button size="lg" variant="primary" className="w-full sm:w-auto px-8 gap-2 shadow-lg shadow-brand/20">
                  <span>{isAuthenticated ? "Go to Dashboard" : "Start Paper Trading Free"}</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#markets" className="w-full sm:w-auto">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto px-8">
                  Explore Live Tickers
                </Button>
              </Link>
            </div>

            {/* Trust / Metric Badges */}
            <div className="pt-6 border-t border-border-primary/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex flex-col items-center lg:items-start">
                <div className="flex items-center gap-1.5 text-xs text-text-tertiary">
                  <DollarSign className="h-3.5 w-3.5 text-brand" />
                  <span>Virtual Capital</span>
                </div>
                <span className="text-lg font-bold text-text-primary">₹10 Lakhs</span>
              </div>

              <div className="flex flex-col items-center lg:items-start">
                <div className="flex items-center gap-1.5 text-xs text-text-tertiary">
                  <Zap className="h-3.5 w-3.5 text-warning" />
                  <span>Latency</span>
                </div>
                <span className="text-lg font-bold text-text-primary">Real-Time</span>
              </div>

              <div className="flex flex-col items-center lg:items-start">
                <div className="flex items-center gap-1.5 text-xs text-text-tertiary">
                  <ShieldCheck className="h-3.5 w-3.5 text-profit" />
                  <span>Broker KYC</span>
                </div>
                <span className="text-lg font-bold text-text-primary">Zero KYC</span>
              </div>

              <div className="flex flex-col items-center lg:items-start">
                <div className="flex items-center gap-1.5 text-xs text-text-tertiary">
                  <CheckCircle2 className="h-3.5 w-3.5 text-brand-secondary" />
                  <span>Cost</span>
                </div>
                <span className="text-lg font-bold text-text-primary">100% Free</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-Fidelity Interactive Trading Mockup */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto w-full max-w-lg rounded-2xl border border-border-primary bg-bg-secondary p-5 shadow-2xl backdrop-blur-xl">
              {/* Card Header & Stock Switcher */}
              <div className="flex items-center justify-between border-b border-border-primary pb-4">
                <div className="flex items-center gap-2">
                  {DEMO_STOCKS.map((s) => (
                    <button
                      key={s.symbol}
                      onClick={() => setSelectedStock(s)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                        selectedStock.symbol === s.symbol
                          ? "bg-brand text-white shadow-xs"
                          : "bg-bg-primary text-text-secondary hover:text-text-primary border border-border-primary"
                      }`}
                    >
                      {s.symbol}
                    </button>
                  ))}
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-profit-bg px-2 py-0.5 text-[11px] font-semibold text-profit">
                  <span className="h-1.5 w-1.5 rounded-full bg-profit animate-pulse" />
                  MARKET OPEN
                </span>
              </div>

              {/* Price & Trend Header */}
              <div className="mt-4 flex items-baseline justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-text-primary">{selectedStock.price}</h3>
                  <p className="text-xs text-text-tertiary">{selectedStock.name}</p>
                </div>
                <div
                  className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold ${
                    selectedStock.isPositive ? "bg-profit-bg text-profit" : "bg-loss-bg text-loss"
                  }`}
                >
                  <ChevronUp className={`h-3.5 w-3.5 ${!selectedStock.isPositive ? "rotate-180" : ""}`} />
                  <span>
                    {selectedStock.change} ({selectedStock.changePercent})
                  </span>
                </div>
              </div>

              {/* Simulated Lightweight Area Chart Sparkline */}
              <div className="mt-4 h-28 w-full overflow-hidden rounded-xl border border-border-primary bg-bg-primary/70 p-2">
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
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-lg bg-bg-primary p-2 border border-border-primary">
                  <span className="block text-[10px] text-text-tertiary">24h High</span>
                  <span className="font-semibold text-text-primary">{selectedStock.high}</span>
                </div>
                <div className="rounded-lg bg-bg-primary p-2 border border-border-primary">
                  <span className="block text-[10px] text-text-tertiary">24h Low</span>
                  <span className="font-semibold text-text-primary">{selectedStock.low}</span>
                </div>
                <div className="rounded-lg bg-bg-primary p-2 border border-border-primary">
                  <span className="block text-[10px] text-text-tertiary">Volume</span>
                  <span className="font-semibold text-text-primary">{selectedStock.volume}</span>
                </div>
              </div>

              {/* Quick Trade Simulation Box */}
              <div className="mt-4 rounded-xl border border-border-primary bg-bg-primary p-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex rounded-lg bg-bg-secondary p-0.5 border border-border-primary">
                    <button
                      onClick={() => setOrderSide("BUY")}
                      className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                        orderSide === "BUY" ? "bg-profit text-white" : "text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      Buy (Long)
                    </button>
                    <button
                      onClick={() => setOrderSide("SELL")}
                      className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                        orderSide === "SELL" ? "bg-loss text-white" : "text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      Sell (Short)
                    </button>
                  </div>
                  <span className="text-[11px] text-text-tertiary">Market Order</span>
                </div>

                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-text-secondary">Quantity:</span>
                  <div className="flex gap-1">
                    {[1, 5, 10, 25].map((qty) => (
                      <button
                        key={qty}
                        onClick={() => setDemoOrderQty(qty)}
                        className={`rounded px-2 py-0.5 text-xs font-medium border ${
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
                  className={`w-full rounded-lg py-2.5 text-xs font-bold text-white transition-all cursor-pointer ${
                    orderSide === "BUY" ? "bg-profit hover:opacity-90" : "bg-loss hover:opacity-90"
                  }`}
                >
                  Simulate {orderSide === "BUY" ? "Buy" : "Sell"} {demoOrderQty} {selectedStock.symbol}
                </button>

                {simulatedSuccess && (
                  <div className="mt-2.5 rounded-lg border border-profit/30 bg-profit-bg p-2 text-center text-xs font-semibold text-profit animate-fadeIn">
                    ✓ Simulated Order Filled: {orderSide} {demoOrderQty} {selectedStock.symbol} executed!
                  </div>
                )}
              </div>

              {/* Floating notification badge */}
              <div className="mt-3 flex items-center justify-between text-[11px] text-text-tertiary">
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-profit" />
                  Simulated Portfolio: ₹10,24,580.00
                </span>
                <span className="font-medium text-profit">+₹24,580.00 (+2.45%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
