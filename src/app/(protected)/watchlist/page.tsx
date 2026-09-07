"use client";

import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";
import { AxiosError } from "axios";
import { Button } from "@/components/atoms/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { ErrorState } from "@/components/atoms/error-state";
import { Spinner } from "@/components/atoms/spinner";
import { useToast } from "@/components/atoms/toast";
import { useRemoveFromWatchlist, useWatchlist } from "@/hooks/use-notification-features";
import { formatDateTime } from "@/lib/utils";

export default function WatchlistPage() {
  const { toast } = useToast();
  const watchlist = useWatchlist();
  const remove = useRemoveFromWatchlist();
  if (watchlist.isLoading) return <div className="flex min-h-64 items-center justify-center"><Spinner size="lg" /></div>;
  if (watchlist.isError || !watchlist.data) return <ErrorState title="Couldn't load your watchlist" description="Please try again in a moment." onRetry={() => watchlist.refetch()} />;
  async function removeSymbol(symbol: string) { try { await remove.mutateAsync(symbol); toast("success", "Removed from watchlist", `${symbol} is no longer being watched.`); } catch (exception) { const message = exception instanceof AxiosError ? exception.response?.data?.message : undefined; toast("error", "Could not remove instrument", message || "Please try again."); } }
  return <div className="mx-auto max-w-5xl space-y-6"><div><h1 className="flex items-center gap-2 text-3xl font-bold text-text-primary"><Heart className="h-7 w-7 text-loss" />Watchlist</h1><p className="mt-1 text-text-secondary">Instruments you have saved for quick access.</p></div><Card className="p-0"><CardHeader className="mb-0 border-b border-border-primary px-5 py-4"><CardTitle>Saved instruments</CardTitle></CardHeader><CardContent>{!watchlist.data.length ? <div className="py-12 text-center"><p className="text-sm text-text-secondary">Your watchlist is empty.</p><Link href="/markets" className="mt-3 inline-block text-sm font-medium text-brand hover:text-brand-hover">Explore markets</Link></div> : <ul>{watchlist.data.map((item) => <li key={item.id} className="flex items-center justify-between gap-4 border-b border-border-primary px-5 py-4 last:border-0"><Link href={`/stocks/${encodeURIComponent(item.symbol)}`} className="min-w-0"><p className="font-semibold text-text-primary hover:text-brand">{item.symbol}</p><p className="truncate text-sm text-text-secondary">{item.stockName} · {item.exchange}</p><p className="mt-1 text-xs text-text-tertiary">Added {formatDateTime(item.createdAt)}</p></Link><Button aria-label={`Remove ${item.symbol} from watchlist`} variant="ghost" size="sm" loading={remove.isPending && remove.variables === item.symbol} onClick={() => removeSymbol(item.symbol)}><Trash2 className="h-4 w-4 text-loss" /></Button></li>)}</ul>}</CardContent></Card></div>;
}
