"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationsApi } from "@/api/notifications.api";
import type { AlertRequest } from "@/types/api.types";

export function useWatchlist() {
  return useQuery({ queryKey: ["watchlist"], queryFn: notificationsApi.getWatchlist });
}

export function useAddToWatchlist() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: notificationsApi.addToWatchlist, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["watchlist"] }) });
}

export function useRemoveFromWatchlist() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: notificationsApi.removeFromWatchlist, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["watchlist"] }) });
}

export function useAlerts() {
  return useQuery({ queryKey: ["alerts"], queryFn: notificationsApi.getAlerts });
}

export function useCreateAlert() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: (alert: AlertRequest) => notificationsApi.createAlert(alert), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["alerts"] }) });
}

export function useDeleteAlert() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: notificationsApi.deleteAlert, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["alerts"] }) });
}

export function useNotifications(limit = 100) {
  return useQuery({ queryKey: ["notifications", limit], queryFn: () => notificationsApi.getNotifications(limit) });
}

export function useUnreadNotificationCount() {
  return useQuery({ queryKey: ["notifications", "unread-count"], queryFn: notificationsApi.getUnreadCount, refetchInterval: 60_000 });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: notificationsApi.markAsRead, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }) });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: notificationsApi.markAllAsRead, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }) });
}
