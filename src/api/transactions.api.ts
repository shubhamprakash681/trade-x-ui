import apiClient from "./client";
import type { TransactionResponse, PageResponse } from "@/types/api.types";

export const transactionsApi = {
  getTransactions: (page = 0, size = 20) =>
    apiClient
      .get<PageResponse<TransactionResponse>>("/api/transactions", {
        params: { page, size },
      })
      .then((r) => r.data),
};
