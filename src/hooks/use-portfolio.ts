"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ordersApi } from "@/api/orders.api";
import { portfolioApi } from "@/api/portfolio.api";
import type { OrderRequest } from "@/types/api.types";

export function usePortfolio() {
  return useQuery({
    queryKey: ["portfolio"],
    queryFn: portfolioApi.getPortfolio,
  });
}

export function useOrderHistory(page = 0, size = 20) {
  return useQuery({
    queryKey: ["orders", "history", page, size],
    queryFn: () => ordersApi.getHistory(page, size),
  });
}

function useOrderMutation(side: "BUY" | "SELL") {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (order: OrderRequest) => side === "BUY" ? ordersApi.buy(order) : ordersApi.sell(order),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["portfolio"] }),
        queryClient.invalidateQueries({ queryKey: ["orders", "history"] }),
      ]);
    },
  });
}

export function useBuyOrder() {
  return useOrderMutation("BUY");
}

export function useSellOrder() {
  return useOrderMutation("SELL");
}
