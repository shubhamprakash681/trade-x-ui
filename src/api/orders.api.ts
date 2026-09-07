import apiClient from "./client";
import type {
  OrderRequest,
  OrderResponse,
  PageResponse,
} from "@/types/api.types";

export const ordersApi = {
  buy: (data: OrderRequest) =>
    apiClient
      .post<OrderResponse>("/api/orders/buy", data)
      .then((r) => r.data),

  sell: (data: OrderRequest) =>
    apiClient
      .post<OrderResponse>("/api/orders/sell", data)
      .then((r) => r.data),

  getHistory: (page = 0, size = 20) =>
    apiClient
      .get<PageResponse<OrderResponse>>("/api/orders/history", {
        params: { page, size },
      })
      .then((r) => r.data),
};
