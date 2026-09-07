import apiClient from "./client";
import type { StockResponse, PageResponse } from "@/types/api.types";

export const stocksApi = {
  getStocks: (page = 0, size = 20, q?: string) =>
    apiClient
      .get<PageResponse<StockResponse>>("/api/stocks", {
        params: { page, size, q: q || undefined },
      })
      .then((r) => r.data),

  search: (q: string) =>
    apiClient
      .get<StockResponse[]>("/api/stocks/search", { params: { q } })
      .then((r) => r.data),

  getStock: (symbol: string) =>
    apiClient.get<StockResponse>(`/api/stocks/${symbol}`).then((r) => r.data),
};
