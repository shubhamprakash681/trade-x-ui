"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { PriceChart } from "@/components/charts/price-chart";
import { OrderForm } from "@/components/orders/order-form";
import { WatchlistToggle } from "@/components/watchlist/watchlist-toggle";
import { ErrorState } from "@/components/atoms/error-state";
import { Spinner } from "@/components/atoms/spinner";
import { useLatestPrice, useMarketHistory } from "@/hooks/use-market";
import { usePortfolio } from "@/hooks/use-portfolio";
import { useLivePrice } from "@/hooks/use-live-price";
import { useStock } from "@/hooks/use-stocks";
import { formatCurrency, formatPercent, getPnlColor } from "@/lib/utils";
import { useWebSocketStore } from "@/store/websocket.store";

export default function StockDetailPage() {
  const params = useParams<{ symbol: string }>();
  const symbol = decodeURIComponent(params.symbol).toUpperCase();
  const stock = useStock(symbol);

  const [interval, setInterval] = useState("D");
  const [range, setRange] = useState("1Y");
  const [customDates, setCustomDates] = useState<{ from?: string; to?: string }>({});

  const history = useMarketHistory(symbol, {
    interval,
    range: customDates.from ? undefined : range,
    from: customDates.from,
    to: customDates.to,
  });

  const latestPrice = useLatestPrice(symbol);
  const portfolio = usePortfolio();
  const livePrice = useLivePrice(symbol);
  const connectionStatus = useWebSocketStore((state) => state.status);
  const displayedPrice = livePrice ?? latestPrice.data;
  const holding = portfolio.data?.holdings.find((item) => item.symbol === symbol);

  const handleIntervalChange = (newInterval: string) => {
    setInterval(newInterval);
    setCustomDates({});
    if (newInterval === "1s") {
      setRange("1D");
    } else if (newInterval === "1m" && range !== "1D" && range !== "5D") {
      setRange("1D");
    } else if (newInterval === "1h" && (range === "1D" || range === "5Y" || range === "All")) {
      setRange("1M");
    } else if (newInterval === "D" && (range === "1D" || range === "5D")) {
      setRange("1Y");
    } else if (newInterval === "W" && (range === "1D" || range === "5D" || range === "1M" || range === "3M")) {
      setRange("5Y");
    } else if (newInterval === "M" && range !== "5Y" && range !== "All") {
      setRange("All");
    }
  };

  const handleRangeChange = (newRange: string) => {
    setRange(newRange);
    setCustomDates({});
    if (newRange === "1D") {
      if (interval !== "1s" && interval !== "1m") {
        setInterval("1m");
      }
    } else if (newRange === "5D") {
      if (interval === "1s") {
        setInterval("1m");
      } else if (interval !== "1m" && interval !== "1h") {
        setInterval("1h");
      }
    } else if (newRange === "1M" || newRange === "3M" || newRange === "6M" || newRange === "YTD" || newRange === "1Y") {
      if (interval === "1s" || interval === "1m") {
        setInterval("D");
      }
    } else if (newRange === "5Y" || newRange === "All") {
      if (interval === "1s" || interval === "1m" || interval === "1h") {
        setInterval("D");
      }
    }
  };

  const handleCustomDateApply = (from: string, to: string) => {
    setCustomDates({ from, to });
  };

  if (stock.isLoading) return <div className="flex min-h-64 items-center justify-center"><Spinner size="lg" /></div>;
  if (stock.isError || !stock.data) return <ErrorState title="Stock not found" description="This instrument may no longer be available." onRetry={() => stock.refetch()} />;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href="/markets" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary"><ArrowLeft className="h-4 w-4" />Back to markets</Link>
      <section className="flex flex-col justify-between gap-4 rounded-xl border border-border-primary bg-bg-secondary p-6 sm:flex-row sm:items-start">
        <div><p className="text-sm text-text-secondary">{stock.data.exchange} · {stock.data.sector}</p><div className="mt-1 flex flex-wrap items-center gap-3"><h1 className="text-3xl font-bold text-text-primary">{stock.data.symbol}</h1><WatchlistToggle symbol={stock.data.symbol} /></div><p className="mt-1 text-text-secondary">{stock.data.name}</p></div>
        <div className="sm:text-right"><p className="flex items-center justify-end gap-2 text-sm text-text-secondary">{displayedPrice ? "Live price" : "Reference price"}<span className={`h-2 w-2 rounded-full ${connectionStatus === "connected" ? "bg-profit" : connectionStatus === "connecting" ? "bg-warning" : "bg-text-tertiary"}`} aria-label={`Live market connection ${connectionStatus}`} /></p><p className="mt-1 text-2xl font-semibold text-text-primary">{formatCurrency(displayedPrice?.price ?? stock.data.referencePrice)}</p>{displayedPrice && <p className={`mt-1 text-sm font-medium ${getPnlColor(displayedPrice.changePercent)}`}>{formatPercent(displayedPrice.changePercent)}</p>}</div>
      </section>
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle>Price history</CardTitle>
          <p className="mt-1 text-sm text-text-secondary">
            Multi-interval candlestick chart with volume histogram and live stream integration.
          </p>
        </CardHeader>
        <CardContent className="p-0 sm:p-4">
          {history.isError ? (
            <p className="py-12 text-center text-sm text-loss">Historical price data is unavailable right now.</p>
          ) : !history.data?.length && !history.isLoading ? (
            <p className="py-12 text-center text-sm text-text-secondary">No historical price data is available for this instrument.</p>
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
              onCustomDateApply={handleCustomDateApply}
              isLoading={history.isLoading}
            />
          )}
        </CardContent>
      </Card>
      <OrderForm stock={stock.data} holding={holding} />
      <Card><CardHeader><CardTitle>Instrument details</CardTitle></CardHeader><CardContent className="grid gap-4 text-sm sm:grid-cols-3"><div><p className="text-text-tertiary">Symbol</p><p className="mt-1 font-medium text-text-primary">{stock.data.symbol}</p></div><div><p className="text-text-tertiary">Exchange</p><p className="mt-1 font-medium text-text-primary">{stock.data.exchange}</p></div><div><p className="text-text-tertiary">Data type</p><p className="mt-1 font-medium text-text-primary">{stock.data.synthetic ? "Simulated" : "Reference"}</p></div></CardContent></Card>
    </div>
  );
}
