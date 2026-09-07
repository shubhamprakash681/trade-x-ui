import { CandlestickChart, Zap, Briefcase, BellRing, ShieldCheck, Cpu } from "lucide-react";

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
  badge: string;
  badgeColor: string;
}

const FEATURES: Feature[] = [
  {
    icon: CandlestickChart,
    title: "TradingView Lightweight Charts",
    description:
      "Interactive multi-timeframe candlestick, area, and volume charts. Inspect price patterns and trendlines with precision zoom and custom crosshairs.",
    badge: "Technical Analysis",
    badgeColor: "text-brand bg-brand/10 border-brand/20",
  },
  {
    icon: Zap,
    title: "Instant Simulated Order Engine",
    description:
      "Execute Market and Limit orders with instant fill simulation, slippage protection, and automated wallet debit/credit mechanics.",
    badge: "Order Execution",
    badgeColor: "text-warning bg-warning/10 border-warning/20",
  },
  {
    icon: Briefcase,
    title: "Comprehensive Portfolio Analytics",
    description:
      "Track your simulated net worth, realized vs unrealized P&L, overall ROI, asset allocation, and average buy price just like Groww and INDmoney.",
    badge: "Portfolio Management",
    badgeColor: "text-profit bg-profit/10 border-profit/20",
  },
  {
    icon: BellRing,
    title: "Price Alerts & Notifications",
    description:
      "Set price breakout triggers on your favorite stocks. Receive instant unread notifications when a target entry or exit condition is met.",
    badge: "Smart Alerts",
    badgeColor: "text-brand-secondary bg-brand-secondary/10 border-brand-secondary/20",
  },
  {
    icon: ShieldCheck,
    title: "100% Risk-Free Strategy Sandbox",
    description:
      "Eliminate psychological trading stress. Perfect your risk management rules, test swing setups, and master discipline with ₹10,00,000 virtual cash.",
    badge: "Paper Trading",
    badgeColor: "text-profit bg-profit/10 border-profit/20",
  },
  {
    icon: Cpu,
    title: "Spring Cloud Microservices Stack",
    description:
      "Powered by an enterprise backend: API Gateway, Auth Service, Market Engine, Portfolio Ledger, and STOMP WebSockets for maximum resilience.",
    badge: "Scalable Architecture",
    badgeColor: "text-brand-accent bg-brand-accent/10 border-brand-accent/20",
  },
];

export function FeaturesGrid() {
  return (
    <section id="features" className="py-20 bg-bg-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="rounded-full border border-brand/20 bg-brand/10 px-3.5 py-1 text-xs font-semibold text-brand uppercase tracking-wider">
            Built for Traders
          </span>
          <h2 className="text-3xl font-extrabold text-text-primary sm:text-4xl tracking-tight">
            Everything You Need to Trade with Confidence
          </h2>
          <p className="text-base text-text-secondary">
            Engineered from the ground up with the capabilities of top fintech platforms, giving you the ultimate paper
            trading environment.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl border border-border-primary bg-bg-secondary p-7 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-bg-primary border border-border-primary group-hover:border-brand/40 group-hover:scale-105 transition-all">
                  <feature.icon className="h-6 w-6 text-brand" />
                </div>
                <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${feature.badgeColor}`}>
                  {feature.badge}
                </span>
              </div>

              <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-brand transition-colors">
                {feature.title}
              </h3>

              <p className="text-sm leading-relaxed text-text-secondary">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
