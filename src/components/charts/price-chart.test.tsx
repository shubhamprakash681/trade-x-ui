import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PriceChart } from "./price-chart";
import type { CandleResponse } from "@/types/api.types";

vi.mock("lightweight-charts", () => {
  const mockSeries = {
    setData: vi.fn(),
    update: vi.fn(),
    createPriceLine: vi.fn().mockReturnValue({}),
    removePriceLine: vi.fn(),
    priceScale: vi.fn().mockReturnValue({
      applyOptions: vi.fn(),
    }),
  };

  const mockTimeScale = {
    fitContent: vi.fn(),
  };

  const mockChart = {
    addSeries: vi.fn().mockReturnValue(mockSeries),
    timeScale: vi.fn().mockReturnValue(mockTimeScale),
    applyOptions: vi.fn(),
    subscribeCrosshairMove: vi.fn(),
    remove: vi.fn(),
  };

  return {
    createChart: vi.fn().mockReturnValue(mockChart),
    CandlestickSeries: "CandlestickSeries",
    HistogramSeries: "HistogramSeries",
    ColorType: { Solid: "solid" },
  };
});

// Mock ResizeObserver
global.ResizeObserver = class {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
};

const mockCandles: CandleResponse[] = [
  {
    symbol: "RELIANCE",
    interval: "DAILY",
    candleTime: "2026-09-10T10:00:00",
    open: 2800.0,
    high: 2850.0,
    low: 2790.0,
    close: 2840.0,
    volume: 1_250_000,
  },
  {
    symbol: "RELIANCE",
    interval: "DAILY",
    candleTime: "2026-09-11T10:00:00",
    open: 2840.0,
    high: 2890.0,
    low: 2830.0,
    close: 2875.0,
    volume: 2_400_000,
  },
];

describe("PriceChart component", () => {
  it("renders TradingView-style top interval buttons and bottom range selectors", () => {
    const onIntervalChange = vi.fn();
    const onRangeChange = vi.fn();

    render(
      <PriceChart
        symbol="RELIANCE"
        stockName="Reliance Industries"
        exchange="NSE"
        candles={mockCandles}
        livePrice={null}
        interval="D"
        range="1Y"
        onIntervalChange={onIntervalChange}
        onRangeChange={onRangeChange}
      />
    );

    // Instrument info & OHLCV readout
    expect(screen.getByText("RELIANCE")).toBeInTheDocument();
    expect(screen.getByText("NSE")).toBeInTheDocument();
    expect(screen.getByText("2875.00")).toBeInTheDocument(); // Close price
    expect(screen.getByText(/2.40 M/)).toBeInTheDocument(); // Volume formatted

    // Interval selector buttons
    const intervalButtons = ["1s", "1m", "1h", "D", "W", "M"];
    for (const id of intervalButtons) {
      expect(screen.getByRole("button", { name: id })).toBeInTheDocument();
    }

    // Range selector buttons
    const rangeButtons = ["1D", "5D", "1M", "3M", "6M", "YTD", "1Y", "5Y", "All"];
    for (const r of rangeButtons) {
      expect(screen.getByRole("button", { name: r })).toBeInTheDocument();
    }

    // Click an interval button
    fireEvent.click(screen.getByRole("button", { name: "1h" }));
    expect(onIntervalChange).toHaveBeenCalledWith("1h");

    // Click a range button
    fireEvent.click(screen.getByRole("button", { name: "3M" }));
    expect(onRangeChange).toHaveBeenCalledWith("3M");
  });

  it("handles custom date range popover and submits date selection", () => {
    const onCustomDateApply = vi.fn();

    render(
      <PriceChart
        symbol="RELIANCE"
        candles={mockCandles}
        livePrice={null}
        interval="D"
        range="1Y"
        onCustomDateApply={onCustomDateApply}
      />
    );

    // Open custom date picker
    const customBtn = screen.getByTitle("Custom Date Range");
    fireEvent.click(customBtn);

    expect(screen.getByText("Custom Date Range")).toBeInTheDocument();

    const dateInputs = screen.getAllByDisplayValue("");
    const fromInput = dateInputs[0];
    const toInput = dateInputs[1];

    fireEvent.change(fromInput, { target: { value: "2026-01-01" } });
    fireEvent.change(toInput, { target: { value: "2026-06-30" } });

    fireEvent.click(screen.getByRole("button", { name: "Apply" }));

    expect(onCustomDateApply).toHaveBeenCalledWith("2026-01-01", "2026-06-30");
  });

  it("shows loading overlay when isLoading is true", () => {
    render(
      <PriceChart
        symbol="RELIANCE"
        candles={mockCandles}
        livePrice={null}
        interval="D"
        range="1Y"
        isLoading={true}
      />
    );

    expect(screen.getByRole("status")).toBeInTheDocument(); // Spinner
  });
});

