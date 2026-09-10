import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { InteractivePreview } from "./interactive-preview";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { pricesApi } from "@/api/prices.api";
import { marketStream } from "@/websocket/market-stream";
import { useDemoTradingStore } from "@/store/demo-trading.store";
import type { PriceResponse } from "@/types/api.types";

vi.mock("@/api/prices.api", () => ({
  pricesApi: {
    getLatestPrices: vi.fn(),
  },
}));

vi.mock("@/websocket/market-stream", () => ({
  marketStream: {
    subscribe: vi.fn(),
    unsubscribe: vi.fn(),
  },
}));

function renderWithClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe("InteractivePreview", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useDemoTradingStore.getState().reset();
  });

  it("renders Live Charts tab with dynamic TCS price and updates on tick", async () => {
    let tcsCallback: ((tick: PriceResponse) => void) | undefined;
    vi.mocked(marketStream.subscribe).mockImplementation((symbol, cb) => {
      if (symbol === "TCS") {
        tcsCallback = cb;
      }
      return vi.fn();
    });

    vi.mocked(pricesApi.getLatestPrices).mockResolvedValue([
      {
        symbol: "TCS",
        price: 3890.7,
        previousPrice: 3845.1,
        changeAmount: 45.6,
        changePercent: 1.12,
        synthetic: false,
        timestamp: "2026-09-11T00:00:00Z",
      },
    ]);

    renderWithClient(<InteractivePreview />);

    expect(screen.getByText("Designed for Speed, Engineered for Precision")).toBeInTheDocument();
    expect(await screen.findByText(/₹3,890\.70/)).toBeInTheDocument();

    act(() => {
      tcsCallback?.({
        symbol: "TCS",
        price: 4150.0,
        previousPrice: 3890.7,
        changeAmount: 259.3,
        changePercent: 6.66,
        synthetic: false,
        timestamp: "2026-09-11T00:00:01Z",
      });
    });

    expect(await screen.findByText(/₹4,150\.00/)).toBeInTheDocument();
  });

  it("displays initial empty state for Portfolio Analytics and shows dynamic holdings when trades are placed", async () => {
    vi.mocked(pricesApi.getLatestPrices).mockResolvedValue([
      {
        symbol: "RELIANCE",
        price: 3100.0,
        previousPrice: 3000.0,
        changeAmount: 100.0,
        changePercent: 3.33,
        synthetic: false,
        timestamp: "2026-09-11T00:00:00Z",
      },
    ]);

    renderWithClient(<InteractivePreview />);

    const portfolioTabButton = screen.getByRole("button", { name: /Portfolio Analytics/i });
    fireEvent.click(portfolioTabButton);

    expect(await screen.findByText("Total Portfolio")).toBeInTheDocument();
    expect(screen.getByText("₹10,00,000.00")).toBeInTheDocument();
    expect(screen.getByText("₹0.00")).toBeInTheDocument(); // Invested amount
    expect(screen.getByText("No Simulated Holdings Yet")).toBeInTheDocument();

    // Now execute trade in store
    act(() => {
      useDemoTradingStore.getState().executeTrade({
        symbol: "RELIANCE",
        side: "BUY",
        qty: 20,
        price: 3000.0,
      });
    });

    // Now holdings table is rendered
    expect(screen.queryByText("No Simulated Holdings Yet")).not.toBeInTheDocument();
    expect(screen.getByText("RELIANCE")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByText("₹3,000.00")).toBeInTheDocument();
    expect(screen.getByText("₹3,100.00")).toBeInTheDocument(); // LTP
    expect(screen.getByText("₹60,000.00")).toBeInTheDocument(); // Invested amount: 20 * 3000
  });

  it("displays initial empty state for Order Execution and displays orders when trades are placed", async () => {
    vi.mocked(pricesApi.getLatestPrices).mockResolvedValue([]);
    renderWithClient(<InteractivePreview />);

    const ordersTabButton = screen.getByRole("button", { name: /Order Execution/i });
    fireEvent.click(ordersTabButton);

    expect(await screen.findByText("Recent Simulated Orders")).toBeInTheDocument();
    expect(screen.getByText("No Simulated Orders Executed")).toBeInTheDocument();

    // Place an order in demo store
    act(() => {
      useDemoTradingStore.getState().executeTrade({
        symbol: "INFY",
        side: "BUY",
        qty: 15,
        price: 1500.0,
      });
    });

    expect(screen.queryByText("No Simulated Orders Executed")).not.toBeInTheDocument();
    expect(screen.getByText("INFY")).toBeInTheDocument();
    expect(screen.getByText(/15 sh @ ₹1,500\.00/)).toBeInTheDocument();
    expect(screen.getByText("FILLED")).toBeInTheDocument();
  });

  it("keeps Alerts & Watchlist tab completely static", async () => {
    vi.mocked(pricesApi.getLatestPrices).mockResolvedValue([]);
    renderWithClient(<InteractivePreview />);

    const alertsTabButton = screen.getByRole("button", { name: /Alerts & Watchlist/i });
    fireEvent.click(alertsTabButton);

    expect(await screen.findByText("Configured Price Triggers")).toBeInTheDocument();
    expect(screen.getByText("New Alert")).toBeInTheDocument();
    expect(screen.getAllByText(/Price crosses (above|below)/i).length).toBeGreaterThan(0);
    expect(screen.getByText("₹3,000.00")).toBeInTheDocument();
  });
});
