import { Check, X } from "lucide-react";

interface ComparisonRow {
  feature: string;
  tradeX: string;
  tradeXPositive: boolean;
  liveBroker: string;
  liveBrokerPositive: boolean;
}

const COMPARISON_ROWS: ComparisonRow[] = [
  {
    feature: "Financial Risk",
    tradeX: "Zero Risk (100% Virtual Money)",
    tradeXPositive: true,
    liveBroker: "High Risk (Hard-earned capital)",
    liveBrokerPositive: false,
  },
  {
    feature: "Starting Capital",
    tradeX: "₹10,00,000 Free Virtual Balance",
    tradeXPositive: true,
    liveBroker: "Requires personal bank deposits",
    liveBrokerPositive: false,
  },
  {
    feature: "Account Setup & KYC",
    tradeX: "30 Seconds · No KYC or Bank details",
    tradeXPositive: true,
    liveBroker: "2-3 Days · Demat, PAN, Aadhaar, Bank verify",
    liveBrokerPositive: false,
  },
  {
    feature: "Emotional Psychology",
    tradeX: "Calm, objective strategy refinement",
    tradeXPositive: true,
    liveBroker: "High emotional anxiety and FOMO",
    liveBrokerPositive: false,
  },
  {
    feature: "Market Data & Charts",
    tradeX: "TradingView Lightweight Charts included",
    tradeXPositive: true,
    liveBroker: "Included, often cluttered with ads/upsells",
    liveBrokerPositive: true,
  },
  {
    feature: "Platform Charges & Brokerage",
    tradeX: "₹0 Free Forever",
    tradeXPositive: true,
    liveBroker: "Brokerage + STT + GST + Stamp Duty",
    liveBrokerPositive: false,
  },
];

export function ComparisonTable() {
  return (
    <section className="py-20 bg-bg-secondary/50 border-t border-border-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="rounded-full border border-brand/20 bg-brand/10 px-3.5 py-1 text-xs font-semibold text-brand uppercase tracking-wider">
            Why Paper Trade First
          </span>
          <h2 className="text-3xl font-extrabold text-text-primary sm:text-4xl tracking-tight">
            TradeX vs Live Broker Trading
          </h2>
          <p className="text-base text-text-secondary">
            Why smart traders build their edge on TradeX before putting real money on the line.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border-primary bg-bg-primary shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border-primary bg-bg-secondary text-text-primary">
                  <th className="py-4 px-6 font-semibold">Aspect</th>
                  <th className="py-4 px-6 font-bold text-brand bg-brand/5 border-x border-border-primary">
                    TradeX Paper Trading
                  </th>
                  <th className="py-4 px-6 font-semibold text-text-secondary">Real Money Broker</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-primary">
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.feature} className="transition-colors hover:bg-bg-secondary/40">
                    <td className="py-4 px-6 font-medium text-text-primary">{row.feature}</td>

                    {/* TradeX column */}
                    <td className="py-4 px-6 bg-brand/5 border-x border-border-primary font-medium">
                      <div className="flex items-center gap-2">
                        {row.tradeXPositive ? (
                          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-profit-bg text-profit">
                            <Check className="h-3.5 w-3.5" />
                          </div>
                        ) : (
                          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-loss-bg text-loss">
                            <X className="h-3.5 w-3.5" />
                          </div>
                        )}
                        <span className="text-text-primary">{row.tradeX}</span>
                      </div>
                    </td>

                    {/* Live Broker column */}
                    <td className="py-4 px-6 text-text-secondary">
                      <div className="flex items-center gap-2">
                        {row.liveBrokerPositive ? (
                          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-profit-bg text-profit">
                            <Check className="h-3.5 w-3.5" />
                          </div>
                        ) : (
                          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-loss-bg text-loss">
                            <X className="h-3.5 w-3.5" />
                          </div>
                        )}
                        <span>{row.liveBroker}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
