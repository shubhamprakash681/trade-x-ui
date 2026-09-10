"use client";

import { useCallback, useMemo, useState } from "react";
import { LineChart, Briefcase, Layers, Bell, Check, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useStocks } from "@/hooks/use-stocks";
import { useLivePrices } from "@/hooks/use-live-prices";
import { pricesApi } from "@/api/prices.api";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { useDemoTradingStore, INITIAL_DEMO_CASH } from "@/store/demo-trading.store";
import { FALLBACK_DEMO_STOCKS } from "./hero-section";
import type { PriceResponse } from "@/types/api.types";

type TabKey = "charts" | "portfolio" | "orders" | "alerts";

interface TabConfig {
  id: TabKey;
  label: string;
  icon: React.ElementType;
  title: string;
  subtitle: string;
}

const TABS: TabConfig[] = [
  {
    id: "charts",
    label: "Live Charts",
    icon: LineChart,
    title: "High-Resolution Technical Charts",
    subtitle:
      "Inspect intraday and historical price trends with TradingView-powered Lightweight Charts, candlestick visualizations, and volume indicators.",
  },
  {
    id: "portfolio",
    label: "Portfolio Analytics",
    icon: Briefcase,
    title: "Real-Time Net Worth & Holding Metrics",
    subtitle:
      "Track your simulated assets with institutional clarity. View total investment, current valuation, and individual stock P&L breakdowns.",
  },
  {
    id: "orders",
    label: "Order Execution",
    icon: Layers,
    title: "Simulated Market & Limit Orders",
    subtitle:
      "Execute simulated trades with instantaneous order matching, transparent fees, and detailed transaction ledger logs.",
  },
  {
    id: "alerts",
    label: "Alerts & Watchlist",
    icon: Bell,
    title: "Smart Target Price Trigger Engine",
    subtitle:
      "Curate your personalized stock watchlist and set price notifications that trigger immediately when target price levels are crossed.",
  },
];

interface CandleItem {
  x: number;
  open: number;
  high: number;
  low: number;
  close: number;
  isUp: boolean;
}

function generateCandles(
  symbol: string,
  currentPrice: number,
  changeAmount: number,
  period: string = "1D",
): CandleItem[] {
  const seed = symbol.split("").reduce((acc, c, idx) => acc + c.charCodeAt(0) * (idx + 1), 0);
  const count = 12;
  const candles: CandleItem[] = [];

  const periodMultiplier =
    period === "1W" ? 1.8 : period === "1M" ? 3.0 : period === "1Y" ? 5.5 : period === "ALL" ? 8.0 : 1.0;

  const startPrice = currentPrice - changeAmount * periodMultiplier;
  const delta = currentPrice - startPrice;

  let currentOpen = startPrice;

  for (let i = 0; i < count; i++) {
    const progress = (i + 1) / count;
    const wave = Math.sin((i + (seed % 7)) * 0.95) * (currentPrice * 0.0035 * Math.sqrt(periodMultiplier));
    const targetClose = i === count - 1 ? currentPrice : startPrice + delta * progress + wave;
    const open = currentOpen;
    const close = i === count - 1 ? currentPrice : targetClose;
    const isUp = close >= open;

    const maxBody = Math.max(open, close);
    const minBody = Math.min(open, close);
    const wickHigh = Math.abs(Math.sin((i * 1.7 + seed) * 0.8)) * (currentPrice * 0.003 * Math.sqrt(periodMultiplier));
    const wickLow = Math.abs(Math.cos((i * 1.3 + seed) * 0.8)) * (currentPrice * 0.003 * Math.sqrt(periodMultiplier));

    const high = maxBody + wickHigh;
    const low = Math.max(minBody - wickLow, 0.01);

    candles.push({
      x: 36 + i * 36,
      open,
      high,
      low,
      close,
      isUp,
    });

    currentOpen = close;
  }

  return candles;
}

export function InteractivePreview() {
  const [activeTab, setActiveTab] = useState<TabKey>("charts");
  // const [selectedPeriod, setSelectedPeriod] = useState<string>("1D");

  const selectedSymbol = useDemoTradingStore((s) => s.selectedSymbol);
  const cashBalance = useDemoTradingStore((s) => s.cashBalance);
  const holdings = useDemoTradingStore((s) => s.holdings);
  const orders = useDemoTradingStore((s) => s.orders);

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

  const activeStock = useMemo(() => {
    const fromApi = stocksQuery.data?.content?.find((s) => s.symbol.toUpperCase() === selectedSymbol.toUpperCase());
    if (fromApi) {
      return {
        symbol: fromApi.symbol,
        name: fromApi.name,
        referencePrice: fromApi.referencePrice,
      };
    }
    const fallback = FALLBACK_DEMO_STOCKS.find((s) => s.symbol.toUpperCase() === selectedSymbol.toUpperCase());
    return fallback ?? { symbol: selectedSymbol, name: `${selectedSymbol} Limited`, referencePrice: 2000 };
  }, [stocksQuery.data, selectedSymbol]);

  const symbolsToSubscribe = useMemo(() => {
    const holdingSymbols = Object.keys(holdings);
    return Array.from(new Set([selectedSymbol, ...holdingSymbols]));
  }, [selectedSymbol, holdings]);

  const livePrices = useLivePrices(symbolsToSubscribe);

  const currentSym = activeStock.symbol.toUpperCase();
  const liveData = livePrices[currentSym] ?? initialPricesMap[currentSym];
  const stockPrice = liveData?.price ?? activeStock.referencePrice;
  const stockChange = liveData?.changeAmount ?? 0;
  const stockPercent = liveData?.changePercent ?? 0;
  const stockPositive = stockChange >= 0;

  const candleList = useMemo(() => {
    // return generateCandles(currentSym, stockPrice, stockChange, selectedPeriod);
    return generateCandles(currentSym, stockPrice, stockChange);
  }, [currentSym, stockPrice, stockChange]);

  const { minPrice, maxPrice } = useMemo(() => {
    if (candleList.length === 0) return { minPrice: 0, maxPrice: 0 };
    let min = Math.min(...candleList.map((c) => c.low));
    let max = Math.max(...candleList.map((c) => c.high));
    if (min === max) {
      min -= stockPrice * 0.01;
      max += stockPrice * 0.01;
    }
    return { minPrice: min, maxPrice: max };
  }, [candleList, stockPrice]);

  const toY = useCallback(
    (price: number) => {
      const topY = 16;
      const bottomY = 120;
      const range = maxPrice - minPrice || 1;
      return bottomY - ((price - minPrice) / range) * (bottomY - topY);
    },
    [minPrice, maxPrice],
  );

  const holdingsList = useMemo(() => Object.values(holdings), [holdings]);

  const { investedAmount, currentHoldingsValue } = useMemo(() => {
    let invested = 0;
    let current = 0;
    for (const h of holdingsList) {
      const sym = h.symbol.toUpperCase();
      const ltp = livePrices[sym]?.price ?? initialPricesMap[sym]?.price ?? h.avgBuyPrice;
      invested += h.qty * h.avgBuyPrice;
      current += h.qty * ltp;
    }
    return { investedAmount: invested, currentHoldingsValue: current };
  }, [holdingsList, livePrices, initialPricesMap]);

  const totalPortfolio = cashBalance + currentHoldingsValue;
  const totalReturns = totalPortfolio - INITIAL_DEMO_CASH;
  const returnsPercent = (totalReturns / INITIAL_DEMO_CASH) * 100;
  const isReturnsPositive = totalReturns >= 0;

  const currentTab = TABS.find((t) => t.id === activeTab)!;

  return (
    <section className="py-20 bg-bg-secondary/40 border-t border-border-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 space-y-3">
          <span className="rounded-full border border-brand-secondary/20 bg-brand-secondary/10 px-3.5 py-1 text-xs font-semibold text-brand-secondary uppercase tracking-wider">
            Interactive Product Tour
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            Designed for Speed, Engineered for Precision
          </h2>
          <p className="text-sm sm:text-base text-text-secondary">
            Switch between core workflows to see how TradeX streamlines your trading routine.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex overflow-x-auto pb-2 mb-8 justify-start sm:justify-center -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="inline-flex rounded-xl bg-bg-secondary p-1 border border-border-primary gap-1 shrink-0">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 sm:gap-2 rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-brand text-white shadow-sm"
                      : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary"
                  }`}
                >
                  <tab.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Display Container */}
        <div className="rounded-xl sm:rounded-2xl border border-border-primary bg-bg-secondary p-4 sm:p-8 shadow-xl min-w-0 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center min-w-0">
            {/* Explanatory side */}
            <div className="lg:col-span-4 space-y-3 sm:space-y-4 min-w-0">
              <h3 className="text-xl sm:text-2xl font-bold text-text-primary">{currentTab.title}</h3>
              <p className="text-xs sm:text-sm leading-relaxed text-text-secondary">{currentTab.subtitle}</p>

              <div className="space-y-2 pt-2 text-xs text-text-secondary">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-profit" />
                  <span>Zero lag simulated quote streaming</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-profit" />
                  <span>Interactive zoom and responsive layouts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-profit" />
                  <span>Full Light and Dark theme compatibility</span>
                </div>
              </div>
            </div>

            {/* Interactive Mock Display */}
            <div className="lg:col-span-8 rounded-lg sm:rounded-xl border border-border-primary bg-bg-primary p-3 sm:p-5 shadow-inner min-w-0">
              {activeTab === "charts" && (
                <div className="space-y-3 sm:space-y-4 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-primary pb-3 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 min-w-0">
                      <span className="font-bold text-sm sm:text-base text-text-primary">{activeStock.symbol}</span>
                      <span className="text-xs text-text-tertiary hidden xs:inline">{activeStock.name}</span>
                      <span
                        className={`rounded px-1.5 sm:px-2 py-0.5 text-[11px] sm:text-xs font-semibold ${
                          stockPositive ? "bg-profit-bg text-profit" : "bg-loss-bg text-loss"
                        }`}
                      >
                        {formatCurrency(stockPrice)} ({stockChange >= 0 ? "+" : ""}
                        {stockChange.toFixed(2)} · {formatPercent(stockPercent)})
                      </span>
                    </div>
                    {/* <div className="flex gap-1 shrink-0">
                      {["1D", "1W", "1M", "1Y", "ALL"].map((period) => (
                        <button
                          key={period}
                          onClick={() => setSelectedPeriod(period)}
                          className={`rounded px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-[11px] font-medium transition-colors cursor-pointer ${
                            period === selectedPeriod
                              ? "bg-brand text-white shadow-xs"
                              : "text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary"
                          }`}
                        >
                          {period}
                        </button>
                      ))}
                    </div> */}
                  </div>

                  {/* Simulated Candle and Line Chart */}
                  <div className="h-56 w-full flex flex-col justify-end p-2 bg-bg-secondary/40 rounded-lg relative overflow-hidden">
                    <svg viewBox="0 0 500 140" className="w-full h-full" preserveAspectRatio="none">
                      {/* Grid lines */}
                      <line
                        x1="0"
                        y1="35"
                        x2="500"
                        y2="35"
                        stroke="currentColor"
                        className="text-border-primary"
                        strokeDasharray="3 3"
                      />
                      <line
                        x1="0"
                        y1="70"
                        x2="500"
                        y2="70"
                        stroke="currentColor"
                        className="text-border-primary"
                        strokeDasharray="3 3"
                      />
                      <line
                        x1="0"
                        y1="105"
                        x2="500"
                        y2="105"
                        stroke="currentColor"
                        className="text-border-primary"
                        strokeDasharray="3 3"
                      />
                      {/* Dynamic Candlesticks */}
                      <g className="opacity-95" data-testid="dynamic-candlesticks">
                        {candleList.map((candle, idx) => {
                          const color = candle.isUp ? "#10B981" : "#EF4444";
                          const wickY1 = toY(candle.high);
                          const wickY2 = toY(candle.low);
                          const bodyTop = Math.min(toY(candle.open), toY(candle.close));
                          const bodyHeight = Math.max(3, Math.abs(toY(candle.close) - toY(candle.open)));

                          return (
                            <g key={idx}>
                              {/* Wick */}
                              <line
                                x1={candle.x + 4}
                                y1={wickY1}
                                x2={candle.x + 4}
                                y2={wickY2}
                                stroke={color}
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              />
                              {/* Candle body */}
                              <rect x={candle.x} y={bodyTop} width="8" height={bodyHeight} fill={color} rx="1" />
                            </g>
                          );
                        })}
                      </g>
                    </svg>
                  </div>
                </div>
              )}

              {/* Dynamic Simulated Portfolio Analytics */}
              {activeTab === "portfolio" && (
                <div className="space-y-4 min-w-0">
                  <div className="grid grid-cols-1 min-[440px]:grid-cols-3 gap-2.5 sm:gap-3">
                    <div className="rounded-lg bg-bg-secondary p-2.5 sm:p-3 border border-border-primary min-w-0">
                      <span className="text-[10px] sm:text-[11px] text-text-tertiary">Total Portfolio</span>
                      <p className="text-sm sm:text-base font-bold text-text-primary truncate">
                        {formatCurrency(totalPortfolio)}
                      </p>
                    </div>
                    <div className="rounded-lg bg-bg-secondary p-2.5 sm:p-3 border border-border-primary min-w-0">
                      <span className="text-[10px] sm:text-[11px] text-text-tertiary">Invested Amount</span>
                      <p className="text-sm sm:text-base font-bold text-text-primary truncate">
                        {formatCurrency(investedAmount)}
                      </p>
                    </div>
                    <div className="rounded-lg bg-bg-secondary p-2.5 sm:p-3 border border-border-primary min-w-0">
                      <span className="text-[10px] sm:text-[11px] text-text-tertiary">Total Returns</span>
                      <p
                        className={`text-sm sm:text-base font-bold truncate ${
                          isReturnsPositive ? "text-profit" : "text-loss"
                        }`}
                      >
                        {totalReturns >= 0 ? "+" : ""}
                        {formatCurrency(totalReturns)} ({formatPercent(returnsPercent)})
                      </p>
                    </div>
                  </div>

                  {holdingsList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 sm:py-10 px-4 text-center rounded-xl border border-dashed border-border-primary bg-bg-secondary/40">
                      <div className="h-10 w-10 rounded-full bg-brand/10 flex items-center justify-center text-brand mb-3">
                        <Briefcase className="h-5 w-5" />
                      </div>
                      <p className="font-semibold text-sm text-text-primary">No Simulated Holdings Yet</p>
                      <p className="text-xs text-text-secondary mt-1 max-w-sm">
                        Place a simulated Buy order in the Quick Trade widget above to start building your paper
                        portfolio with your ₹10,00,000 virtual balance.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto w-full">
                      <table className="w-full min-w-85 text-left text-xs">
                        <thead>
                          <tr className="border-b border-border-primary text-text-tertiary">
                            <th className="pb-2 font-medium">Stock</th>
                            <th className="pb-2 font-medium">Qty</th>
                            <th className="pb-2 font-medium">Avg. Buy</th>
                            <th className="pb-2 font-medium">LTP</th>
                            <th className="pb-2 text-right font-medium">P&L</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border-primary/50">
                          {holdingsList.map((h) => {
                            const sym = h.symbol.toUpperCase();
                            const ltp = livePrices[sym]?.price ?? initialPricesMap[sym]?.price ?? h.avgBuyPrice;
                            const pnl = (ltp - h.avgBuyPrice) * h.qty;
                            const pnlPercent = h.avgBuyPrice > 0 ? ((ltp - h.avgBuyPrice) / h.avgBuyPrice) * 100 : 0;
                            const isPnlPositive = pnl >= 0;

                            return (
                              <tr key={h.symbol}>
                                <td className="py-2.5 font-semibold text-text-primary">{h.symbol}</td>
                                <td className="py-2.5">{h.qty}</td>
                                <td className="py-2.5">{formatCurrency(h.avgBuyPrice)}</td>
                                <td className="py-2.5 font-medium text-text-primary">{formatCurrency(ltp)}</td>
                                <td
                                  className={`py-2.5 text-right font-semibold ${
                                    isPnlPositive ? "text-profit" : "text-loss"
                                  }`}
                                >
                                  {isPnlPositive ? "+" : ""}
                                  {formatCurrency(pnl)} ({formatPercent(pnlPercent)})
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Dynamic Simulated Order Execution */}
              {activeTab === "orders" && (
                <div className="space-y-4 min-w-0">
                  <div className="flex items-center justify-between border-b border-border-primary pb-3 min-w-0">
                    <span className="font-bold text-sm text-text-primary">Recent Simulated Orders</span>
                    <span className="text-xs text-text-tertiary">Real-time status matching</span>
                  </div>

                  {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 sm:py-10 px-4 text-center rounded-xl border border-dashed border-border-primary bg-bg-secondary/40">
                      <div className="h-10 w-10 rounded-full bg-brand/10 flex items-center justify-center text-brand mb-3">
                        <Layers className="h-5 w-5" />
                      </div>
                      <p className="font-semibold text-sm text-text-primary">No Simulated Orders Executed</p>
                      <p className="text-xs text-text-secondary mt-1 max-w-sm">
                        Simulate a market order in the Quick Trade section above to observe real-time transaction ledger
                        updates and order matching.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2.5 min-w-0 max-h-72 overflow-y-auto pr-1">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="flex items-center justify-between gap-2 rounded-lg bg-bg-secondary p-2.5 sm:p-3 border border-border-primary min-w-0"
                        >
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                            <span
                              className={`rounded px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-bold shrink-0 ${
                                order.type === "BUY" ? "bg-profit-bg text-profit" : "bg-loss-bg text-loss"
                              }`}
                            >
                              {order.type}
                            </span>
                            <div className="min-w-0">
                              <p className="font-semibold text-xs text-text-primary truncate">{order.stock}</p>
                              <p className="text-[10px] text-text-tertiary truncate">
                                {order.id} · {order.timestamp}
                              </p>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <p className="font-semibold text-xs text-text-primary">
                              {order.qty} sh @ {formatCurrency(order.price)}
                            </p>
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-profit">
                              <Check className="h-3 w-3 shrink-0" /> {order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Static Showcase Mockup for Authenticated Platform Features */}
              {activeTab === "alerts" && (
                <div className="space-y-4 min-w-0">
                  <div className="flex items-center justify-between border-b border-border-primary pb-3 min-w-0">
                    <span className="font-bold text-sm text-text-primary">Configured Price Triggers</span>
                    <button className="inline-flex items-center gap-1 rounded-md bg-brand/10 px-2 py-1 text-xs font-medium text-brand shrink-0">
                      <Plus className="h-3 w-3" /> New Alert
                    </button>
                  </div>

                  <div className="space-y-2.5 min-w-0">
                    {[
                      { stock: "RELIANCE", condition: "Price crosses above", target: "₹3,000.00" },
                      { stock: "TCS", condition: "Price crosses below", target: "₹4,050.00" },
                      { stock: "TATAMOTORS", condition: "Price crosses above", target: "₹1,050.00" },
                    ].map((alert, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between gap-2 rounded-lg bg-bg-secondary p-2.5 sm:p-3 border border-border-primary min-w-0"
                      >
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                          <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-md bg-brand-secondary/10 text-brand-secondary">
                            <Bell className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-xs text-text-primary truncate">{alert.stock}</p>
                            <p className="text-[10px] sm:text-[11px] text-text-secondary truncate">
                              {alert.condition} <span className="font-bold text-text-primary">{alert.target}</span>
                            </p>
                          </div>
                        </div>

                        <span className="rounded-full bg-profit-bg px-2 sm:px-2.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-profit shrink-0">
                          ACTIVE
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
