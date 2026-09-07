import { UserPlus, Wallet, TrendingUp, ArrowRight } from "lucide-react";

interface Step {
  step: string;
  icon: React.ElementType;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    step: "01",
    icon: UserPlus,
    title: "Instant 30-Second Sign Up",
    description:
      "Register with your name and email. Absolutely zero KYC, no bank account details, and zero verification delays required.",
  },
  {
    step: "02",
    icon: Wallet,
    title: "Receive ₹10 Lakhs Virtual Capital",
    description:
      "Your paper trading wallet is instantly credited with ₹10,00,000 in simulated funds ready for live market action.",
  },
  {
    step: "03",
    icon: TrendingUp,
    title: "Trade & Master the Markets",
    description:
      "Place real-time market and limit orders, test swing or intraday setups, track your P&L, and gain unshakable confidence.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-bg-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <span className="rounded-full border border-brand/20 bg-brand/10 px-3.5 py-1 text-xs font-semibold text-brand uppercase tracking-wider">
            Simple 3-Step Setup
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            How Paper Trading on TradeX Works
          </h2>
          <p className="text-sm sm:text-base text-text-secondary">
            Jump from spectator to active simulated trader in less than a minute.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 relative">
          {STEPS.map((item) => (
            <div
              key={item.step}
              className="relative rounded-xl sm:rounded-2xl border border-border-primary bg-bg-secondary p-5 sm:p-8 shadow-xs transition-all hover:border-brand/40 min-w-0"
            >
              {/* Step number badge */}
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-brand/10 border border-brand/20 text-brand">
                  <item.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <span className="text-2xl sm:text-3xl font-black text-text-tertiary/40">{item.step}</span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-text-primary mb-2 break-words">{item.title}</h3>

              <p className="text-xs sm:text-sm leading-relaxed text-text-secondary">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
