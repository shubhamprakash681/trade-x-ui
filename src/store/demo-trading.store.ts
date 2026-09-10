import { create } from "zustand";

export interface DemoOrder {
  id: string;
  stock: string;
  type: "BUY" | "SELL";
  qty: number;
  price: number;
  status: "FILLED";
  timestamp: string;
}

export interface DemoHolding {
  symbol: string;
  qty: number;
  avgBuyPrice: number;
}

interface DemoTradingState {
  cashBalance: number;
  holdings: Record<string, DemoHolding>;
  orders: DemoOrder[];
  executeTrade: (params: { symbol: string; side: "BUY" | "SELL"; qty: number; price: number }) => {
    success: boolean;
    message?: string;
  };
  reset: () => void;
}

export const INITIAL_DEMO_CASH = 10_00_000; // ₹10,00,000 (10 Lakhs)

export const useDemoTradingStore = create<DemoTradingState>((set, get) => ({
  cashBalance: INITIAL_DEMO_CASH,
  holdings: {},
  orders: [],
  executeTrade: ({ symbol, side, qty, price }) => {
    const { cashBalance, holdings, orders } = get();
    const normalizedSymbol = symbol.toUpperCase();

    if (qty <= 0 || price <= 0) {
      return { success: false, message: "Invalid quantity or price" };
    }

    if (side === "BUY") {
      const totalCost = qty * price;
      if (cashBalance < totalCost) {
        return {
          success: false,
          message: `Insufficient virtual cash balance (available: ₹${cashBalance.toLocaleString("en-IN", {
            maximumFractionDigits: 2,
          })})`,
        };
      }

      const currentHolding = holdings[normalizedSymbol];
      let newHoldings: Record<string, DemoHolding>;

      if (currentHolding) {
        const newQty = currentHolding.qty + qty;
        const newAvg = (currentHolding.qty * currentHolding.avgBuyPrice + totalCost) / newQty;
        newHoldings = {
          ...holdings,
          [normalizedSymbol]: {
            symbol: normalizedSymbol,
            qty: newQty,
            avgBuyPrice: newAvg,
          },
        };
      } else {
        newHoldings = {
          ...holdings,
          [normalizedSymbol]: {
            symbol: normalizedSymbol,
            qty,
            avgBuyPrice: price,
          },
        };
      }

      const now = new Date();
      const timeString = `Today, ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
      const newOrder: DemoOrder = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        stock: normalizedSymbol,
        type: "BUY",
        qty,
        price,
        status: "FILLED",
        timestamp: timeString,
      };

      set({
        cashBalance: cashBalance - totalCost,
        holdings: newHoldings,
        orders: [newOrder, ...orders],
      });

      return { success: true };
    } else {
      // SELL side
      const currentHolding = holdings[normalizedSymbol];
      if (!currentHolding || currentHolding.qty < qty) {
        return {
          success: false,
          message: `You don't own enough ${normalizedSymbol} shares to sell (owned: ${
            currentHolding?.qty ?? 0
          }). Place a Buy order first!`,
        };
      }

      const proceeds = qty * price;
      const newQty = currentHolding.qty - qty;
      const newHoldings = { ...holdings };

      if (newQty === 0) {
        delete newHoldings[normalizedSymbol];
      } else {
        newHoldings[normalizedSymbol] = {
          ...currentHolding,
          qty: newQty,
        };
      }

      const now = new Date();
      const timeString = `Today, ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
      const newOrder: DemoOrder = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        stock: normalizedSymbol,
        type: "SELL",
        qty,
        price,
        status: "FILLED",
        timestamp: timeString,
      };

      set({
        cashBalance: cashBalance + proceeds,
        holdings: newHoldings,
        orders: [newOrder, ...orders],
      });

      return { success: true };
    }
  },
  reset: () =>
    set({
      cashBalance: INITIAL_DEMO_CASH,
      holdings: {},
      orders: [],
    }),
}));
