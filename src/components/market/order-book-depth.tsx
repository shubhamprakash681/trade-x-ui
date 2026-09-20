"use client";

import { useState, useEffect } from "react";
import { formatCurrency, cn } from "@/lib/utils";

interface OrderBookDepthProps {
  currentPrice: number;
  symbol?: string;
}

interface TapePrint {
  id: string;
  time: string;
  price: number;
  qty: number;
  side: "BUY" | "SELL";
}

export function OrderBookDepth({ currentPrice, symbol = "STOCK" }: OrderBookDepthProps) {
  const [activeTab, setActiveTab] = useState<"book" | "trades">("book");
  const [tapePrints, setTapePrints] = useState<TapePrint[]>([]);
  const [fluctuation, setFluctuation] = useState(0);

  const effectivePrice = currentPrice > 0 ? currentPrice : 1000;

  // Periodic subtle size/depth jitter to simulate real live market liquidity fluctuations
  useEffect(() => {
    const timer = setInterval(() => {
      setFluctuation((prev) => (prev + 1) % 100);
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  // Periodic Time & Sales (Tape) stream generation
  useEffect(() => {
    // Seed initial prints
    const now = new Date();
    const initial: TapePrint[] = Array.from({ length: 8 }).map((_, i) => {
      const isBuy = Math.random() > 0.48;
      const variation = ((Math.random() * 0.4 - 0.2) / 100) * effectivePrice;
      const tradeTime = new Date(now.getTime() - (7 - i) * 3500);
      return {
        id: `init-${i}-${Date.now()}`,
        time: tradeTime.toTimeString().split(" ")[0],
        price: +(effectivePrice + variation).toFixed(2),
        qty: Math.floor(Math.random() * 8 + 1) * 10,
        side: isBuy ? "BUY" : "SELL",
      };
    });
    setTapePrints(initial.reverse());

    // Stream new trades every 1.5 to 2.5 seconds
    const interval = setInterval(() => {
      const isBuy = Math.random() > 0.46;
      const variation = ((Math.random() * 0.3 - 0.15) / 100) * effectivePrice;
      const tradePrice = +(effectivePrice + variation).toFixed(2);
      const tradeQty = Math.floor(Math.random() * 12 + 1) * 5;
      const currentTime = new Date().toTimeString().split(" ")[0];

      const newPrint: TapePrint = {
        id: `${Date.now()}-${Math.random()}`,
        time: currentTime,
        price: tradePrice,
        qty: tradeQty,
        side: isBuy ? "BUY" : "SELL",
      };

      setTapePrints((prev) => [newPrint, ...prev.slice(0, 11)]);
    }, 2000);

    return () => clearInterval(interval);
  }, [effectivePrice]);

  // Dynamic Level 2 Order Book ladder based on current price and live fluctuations
  const jitterA = ((fluctuation * 17) % 50) - 25;
  const jitterB = ((fluctuation * 29) % 60) - 30;

  const asks = [
    { price: effectivePrice * 1.0035, size: Math.max(80, 440 + jitterA), total: 2240 + jitterA },
    { price: effectivePrice * 1.0028, size: Math.max(120, 610 - jitterB), total: 1800 - jitterB },
    { price: effectivePrice * 1.0020, size: Math.max(90, 290 + jitterA * 2), total: 1190 },
    { price: effectivePrice * 1.0012, size: Math.max(110, 520 - jitterA), total: 900 - jitterA },
    { price: effectivePrice * 1.0005, size: Math.max(100, 380 + jitterB), total: 380 + jitterB },
  ];

  const bids = [
    { price: effectivePrice * 0.9995, size: Math.max(100, 450 - jitterA), total: 450 - jitterA },
    { price: effectivePrice * 0.9988, size: Math.max(80, 320 + jitterB), total: 770 + jitterB },
    { price: effectivePrice * 0.9980, size: Math.max(150, 680 - jitterB), total: 1450 - jitterB },
    { price: effectivePrice * 0.9972, size: Math.max(90, 510 + jitterA), total: 1960 + jitterA },
    { price: effectivePrice * 0.9965, size: Math.max(120, 390 - jitterA), total: 2350 },
  ];

  const spread = Math.max(0.05, asks[4].price - bids[0].price);
  const spreadPct = effectivePrice > 0 ? (spread / effectivePrice) * 100 : 0;
  const maxVolume = 2500;

  return (
    <div className="rounded-xl border border-border-primary bg-bg-secondary p-4 space-y-3 font-mono text-xs shadow-sm select-none">
      {/* ─── Top Tabs ────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-border-primary pb-2.5 font-sans">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("book")}
            className={cn(
              "rounded-lg px-2.5 py-1 text-xs font-bold uppercase transition-all cursor-pointer",
              activeTab === "book"
                ? "bg-brand/10 text-brand border border-brand/30 shadow-xs"
                : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary"
            )}
          >
            Order Book (L2)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("trades")}
            className={cn(
              "rounded-lg px-2.5 py-1 text-xs font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5",
              activeTab === "trades"
                ? "bg-brand/10 text-brand border border-brand/30 shadow-xs"
                : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary"
            )}
          >
            <span>Time & Sales</span>
            <span className="h-1.5 w-1.5 rounded-full bg-profit animate-pulse" />
          </button>
        </div>

        <span className="text-[10px] text-text-tertiary font-bold tracking-wider uppercase font-mono">
          {activeTab === "book" ? "NSE DEPTH" : "LIVE TAPE"}
        </span>
      </div>

      {/* ─── Tab 1: ORDER BOOK (L2) ─────────────────────────────────────────── */}
      {activeTab === "book" ? (
        <div className="space-y-1.5">
          {/* Table Header */}
          <div className="grid grid-cols-3 text-[10px] uppercase text-text-tertiary pb-1 border-b border-border-primary/50 font-bold tracking-wider">
            <span>Price (₹)</span>
            <span className="text-right">Size</span>
            <span className="text-right">Total</span>
          </div>

          {/* Asks / Sells (Red / Coral) */}
          <div className="space-y-0.5">
            {asks.map((row, i) => {
              const widthPct = Math.min(100, Math.max(8, (row.total / maxVolume) * 100));
              return (
                <div key={i} className="relative grid grid-cols-3 py-0.5 px-1 text-[11px] tabular-nums">
                  <div
                    className="absolute right-0 top-0 bottom-0 bg-loss/15 rounded-sm transition-all duration-500"
                    style={{ width: `${widthPct}%` }}
                  />
                  <span className="relative text-loss font-semibold">{formatCurrency(row.price)}</span>
                  <span className="relative text-right text-text-secondary">{row.size}</span>
                  <span className="relative text-right text-text-primary font-medium">{row.total}</span>
                </div>
              );
            })}
          </div>

          {/* Mid-Market Spread Ribbon */}
          <div className="flex items-center justify-between rounded-lg bg-bg-tertiary px-3 py-1.5 text-[11px] border border-border-primary/60 text-text-secondary">
            <span>Spread: {spread.toFixed(2)} ({spreadPct.toFixed(2)}%)</span>
            <span className="font-bold text-text-primary font-mono">{formatCurrency(effectivePrice)}</span>
          </div>

          {/* Bids / Buys (Green / Emerald) */}
          <div className="space-y-0.5">
            {bids.map((row, i) => {
              const widthPct = Math.min(100, Math.max(8, (row.total / maxVolume) * 100));
              return (
                <div key={i} className="relative grid grid-cols-3 py-0.5 px-1 text-[11px] tabular-nums">
                  <div
                    className="absolute right-0 top-0 bottom-0 bg-profit/15 rounded-sm transition-all duration-500"
                    style={{ width: `${widthPct}%` }}
                  />
                  <span className="relative text-profit font-semibold">{formatCurrency(row.price)}</span>
                  <span className="relative text-right text-text-secondary">{row.size}</span>
                  <span className="relative text-right text-text-primary font-medium">{row.total}</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ─── Tab 2: TIME & SALES (Dynamic Tape) ────────────────────────────── */
        <div className="space-y-1.5">
          {/* Table Header */}
          <div className="grid grid-cols-4 text-[10px] uppercase text-text-tertiary pb-1 border-b border-border-primary/50 font-bold tracking-wider">
            <span>Time</span>
            <span>Side</span>
            <span className="text-right">Price</span>
            <span className="text-right">Shares</span>
          </div>

          {/* Live Executed Trades List */}
          <div className="space-y-0.5 max-h-[220px] overflow-y-auto">
            {tapePrints.length === 0 ? (
              <p className="py-8 text-center text-xs text-text-secondary font-sans">
                Awaiting market trade executions...
              </p>
            ) : (
              tapePrints.map((trade, idx) => (
                <div
                  key={trade.id}
                  className={cn(
                    "grid grid-cols-4 py-1 px-1 text-[11px] tabular-nums border-b border-border-primary/30 last:border-0 rounded-sm transition-colors",
                    idx === 0 ? (trade.side === "BUY" ? "bg-profit/10" : "bg-loss/10") : "hover:bg-bg-tertiary/50"
                  )}
                >
                  <span className="text-text-tertiary">{trade.time}</span>
                  <span
                    className={cn(
                      "font-extrabold text-[10px] uppercase",
                      trade.side === "BUY" ? "text-profit" : "text-loss"
                    )}
                  >
                    {trade.side}
                  </span>
                  <span className="text-right font-medium text-text-primary">
                    {formatCurrency(trade.price)}
                  </span>
                  <span className="text-right font-semibold text-text-secondary">
                    {trade.qty}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="pt-1 flex items-center justify-between text-[10px] text-text-tertiary border-t border-border-primary/40 font-sans">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-profit animate-ping" />
              Sub-second tick execution
            </span>
            <span>{tapePrints.length} recent prints</span>
          </div>
        </div>
      )}
    </div>
  );
}
