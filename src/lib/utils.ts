import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// ─── Class Name Utility ───────────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Financial Formatting ─────────────────────────────────────────────────────

const INR_FORMATTER = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const INR_COMPACT_FORMATTER = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  notation: "compact",
  maximumFractionDigits: 2,
});

const PERCENT_FORMATTER = new Intl.NumberFormat("en-IN", {
  style: "percent",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  signDisplay: "always",
});

const NUMBER_FORMATTER = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 2,
});

const QUANTITY_FORMATTER = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 4,
});

/**
 * Format a number as Indian Rupees: ₹1,24,500.50
 */
export function formatCurrency(value: number | string | null | undefined): string {
  if (value == null) return "₹0.00";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "₹0.00";
  return INR_FORMATTER.format(num);
}

/**
 * Format a number as compact Indian Rupees: ₹1.24L
 */
export function formatCurrencyCompact(value: number | string | null | undefined): string {
  if (value == null) return "₹0";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "₹0";
  return INR_COMPACT_FORMATTER.format(num);
}

/**
 * Format a number as percentage with sign: +2.45%, -1.21%
 */
export function formatPercent(value: number | string | null | undefined): string {
  if (value == null) return "0.00%";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "0.00%";
  return PERCENT_FORMATTER.format(num / 100);
}

/**
 * Format a general number with Indian locale
 */
export function formatNumber(value: number | string | null | undefined): string {
  if (value == null) return "0";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "0";
  return NUMBER_FORMATTER.format(num);
}

/**
 * Format quantity (up to 4 decimal places)
 */
export function formatQuantity(value: number | string | null | undefined): string {
  if (value == null) return "0";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "0";
  return QUANTITY_FORMATTER.format(num);
}

// ─── P/L Utilities ────────────────────────────────────────────────────────────

export function getPnlColor(value: number | string | null | undefined): string {
  if (value == null) return "text-secondary";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (num > 0) return "text-profit";
  if (num < 0) return "text-loss";
  return "text-secondary";
}

export function getPnlBgColor(value: number | string | null | undefined): string {
  if (value == null) return "";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (num > 0) return "bg-profit-bg";
  if (num < 0) return "bg-loss-bg";
  return "";
}

export function getPnlSign(value: number | string | null | undefined): string {
  if (value == null) return "";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (num > 0) return "+";
  if (num < 0) return ""; // negative sign is already present
  return "";
}

export function formatPnl(value: number | string | null | undefined): string {
  return `${getPnlSign(value)}${formatCurrency(value)}`;
}

export function formatPnlPercent(value: number | string | null | undefined): string {
  return formatPercent(value);
}

// ─── Date / Time Utilities ────────────────────────────────────────────────────

/**
 * Format ISO-8601 datetime to readable date: "06 Sep 2026"
 */
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Format ISO-8601 datetime to readable datetime: "06 Sep 2026, 09:30 PM"
 */
export function formatDateTime(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Format relative time: "2 minutes ago", "3 hours ago", "Yesterday"
 */
export function formatRelativeTime(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay === 1) return "Yesterday";
  if (diffDay < 7) return `${diffDay}d ago`;
  return formatDate(dateStr);
}

// ─── Misc ─────────────────────────────────────────────────────────────────────

/**
 * Generate initials from a full name: "Shubham Prakash" → "SP"
 */
export function getInitials(name: string | null | undefined): string {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
