"use client";

import { useQuery } from "@tanstack/react-query";
import { stocksApi } from "@/api/stocks.api";

export function useStocks(page = 0, size = 20, query = "") {
  return useQuery({
    queryKey: ["stocks", { page, size, query }],
    queryFn: () => stocksApi.getStocks(page, size, query),
  });
}

export function useStock(symbol: string) {
  return useQuery({
    queryKey: ["stocks", symbol],
    queryFn: () => stocksApi.getStock(symbol),
    enabled: Boolean(symbol),
  });
}

export function useStockSearch(query: string) {
  return useQuery({
    queryKey: ["stocks", "search", query],
    queryFn: () => stocksApi.search(query),
    enabled: query.trim().length >= 2,
  });
}
