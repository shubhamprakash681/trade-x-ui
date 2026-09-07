"use client";

import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { ErrorState } from "@/components/atoms/error-state";
import { Spinner } from "@/components/atoms/spinner";
import { useMarkAllNotificationsRead, useMarkNotificationRead, useNotifications } from "@/hooks/use-notification-features";
import { formatDateTime } from "@/lib/utils";

export default function NotificationsPage() {
  const notifications = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  if (notifications.isLoading) return <div className="flex min-h-64 items-center justify-center"><Spinner size="lg" /></div>;
  if (notifications.isError || !notifications.data) return <ErrorState title="Couldn't load notifications" description="Please try again in a moment." onRetry={() => notifications.refetch()} />;
  const unread = notifications.data.filter((item) => !item.readStatus).length;
  return <div className="mx-auto max-w-5xl space-y-6"><div className="flex flex-wrap items-end justify-between gap-4"><div><h1 className="flex items-center gap-2 text-3xl font-bold text-text-primary"><Bell className="h-7 w-7 text-brand" />Notifications</h1><p className="mt-1 text-text-secondary">Price-alert activity from your TradeX account.</p></div><Button variant="secondary" loading={markAllRead.isPending} disabled={!unread} onClick={() => markAllRead.mutate() }><CheckCheck className="h-4 w-4" />Mark all read</Button></div><Card className="p-0"><CardHeader className="mb-0 border-b border-border-primary px-5 py-4"><CardTitle>{unread ? `${unread} unread notification${unread === 1 ? "" : "s"}` : "All caught up"}</CardTitle></CardHeader><CardContent>{!notifications.data.length ? <p className="py-12 text-center text-sm text-text-secondary">No notifications yet.</p> : <ul>{notifications.data.map((notification) => <li key={notification.id} className={`flex gap-3 border-b border-border-primary px-5 py-4 last:border-0 ${notification.readStatus ? "" : "bg-brand/5"}`}><span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${notification.readStatus ? "bg-border-secondary" : "bg-brand"}`} aria-label={notification.readStatus ? "Read" : "Unread"} /><button type="button" disabled={notification.readStatus || markRead.isPending} onClick={() => markRead.mutate(notification.id)} className="min-w-0 flex-1 text-left"><p className="font-medium text-text-primary">{notification.title}</p><p className="mt-1 text-sm text-text-secondary">{notification.message}</p><p className="mt-1 text-xs text-text-tertiary">{notification.symbol} · {formatDateTime(notification.createdAt)}</p></button></li>)}</ul>}</CardContent></Card></div>;
}
