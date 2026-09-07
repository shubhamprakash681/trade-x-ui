import apiClient from "./client";
import type {
  NotificationResponse,
  UnreadCountResponse,
  WatchlistResponse,
  AlertRequest,
  AlertResponse,
  DashboardResponse,
} from "@/types/api.types";

export const notificationsApi = {
  // Notifications
  getNotifications: (limit = 100) =>
    apiClient
      .get<NotificationResponse[]>("/api/notifications", {
        params: { limit },
      })
      .then((r) => r.data),

  getUnreadCount: () =>
    apiClient
      .get<UnreadCountResponse>("/api/notifications/unread-count")
      .then((r) => r.data),

  markAsRead: (id: number) =>
    apiClient
      .patch<NotificationResponse>(`/api/notifications/${id}/read`)
      .then((r) => r.data),

  markAllAsRead: () =>
    apiClient.post<void>("/api/notifications/read-all").then((r) => r.data),

  // Watchlist
  getWatchlist: () =>
    apiClient
      .get<WatchlistResponse[]>("/api/watchlist")
      .then((r) => r.data),

  addToWatchlist: (symbol: string) =>
    apiClient
      .post<WatchlistResponse>("/api/watchlist", { symbol })
      .then((r) => r.data),

  removeFromWatchlist: (symbol: string) =>
    apiClient.delete<void>(`/api/watchlist/${symbol}`).then((r) => r.data),

  // Alerts
  getAlerts: () =>
    apiClient.get<AlertResponse[]>("/api/alerts").then((r) => r.data),

  createAlert: (data: AlertRequest) =>
    apiClient.post<AlertResponse>("/api/alerts", data).then((r) => r.data),

  deleteAlert: (id: number) =>
    apiClient.delete<void>(`/api/alerts/${id}`).then((r) => r.data),

  // Dashboard
  getDashboard: () =>
    apiClient.get<DashboardResponse>("/api/dashboard").then((r) => r.data),
};
