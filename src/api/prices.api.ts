import apiClient from "./client";
import type { PriceResponse } from "@/types/api.types";

export const pricesApi = {
  getLatestPrices: () =>
    apiClient
      .get<PriceResponse[]>("/api/prices/latest")
      .then((r) => r.data),

  getPrice: (symbol: string) =>
    apiClient
      .get<PriceResponse>(`/api/prices/${symbol}`)
      .then((r) => r.data),
};
