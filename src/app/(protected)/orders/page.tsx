"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { ErrorState } from "@/components/atoms/error-state";
import { Spinner } from "@/components/atoms/spinner";
import { OrderHistoryTable } from "@/components/orders/order-history-table";
import { useOrderHistory } from "@/hooks/use-portfolio";

export default function OrdersPage() {
  const [page, setPage] = useState(0);
  const history = useOrderHistory(page);
  if (history.isLoading) return <div className="flex min-h-64 items-center justify-center"><Spinner size="lg" /></div>;
  if (history.isError || !history.data) return <ErrorState title="Couldn't load order history" description="Please try again in a moment." onRetry={() => history.refetch()} />;
  return <div className="mx-auto max-w-7xl space-y-6"><div><h1 className="text-3xl font-bold text-text-primary">Orders</h1><p className="mt-1 text-text-secondary">Executed paper-trading orders, newest first.</p></div><Card className="p-0"><CardHeader className="mb-0 border-b border-border-primary px-5 py-4"><CardTitle>Order history</CardTitle></CardHeader><CardContent><OrderHistoryTable orders={history.data.content} /></CardContent></Card><div className="flex items-center justify-between"><p className="text-sm text-text-secondary">{history.data.totalElements} order{history.data.totalElements === 1 ? "" : "s"}</p><div className="flex gap-2"><Button size="sm" variant="secondary" disabled={history.data.first} onClick={() => setPage((current) => current - 1)}><ChevronLeft className="h-4 w-4" />Previous</Button><Button size="sm" variant="secondary" disabled={history.data.last} onClick={() => setPage((current) => current + 1)}>Next<ChevronRight className="h-4 w-4" /></Button></div></div></div>;
}
