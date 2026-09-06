import apiClient from "./client";
import type {
  CandleResponse,
  MarketMoverResponse,
  MarketTrendResponse,
} from "@/types/api.types";

export const marketApi = {
  getHistory: (symbol: string, from?: string, to?: string) =>
    apiClient
      .get<CandleResponse[]>(`/api/market/history/${symbol}`, {
        params: { from, to },
      })
      .then((r) => r.data),

  getLatestCandle: (symbol: string) =>
    apiClient
      .get<CandleResponse>(`/api/market/candle/${symbol}`)
      .then((r) => r.data),

  getGainers: () =>
    apiClient
      .get<MarketMoverResponse[]>("/api/market/gainers")
      .then((r) => r.data),

  getLosers: () =>
    apiClient
      .get<MarketMoverResponse[]>("/api/market/losers")
      .then((r) => r.data),

  getTrending: () =>
    apiClient
      .get<MarketTrendResponse[]>("/api/market/trending")
      .then((r) => r.data),
};
