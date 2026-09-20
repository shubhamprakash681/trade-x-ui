"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Briefcase,
  History,
  Activity,
} from "lucide-react";
import { PriceChart } from "@/components/charts/price-chart";
import { FastOrderTicket } from "@/components/orders/fast-order-ticket";
import { OrderBookDepth } from "@/components/market/order-book-depth";
import { WatchlistToggle } from "@/components/watchlist/watchlist-toggle";
import { ErrorState } from "@/components/atoms/error-state";
import { StockDetailSkeleton } from "@/components/atoms/skeleton";
import { useToast } from "@/components/atoms/toast";
import { useLatestPrice, useMarketHistory } from "@/hooks/use-market";
import { usePortfolio, useOrderHistory, useSellOrder } from "@/hooks/use-portfolio";
import { useLivePrice } from "@/hooks/use-live-price";
import { useStock } from "@/hooks/use-stocks";
import {
  formatCurrency,
  formatPercent,
  formatQuantity,
  formatDateTime,
  getPnlColor,
  cn,
} from "@/lib/utils";
import { useWebSocketStore } from "@/store/websocket.store";

export default function StockDetailPage() {
  const params = useParams<{ symbol: string }>();
  const symbol = decodeURIComponent(params.symbol).toUpperCase();
  const { toast } = useToast();

  const stock = useStock(symbol);
  const latestPrice = useLatestPrice(symbol);
  const livePrice = useLivePrice(symbol);
  const portfolio = usePortfolio();
  const ordersQuery = useOrderHistory(0, 50);
  const sellMutation = useSellOrder();
  const connectionStatus = useWebSocketStore((state) => state.status);

  const [interval, setInterval] = useState("D");
  const [range, setRange] = useState("1Y");
  const [customDates, setCustomDates] = useState<{ from?: string; to?: string }>({});
  const [bottomTab, setBottomTab] = useState<"position" | "executions">("position");

  const history = useMarketHistory(symbol, {
    interval,
    range: customDates.from ? undefined : range,
    from: customDates.from,
    to: customDates.to,
  });

  const displayedPrice = livePrice ?? latestPrice.data;
  const currentPrice = displayedPrice?.price ?? stock.data?.referencePrice ?? 0;
  const changePercent = displayedPrice?.changePercent ?? 0;
  const isUp = changePercent >= 0;

  const holding = portfolio.data?.holdings.find((item) => item.symbol.toUpperCase() === symbol);
  const ownedQuantity = holding?.quantity ?? 0;

  // Past executions for this stock
  const stockOrders = (ordersQuery.data?.content ?? []).filter(
    (o) => o.symbol.toUpperCase() === symbol
  );

  // 24H High / Low estimate
  const high24h = currentPrice * 1.025;
  const low24h = currentPrice * 0.975;
  const progress24h =
    high24h > low24h
      ? Math.min(Math.max(((currentPrice - low24h) / (high24h - low24h)) * 100, 5), 95)
      : 50;

  const handleLiquidatePosition = async () => {
    if (!holding || holding.quantity <= 0) return;
    try {
      await sellMutation.mutateAsync({
        symbol,
        quantity: holding.quantity,
      });
      toast(
        "success",
        "Position Liquidated",
        `Liquidated ${formatQuantity(holding.quantity)} shares of ${symbol} @ ${formatCurrency(currentPrice)}`
      );
    } catch {
      toast("error", "Liquidation Failed", "Could not execute market sell order.");
    }
  };

  const handleIntervalChange = (newInterval: string) => {
    setInterval(newInterval);
    setCustomDates({});
    if (newInterval === "1s") setRange("1D");
    else if (newInterval === "1m" && range !== "1D" && range !== "5D") setRange("1D");
    else if (newInterval === "1h" && (range === "1D" || range === "5Y" || range === "All")) setRange("1M");
    else if (newInterval === "D" && (range === "1D" || range === "5D")) setRange("1Y");
    else if (newInterval === "W" && (range === "1D" || range === "5D" || range === "1M" || range === "3M")) setRange("5Y");
    else if (newInterval === "M" && range !== "5Y" && range !== "All") setRange("All");
  };

  const handleRangeChange = (newRange: string) => {
    setRange(newRange);
    setCustomDates({});
    if (newRange === "1D" && interval !== "1s" && interval !== "1m") setInterval("1m");
    else if (newRange === "5D" && interval === "1s") setInterval("1m");
    else if ((newRange === "1M" || newRange === "3M" || newRange === "6M" || newRange === "YTD" || newRange === "1Y") && (interval === "1s" || interval === "1m")) setInterval("D");
    else if ((newRange === "5Y" || newRange === "All") && (interval === "1s" || interval === "1m" || interval === "1h")) setInterval("D");
  };

  if (stock.isLoading) {
    return <StockDetailSkeleton />;
  }

  if (stock.isError || !stock.data) {
    return (
      <ErrorState
        title="Stock not found"
        description="This instrument may no longer be available."
        onRetry={() => stock.refetch()}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* ─── Top Telemetry Header Bar ────────────────────────────────────────── */}
      <section className="rounded-xl border border-border-primary bg-bg-secondary p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Left: Symbol & Metadata */}
          <div className="flex items-center gap-3">
            <Link
              href="/markets"
              className="rounded-lg border border-border-primary p-2 text-text-secondary hover:bg-bg-tertiary hover:text-text-primary transition-colors"
              title="Back to markets"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-text-primary">
                  {stock.data.symbol}
                </h1>
                <span className="rounded border border-border-primary bg-bg-tertiary px-2 py-0.5 text-[11px] font-bold text-text-secondary">
                  {stock.data.exchange}
                </span>
                <span className="rounded border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[11px] font-bold text-cyan-400">
                  {stock.data.sector}
                </span>
                {stock.data.synthetic && (
                  <span className="rounded border border-warning/30 bg-warning/10 px-2 py-0.5 text-[11px] font-bold text-warning">
                    SYNTHETIC
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs text-text-secondary">
                {stock.data.name}
              </p>
            </div>

            <div className="ml-2">
              <WatchlistToggle symbol={stock.data.symbol} />
            </div>
          </div>

          {/* Center: 24h High/Low Slider */}
          <div className="hidden xl:flex items-center gap-3 text-xs font-mono text-text-secondary tabular-nums">
            <span>24H L: {formatCurrency(low24h)}</span>
            <div className="relative h-2 w-36 rounded-full bg-bg-tertiary overflow-hidden border border-border-primary/60">
              <div
                className="h-full rounded-full bg-gradient-to-r from-loss via-warning to-profit transition-all duration-300"
                style={{ width: `${progress24h}%` }}
              />
            </div>
            <span>24H H: {formatCurrency(high24h)}</span>
          </div>

          {/* Right: Live Price & Ticker Pulse */}
          <div className="text-right">
            <div className="flex items-center justify-end gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  connectionStatus === "connected"
                    ? "bg-profit animate-pulse"
                    : connectionStatus === "connecting"
                    ? "bg-warning"
                    : "bg-text-tertiary"
                }`}
                title={`Market connection: ${connectionStatus}`}
              />
              <span className="text-2xl font-black text-text-primary font-mono tabular-nums">
                {formatCurrency(currentPrice)}
              </span>
            </div>
            {displayedPrice && (
              <p
                className={cn(
                  "mt-0.5 text-xs font-bold font-mono tabular-nums flex items-center justify-end gap-1",
                  isUp ? "text-profit" : "text-loss"
                )}
              >
                {isUp ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                {formatPercent(changePercent)}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ─── 2-Column Pro Workstation Cockpit ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Candlestick Chart & Bottom Studio Drawer */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Chart Card */}
          <div className="rounded-xl border border-border-primary bg-bg-secondary p-4 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between border-b border-border-primary pb-3 mb-3">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-text-primary">
                  Interactive Price Chart
                </h2>
                <p className="text-xs text-text-secondary">
                  Sub-second candlestick engine with volume histogram and live tick interpolation.
                </p>
              </div>
              <span className="rounded bg-bg-tertiary px-2 py-1 text-[11px] font-mono text-text-tertiary border border-border-primary">
                {stock.data.symbol} · {interval}
              </span>
            </div>

            {history.isError ? (
              <p className="py-16 text-center text-sm text-loss">Historical price data is unavailable right now.</p>
            ) : !history.data?.length && !history.isLoading ? (
              <p className="py-16 text-center text-sm text-text-secondary">No historical price data is available for this instrument.</p>
            ) : (
              <PriceChart
                symbol={stock.data.symbol}
                stockName={stock.data.name}
                exchange={stock.data.exchange}
                candles={history.data ?? []}
                livePrice={livePrice}
                interval={interval}
                range={range}
                onIntervalChange={handleIntervalChange}
                onRangeChange={handleRangeChange}
                onCustomDateApply={(from, to) => setCustomDates({ from, to })}
                isLoading={history.isLoading}
              />
            )}
          </div>

          {/* Bottom Studio Drawer: Active Position & Executions */}
          <div className="rounded-xl border border-border-primary bg-bg-secondary overflow-hidden shadow-sm font-mono text-xs">
            {/* Drawer Tabs */}
            <div className="flex items-center justify-between border-b border-border-primary px-4 py-2.5 bg-bg-secondary">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setBottomTab("position")}
                  className={cn(
                    "flex items-center gap-1.5 font-bold uppercase tracking-wider transition-colors cursor-pointer",
                    bottomTab === "position" ? "text-brand border-b-2 border-brand pb-0.5" : "text-text-secondary hover:text-text-primary"
                  )}
                >
                  <Briefcase className="h-3.5 w-3.5" />
                  <span>Open Position ({ownedQuantity > 0 ? "1" : "0"})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBottomTab("executions")}
                  className={cn(
                    "flex items-center gap-1.5 font-bold uppercase tracking-wider transition-colors cursor-pointer",
                    bottomTab === "executions" ? "text-brand border-b-2 border-brand pb-0.5" : "text-text-secondary hover:text-text-primary"
                  )}
                >
                  <History className="h-3.5 w-3.5" />
                  <span>Executions ({stockOrders.length})</span>
                </button>
              </div>

              <span className="text-[11px] text-text-tertiary font-bold">
                PORTFOLIO TELEMETRY
              </span>
            </div>

            {/* Tab 1: Position */}
            {bottomTab === "position" && (
              <div className="p-4">
                {holding && holding.quantity > 0 ? (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
                      <div>
                        <span className="text-[10px] uppercase text-text-tertiary font-bold">Position</span>
                        <p className="text-sm font-bold text-text-primary mt-0.5 tabular-nums">
                          {formatQuantity(holding.quantity)} Shares
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-text-tertiary font-bold">Avg Price</span>
                        <p className="text-sm font-bold text-text-primary mt-0.5 tabular-nums">
                          {formatCurrency(holding.averagePrice)}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-text-tertiary font-bold">Market Value</span>
                        <p className="text-sm font-bold text-text-primary mt-0.5 tabular-nums">
                          {formatCurrency(holding.quantity * currentPrice)}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-text-tertiary font-bold">Unrealized P&L</span>
                        <p className={cn("text-sm font-bold mt-0.5 tabular-nums", getPnlColor(holding.unrealizedPnl))}>
                          {formatCurrency(holding.unrealizedPnl)} ({formatPercent(holding.unrealizedPnlPercent)})
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleLiquidatePosition}
                      disabled={sellMutation.isPending}
                      className="rounded-lg bg-loss px-4 py-2 font-bold text-white hover:opacity-90 active:scale-95 transition-all cursor-pointer self-start sm:self-auto disabled:opacity-50"
                    >
                      {sellMutation.isPending ? "Liquidating..." : "Liquidate Position"}
                    </button>
                  </div>
                ) : (
                  <div className="py-6 text-center text-text-secondary font-sans">
                    <p className="text-sm font-medium text-text-primary">No active position in {symbol}</p>
                    <p className="text-xs mt-1">Use the Fast Order Ticket on the right to enter a position.</p>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Executions */}
            {bottomTab === "executions" && (
              <div className="overflow-x-auto">
                {stockOrders.length > 0 ? (
                  <table className="w-full text-left text-xs tabular-nums select-none">
                    <thead className="border-b border-border-primary bg-bg-tertiary/40 text-[10px] uppercase text-text-tertiary font-bold">
                      <tr>
                        <th className="px-4 py-2">Timestamp</th>
                        <th className="px-4 py-2">Side</th>
                        <th className="px-4 py-2 text-right">Quantity</th>
                        <th className="px-4 py-2 text-right">Price</th>
                        <th className="px-4 py-2 text-right">Total</th>
                        <th className="px-4 py-2 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-primary/50">
                      {stockOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-bg-tertiary/40 transition-colors">
                          <td className="px-4 py-2 text-text-secondary">{formatDateTime(order.createdAt)}</td>
                          <td className="px-4 py-2 font-bold">
                            <span
                              className={cn(
                                "rounded px-1.5 py-0.5 text-[10px]",
                                order.side === "BUY" ? "bg-profit/10 text-profit" : "bg-loss/10 text-loss"
                              )}
                            >
                              {order.side}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-right font-medium text-text-primary">
                            {formatQuantity(order.quantity)}
                          </td>
                          <td className="px-4 py-2 text-right text-text-secondary">
                            {formatCurrency(order.price)}
                          </td>
                          <td className="px-4 py-2 text-right font-bold text-text-primary">
                            {formatCurrency(order.quantity * order.price)}
                          </td>
                          <td className="px-4 py-2 text-center text-text-tertiary">
                            <span className="rounded bg-bg-tertiary px-1.5 py-0.5 text-[10px] font-bold">
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="py-6 text-center text-text-secondary font-sans">
                    <p className="text-sm font-medium text-text-primary">No previous executions found</p>
                    <p className="text-xs mt-1">Orders placed for {symbol} will appear here.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Docked Fast Order Ticket & Level-2 Depth Simulator */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <FastOrderTicket
            stock={stock.data}
            holding={holding}
            currentPrice={currentPrice}
          />

          <OrderBookDepth currentPrice={currentPrice} />
        </div>
      </div>
    </div>
  );
}
