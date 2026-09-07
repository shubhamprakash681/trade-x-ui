"use client";

import { useEffect, useState } from "react";
import type { PriceResponse } from "@/types/api.types";
import { marketStream } from "@/websocket/market-stream";

export function useLivePrices(symbols: string[]) {
  const [prices, setPrices] = useState<Record<string, PriceResponse>>({});
  const symbolKey = [...new Set(symbols.map((symbol) => symbol.toUpperCase()))].sort().join(",");

  useEffect(() => {
    const activeSymbols = symbolKey ? symbolKey.split(",") : [];
    const unsubscribers = activeSymbols.map((symbol) => marketStream.subscribe(symbol, (price) => {
      setPrices((current) => ({ ...current, [symbol]: price }));
    }));
    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  }, [symbolKey]);

  return prices;
}
