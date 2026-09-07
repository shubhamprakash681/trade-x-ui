"use client";

import { useQuery } from "@tanstack/react-query";
import { marketApi } from "@/api/market.api";

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
