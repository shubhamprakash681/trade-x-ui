"use client";

import { useState, type FormEvent } from "react";
import { AxiosError } from "axios";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { useToast } from "@/components/atoms/toast";
import { useBuyOrder, useSellOrder } from "@/hooks/use-portfolio";
import type { HoldingResponse, OrderSide, StockResponse } from "@/types/api.types";
import { formatCurrency, formatQuantity } from "@/lib/utils";

interface OrderFormProps {
  stock: StockResponse;
  holding?: HoldingResponse;
}

export function OrderForm({ stock, holding }: OrderFormProps) {
  const { toast } = useToast();
  const buyOrder = useBuyOrder();
  const sellOrder = useSellOrder();
  const [side, setSide] = useState<OrderSide>("BUY");
  const [quantity, setQuantity] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState<string>();
  const activeMutation = side === "BUY" ? buyOrder : sellOrder;

  function validate(): number | null {
    const parsed = Number(quantity);
    if (!Number.isFinite(parsed) || parsed < 0.0001) {
      setError("Enter a quantity of at least 0.0001.");
      return null;
    }
    setError(undefined);
    return parsed;
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (validate() !== null) setShowConfirmation(true);
  }

  async function confirmOrder() {
    const parsedQuantity = validate();
    if (parsedQuantity === null) return;
    try {
      const order = await activeMutation.mutateAsync({ symbol: stock.symbol, quantity: parsedQuantity });
      toast("success", `${order.side === "BUY" ? "Buy" : "Sell"} order executed`, `${formatQuantity(order.quantity)} ${order.symbol} executed at ${formatCurrency(order.price)}.`);
      setQuantity("");
      setShowConfirmation(false);
    } catch (exception) {
      const message = exception instanceof AxiosError ? exception.response?.data?.message : undefined;
      toast("error", "Order could not be executed", message || "Please review your balance or holdings and try again.");
      setShowConfirmation(false);
    }
  }

  return (
    <section className="rounded-xl border border-border-primary bg-bg-secondary p-5">
      <h2 className="text-lg font-semibold text-text-primary">Place a market order</h2>
      <p className="mt-1 text-sm text-text-secondary">Orders execute immediately at the backend&apos;s current reference price.</p>
      <div className="mt-4 grid grid-cols-2 rounded-lg bg-bg-tertiary p-1">
        {(["BUY", "SELL"] as const).map((option) => <button key={option} type="button" onClick={() => { setSide(option); setError(undefined); }} className={`rounded-md py-2 text-sm font-semibold ${side === option ? option === "BUY" ? "bg-profit text-white" : "bg-loss text-white" : "text-text-secondary hover:text-text-primary"}`}>{option === "BUY" ? "Buy" : "Sell"}</button>)}
      </div>
      {side === "SELL" && <p className="mt-3 text-xs text-text-secondary">Available to sell: {formatQuantity(holding?.quantity)} shares</p>}
      <form className="mt-4 space-y-4" onSubmit={submit} noValidate>
        <Input id="order-quantity" label="Quantity" type="number" min="0.0001" step="0.0001" inputMode="decimal" placeholder="0.0000" value={quantity} onChange={(event) => setQuantity(event.target.value)} error={error} />
        <Button type="submit" className="w-full" variant={side === "BUY" ? "profit" : "danger"}>{side === "BUY" ? "Review buy order" : "Review sell order"}</Button>
      </form>
      {showConfirmation && <div className="mt-4 rounded-lg border border-border-secondary bg-bg-primary p-4" role="alertdialog" aria-label="Confirm order"><p className="font-medium text-text-primary">Confirm {side.toLowerCase()} order</p><p className="mt-1 text-sm text-text-secondary">Submit an immediate market order for {quantity} {stock.symbol}. The final execution price and amount are set by TradeX.</p><div className="mt-4 flex gap-2"><Button loading={activeMutation.isPending} onClick={confirmOrder} variant={side === "BUY" ? "profit" : "danger"}>Confirm {side.toLowerCase()}</Button><Button disabled={activeMutation.isPending} onClick={() => setShowConfirmation(false)} variant="secondary">Cancel</Button></div></div>}
    </section>
  );
}
