import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import type { PortfolioSummaryResponse } from "@/types/api.types";
import { formatCurrency, formatPnl, formatPercent, getPnlColor } from "@/lib/utils";

export function PortfolioSummary({ summary }: { summary: PortfolioSummaryResponse }) {
  const metrics = [
    { label: "Portfolio value", value: formatCurrency(summary.totalValue) },
    { label: "Cash balance", value: formatCurrency(summary.cashBalance) },
    { label: "Invested value", value: formatCurrency(summary.investedValue) },
    { label: "Holdings value", value: formatCurrency(summary.holdingsValue) },
  ];
  return <><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map((metric) => <Card key={metric.label}><CardContent><p className="text-sm text-text-secondary">{metric.label}</p><p className="mt-2 text-xl font-semibold text-text-primary">{metric.value}</p></CardContent></Card>)}</div><div className="mt-4 grid gap-4 sm:grid-cols-2"><Card><CardHeader><CardTitle className="text-base">Unrealized P/L</CardTitle></CardHeader><CardContent><p className={`text-2xl font-semibold ${getPnlColor(summary.unrealizedPnl)}`}>{formatPnl(summary.unrealizedPnl)}</p><p className={`mt-1 text-sm ${getPnlColor(summary.unrealizedPnlPercent)}`}>{formatPercent(summary.unrealizedPnlPercent)}</p></CardContent></Card><Card><CardHeader><CardTitle className="text-base">Today&apos;s P/L</CardTitle></CardHeader><CardContent><p className={`text-2xl font-semibold ${getPnlColor(summary.todayPnl)}`}>{formatPnl(summary.todayPnl)}</p><p className={`mt-1 text-sm ${getPnlColor(summary.todayPnlPercent)}`}>{formatPercent(summary.todayPnlPercent)}</p></CardContent></Card></div></>;
}
