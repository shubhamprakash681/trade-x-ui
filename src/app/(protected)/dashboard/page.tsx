"use client";

import { StockSearch } from "@/components/market/stock-search";
import { MarketMoverList } from "@/components/market/market-mover-list";
import { useGainers, useLosers, useTrending } from "@/hooks/use-market";
import { useLivePrices } from "@/hooks/use-live-prices";

export default function DashboardPage() {
  const gainers = useGainers();
  const losers = useLosers();
  const trending = useTrending();
  const livePrices = useLivePrices([
    ...(gainers.data ?? []),
    ...(losers.data ?? []),
    ...(trending.data ?? []),
  ].map((item) => item.symbol));

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section>
        <p className="text-sm font-medium text-brand">Market overview</p>
        <h1 className="mt-1 text-3xl font-bold text-text-primary">Discover today&apos;s market</h1>
        <p className="mt-2 text-text-secondary">Search the available TradeX instruments and review backend-generated market movements.</p>
        <div className="mt-6"><StockSearch /></div>
      </section>
      <section className="grid gap-5 xl:grid-cols-3">
        <MarketMoverList title="Top gainers" kind="gainers" items={gainers.data} isLoading={gainers.isLoading} isError={gainers.isError} livePrices={livePrices} />
        <MarketMoverList title="Top losers" kind="losers" items={losers.data} isLoading={losers.isLoading} isError={losers.isError} livePrices={livePrices} />
        <MarketMoverList title="Trending" kind="trending" items={trending.data} isLoading={trending.isLoading} isError={trending.isError} livePrices={livePrices} />
      </section>
    </div>
  );
}
