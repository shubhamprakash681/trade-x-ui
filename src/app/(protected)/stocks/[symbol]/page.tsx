"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { ErrorState } from "@/components/atoms/error-state";
import { Spinner } from "@/components/atoms/spinner";
import { useStock } from "@/hooks/use-stocks";
import { formatCurrency } from "@/lib/utils";

export default function StockDetailPage() {
  const params = useParams<{ symbol: string }>();
  const symbol = decodeURIComponent(params.symbol).toUpperCase();
  const stock = useStock(symbol);

  if (stock.isLoading) return <div className="flex min-h-64 items-center justify-center"><Spinner size="lg" /></div>;
  if (stock.isError || !stock.data) return <ErrorState title="Stock not found" description="This instrument may no longer be available." onRetry={() => stock.refetch()} />;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href="/markets" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary"><ArrowLeft className="h-4 w-4" />Back to markets</Link>
      <section className="flex flex-col justify-between gap-4 rounded-xl border border-border-primary bg-bg-secondary p-6 sm:flex-row sm:items-start">
        <div><p className="text-sm text-text-secondary">{stock.data.exchange} · {stock.data.sector}</p><h1 className="mt-1 text-3xl font-bold text-text-primary">{stock.data.symbol}</h1><p className="mt-1 text-text-secondary">{stock.data.name}</p></div>
        <div className="sm:text-right"><p className="text-sm text-text-secondary">Reference price</p><p className="mt-1 text-2xl font-semibold text-text-primary">{formatCurrency(stock.data.referencePrice)}</p></div>
      </section>
      <Card><CardHeader><CardTitle>Instrument details</CardTitle></CardHeader><CardContent className="grid gap-4 text-sm sm:grid-cols-3"><div><p className="text-text-tertiary">Symbol</p><p className="mt-1 font-medium text-text-primary">{stock.data.symbol}</p></div><div><p className="text-text-tertiary">Exchange</p><p className="mt-1 font-medium text-text-primary">{stock.data.exchange}</p></div><div><p className="text-text-tertiary">Data type</p><p className="mt-1 font-medium text-text-primary">{stock.data.synthetic ? "Simulated" : "Reference"}</p></div></CardContent></Card>
      <p className="text-sm text-text-secondary">Historical charts, live prices, and order placement are added in their respective later phases.</p>
    </div>
  );
}
