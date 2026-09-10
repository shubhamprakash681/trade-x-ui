"use client";

import { useMemo, useState, useRef, useCallback, useEffect } from "react";
import { formatCurrency } from "@/lib/utils";

interface DynamicSparklineProps {
  symbol: string;
  currentPrice: number;
  changeAmount: number;
  isPositive: boolean;
  className?: string;
  onHoverPrice?: (price: number | null) => void;
}

/**
 * Generate deterministic intraday seed points leading up to currentPrice.
 * Ensures consistent curve per stock before live ticks arrive.
 */
function generateIntradaySeed(symbol: string, currentPrice: number, changeAmount: number, count = 24): number[] {
  const seed = symbol.split("").reduce((acc, c, idx) => acc + c.charCodeAt(0) * (idx + 1), 0);
  const points: number[] = [];
  const startPrice = currentPrice - changeAmount;
  const delta = currentPrice - startPrice;

  for (let i = 0; i < count; i++) {
    const progress = i / (count - 1);
    // Baseline trend from start to current price
    const trend = startPrice + delta * progress;
    // Multi-frequency harmonic wave for realistic market texture
    const wave1 = Math.sin((i + (seed % 7)) * 0.85) * (currentPrice * 0.0035);
    const wave2 = Math.cos((i * 1.4 + (seed % 11)) * 0.6) * (currentPrice * 0.0025);
    const pseudoRandom = ((seed * (i + 1) * 9301 + 49297) % 233280) / 233280 - 0.5;
    const wave3 = pseudoRandom * (currentPrice * 0.0018);

    const val = progress === 1 ? currentPrice : trend + wave1 + wave2 + wave3;
    points.push(Number(val.toFixed(2)));
  }
  return points;
}

/**
 * Convert coordinate points to a smooth cubic Bezier curve SVG path.
 */
function pointsToSmoothPath(coords: { x: number; y: number }[]): string {
  if (coords.length === 0) return "";
  if (coords.length === 1) return `M ${coords[0].x} ${coords[0].y}`;

  let d = `M ${coords[0].x.toFixed(1)} ${coords[0].y.toFixed(1)}`;
  for (let i = 0; i < coords.length - 1; i++) {
    const p0 = coords[i === 0 ? 0 : i - 1];
    const p1 = coords[i];
    const p2 = coords[i + 1];
    const p3 = coords[i + 2 >= coords.length ? coords.length - 1 : i + 2];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

export function DynamicSparkline({
  symbol,
  currentPrice,
  changeAmount,
  isPositive,
  className = "",
  onHoverPrice,
}: DynamicSparklineProps) {
  const [historyMap, setHistoryMap] = useState<Record<string, number[]>>({});
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Initialize or append points for the active symbol
  useEffect(() => {
    if (!symbol || currentPrice <= 0) return;

    setHistoryMap((prev) => {
      const existing = prev[symbol];
      if (!existing || existing.length === 0) {
        return {
          ...prev,
          [symbol]: generateIntradaySeed(symbol, currentPrice, changeAmount),
        };
      }

      const lastPrice = existing[existing.length - 1];
      if (lastPrice !== currentPrice) {
        const next = [...existing, currentPrice];
        if (next.length > 35) next.shift(); // Keep maximum 35 rolling points
        return {
          ...prev,
          [symbol]: next,
        };
      }

      return prev;
    });
  }, [symbol, currentPrice, changeAmount]);

  const rawPoints = useMemo(() => {
    return historyMap[symbol] ?? generateIntradaySeed(symbol, currentPrice, changeAmount);
  }, [historyMap, symbol, currentPrice, changeAmount]);

  // Scaled coordinates mapping to SVG viewport (300 x 80)
  const { coords } = useMemo(() => {
    if (rawPoints.length === 0) return { coords: [] };

    let min = Math.min(...rawPoints);
    let max = Math.max(...rawPoints);

    if (min === max) {
      min -= currentPrice * 0.005;
      max += currentPrice * 0.005;
    }

    const range = max - min;
    const topY = 12;
    const bottomY = 66;
    const usableHeight = bottomY - topY;

    const scaled = rawPoints.map((val, idx) => {
      const x = (idx / (rawPoints.length - 1)) * 300;
      const y = bottomY - ((val - min) / range) * usableHeight;
      return { x, y, price: val };
    });

    return { coords: scaled };
  }, [rawPoints, currentPrice]);

  const linePath = useMemo(() => pointsToSmoothPath(coords), [coords]);
  const areaPath = useMemo(() => {
    if (coords.length === 0) return "";
    const firstX = coords[0].x.toFixed(1);
    const lastX = coords[coords.length - 1].x.toFixed(1);
    return `${linePath} L ${lastX} 80 L ${firstX} 80 Z`;
  }, [linePath, coords]);

  const strokeColor = isPositive ? "#10B981" : "#EF4444";
  const glowGradientId = `chartGlow-${symbol}-${isPositive ? "up" : "down"}`;

  const lastCoord = coords.length > 0 ? coords[coords.length - 1] : { x: 300, y: 40, price: currentPrice };
  const activeCoord = hoverIndex !== null && coords[hoverIndex] ? coords[hoverIndex] : lastCoord;

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      const svg = svgRef.current;
      if (!svg || coords.length === 0) return;

      const rect = svg.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const ratio = Math.max(0, Math.min(1, clientX / rect.width));
      const targetX = ratio * 300;

      let closestIdx = 0;
      let minDiff = Infinity;
      for (let i = 0; i < coords.length; i++) {
        const diff = Math.abs(coords[i].x - targetX);
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = i;
        }
      }

      setHoverIndex(closestIdx);
      onHoverPrice?.(coords[closestIdx].price);
    },
    [coords, onHoverPrice],
  );

  const handlePointerLeave = useCallback(() => {
    setHoverIndex(null);
    onHoverPrice?.(null);
  }, [onHoverPrice]);

  return (
    <div className={`relative w-full select-none ${className}`}>
      <svg
        ref={svgRef}
        data-testid="dynamic-sparkline-svg"
        viewBox="0 0 300 80"
        className="h-full w-full overflow-visible cursor-crosshair touch-none"
        preserveAspectRatio="none"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <defs>
          <linearGradient id={glowGradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.38" />
            <stop offset="60%" stopColor={strokeColor} stopOpacity="0.10" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Dynamic Area Fill under Curve */}
        {areaPath && <path d={areaPath} fill={`url(#${glowGradientId})`} className="transition-all duration-300" />}

        {/* Dynamic Smooth Spline Line */}
        {linePath && (
          <path
            d={linePath}
            fill="none"
            stroke={strokeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-colors duration-300"
          />
        )}

        {/* Vertical Crosshair Guide on Hover */}
        {hoverIndex !== null && (
          <line
            x1={activeCoord.x}
            y1={6}
            x2={activeCoord.x}
            y2={74}
            stroke={strokeColor}
            strokeWidth="1.2"
            strokeDasharray="3 3"
            opacity="0.8"
          />
        )}

        {/* Glowing Current Price Beacon (or Hover Dot) */}
        <circle
          cx={activeCoord.x}
          cy={activeCoord.y}
          r="3.5"
          fill={strokeColor}
          stroke="#FFFFFF"
          strokeWidth="1.5"
          className="transition-transform duration-75"
        />
        {hoverIndex === null && (
          <circle cx={lastCoord.x} cy={lastCoord.y} r="7" fill={strokeColor} opacity="0.5" className="animate-ping" />
        )}
      </svg>

      {/* Floating Scrubbing Tooltip Pill */}
      {hoverIndex !== null && (
        <div
          data-testid="sparkline-tooltip"
          className="pointer-events-none absolute -top-3 z-10 -translate-x-1/2 -translate-y-full rounded-md border border-border-primary bg-bg-secondary px-2 py-0.5 text-[10px] font-bold text-text-primary shadow-lg backdrop-blur-md"
          style={{
            left: `${(activeCoord.x / 300) * 100}%`,
          }}
        >
          {formatCurrency(activeCoord.price)}
        </div>
      )}
    </div>
  );
}
