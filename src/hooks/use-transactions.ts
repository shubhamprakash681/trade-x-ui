"use client";

import { useQuery } from "@tanstack/react-query";
import { transactionsApi } from "@/api/transactions.api";

export function useTransactions(page = 0, size = 20) {
  return useQuery({
    queryKey: ["transactions", page, size],
    queryFn: () => transactionsApi.getTransactions(page, size),
  });
}
