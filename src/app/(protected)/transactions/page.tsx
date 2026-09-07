"use client";

import { useState } from "react";
import { ArrowDownRight, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { ErrorState } from "@/components/atoms/error-state";
import { Spinner } from "@/components/atoms/spinner";
import { useTransactions } from "@/hooks/use-transactions";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export default function TransactionsPage() {
  const [page, setPage] = useState(0);
  const transactions = useTransactions(page);
  if (transactions.isLoading) return <div className="flex min-h-64 items-center justify-center"><Spinner size="lg" /></div>;
  if (transactions.isError || !transactions.data) return <ErrorState title="Couldn't load transactions" description="Please try again in a moment." onRetry={() => transactions.refetch()} />;
  return <div className="mx-auto max-w-6xl space-y-6"><div><h1 className="text-3xl font-bold text-text-primary">Transactions</h1><p className="mt-1 text-text-secondary">A ledger of your executed paper-trading orders.</p></div><Card className="p-0"><CardHeader className="mb-0 border-b border-border-primary px-5 py-4"><CardTitle>Transaction history</CardTitle></CardHeader><CardContent>{!transactions.data.content.length ? <p className="py-12 text-center text-sm text-text-secondary">No transactions yet. Executed buy and sell orders will appear here.</p> : <ul>{transactions.data.content.map((transaction) => <li key={transaction.id} className="flex items-center justify-between gap-4 border-b border-border-primary px-5 py-4 last:border-0"><div className="flex min-w-0 items-center gap-3"><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${transaction.type === "BUY" ? "bg-loss-bg text-loss" : "bg-profit-bg text-profit"}`}>{transaction.type === "BUY" ? <ArrowDownRight className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}</span><div className="min-w-0"><p className="truncate font-medium text-text-primary">{transaction.description}</p><p className="mt-1 text-xs text-text-tertiary">Order #{transaction.orderId} · {formatDateTime(transaction.createdAt)}</p></div></div><div className={`shrink-0 text-right font-semibold ${transaction.type === "BUY" ? "text-loss" : "text-profit"}`}><p>{transaction.type === "BUY" ? "−" : "+"}{formatCurrency(transaction.amount)}</p><p className="mt-1 text-xs font-medium uppercase">{transaction.type}</p></div></li>)}</ul>}</CardContent></Card><div className="flex items-center justify-between"><p className="text-sm text-text-secondary">{transactions.data.totalElements} transaction{transactions.data.totalElements === 1 ? "" : "s"}</p><div className="flex gap-2"><Button size="sm" variant="secondary" disabled={transactions.data.first} onClick={() => setPage((current) => current - 1)}><ChevronLeft className="h-4 w-4" />Previous</Button><Button size="sm" variant="secondary" disabled={transactions.data.last} onClick={() => setPage((current) => current + 1)}>Next<ChevronRight className="h-4 w-4" /></Button></div></div></div>;
}
