"use client";

import { Heart } from "lucide-react";
import { AxiosError } from "axios";
import { Button } from "@/components/atoms/button";
import { useToast } from "@/components/atoms/toast";
import { useAddToWatchlist, useRemoveFromWatchlist, useWatchlist } from "@/hooks/use-notification-features";

export function WatchlistToggle({ symbol }: { symbol: string }) {
  const { toast } = useToast();
  const watchlist = useWatchlist();
  const add = useAddToWatchlist();
  const remove = useRemoveFromWatchlist();
  const watched = watchlist.data?.some((item) => item.symbol === symbol) ?? false;
  const pending = add.isPending || remove.isPending;

  async function toggle() {
    try {
      if (watched) {
        await remove.mutateAsync(symbol);
        toast("success", "Removed from watchlist", `${symbol} is no longer being watched.`);
      } else {
        await add.mutateAsync(symbol);
        toast("success", "Added to watchlist", `${symbol} is now being watched.`);
      }
    } catch (exception) {
      const message = exception instanceof AxiosError ? exception.response?.data?.message : undefined;
      toast("error", "Watchlist update failed", message || "Please try again.");
    }
  }

  return <Button type="button" variant={watched ? "secondary" : "outline"} size="sm" loading={pending} onClick={toggle}><Heart className={`h-4 w-4 ${watched ? "fill-current text-loss" : ""}`} />{watched ? "Watching" : "Watch"}</Button>;
}
