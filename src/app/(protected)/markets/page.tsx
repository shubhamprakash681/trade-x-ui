"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Card, CardContent } from "@/components/atoms/card";
import { ErrorState } from "@/components/atoms/error-state";
import { Input } from "@/components/atoms/input";
import { Spinner } from "@/components/atoms/spinner";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useStocks } from "@/hooks/use-stocks";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";

const PAGE_SIZE = 12;

export default function MarketsPage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const debouncedQuery = useDebouncedValue(query.trim());
  const stocks = useStocks(page, PAGE_SIZE, debouncedQuery);

  if (stocks.isError) {
    return <ErrorState title="Couldn't load markets" description="Check your connection and try again." onRetry={() => stocks.refetch()} />;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Markets</h1>
          <p className="mt-1 text-text-secondary">Browse TradeX&apos;s supported paper-trading instruments.</p>
        </div>
        <div className="w-full sm:w-80">
          <Input id="market-filter" label="Filter instruments" placeholder="Company or symbol" value={query} onChange={(event) => { setQuery(event.target.value); setPage(0); }} icon={<Search className="h-4 w-4" />} />
        </div>
      </div>

      {stocks.isLoading ? (
        <div className="flex min-h-64 items-center justify-center"><Spinner size="lg" /></div>
      ) : !stocks.data?.content.length ? (
        <Card><CardContent className="py-12 text-center text-text-secondary">No instruments match your search.</CardContent></Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {stocks.data.content.map((stock) => (
              <Link key={stock.symbol} href={`/stocks/${encodeURIComponent(stock.symbol)}`} className="rounded-xl border border-border-primary bg-bg-secondary p-5 transition-colors hover:border-brand hover:bg-bg-tertiary">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0"><h2 className="font-semibold text-text-primary">{stock.symbol}</h2><p className="mt-1 truncate text-sm text-text-secondary">{stock.name}</p></div>
                  <p className="shrink-0 text-sm font-semibold text-text-primary">{formatCurrency(stock.referencePrice)}</p>
                </div>
                <div className="mt-4 flex gap-2 text-xs"><span className="rounded bg-bg-tertiary px-2 py-1 text-text-secondary">{stock.exchange}</span><span className="rounded bg-bg-tertiary px-2 py-1 text-text-secondary">{stock.sector}</span></div>
              </Link>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-secondary">{stocks.data.totalElements} instrument{stocks.data.totalElements === 1 ? "" : "s"}</p>
            <div className="flex gap-2"><Button variant="secondary" size="sm" disabled={stocks.data.first} onClick={() => setPage((current) => current - 1)}><ChevronLeft className="h-4 w-4" />Previous</Button><Button variant="secondary" size="sm" disabled={stocks.data.last} onClick={() => setPage((current) => current + 1)}>Next<ChevronRight className="h-4 w-4" /></Button></div>
          </div>
        </>
      )}
    </div>
  );
}
