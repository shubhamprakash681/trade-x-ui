# Step 2: Pro Trading Workstation (`/stocks/[symbol]`)

Copy and paste this prompt to execute **Phase 2: Pro Trading Workstation**:

```markdown
# TASK: REDESIGN STOCK DETAIL PAGE INTO A 2-PANE PRO TRADING WORKSTATION

## Context
You are working on `trade-x-ui`. The current stock page at `src/app/(protected)/stocks/[symbol]/page.tsx` is a basic vertical card stack.
We need to elevate this page into an **institutional multi-pane trading workstation** that matches the capability shown in Screenshot 1, while preserving `trade-x-ui`'s layout shell (`AppShell` + `Sidebar`).

---

## Deliverables & Exact Implementation

### 1. Create Fast Order Ticket (`src/components/orders/fast-order-ticket.tsx`)
Create a new file `src/components/orders/fast-order-ticket.tsx`:

```tsx
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
  const estimatedCapital = parsedQty * currentPrice;
  const canAfford = side === "BUY" ? estimatedCapital <= cashBalance : parsedQty <= ownedQuantity;

  const handlePreset = (addVal: number) => {
    setQuantity((prev) => (Math.max(1, (parseFloat(prev) || 0) + addVal)).toString());
  };

  const handlePercent = (pct: number) => {
    if (side === "BUY") {
      if (currentPrice > 0) {
        const affordableShares = Math.floor(((cashBalance * pct) / currentPrice) * 1000) / 1000;
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
          <span className="font-bold text-text-primary tabular-nums">{formatCurrency(currentPrice)}</span>
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
```

---

### 2. Create Level-2 Depth / Tape Simulator (`src/components/market/order-book-depth.tsx`)
Create `src/components/market/order-book-depth.tsx`:

```tsx
"use client";

import { useState } from "react";
import { formatCurrency, cn } from "@/lib/utils";

interface OrderBookDepthProps {
  currentPrice: number;
}

export function OrderBookDepth({ currentPrice }: OrderBookDepthProps) {
  const [activeTab, setActiveTab] = useState<"book" | "trades">("book");

  // Simulated depth based on current reference price
  const asks = [
    { price: currentPrice * 1.0035, size: 440, total: 2240 },
    { price: currentPrice * 1.0028, size: 610, total: 1800 },
    { price: currentPrice * 1.0020, size: 290, total: 1190 },
    { price: currentPrice * 1.0012, size: 520, total: 900 },
    { price: currentPrice * 1.0005, size: 380, total: 380 },
  ];

  const bids = [
    { price: currentPrice * 0.9995, size: 450, total: 450 },
    { price: currentPrice * 0.9988, size: 320, total: 770 },
    { price: currentPrice * 0.9980, size: 680, total: 1450 },
    { price: currentPrice * 0.9972, size: 510, total: 1960 },
    { price: currentPrice * 0.9965, size: 390, total: 2350 },
  ];

  const spread = asks[4].price - bids[0].price;
  const spreadPct = (spread / currentPrice) * 100;

  return (
    <div className="rounded-xl border border-border-primary bg-bg-secondary p-4 space-y-3 font-mono text-xs shadow-sm">
      <div className="flex items-center gap-4 border-b border-border-primary pb-2 font-sans">
        <button
          onClick={() => setActiveTab("book")}
          className={cn(
            "text-xs font-bold uppercase transition-colors cursor-pointer",
            activeTab === "book" ? "text-brand" : "text-text-secondary hover:text-text-primary"
          )}
        >
          Order Book (L2)
        </button>
        <button
          onClick={() => setActiveTab("trades")}
          className={cn(
            "text-xs font-bold uppercase transition-colors cursor-pointer",
            activeTab === "trades" ? "text-brand" : "text-text-secondary hover:text-text-primary"
          )}
        >
          Time & Sales
        </button>
      </div>

      <div className="grid grid-cols-3 text-[10px] uppercase text-text-tertiary pb-1 border-b border-border-primary/50 font-bold">
        <span>Price</span>
        <span className="text-right">Size</span>
        <span className="text-right">Total</span>
      </div>

      {/* Asks (Sell Orders - Coral/Red) */}
      <div className="space-y-0.5">
        {asks.map((row, i) => (
          <div key={i} className="relative grid grid-cols-3 py-0.5 text-[11px] tabular-nums">
            <div
              className="absolute right-0 top-0 bottom-0 bg-loss/10 rounded-sm"
              style={{ width: `${Math.min(100, (row.total / 2500) * 100)}%` }}
            />
            <span className="relative text-loss font-semibold">{formatCurrency(row.price)}</span>
            <span className="relative text-right text-text-secondary">{row.size}</span>
            <span className="relative text-right text-text-primary font-medium">{row.total}</span>
          </div>
        ))}
      </div>

      {/* Mid-market Spread */}
      <div className="flex items-center justify-between rounded bg-bg-tertiary px-2 py-1 text-[11px] border border-border-primary/50 text-text-secondary">
        <span>Spread: {spread.toFixed(2)} ({spreadPct.toFixed(2)}%)</span>
        <span className="font-bold text-text-primary">{formatCurrency(currentPrice)}</span>
      </div>

      {/* Bids (Buy Orders - Emerald/Green) */}
      <div className="space-y-0.5">
        {bids.map((row, i) => (
          <div key={i} className="relative grid grid-cols-3 py-0.5 text-[11px] tabular-nums">
            <div
              className="absolute right-0 top-0 bottom-0 bg-profit/10 rounded-sm"
              style={{ width: `${Math.min(100, (row.total / 2500) * 100)}%` }}
            />
            <span className="relative text-profit font-semibold">{formatCurrency(row.price)}</span>
            <span className="relative text-right text-text-secondary">{row.size}</span>
            <span className="relative text-right text-text-primary font-medium">{row.total}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### 3. Redesign `src/app/(protected)/stocks/[symbol]/page.tsx`
Update `src/app/(protected)/stocks/[symbol]/page.tsx` to integrate the 2-pane workstation layout, top telemetry bar, bottom drawer for Open Position (with Liquidate button) & Executions table.

Ensure:
- Liquidate button calls `useSellOrder()` for all owned shares with toast confirmation.
- 24H High/Low visual range slider is rendered in the top telemetry bar.
- Run `npm run test` and `npx tsc --noEmit` to confirm zero errors.
```

