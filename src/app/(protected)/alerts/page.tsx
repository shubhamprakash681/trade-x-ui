"use client";

import { useState, type FormEvent } from "react";
import { BellDot, Trash2 } from "lucide-react";
import { AxiosError } from "axios";
import { Button } from "@/components/atoms/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { ErrorState } from "@/components/atoms/error-state";
import { Input } from "@/components/atoms/input";
import { Spinner } from "@/components/atoms/spinner";
import { useToast } from "@/components/atoms/toast";
import { useAlerts, useCreateAlert, useDeleteAlert } from "@/hooks/use-notification-features";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import type { AlertCondition } from "@/types/api.types";

export default function AlertsPage() {
  const { toast } = useToast();
  const alerts = useAlerts();
  const create = useCreateAlert();
  const remove = useDeleteAlert();
  const [symbol, setSymbol] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [condition, setCondition] = useState<AlertCondition>("ABOVE");
  const [formError, setFormError] = useState<string>();
  if (alerts.isLoading) return <div className="flex min-h-64 items-center justify-center"><Spinner size="lg" /></div>;
  if (alerts.isError || !alerts.data) return <ErrorState title="Couldn't load alerts" description="Please try again in a moment." onRetry={() => alerts.refetch()} />;
  async function submit(event: FormEvent) { event.preventDefault(); const price = Number(targetPrice); if (!symbol.trim() || !Number.isFinite(price) || price < 0.0001) { setFormError("Enter a stock symbol and target price of at least ₹0.0001."); return; } setFormError(undefined); try { await create.mutateAsync({ symbol: symbol.trim().toUpperCase(), targetPrice: price, condition }); toast("success", "Price alert created", `You'll be notified when ${symbol.trim().toUpperCase()} moves ${condition.toLowerCase()} ${formatCurrency(price)}.`); setSymbol(""); setTargetPrice(""); } catch (exception) { const message = exception instanceof AxiosError ? exception.response?.data?.message : undefined; toast("error", "Alert could not be created", message || "Please verify the stock symbol and try again."); } }
  async function deleteAlert(id: number) { try { await remove.mutateAsync(id); toast("success", "Alert deleted"); } catch (exception) { const message = exception instanceof AxiosError ? exception.response?.data?.message : undefined; toast("error", "Alert could not be deleted", message || "Please try again."); } }
  return <div className="mx-auto max-w-5xl space-y-6"><div><h1 className="flex items-center gap-2 text-3xl font-bold text-text-primary"><BellDot className="h-7 w-7 text-brand" />Price alerts</h1><p className="mt-1 text-text-secondary">Get notified when a supported instrument crosses your selected price.</p></div><Card><CardHeader><CardTitle>Create alert</CardTitle></CardHeader><CardContent><form className="grid gap-4 md:grid-cols-4 md:items-end" onSubmit={submit} noValidate><Input id="alert-symbol" label="Symbol" maxLength={32} placeholder="RELIANCE" value={symbol} onChange={(event) => setSymbol(event.target.value)} /><Input id="alert-target" label="Target price" type="number" min="0.0001" step="0.0001" inputMode="decimal" placeholder="0.00" value={targetPrice} onChange={(event) => setTargetPrice(event.target.value)} /><label className="block text-sm font-medium text-text-secondary">Condition<select value={condition} onChange={(event) => setCondition(event.target.value as AlertCondition)} className="mt-1.5 h-10 w-full rounded-lg border border-border-secondary bg-bg-primary px-3 text-sm text-text-primary"><option value="ABOVE">Moves above</option><option value="BELOW">Moves below</option></select></label><Button type="submit" loading={create.isPending}>Create alert</Button></form>{formError && <p className="mt-2 text-sm text-loss" role="alert">{formError}</p>}</CardContent></Card><Card className="p-0"><CardHeader className="mb-0 border-b border-border-primary px-5 py-4"><CardTitle>My alerts</CardTitle></CardHeader><CardContent>{!alerts.data.length ? <p className="py-12 text-center text-sm text-text-secondary">No price alerts yet.</p> : <ul>{alerts.data.map((alert) => <li key={alert.id} className="flex items-center justify-between gap-4 border-b border-border-primary px-5 py-4 last:border-0"><div><p className="font-semibold text-text-primary">{alert.symbol} <span className="text-sm font-normal text-text-secondary">{alert.stockName}</span></p><p className="mt-1 text-sm text-text-secondary">{alert.condition === "ABOVE" ? "Above" : "Below"} {formatCurrency(alert.targetPrice)} · <span className={alert.status === "ACTIVE" ? "text-brand" : "text-profit"}>{alert.status}</span></p><p className="mt-1 text-xs text-text-tertiary">Created {formatDateTime(alert.createdAt)}</p>{alert.triggeredAt && <p className="mt-1 text-xs text-profit">Triggered at {formatCurrency(alert.triggeredPrice)} on {formatDateTime(alert.triggeredAt)}</p>}</div><Button aria-label={`Delete ${alert.symbol} alert`} variant="ghost" size="sm" loading={remove.isPending && remove.variables === alert.id} onClick={() => deleteAlert(alert.id)}><Trash2 className="h-4 w-4 text-loss" /></Button></li>)}</ul>}</CardContent></Card></div>;
}
