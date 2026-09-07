"use client";

import { useEffect, useRef } from "react";
import { CandlestickSeries, ColorType, createChart, type IPriceLine, type ISeriesApi, type UTCTimestamp } from "lightweight-charts";
import type { CandleResponse, PriceResponse } from "@/types/api.types";

interface PriceChartProps {
  candles: CandleResponse[];
  livePrice: PriceResponse | null;
}

function toTimestamp(value: string): UTCTimestamp | null {
  const milliseconds = Date.parse(value);
  return Number.isNaN(milliseconds) ? null : Math.floor(milliseconds / 1000) as UTCTimestamp;
}

export function PriceChart({ candles, livePrice }: PriceChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const priceLineRef = useRef<IPriceLine | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const style = getComputedStyle(document.documentElement);
    const chart = createChart(container, {
      width: container.clientWidth,
      height: 360,
      layout: { background: { type: ColorType.Solid, color: "transparent" }, textColor: style.getPropertyValue("--text-secondary").trim() },
      grid: { vertLines: { color: style.getPropertyValue("--chart-grid").trim() }, horzLines: { color: style.getPropertyValue("--chart-grid").trim() } },
      rightPriceScale: { borderColor: style.getPropertyValue("--border-primary").trim() },
      timeScale: { borderColor: style.getPropertyValue("--border-primary").trim(), timeVisible: true },
    });
    const series = chart.addSeries(CandlestickSeries, {
      upColor: style.getPropertyValue("--chart-candle-up").trim(),
      downColor: style.getPropertyValue("--chart-candle-down").trim(),
      borderVisible: false,
      wickUpColor: style.getPropertyValue("--chart-candle-up").trim(),
      wickDownColor: style.getPropertyValue("--chart-candle-down").trim(),
    });
    const data = candles.flatMap((candle) => {
      const time = toTimestamp(candle.candleTime);
      return time === null ? [] : [{ time, open: candle.open, high: candle.high, low: candle.low, close: candle.close }];
    });
    series.setData(data);
    chart.timeScale().fitContent();
    const resizeObserver = new ResizeObserver(([entry]) => chart.applyOptions({ width: entry.contentRect.width }));
    resizeObserver.observe(container);
    seriesRef.current = series;

    return () => {
      resizeObserver.disconnect();
      chart.remove();
      seriesRef.current = null;
      priceLineRef.current = null;
    };
  }, [candles]);

  useEffect(() => {
    const series = seriesRef.current;
    if (!series || !livePrice) return;
    if (priceLineRef.current) series.removePriceLine(priceLineRef.current);
    priceLineRef.current = series.createPriceLine({
      price: livePrice.price,
      color: livePrice.changeAmount >= 0 ? "#10B981" : "#EF4444",
      lineWidth: 1,
      lineStyle: 2,
      axisLabelVisible: true,
      title: "Live",
    });
  }, [livePrice]);

  return <div ref={containerRef} className="h-[360px] w-full" aria-label="Historical candlestick chart with current live price" />;
}
