import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, TrendingUp } from "lucide-react";
import type { MarketMoverResponse, MarketTrendResponse, PriceResponse } from "@/types/api.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { formatCurrency, formatPercent, getPnlColor } from "@/lib/utils";

type Mover = MarketMoverResponse | MarketTrendResponse;

interface MarketMoverListProps {
  title: string;
  items?: Mover[];
  kind: "gainers" | "losers" | "trending";
  isLoading: boolean;
  isError: boolean;
  livePrices?: Record<string, PriceResponse>;
}

function isMover(item: Mover): item is MarketMoverResponse {
  return "changeAmount" in item;
}

export function MarketMoverList({ title, items, kind, isLoading, isError, livePrices = {} }: MarketMoverListProps) {
  return (
    <Card className="p-0">
      <CardHeader className="mb-0 flex items-center gap-2 border-b border-border-primary px-5 py-4">
        {kind === "gainers" ? <ArrowUpRight className="h-5 w-5 text-profit" /> : kind === "losers" ? <ArrowDownRight className="h-5 w-5 text-loss" /> : <TrendingUp className="h-5 w-5 text-brand" />}
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && <p className="p-5 text-sm text-text-secondary">Loading market data…</p>}
        {isError && <p className="p-5 text-sm text-loss">Market data is unavailable right now.</p>}
        {!isLoading && !isError && !items?.length && <p className="p-5 text-sm text-text-secondary">No market data is available.</p>}
        {!isLoading && !isError && items?.map((item) => {
          const livePrice = livePrices[item.symbol];
          const price = livePrice?.price ?? item.price;
          const changePercent = livePrice?.changePercent ?? item.changePercent;
          const changeAmount = livePrice?.changeAmount ?? (isMover(item) ? item.changeAmount : undefined);
          return (
          <Link key={item.symbol} href={`/stocks/${encodeURIComponent(item.symbol)}`} className="flex items-center justify-between gap-3 border-b border-border-primary px-5 py-3 last:border-0 hover:bg-bg-tertiary">
            <div className="min-w-0">
              <p className="font-semibold text-text-primary">{item.symbol}</p>
              <p className="truncate text-xs text-text-secondary">{item.name}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-sm font-medium text-text-primary">{formatCurrency(price)}</p>
              <p className={`text-xs font-medium ${getPnlColor(changePercent)}`}>
                {formatPercent(changePercent)}{changeAmount !== undefined ? ` · ${formatCurrency(changeAmount)}` : ""}
              </p>
            </div>
          </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
