import { render, screen, act, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { HeroSection } from "./hero-section";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { stocksApi } from "@/api/stocks.api";
import { pricesApi } from "@/api/prices.api";
import { marketStream } from "@/websocket/market-stream";
import type { PageResponse, StockResponse, PriceResponse } from "@/types/api.types";

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

import { useDemoTradingStore } from "@/store/demo-trading.store";

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

describe("HeroSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useDemoTradingStore.getState().reset();
  });

  it("renders hero pitch, badges, and default stock tabs", async () => {
    vi.mocked(stocksApi.getStocks).mockResolvedValue({
      content: [
        {
          symbol: "RELIANCE",
          name: "Reliance Industries Ltd",
          exchange: "NSE",
          sector: "Energy",
          referencePrice: 2940.1,
          synthetic: false,
        },
        {
          symbol: "TCS",
          name: "Tata Consultancy Services",
          exchange: "NSE",
          sector: "Technology",
          referencePrice: 3890.7,
          synthetic: false,
        },
      ],
      totalElements: 2,
      totalPages: 1,
      size: 4,
      number: 0,
      first: true,
      last: true,
      empty: false,
    });
    vi.mocked(pricesApi.getLatestPrices).mockResolvedValue([]);
    vi.mocked(marketStream.subscribe).mockReturnValue(vi.fn());

    renderWithClient(<HeroSection />);

    expect(screen.getByText(/Master Stock Trading Without Risking/i)).toBeInTheDocument();
    expect(await screen.findByText("₹2,940.10")).toBeInTheDocument();
    expect(screen.getByText("Reliance Industries Ltd")).toBeInTheDocument();
  });

  it("switches active stock and updates price when user selects another tab", async () => {
    const mockStocks: PageResponse<StockResponse> = {
      content: [
        {
          symbol: "RELIANCE",
          name: "Reliance Industries Ltd",
          exchange: "NSE",
          sector: "Energy",
          referencePrice: 2940.1,
          synthetic: false,
        },
        {
          symbol: "TCS",
          name: "Tata Consultancy Services",
          exchange: "NSE",
          sector: "Technology",
          referencePrice: 3890.7,
          synthetic: false,
        },
      ],
      totalElements: 2,
      totalPages: 1,
      size: 4,
      number: 0,
      first: true,
      last: true,
      empty: false,
    };

    vi.mocked(stocksApi.getStocks).mockResolvedValue(mockStocks);
    vi.mocked(pricesApi.getLatestPrices).mockResolvedValue([
      {
        symbol: "TCS",
        price: 4100.0,
        previousPrice: 3890.7,
        changeAmount: 209.3,
        changePercent: 5.38,
        synthetic: false,
        timestamp: "2026-09-11T00:00:00Z",
      },
    ]);
    vi.mocked(marketStream.subscribe).mockReturnValue(vi.fn());

    renderWithClient(<HeroSection />);

    expect(await screen.findByText("₹2,940.10")).toBeInTheDocument();

    const tcsButton = screen.getByRole("button", { name: "TCS" });
    fireEvent.click(tcsButton);

    expect(await screen.findByText("₹4,100.00")).toBeInTheDocument();
    expect(screen.getByText("Tata Consultancy Services")).toBeInTheDocument();
  });

  it("updates live price when WebSocket emits a price tick", async () => {
    let wsCallback: ((tick: PriceResponse) => void) | undefined;
    vi.mocked(marketStream.subscribe).mockImplementation((symbol, cb) => {
      if (symbol === "RELIANCE") {
        wsCallback = cb;
      }
      return vi.fn();
    });

    vi.mocked(stocksApi.getStocks).mockResolvedValue({
      content: [
        {
          symbol: "RELIANCE",
          name: "Reliance Industries Ltd",
          exchange: "NSE",
          sector: "Energy",
          referencePrice: 2940.1,
          synthetic: false,
        },
      ],
      totalElements: 1,
      totalPages: 1,
      size: 4,
      number: 0,
      first: true,
      last: true,
      empty: false,
    });
    vi.mocked(pricesApi.getLatestPrices).mockResolvedValue([]);

    renderWithClient(<HeroSection />);

    expect(await screen.findByText("₹2,940.10")).toBeInTheDocument();

    act(() => {
      wsCallback?.({
        symbol: "RELIANCE",
        price: 3050.0,
        previousPrice: 2940.1,
        changeAmount: 109.9,
        changePercent: 3.74,
        synthetic: false,
        timestamp: "2026-09-11T00:00:01Z",
      });
    });

    expect(await screen.findByText("₹3,050.00")).toBeInTheDocument();
    expect(screen.getByText(/\+3\.74%/)).toBeInTheDocument();
  });

  it("calculates dynamic order total and executes simulation", async () => {
    vi.mocked(stocksApi.getStocks).mockResolvedValue({
      content: [
        {
          symbol: "RELIANCE",
          name: "Reliance Industries Ltd",
          exchange: "NSE",
          sector: "Energy",
          referencePrice: 2000.0,
          synthetic: false,
        },
      ],
      totalElements: 1,
      totalPages: 1,
      size: 4,
      number: 0,
      first: true,
      last: true,
      empty: false,
    });
    vi.mocked(pricesApi.getLatestPrices).mockResolvedValue([]);
    vi.mocked(marketStream.subscribe).mockReturnValue(vi.fn());

    renderWithClient(<HeroSection />);

    expect(await screen.findByText("₹2,000.00")).toBeInTheDocument();

    // Default quantity is 10, so 10 * 2000 = 20,000
    const simulateButton = screen.getByText(/Simulate Buy 10 RELIANCE/i);
    expect(simulateButton).toHaveTextContent("₹20,000.00");

    // Check initial portfolio display
    expect(screen.getByText(/Portfolio: ₹10,00,000\.00/)).toBeInTheDocument();

    fireEvent.click(simulateButton);

    expect(await screen.findByText(/Simulated Order Filled: BUY 10 RELIANCE/i)).toBeInTheDocument();
    expect(useDemoTradingStore.getState().cashBalance).toBe(980000);
    expect(useDemoTradingStore.getState().holdings["RELIANCE"].qty).toBe(10);
    expect(useDemoTradingStore.getState().orders.length).toBe(1);
  });

  it("shows error feedback when attempting to sell unowned stock", async () => {
    vi.mocked(stocksApi.getStocks).mockResolvedValue({
      content: [
        {
          symbol: "RELIANCE",
          name: "Reliance Industries Ltd",
          exchange: "NSE",
          sector: "Energy",
          referencePrice: 2000.0,
          synthetic: false,
        },
      ],
      totalElements: 1,
      totalPages: 1,
      size: 4,
      number: 0,
      first: true,
      last: true,
      empty: false,
    });
    vi.mocked(pricesApi.getLatestPrices).mockResolvedValue([]);
    vi.mocked(marketStream.subscribe).mockReturnValue(vi.fn());

    renderWithClient(<HeroSection />);

    expect(await screen.findByText("₹2,000.00")).toBeInTheDocument();

    const sellTabButton = screen.getByRole("button", { name: /Sell \(Short\)/i });
    fireEvent.click(sellTabButton);

    const simulateSellButton = screen.getByText(/Simulate Sell 10 RELIANCE/i);
    fireEvent.click(simulateSellButton);

    expect(await screen.findByText(/You don't own enough RELIANCE shares to sell/i)).toBeInTheDocument();
    expect(useDemoTradingStore.getState().orders.length).toBe(0);
  });

  it("shows portfolio analysis link after trade is taken and handles scroll and tab event", async () => {
    vi.mocked(stocksApi.getStocks).mockResolvedValue({
      content: [
        {
          symbol: "RELIANCE",
          name: "Reliance Industries Ltd",
          exchange: "NSE",
          sector: "Energy",
          referencePrice: 2000.0,
          synthetic: false,
        },
      ],
      totalElements: 1,
      totalPages: 1,
      size: 4,
      number: 0,
      first: true,
      last: true,
      empty: false,
    });
    vi.mocked(pricesApi.getLatestPrices).mockResolvedValue([]);
    vi.mocked(marketStream.subscribe).mockReturnValue(vi.fn());

    // Mock target element for scrollIntoView
    const scrollMock = vi.fn();
    const fakeTarget = document.createElement("section");
    fakeTarget.id = "portfolio-analysis";
    fakeTarget.scrollIntoView = scrollMock;
    document.body.appendChild(fakeTarget);

    const eventSpy = vi.fn();
    window.addEventListener("tradex:switch-preview-tab", eventSpy);

    renderWithClient(<HeroSection />);

    // Initially no trades taken, link should not be present
    expect(screen.queryByTestId("hero-portfolio-link")).not.toBeInTheDocument();
    expect(screen.queryByTestId("hero-portfolio-cta")).not.toBeInTheDocument();

    // Execute simulated trade
    const simulateButton = screen.getByText(/Simulate Buy 10 RELIANCE/i);
    fireEvent.click(simulateButton);

    // After trade is executed, link should appear
    const portfolioLink = await screen.findByTestId("hero-portfolio-link");
    expect(portfolioLink).toBeInTheDocument();
    expect(portfolioLink).toHaveAttribute("href", "#portfolio-analysis");
    expect(screen.getByTestId("hero-portfolio-cta")).toBeInTheDocument();

    // Click the portfolio link
    fireEvent.click(portfolioLink);

    expect(scrollMock).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
    expect(eventSpy).toHaveBeenCalled();
    const customEvt = eventSpy.mock.calls[0][0] as CustomEvent;
    expect(customEvt.detail).toBe("portfolio");

    // Cleanup
    document.body.removeChild(fakeTarget);
    window.removeEventListener("tradex:switch-preview-tab", eventSpy);
  });
});
