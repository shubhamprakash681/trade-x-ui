import Link from "next/link";
import type { HoldingResponse } from "@/types/api.types";
import { formatCurrency, formatPercent, formatQuantity, getPnlColor } from "@/lib/utils";

export function HoldingsTable({ holdings }: { holdings: HoldingResponse[] }) {
  if (!holdings.length) {
    return <p className="py-12 text-center text-sm text-text-secondary">You do not have any holdings yet. Find an instrument in Markets to place your first paper trade.</p>;
  }

  return <div className="overflow-x-auto"><table className="w-full min-w-[880px] text-left text-sm"><thead className="border-b border-border-primary text-xs uppercase tracking-wide text-text-tertiary"><tr><th className="px-5 py-3 font-medium">Instrument</th><th className="px-5 py-3 font-medium">Quantity</th><th className="px-5 py-3 font-medium">Avg. price</th><th className="px-5 py-3 font-medium">Last price</th><th className="px-5 py-3 font-medium">Invested</th><th className="px-5 py-3 font-medium">Market value</th><th className="px-5 py-3 font-medium">P/L</th></tr></thead><tbody>{holdings.map((holding) => <tr key={holding.symbol} className="border-b border-border-primary last:border-0 hover:bg-bg-tertiary"><td className="px-5 py-4"><Link href={`/stocks/${encodeURIComponent(holding.symbol)}`} className="font-semibold text-text-primary hover:text-brand">{holding.symbol}</Link><p className="mt-0.5 max-w-[180px] truncate text-xs text-text-secondary">{holding.stockName}</p></td><td className="px-5 py-4 text-text-primary">{formatQuantity(holding.quantity)}</td><td className="px-5 py-4 text-text-primary">{formatCurrency(holding.averagePrice)}</td><td className="px-5 py-4 text-text-primary">{formatCurrency(holding.lastPrice)}</td><td className="px-5 py-4 text-text-primary">{formatCurrency(holding.investedValue)}</td><td className="px-5 py-4 text-text-primary">{formatCurrency(holding.marketValue)}</td><td className={`px-5 py-4 font-medium ${getPnlColor(holding.unrealizedPnl)}`}>{formatCurrency(holding.unrealizedPnl)}<p className="mt-0.5 text-xs">{formatPercent(holding.unrealizedPnlPercent)}</p></td></tr>)}</tbody></table></div>;
}
