"use client";

import { useState } from "react";
import { formatCurrency, cn } from "@/lib/utils";

interface OrderBookDepthProps {
  currentPrice: number;
}

export function OrderBookDepth({ currentPrice }: OrderBookDepthProps) {
  const [activeTab, setActiveTab] = useState<"book" | "trades">("book");

  // Simulated depth based on current reference price
  const asks = [
    { price: currentPrice * 1.0035, size: 440, total: 2240 },
    { price: currentPrice * 1.0028, size: 610, total: 1800 },
    { price: currentPrice * 1.0020, size: 290, total: 1190 },
    { price: currentPrice * 1.0012, size: 520, total: 900 },
    { price: currentPrice * 1.0005, size: 380, total: 380 },
  ];

  const bids = [
    { price: currentPrice * 0.9995, size: 450, total: 450 },
    { price: currentPrice * 0.9988, size: 320, total: 770 },
    { price: currentPrice * 0.9980, size: 680, total: 1450 },
    { price: currentPrice * 0.9972, size: 510, total: 1960 },
    { price: currentPrice * 0.9965, size: 390, total: 2350 },
  ];

  const spread = Math.max(0.05, asks[4].price - bids[0].price);
  const spreadPct = currentPrice > 0 ? (spread / currentPrice) * 100 : 0;

  return (
    <div className="rounded-xl border border-border-primary bg-bg-secondary p-4 space-y-3 font-mono text-xs shadow-sm">
      <div className="flex items-center justify-between border-b border-border-primary pb-2 font-sans">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab("book")}
            className={cn(
              "text-xs font-bold uppercase transition-colors cursor-pointer",
              activeTab === "book" ? "text-brand" : "text-text-secondary hover:text-text-primary"
            )}
          >
            Order Book (L2)
          </button>
          <button
            onClick={() => setActiveTab("trades")}
            className={cn(
              "text-xs font-bold uppercase transition-colors cursor-pointer",
              activeTab === "trades" ? "text-brand" : "text-text-secondary hover:text-text-primary"
            )}
          >
            Time & Sales
          </button>
        </div>
        <span className="text-[10px] text-text-tertiary font-bold tracking-wider">
          NSE DEPTH
        </span>
      </div>

      <div className="grid grid-cols-3 text-[10px] uppercase text-text-tertiary pb-1 border-b border-border-primary/50 font-bold">
        <span>Price</span>
        <span className="text-right">Size</span>
        <span className="text-right">Total</span>
      </div>

      {/* Asks (Sell Orders - Coral/Red) */}
      <div className="space-y-0.5">
        {asks.map((row, i) => (
          <div key={i} className="relative grid grid-cols-3 py-0.5 text-[11px] tabular-nums">
            <div
              className="absolute right-0 top-0 bottom-0 bg-loss/10 rounded-sm"
              style={{ width: `${Math.min(100, (row.total / 2500) * 100)}%` }}
            />
            <span className="relative text-loss font-semibold">{formatCurrency(row.price)}</span>
            <span className="relative text-right text-text-secondary">{row.size}</span>
            <span className="relative text-right text-text-primary font-medium">{row.total}</span>
          </div>
        ))}
      </div>

      {/* Mid-market Spread */}
      <div className="flex items-center justify-between rounded bg-bg-tertiary px-2.5 py-1 text-[11px] border border-border-primary/50 text-text-secondary">
        <span>Spread: {spread.toFixed(2)} ({spreadPct.toFixed(2)}%)</span>
        <span className="font-bold text-text-primary">{formatCurrency(currentPrice)}</span>
      </div>

      {/* Bids (Buy Orders - Emerald/Green) */}
      <div className="space-y-0.5">
        {bids.map((row, i) => (
          <div key={i} className="relative grid grid-cols-3 py-0.5 text-[11px] tabular-nums">
            <div
              className="absolute right-0 top-0 bottom-0 bg-profit/10 rounded-sm"
              style={{ width: `${Math.min(100, (row.total / 2500) * 100)}%` }}
            />
            <span className="relative text-profit font-semibold">{formatCurrency(row.price)}</span>
            <span className="relative text-right text-text-secondary">{row.size}</span>
            <span className="relative text-right text-text-primary font-medium">{row.total}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

