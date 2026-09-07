"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { PriceChart } from "@/components/charts/price-chart";
import { ErrorState } from "@/components/atoms/error-state";
import { Spinner } from "@/components/atoms/spinner";
import { useLatestPrice, useMarketHistory } from "@/hooks/use-market";
import { useLivePrice } from "@/hooks/use-live-price";
import { useStock } from "@/hooks/use-stocks";
import { formatCurrency, formatPercent, getPnlColor } from "@/lib/utils";
import { useWebSocketStore } from "@/store/websocket.store";

export default function StockDetailPage() {
  const params = useParams<{ symbol: string }>();
  const symbol = decodeURIComponent(params.symbol).toUpperCase();
  const stock = useStock(symbol);
  const history = useMarketHistory(symbol);
  const latestPrice = useLatestPrice(symbol);
  const livePrice = useLivePrice(symbol);
  const connectionStatus = useWebSocketStore((state) => state.status);
  const displayedPrice = livePrice ?? latestPrice.data;

  if (stock.isLoading) return <div className="flex min-h-64 items-center justify-center"><Spinner size="lg" /></div>;
  if (stock.isError || !stock.data) return <ErrorState title="Stock not found" description="This instrument may no longer be available." onRetry={() => stock.refetch()} />;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href="/markets" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary"><ArrowLeft className="h-4 w-4" />Back to markets</Link>
      <section className="flex flex-col justify-between gap-4 rounded-xl border border-border-primary bg-bg-secondary p-6 sm:flex-row sm:items-start">
        <div><p className="text-sm text-text-secondary">{stock.data.exchange} · {stock.data.sector}</p><h1 className="mt-1 text-3xl font-bold text-text-primary">{stock.data.symbol}</h1><p className="mt-1 text-text-secondary">{stock.data.name}</p></div>
        <div className="sm:text-right"><p className="flex items-center justify-end gap-2 text-sm text-text-secondary">{displayedPrice ? "Live price" : "Reference price"}<span className={`h-2 w-2 rounded-full ${connectionStatus === "connected" ? "bg-profit" : connectionStatus === "connecting" ? "bg-warning" : "bg-text-tertiary"}`} aria-label={`Live market connection ${connectionStatus}`} /></p><p className="mt-1 text-2xl font-semibold text-text-primary">{formatCurrency(displayedPrice?.price ?? stock.data.referencePrice)}</p>{displayedPrice && <p className={`mt-1 text-sm font-medium ${getPnlColor(displayedPrice.changePercent)}`}>{formatPercent(displayedPrice.changePercent)}</p>}</div>
      </section>
      <Card>
        <CardHeader><CardTitle>Price history</CardTitle><p className="mt-1 text-sm text-text-secondary">Daily backend-generated candles. The labelled price line updates from the live market stream.</p></CardHeader>
        <CardContent>
          {history.isLoading ? <div className="flex h-[360px] items-center justify-center"><Spinner size="lg" /></div> : history.isError ? <p className="py-12 text-center text-sm text-loss">Historical price data is unavailable right now.</p> : !history.data?.length ? <p className="py-12 text-center text-sm text-text-secondary">No historical price data is available for this instrument.</p> : <PriceChart candles={history.data} livePrice={livePrice} />}
        </CardContent>
      </Card>
      <Card><CardHeader><CardTitle>Instrument details</CardTitle></CardHeader><CardContent className="grid gap-4 text-sm sm:grid-cols-3"><div><p className="text-text-tertiary">Symbol</p><p className="mt-1 font-medium text-text-primary">{stock.data.symbol}</p></div><div><p className="text-text-tertiary">Exchange</p><p className="mt-1 font-medium text-text-primary">{stock.data.exchange}</p></div><div><p className="text-text-tertiary">Data type</p><p className="mt-1 font-medium text-text-primary">{stock.data.synthetic ? "Simulated" : "Reference"}</p></div></CardContent></Card>
      <p className="text-sm text-text-secondary">Order placement is added in a later phase.</p>
    </div>
  );
}
