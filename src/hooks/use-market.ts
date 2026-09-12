"use client";

import { useQuery } from "@tanstack/react-query";
import { marketApi, type MarketHistoryParams } from "@/api/market.api";
import { pricesApi } from "@/api/prices.api";

const MARKET_STALE_TIME = 60_000;

export function useGainers() {
  return useQuery({
    queryKey: ["market", "gainers"],
    queryFn: marketApi.getGainers,
    staleTime: MARKET_STALE_TIME,
  });
}

export function useLosers() {
  return useQuery({
    queryKey: ["market", "losers"],
    queryFn: marketApi.getLosers,
    staleTime: MARKET_STALE_TIME,
  });
}

export function useTrending() {
  return useQuery({
    queryKey: ["market", "trending"],
    queryFn: marketApi.getTrending,
    staleTime: MARKET_STALE_TIME,
  });
}

export function useMarketHistory(symbol: string, params?: MarketHistoryParams) {
  return useQuery({
    queryKey: ["market", "history", symbol, params?.interval, params?.range, params?.from, params?.to],
    queryFn: () => marketApi.getHistory(symbol, params),
    enabled: Boolean(symbol),
    staleTime: params?.interval === "1s" || params?.interval === "SECONDS" ? 2_000 : 30_000,
  });
}

export function useLatestPrice(symbol: string) {
  return useQuery({
    queryKey: ["prices", symbol],
    queryFn: () => pricesApi.getPrice(symbol),
    enabled: Boolean(symbol),
    staleTime: 30_000,
  });
}
