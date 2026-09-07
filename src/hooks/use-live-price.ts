"use client";

import { useEffect, useState } from "react";
import type { PriceResponse } from "@/types/api.types";
import { useWebSocketStore } from "@/store/websocket.store";
import { marketStream } from "@/websocket/market-stream";

export function useLivePrice(symbol: string) {
  const [price, setPrice] = useState<PriceResponse | null>(null);
  const setStatus = useWebSocketStore((state) => state.setStatus);

  useEffect(() => {
    if (!symbol) return;
    setStatus("connecting");
    return marketStream.subscribe(symbol, setPrice);
  }, [symbol, setStatus]);

  return price;
}
