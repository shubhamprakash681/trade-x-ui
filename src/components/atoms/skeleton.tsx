"use client";

import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

/**
 * Base atomic Skeleton component with pulse & traveling light shimmer animation
 */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse animate-shimmer rounded-lg bg-bg-tertiary/70",
        className
      )}
      {...props}
    />
  );
}

/**
 * Skeleton for Market Movers (Top Gainers, Top Losers, Trending)
 */
export function MarketMoverSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="divide-y divide-border-primary/50 select-none">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center justify-between gap-3 px-5 py-3.5">
          <div className="space-y-1.5 flex-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-32" />
          </div>
          <div className="space-y-1.5 text-right">
            <Skeleton className="h-4 w-16 ml-auto" />
            <Skeleton className="h-3 w-12 ml-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Tabular rows skeleton for lists & tables (Orders, Transactions, Watchlist, etc.)
 */
export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="w-full space-y-3 p-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 border-b border-border-primary pb-3">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      <div className="space-y-3 pt-1">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex items-center justify-between gap-4 py-2 border-b border-border-primary/40 last:border-0">
            {Array.from({ length: cols }).map((_, c) => (
              <Skeleton
                key={c}
                className={cn(
                  "h-4 flex-1",
                  c === 0 ? "w-1/3" : "w-1/4"
                )}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Card skeleton with header and content shimmer
 */
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl border border-border-primary bg-bg-secondary p-5 space-y-4 shadow-sm", className)}>
      <div className="space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-7 w-40" />
      </div>
      <Skeleton className="h-3 w-32" />
    </div>
  );
}

/**
 * Grid of market cards skeleton for `/markets`
 */
export function MarketsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border-primary bg-bg-secondary p-5 space-y-4 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-3.5 w-40" />
            </div>
            <div className="space-y-2 text-right">
              <Skeleton className="h-5 w-20 ml-auto" />
              <Skeleton className="h-3.5 w-14 ml-auto" />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-5 w-12 rounded" />
            <Skeleton className="h-5 w-24 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Stock Detail 2-Pane Workstation Skeleton for `/stocks/[symbol]`
 */
export function StockDetailSkeleton() {
  return (
    <div className="space-y-4 font-sans select-none">
      {/* Top Telemetry Header Skeleton */}
      <div className="rounded-xl border border-border-primary bg-bg-secondary p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-28 rounded-md" />
                <Skeleton className="h-5 w-12 rounded" />
                <Skeleton className="h-5 w-24 rounded" />
              </div>
              <Skeleton className="h-3.5 w-36" />
            </div>
          </div>

          {/* 24h slider skeleton */}
          <div className="hidden xl:flex items-center gap-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-2 w-36 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>

          {/* Price skeleton */}
          <div className="space-y-1.5 text-right">
            <Skeleton className="h-7 w-32 ml-auto rounded-md" />
            <Skeleton className="h-4 w-16 ml-auto rounded" />
          </div>
        </div>
      </div>

      {/* 2-Pane Body Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Chart & Drawer */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Chart card skeleton */}
          <div className="rounded-xl border border-border-primary bg-bg-secondary p-4 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-border-primary pb-3">
              <div className="space-y-1">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-56" />
              </div>
              <Skeleton className="h-6 w-20 rounded" />
            </div>
            {/* Chart Area */}
            <div className="h-[380px] w-full flex flex-col justify-end p-4 gap-2 bg-bg-tertiary/20 rounded-lg">
              <div className="flex items-end justify-between gap-1 h-48 px-2">
                {Array.from({ length: 24 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className="w-full rounded-t-sm"
                    style={{ height: `${20 + ((i * 17) % 75)}%` }}
                  />
                ))}
              </div>
              <Skeleton className="h-10 w-full rounded" />
            </div>
          </div>

          {/* Bottom Drawer Skeleton */}
          <div className="rounded-xl border border-border-primary bg-bg-secondary p-4 shadow-sm space-y-3">
            <div className="flex items-center gap-4 border-b border-border-primary pb-2.5">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-32" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-5 w-24" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Order Ticket & Depth */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Fast Order Ticket Skeleton */}
          <div className="rounded-xl border border-border-primary bg-bg-secondary p-4 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border-primary pb-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20 rounded" />
            </div>
            <Skeleton className="h-9 w-full rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
            <Skeleton className="h-10 w-full rounded-lg" />
            <div className="grid grid-cols-5 gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-7 rounded" />
              ))}
            </div>
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>

          {/* Depth Skeleton */}
          <div className="rounded-xl border border-border-primary bg-bg-secondary p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-border-primary pb-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="space-y-1.5">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-full rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Portfolio Skeleton matching `/portfolio`
 */
export function PortfolioSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 select-none">
      {/* Executive Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border-primary pb-4 gap-3">
        <div className="space-y-1.5">
          <Skeleton className="h-8 w-64 rounded-md" />
          <Skeleton className="h-3.5 w-80" />
        </div>
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>

      {/* 4 KPI Cards Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border-primary bg-bg-secondary p-5 space-y-3 shadow-sm">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-8 w-36 rounded" />
            <Skeleton className="h-3.5 w-44" />
          </div>
        ))}
      </div>

      {/* Asset Allocation Bar Skeleton */}
      <div className="rounded-xl border border-border-primary bg-bg-secondary p-5 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-44" />
          <Skeleton className="h-3.5 w-48" />
        </div>
        <Skeleton className="h-3 w-full rounded-full" />
        <div className="flex gap-4 pt-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-24 rounded" />
          ))}
        </div>
      </div>

      {/* Holdings Table Skeleton */}
      <div className="rounded-xl border border-border-primary bg-bg-secondary shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-border-primary px-5 py-4">
          <Skeleton className="h-4 w-44" />
          <Skeleton className="h-3.5 w-24" />
        </div>
        <TableSkeleton rows={6} cols={8} />
      </div>
    </div>
  );
}

/**
 * Simple row-list skeleton for Notifications, Watchlist, Alerts
 */
export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="divide-y divide-border-primary/50">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center justify-between gap-4 px-5 py-4">
          <div className="flex items-center gap-3 flex-1">
            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
          <Skeleton className="h-7 w-16 rounded-md" />
        </div>
      ))}
    </div>
  );
}

/**
 * Full page skeleton for app layout loading states
 */
export function FullPageSkeleton() {
  return (
    <div className="flex h-dvh w-full overflow-hidden bg-bg-primary select-none">
      {/* Sidebar Skeleton */}
      <div className="hidden lg:flex w-64 flex-col border-r border-border-primary bg-bg-secondary p-4 space-y-6">
        <Skeleton className="h-9 w-32 rounded-lg" />
        <div className="space-y-3 flex-1 pt-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full rounded-lg" />
          ))}
        </div>
      </div>

      {/* Main Content Area Skeleton */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <div className="h-16 border-b border-border-primary bg-bg-secondary flex items-center justify-between px-6">
          <Skeleton className="h-6 w-32 rounded" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
          <div className="rounded-xl border border-border-primary bg-bg-secondary p-4">
            <TableSkeleton rows={5} cols={5} />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for Auth pages (Login, Register, Forgot Password)
 */
export function AuthLayoutSkeleton() {
  return (
    <div role="status" aria-label="Loading..." className="flex min-h-screen flex-col bg-bg-primary select-none">
      <div className="flex flex-1 items-center justify-center p-4 py-12">
        <div className="w-full max-w-md space-y-6">
          <div className="flex justify-center">
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
          <div className="rounded-xl border border-border-primary bg-bg-secondary p-6 space-y-4 shadow-sm">
            <Skeleton className="h-6 w-40 mx-auto rounded" />
            <Skeleton className="h-4 w-56 mx-auto" />
            <div className="space-y-3 pt-2">
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
      <p className="sr-only">Loading...</p>
    </div>
  );
}

