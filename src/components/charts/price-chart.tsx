"use client";

import { useEffect, useRef, useState } from "react";
import {
  CandlestickSeries,
  ColorType,
  createChart,
  HistogramSeries,
  type IChartApi,
  type IPriceLine,
  type ISeriesApi,
  type UTCTimestamp,
} from "lightweight-charts";
import { Calendar, RotateCcw, X } from "lucide-react";
import type { CandleResponse, PriceResponse } from "@/types/api.types";
import { Spinner } from "@/components/atoms/spinner";

export interface PriceChartProps {
  candles: CandleResponse[];
  livePrice: PriceResponse | null;
  symbol?: string;
  stockName?: string;
  exchange?: string;
  interval?: string;
  range?: string;
  onIntervalChange?: (interval: string) => void;
  onRangeChange?: (range: string) => void;
  onCustomDateApply?: (from: string, to: string) => void;
  isLoading?: boolean;
}

const INTERVAL_OPTIONS = [
  { id: "1s", label: "1s", title: "1 Second" },
  { id: "1m", label: "1m", title: "1 Minute" },
  { id: "1h", label: "1h", title: "1 Hour" },
  { id: "D", label: "D", title: "1 Day" },
  { id: "W", label: "W", title: "1 Week" },
  { id: "M", label: "M", title: "1 Month" },
];

const RANGE_OPTIONS = ["1D", "5D", "1M", "3M", "6M", "YTD", "1Y", "5Y", "All"];

function toTimestamp(value: string): UTCTimestamp | null {
  const milliseconds = Date.parse(value);
  return Number.isNaN(milliseconds) ? null : (Math.floor(milliseconds / 1000) as UTCTimestamp);
}

function formatVolume(val: number): string {
  if (val >= 1_000_000_000) return (val / 1_000_000_000).toFixed(2) + " B";
  if (val >= 1_000_000) return (val / 1_000_000).toFixed(2) + " M";
  if (val >= 1_000) return (val / 1_000).toFixed(2) + " K";
  return val.toLocaleString();
}

interface HoveredCandle {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export function PriceChart({
  candles,
  livePrice,
  symbol = "STOCK",
  stockName,
  exchange = "NSE",
  interval = "D",
  range = "1Y",
  onIntervalChange,
  onRangeChange,
  onCustomDateApply,
  isLoading = false,
}: PriceChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  const priceLineRef = useRef<IPriceLine | null>(null);

  const [hoveredCandle, setHoveredCandle] = useState<HoveredCandle | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  const activeInterval = interval.toUpperCase() === "DAILY" ? "D" : interval.toUpperCase() === "SECONDS" ? "1s" : interval.toUpperCase() === "MINUTE" ? "1m" : interval.toUpperCase() === "HOURLY" ? "1h" : interval.toUpperCase() === "WEEKLY" ? "W" : interval.toUpperCase() === "MONTHLY" ? "M" : interval;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const style = getComputedStyle(document.documentElement);
    const chart = createChart(container, {
      width: container.clientWidth,
      height: 380,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: style.getPropertyValue("--text-secondary").trim() || "#9CA3AF",
      },
      grid: {
        vertLines: { color: style.getPropertyValue("--chart-grid").trim() || "rgba(255, 255, 255, 0.05)" },
        horzLines: { color: style.getPropertyValue("--chart-grid").trim() || "rgba(255, 255, 255, 0.05)" },
      },
      rightPriceScale: {
        borderColor: style.getPropertyValue("--border-primary").trim() || "rgba(255, 255, 255, 0.1)",
        scaleMargins: {
          top: 0.1,
          bottom: 0.22,
        },
      },
      timeScale: {
        borderColor: style.getPropertyValue("--border-primary").trim() || "rgba(255, 255, 255, 0.1)",
        timeVisible: true,
        secondsVisible: activeInterval === "1s",
      },
      crosshair: {
        vertLine: {
          color: "rgba(156, 163, 175, 0.5)",
          style: 2,
          labelBackgroundColor: "#1E222D",
        },
        horzLine: {
          color: "rgba(156, 163, 175, 0.5)",
          style: 2,
          labelBackgroundColor: "#1E222D",
        },
      },
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#10B981",
      downColor: "#EF4444",
      borderVisible: false,
      wickUpColor: "#10B981",
      wickDownColor: "#EF4444",
    });

    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: "volume" },
      priceScaleId: "",
    });

    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    const sortedData = candles
      .map((candle) => {
        const time = toTimestamp(candle.candleTime);
        return time === null
          ? null
          : {
              time,
              open: candle.open,
              high: candle.high,
              low: candle.low,
              close: candle.close,
              volume: candle.volume ?? 0,
            };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => a.time - b.time);

    const uniqueCandles: typeof sortedData = [];
    for (const item of sortedData) {
      if (uniqueCandles.length === 0 || uniqueCandles[uniqueCandles.length - 1].time !== item.time) {
        uniqueCandles.push(item);
      } else {
        uniqueCandles[uniqueCandles.length - 1] = item;
      }
    }

    candleSeries.setData(
      uniqueCandles.map(({ time, open, high, low, close }) => ({
        time,
        open,
        high,
        low,
        close,
      }))
    );

    volumeSeries.setData(
      uniqueCandles.map(({ time, open, close, volume }) => ({
        time,
        value: volume,
        color: close >= open ? "rgba(16, 185, 129, 0.45)" : "rgba(239, 68, 68, 0.45)",
      }))
    );

    chart.timeScale().fitContent();

    chart.subscribeCrosshairMove((param) => {
      if (!param.time || !param.seriesData) {
        setHoveredCandle(null);
        return;
      }
      const c = param.seriesData.get(candleSeries) as
        | { open: number; high: number; low: number; close: number }
        | undefined;
      const v = param.seriesData.get(volumeSeries) as { value: number } | undefined;
      if (c) {
        setHoveredCandle({
          open: c.open,
          high: c.high,
          low: c.low,
          close: c.close,
          volume: v?.value ?? 0,
        });
      } else {
        setHoveredCandle(null);
      }
    });

    const resizeObserver = new ResizeObserver(([entry]) => {
      if (entry?.contentRect) {
        chart.applyOptions({ width: entry.contentRect.width });
      }
    });
    resizeObserver.observe(container);

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;
    volumeSeriesRef.current = volumeSeries;

    return () => {
      resizeObserver.disconnect();
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
      volumeSeriesRef.current = null;
      priceLineRef.current = null;
    };
  }, [candles, activeInterval]);

  useEffect(() => {
    const candleSeries = candleSeriesRef.current;
    const volumeSeries = volumeSeriesRef.current;
    if (!candleSeries || !livePrice) return;

    if (priceLineRef.current) candleSeries.removePriceLine(priceLineRef.current);
    priceLineRef.current = candleSeries.createPriceLine({
      price: livePrice.price,
      color: livePrice.changeAmount >= 0 ? "#10B981" : "#EF4444",
      lineWidth: 1,
      lineStyle: 2,
      axisLabelVisible: true,
      title: "Live",
    });

    if (candles.length > 0) {
      const lastCandle = candles[candles.length - 1];
      const time = toTimestamp(lastCandle.candleTime);
      if (time !== null) {
        const updatedHigh = Math.max(lastCandle.high, livePrice.price);
        const updatedLow = Math.min(lastCandle.low, livePrice.price);
        const updatedClose = livePrice.price;
        candleSeries.update({
          time,
          open: lastCandle.open,
          high: updatedHigh,
          low: updatedLow,
          close: updatedClose,
        });

        if (volumeSeries) {
          volumeSeries.update({
            time,
            value: lastCandle.volume ?? 0,
            color: updatedClose >= lastCandle.open ? "rgba(16, 185, 129, 0.45)" : "rgba(239, 68, 68, 0.45)",
          });
        }
      }
    }
  }, [livePrice, candles]);

  const latestCandle = candles.length > 0 ? candles[candles.length - 1] : null;
  const activeDisplay = hoveredCandle ?? (latestCandle ? {
    open: latestCandle.open,
    high: latestCandle.high,
    low: latestCandle.low,
    close: latestCandle.close,
    volume: latestCandle.volume ?? 0,
  } : null);

  const candleDiff = activeDisplay ? activeDisplay.close - activeDisplay.open : 0;
  const candlePercent = activeDisplay && activeDisplay.open > 0 ? (candleDiff / activeDisplay.open) * 100 : 0;

  const handleApplyCustomRange = (e: React.FormEvent) => {
    e.preventDefault();
    if (customFrom && customTo && onCustomDateApply) {
      onCustomDateApply(customFrom, customTo);
      setShowDatePicker(false);
    }
  };

  return (
    <div className="flex flex-col rounded-xl border border-border-primary bg-bg-secondary overflow-hidden">
      {/* ─── Top Toolbar: Symbol info, live OHLCV readouts & Interval selector ─── */}
      <div className="flex flex-wrap items-center justify-between border-b border-border-primary px-4 py-2.5 gap-2 bg-bg-secondary/70">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-text-primary">
            <span>{symbol}</span>
            <span className="text-text-tertiary">·</span>
            <span className="text-brand font-medium">{activeInterval}</span>
            <span className="text-text-tertiary">·</span>
            <span className="text-text-secondary">{exchange}</span>
          </div>

          {activeDisplay && (
            <div className="flex flex-wrap items-center gap-x-2 text-xs font-mono">
              <span className="text-text-secondary">O <span className="text-text-primary">{activeDisplay.open.toFixed(2)}</span></span>
              <span className="text-text-secondary">H <span className="text-text-primary">{activeDisplay.high.toFixed(2)}</span></span>
              <span className="text-text-secondary">L <span className="text-text-primary">{activeDisplay.low.toFixed(2)}</span></span>
              <span className="text-text-secondary">C <span className="text-text-primary">{activeDisplay.close.toFixed(2)}</span></span>
              <span className={`font-medium ${candleDiff >= 0 ? "text-profit" : "text-loss"}`}>
                {candleDiff >= 0 ? "+" : ""}{candleDiff.toFixed(2)} ({candlePercent >= 0 ? "+" : ""}{candlePercent.toFixed(2)}%)
              </span>
              <span className="text-text-secondary pl-1">
                Vol <span className="text-text-primary font-medium">{formatVolume(activeDisplay.volume)}</span>
              </span>
            </div>
          )}
        </div>

        {/* Interval buttons */}
        <div className="inline-flex items-center rounded-lg bg-bg-tertiary/60 p-0.5 border border-border-primary/50 text-xs">
          {INTERVAL_OPTIONS.map((opt) => {
            const isSelected = activeInterval === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                title={opt.title}
                onClick={() => onIntervalChange?.(opt.id)}
                className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                  isSelected
                    ? "bg-brand text-white shadow-xs"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Chart Area ─── */}
      <div className="relative w-full h-[380px]">
        {isLoading && (
          <div role="status" className="absolute inset-0 z-10 flex items-center justify-center bg-bg-primary/50 backdrop-blur-xs">
            <Spinner size="lg" />
          </div>
        )}
        <div
          ref={containerRef}
          className="w-full h-full"
          aria-label={`${symbol} interactive price and volume chart`}
        />
      </div>

      {/* ─── Bottom Toolbar: Range selector & Custom date range ─── */}
      <div className="flex flex-wrap items-center justify-between border-t border-border-primary px-4 py-2 gap-2 bg-bg-secondary/70 text-xs">
        <div className="flex flex-wrap items-center gap-1">
          {RANGE_OPTIONS.map((r) => {
            const isSelected = range.toUpperCase() === r.toUpperCase() && !customFrom;
            return (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setCustomFrom("");
                  setCustomTo("");
                  onRangeChange?.(r);
                }}
                className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                  isSelected
                    ? "bg-brand text-white shadow-xs"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary"
                }`}
              >
                {r}
              </button>
            );
          })}

          {/* Custom Date Range Toggle */}
          <div className="relative ml-1">
            <button
              type="button"
              onClick={() => setShowDatePicker((prev) => !prev)}
              title="Custom Date Range"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                customFrom || showDatePicker
                  ? "bg-brand/20 text-brand border border-brand/40"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary border border-transparent"
              }`}
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>{customFrom && customTo ? `${customFrom} ~ ${customTo}` : "Custom"}</span>
            </button>

            {showDatePicker && (
              <div className="absolute bottom-full left-0 mb-2 z-20 w-72 rounded-xl border border-border-primary bg-bg-secondary p-3 shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-border-primary pb-2">
                  <span className="font-semibold text-text-primary">Custom Date Range</span>
                  <button
                    type="button"
                    onClick={() => setShowDatePicker(false)}
                    className="text-text-secondary hover:text-text-primary p-0.5 rounded"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <form onSubmit={handleApplyCustomRange} className="space-y-2">
                  <div>
                    <label className="block text-[11px] text-text-secondary mb-1">From Date</label>
                    <input
                      type="date"
                      required
                      value={customFrom}
                      onChange={(e) => setCustomFrom(e.target.value)}
                      className="w-full rounded-lg border border-border-primary bg-bg-tertiary px-2 py-1 text-xs text-text-primary focus:outline-hidden focus:border-brand"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-text-secondary mb-1">To Date</label>
                    <input
                      type="date"
                      required
                      value={customTo}
                      onChange={(e) => setCustomTo(e.target.value)}
                      className="w-full rounded-lg border border-border-primary bg-bg-tertiary px-2 py-1 text-xs text-text-primary focus:outline-hidden focus:border-brand"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setCustomFrom("");
                        setCustomTo("");
                        setShowDatePicker(false);
                        onRangeChange?.("1Y");
                      }}
                      className="px-2.5 py-1 text-text-secondary hover:text-text-primary cursor-pointer text-xs"
                    >
                      Reset
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 bg-brand text-white rounded-md font-medium cursor-pointer text-xs hover:bg-brand/90"
                    >
                      Apply
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-text-tertiary">
          <button
            type="button"
            title="Reset Zoom"
            onClick={() => chartRef.current?.timeScale().fitContent()}
            className="p-1 rounded hover:text-text-primary hover:bg-bg-tertiary cursor-pointer transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
          <span className="hidden sm:inline">Local Time</span>
        </div>
      </div>
    </div>
  );
}
