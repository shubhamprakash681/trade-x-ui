import apiClient from "./client";
import type {
  PortfolioSummaryResponse,
  HoldingResponse,
} from "@/types/api.types";

export const portfolioApi = {
  getSummary: () =>
    apiClient
      .get<PortfolioSummaryResponse>("/api/portfolio/summary")
      .then((r) => r.data),

  getHoldings: () =>
    apiClient
      .get<HoldingResponse[]>("/api/portfolio/holdings")
      .then((r) => r.data),
};
