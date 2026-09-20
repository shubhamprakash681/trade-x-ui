"use client";

import { useState } from "react";
import { AxiosError } from "axios";
import { Zap, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { useToast } from "@/components/atoms/toast";
import { useBuyOrder, useSellOrder, usePortfolio } from "@/hooks/use-portfolio";
import type { HoldingResponse, OrderSide, StockResponse } from "@/types/api.types";
import { formatCurrency, formatQuantity, cn } from "@/lib/utils";

interface FastOrderTicketProps {
  stock: StockResponse;
  holding?: HoldingResponse;
  currentPrice: number;
}

export function FastOrderTicket({ stock, holding, currentPrice }: FastOrderTicketProps) {
  const { toast } = useToast();
  const buyOrder = useBuyOrder();
  const sellOrder = useSellOrder();
  const portfolio = usePortfolio();

  const [side, setSide] = useState<OrderSide>("BUY");
  const [quantity, setQuantity] = useState("10");

  const cashBalance = portfolio.data?.summary.cashBalance ?? 0;
  const ownedQuantity = holding?.quantity ?? 0;
  const activeMutation = side === "BUY" ? buyOrder : sellOrder;

  const parsedQty = parseFloat(quantity) || 0;
  const effectivePrice = currentPrice > 0 ? currentPrice : stock.referencePrice;
  const estimatedCapital = parsedQty * effectivePrice;
  const canAfford = side === "BUY" ? estimatedCapital <= cashBalance : parsedQty <= ownedQuantity;

  const handlePreset = (addVal: number) => {
    const current = parseFloat(quantity) || 0;
    setQuantity(Math.max(1, current + addVal).toString());
  };

  const handlePercent = (pct: number) => {
    if (side === "BUY") {
      if (effectivePrice > 0) {
        const affordableShares = Math.floor(((cashBalance * pct) / effectivePrice) * 1000) / 1000;
        setQuantity(Math.max(0, affordableShares).toString());
      }
    } else {
      const shares = Math.floor((ownedQuantity * pct) * 1000) / 1000;
      setQuantity(Math.max(0, shares).toString());
    }
  };

  const handleExecute = async () => {
    if (parsedQty <= 0) {
      toast("error", "Invalid Quantity", "Please enter a quantity greater than 0.");
      return;
    }

    if (!canAfford) {
      toast("error", "Insufficient Balance", side === "BUY" ? "You do not have enough cash." : "You do not hold enough shares.");
      return;
    }

    try {
      const order = await activeMutation.mutateAsync({
        symbol: stock.symbol,
        quantity: parsedQty,
      });
      toast(
        "success",
        `${order.side} Order Executed`,
        `Executed ${formatQuantity(order.quantity)} ${order.symbol} @ ${formatCurrency(order.price)}`
      );
    } catch (err) {
      const msg = err instanceof AxiosError ? err.response?.data?.message : "Failed to execute order.";
      toast("error", "Execution Failed", msg);
    }
  };

  return (
    <div className="rounded-xl border border-border-primary bg-bg-secondary p-4 space-y-4 shadow-sm font-sans">
      <div className="flex items-center justify-between border-b border-border-primary pb-3">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-brand" />
          <span className="text-xs font-bold uppercase tracking-wider text-text-primary">
            Fast Order Ticket
          </span>
        </div>
        <span className="rounded bg-brand/10 border border-brand/20 px-2 py-0.5 text-[10px] font-semibold text-brand tracking-wider uppercase">
          Instant Fill
        </span>
      </div>

      {/* Side Selector */}
      <div className="grid grid-cols-2 gap-1.5 rounded-lg bg-bg-tertiary p-1">
        <button
          type="button"
          onClick={() => setSide("BUY")}
          className={cn(
            "flex items-center justify-center gap-1.5 rounded-md py-2 text-xs font-bold uppercase transition-all cursor-pointer",
            side === "BUY"
              ? "bg-profit text-white shadow-sm"
              : "text-text-secondary hover:text-text-primary"
          )}
        >
          <TrendingUp className="h-3.5 w-3.5" />
          <span>Buy / Long</span>
        </button>

        <button
          type="button"
          onClick={() => setSide("SELL")}
          className={cn(
            "flex items-center justify-center gap-1.5 rounded-md py-2 text-xs font-bold uppercase transition-all cursor-pointer",
            side === "SELL"
              ? "bg-loss text-white shadow-sm"
              : "text-text-secondary hover:text-text-primary"
          )}
        >
          <TrendingDown className="h-3.5 w-3.5" />
          <span>Sell / Short</span>
        </button>
      </div>

      {/* Telemetry rows */}
      <div className="space-y-1.5 text-xs font-mono">
        <div className="flex items-center justify-between text-text-secondary">
          <span>Execution Price:</span>
          <span className="font-bold text-text-primary tabular-nums">{formatCurrency(effectivePrice)}</span>
        </div>
        <div className="flex items-center justify-between text-text-secondary">
          <span>Available Cash:</span>
          <span className="font-bold text-text-primary tabular-nums">{formatCurrency(cashBalance)}</span>
        </div>
        <div className="flex items-center justify-between text-text-secondary">
          <span>Open Position:</span>
          <span className="font-bold text-text-primary tabular-nums">{formatQuantity(ownedQuantity)} shares</span>
        </div>
      </div>

      {/* Quantity & Preset Chips */}
      <div className="space-y-2">
        <label htmlFor="fast-qty" className="text-[11px] font-bold uppercase text-text-secondary">
          Quantity (Shares)
        </label>
        <input
          id="fast-qty"
          type="number"
          min="0.0001"
          step="any"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full rounded-lg border border-border-primary bg-bg-tertiary px-3 py-2 text-sm font-mono text-text-primary focus:border-brand focus:outline-none tabular-nums"
        />

        <div className="grid grid-cols-5 gap-1 pt-1 font-mono text-xs">
          {["+10", "+50", "+100"].map((label, idx) => (
            <button
              key={label}
              type="button"
              onClick={() => handlePreset([10, 50, 100][idx])}
              className="rounded border border-border-primary bg-bg-tertiary py-1 text-text-secondary hover:border-brand hover:text-text-primary transition-colors cursor-pointer"
            >
              {label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => handlePercent(0.5)}
            className="rounded border border-border-primary bg-bg-tertiary py-1 text-text-secondary hover:border-brand hover:text-text-primary transition-colors cursor-pointer"
          >
            50%
          </button>
          <button
            type="button"
            onClick={() => handlePercent(1.0)}
            className="rounded border border-border-primary bg-bg-tertiary py-1 text-text-secondary hover:border-brand hover:text-text-primary transition-colors cursor-pointer"
          >
            MAX
          </button>
        </div>
      </div>

      {/* Estimated Capital */}
      <div className="rounded-lg border border-border-primary bg-bg-tertiary p-3 font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="text-text-secondary">Estimated Capital:</span>
          <span className={cn("text-sm font-bold tabular-nums", !canAfford ? "text-loss" : "text-text-primary")}>
            {formatCurrency(estimatedCapital)}
          </span>
        </div>
        {!canAfford && (
          <p className="mt-1 text-[11px] text-loss">
            {side === "BUY" ? "Exceeds available cash balance" : "Exceeds owned position"}
          </p>
        )}
      </div>

      {/* Execute Button */}
      <Button
        type="button"
        variant={side === "BUY" ? "profit" : "danger"}
        size="lg"
        className="w-full font-bold uppercase tracking-wider"
        loading={activeMutation.isPending}
        disabled={!canAfford || parsedQty <= 0}
        onClick={handleExecute}
      >
        {`Execute ${side} ${parsedQty > 0 ? parsedQty : ""} Shares`}
      </Button>
    </div>
  );
}

