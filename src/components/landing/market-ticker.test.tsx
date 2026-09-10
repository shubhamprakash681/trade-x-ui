import { render, screen, act } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { MarketTicker } from "./market-ticker";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { stocksApi } from "@/api/stocks.api";
import { pricesApi } from "@/api/prices.api";
import { marketStream } from "@/websocket/market-stream";
import type { PageResponse, StockResponse, PriceResponse } from "@/types/api.types";

// Mock APIs and WebSocket
vi.mock("@/api/stocks.api", () => ({
  stocksApi: {
    getStocks: vi.fn(),
  },
}));

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

describe("MarketTicker", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders skeletons while stocks are loading", () => {
    vi.mocked(stocksApi.getStocks).mockReturnValue(new Promise(() => {}));
    vi.mocked(pricesApi.getLatestPrices).mockResolvedValue([]);
    vi.mocked(marketStream.subscribe).mockReturnValue(vi.fn());

    renderWithClient(<MarketTicker />);

    expect(screen.getByText("Popular Simulated Markets")).toBeInTheDocument();
    expect(screen.getAllByTestId("ticker-skeleton")).toHaveLength(8);
  });

  it("renders dynamic stocks and prices once fetched", async () => {
    const mockStocks: PageResponse<StockResponse> = {
      content: [
        {
          symbol: "TATAMOTORS",
          name: "Tata Motors Limited",
          exchange: "NSE",
          sector: "Automobile",
          referencePrice: 1024.4,
          synthetic: false,
        },
        {
          symbol: "NIFTYBEES",
          name: "Nippon India ETF Nifty 50 BeES",
          exchange: "NSE",
          sector: "ETF",
          referencePrice: 275.5,
          synthetic: false,
        },
      ],
      totalElements: 2,
      totalPages: 1,
      size: 8,
      number: 0,
      first: true,
      last: true,
      empty: false,
    };

    const mockPrices: PriceResponse[] = [
      {
        symbol: "TATAMOTORS",
        price: 1050.0,
        previousPrice: 1024.4,
        changeAmount: 25.6,
        changePercent: 2.5,
        synthetic: false,
        timestamp: "2026-09-11T00:00:00Z",
      },
    ];

    vi.mocked(stocksApi.getStocks).mockResolvedValue(mockStocks);
    vi.mocked(pricesApi.getLatestPrices).mockResolvedValue(mockPrices);
    vi.mocked(marketStream.subscribe).mockReturnValue(vi.fn());

    renderWithClient(<MarketTicker />);

    expect(await screen.findByText("TATAMOTORS")).toBeInTheDocument();
    expect(screen.getByText("Tata Motors Limited")).toBeInTheDocument();
    expect(screen.getByText("₹1,050.00")).toBeInTheDocument();
    expect(screen.getByText("+25.60")).toBeInTheDocument();
    expect(screen.getByText("+2.50%")).toBeInTheDocument();

    expect(screen.getByText("NIFTYBEES")).toBeInTheDocument();
    expect(screen.getByText("ETF")).toBeInTheDocument();
  });

  it("updates price dynamically when WebSocket stream receives a tick", async () => {
    const mockStocks: PageResponse<StockResponse> = {
      content: [
        {
          symbol: "RELIANCE",
          name: "Reliance Industries Limited",
          exchange: "NSE",
          sector: "Energy",
          referencePrice: 2940.1,
          synthetic: false,
        },
      ],
      totalElements: 1,
      totalPages: 1,
      size: 8,
      number: 0,
      first: true,
      last: true,
      empty: false,
    };

    let wsCallback: ((tick: PriceResponse) => void) | undefined;
    vi.mocked(marketStream.subscribe).mockImplementation((symbol, cb) => {
      if (symbol === "RELIANCE") {
        wsCallback = cb;
      }
      return vi.fn();
    });

    vi.mocked(stocksApi.getStocks).mockResolvedValue(mockStocks);
    vi.mocked(pricesApi.getLatestPrices).mockResolvedValue([]);

    renderWithClient(<MarketTicker />);

    expect(await screen.findByText("RELIANCE")).toBeInTheDocument();
    expect(screen.getByText("₹2,940.10")).toBeInTheDocument();

    // Trigger live tick
    act(() => {
      wsCallback?.({
        symbol: "RELIANCE",
        price: 2999.0,
        previousPrice: 2940.1,
        changeAmount: 58.9,
        changePercent: 2.0,
        synthetic: false,
        timestamp: "2026-09-11T00:00:01Z",
      });
    });

    expect(await screen.findByText("₹2,999.00")).toBeInTheDocument();
    expect(screen.getByText("+58.90")).toBeInTheDocument();
    expect(screen.getByText("+2.00%")).toBeInTheDocument();
  });

  it("falls back gracefully when stock query fails", async () => {
    vi.mocked(stocksApi.getStocks).mockRejectedValue(new Error("Network Error"));
    vi.mocked(pricesApi.getLatestPrices).mockResolvedValue([]);
    vi.mocked(marketStream.subscribe).mockReturnValue(vi.fn());

    renderWithClient(<MarketTicker />);

    // Fallback tickers should render
    expect(await screen.findByText("RELIANCE")).toBeInTheDocument();
    expect(screen.getByText("TCS")).toBeInTheDocument();
    expect(screen.getByText("INFY")).toBeInTheDocument();
  });
});
