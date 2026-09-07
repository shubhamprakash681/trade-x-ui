import apiClient from "./client";
import type {
  PortfolioResponse,
  PortfolioSummaryResponse,
  HoldingResponse,
} from "@/types/api.types";

export const portfolioApi = {
  getPortfolio: () =>
    apiClient.get<PortfolioResponse>("/api/portfolio").then((r) => r.data),

  getSummary: () =>
    apiClient
      .get<PortfolioSummaryResponse>("/api/portfolio/summary")
      .then((r) => r.data),

  getHoldings: () =>
    apiClient
      .get<HoldingResponse[]>("/api/portfolio/holdings")
      .then((r) => r.data),
};
