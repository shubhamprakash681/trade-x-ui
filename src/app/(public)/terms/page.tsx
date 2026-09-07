import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";

export const metadata = {
  title: "Terms of Service — TradeX",
  description: "Terms and Conditions governing the use of TradeX, a paper-trading educational simulation platform.",
};

export default function TermsPage() {
  return (
    <div className="py-8 sm:py-12 w-full min-w-0">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 w-full min-w-0">
        {/* Back Link */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-brand hover:underline transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4 shrink-0" />
            Back to Home
          </Link>
        </div>

        <div className="space-y-6 sm:space-y-8 min-w-0">
          {/* Header */}
          <div className="space-y-2 sm:space-y-3 border-b border-border-primary pb-5 sm:pb-6 min-w-0">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-text-primary break-words">
              TradeX Terms and Conditions
            </h1>
            <p className="text-xs sm:text-sm text-text-tertiary">
              Last Updated: <span className="text-text-secondary">September 2026</span>
            </p>
          </div>

          {/* Important Regulatory Disclaimer Callout */}
          <div className="rounded-xl border border-warning/40 bg-warning-bg/40 p-4 sm:p-5 text-text-primary min-w-0">
            <div className="flex items-start gap-3 min-w-0">
              <ShieldAlert className="h-5 w-5 shrink-0 text-warning mt-0.5" />
              <div className="text-xs sm:text-sm leading-relaxed space-y-1 min-w-0 flex-1">
                <p className="font-bold text-warning break-words">
                  IMPORTANT REGULATORY NOTICE: SIMULATION & EDUCATIONAL USE ONLY
                </p>
                <p className="text-text-secondary">
                  TradeX is an educational paper-trading platform created for software portfolio and strategy learning
                  purposes. TradeX is <strong>NOT</strong> a SEBI-registered broker, registered investment advisor,
                  exchange, or financial institution. All currencies, account balances, securities, and order executions
                  are strictly virtual simulations. No real monetary transactions take place.
                </p>
              </div>
            </div>
          </div>

          {/* Body Sections */}
          <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 sm:space-y-8 text-xs sm:text-base leading-relaxed text-text-secondary min-w-0 break-words">
            <p>
              Welcome to <strong className="text-text-primary">TradeX</strong>! By accessing or using our paper-trading
              platform, website, or associated APIs, you agree to comply with and be bound by the following Terms and
              Conditions. Please read them carefully. If you do not agree to these terms, you must discontinue your use
              of TradeX immediately.
            </p>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-text-primary">1. Acceptance of Terms</h2>
              <p>
                By registering an account, viewing market data, placing simulated orders, or otherwise utilizing TradeX,
                you confirm that you have read, understood, and agreed to be bound by these Terms and our Privacy
                Policy.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-text-primary">
                2. Nature of Platform — Virtual Paper Trading Only
              </h2>
              <h3 className="text-base font-semibold text-text-primary">2.1. Simulated Funds</h3>
              <p>
                Upon registration, users are credited with simulated virtual funds (e.g. ₹10,00,000). These funds have
                zero real-world cash value, cannot be withdrawn, cannot be redeemed for real currency, and cannot be
                transferred to any real bank or brokerage account.
              </p>
              <h3 className="text-base font-semibold text-text-primary">2.2. No Investment Advice</h3>
              <p>
                None of the materials, simulated prices, chart patterns, or performance metrics on TradeX constitute
                financial, investment, legal, or tax advice. Simulated success on TradeX does not indicate or guarantee
                real-world trading profitability in live financial markets.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-text-primary">3. User Accounts and Security</h2>
              <h3 className="text-base font-semibold text-text-primary">3.1. Account Credentials</h3>
              <p>
                You are responsible for maintaining the confidentiality of your login credentials and password. You
                agree to notify us immediately of any unauthorized use or security breach of your account.
              </p>
              <h3 className="text-base font-semibold text-text-primary">3.2. Age Requirement</h3>
              <p>
                You must be at least 13 years of age (or the minimum legal age in your jurisdiction) to register an
                account on TradeX.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-text-primary">4. Acceptable Use Policy</h2>
              <p>You agree not to:</p>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li>Deploy automated bots, crawlers, or scrapers to overload the backend microservices.</li>
                <li>
                  Attempt to bypass authentication, reverse-engineer API tokens, or exploit security vulnerabilities.
                </li>
                <li>Introduce malicious viruses, worms, Trojan horses, or harmful code into the platform.</li>
                <li>Engage in abusive or unlawful activities using our platform features.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-text-primary">5. Market Data & Simulation Accuracy</h2>
              <p>
                Market quotes, charts, and simulated executions are generated for educational and demonstration
                purposes. Ticker quotes may be delayed, approximated, or synthetically generated. TradeX makes no
                warranty regarding the completeness, timeliness, or accuracy of any price or technical metric displayed.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-text-primary">6. Intellectual Property & Portfolio Ownership</h2>
              <p>
                The TradeX platform, source code, user interfaces, branding, and graphics are the intellectual property
                of <strong className="text-text-primary">Shubham Prakash</strong> as a personal engineering portfolio
                showcase. Unauthorized commercial replication or redistribution is prohibited.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-text-primary">7. Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by applicable law, TradeX and its developer shall not be liable for any
                indirect, incidental, punitive, or consequential damages arising out of your access to or use of the
                platform, including any hypothetical financial decisions made based on simulation results.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-text-primary">8. Changes to These Terms</h2>
              <p>
                We reserve the right to revise or update these Terms and Conditions at any time. Continued use of the
                platform following any modifications constitutes acceptance of the updated terms.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-text-primary">9. Contact Information</h2>
              <p>If you have any questions or feedback regarding these Terms and Conditions, please contact:</p>
              <p>
                <strong className="text-text-primary">Developer:</strong> Shubham Prakash
                <br />
                <strong className="text-text-primary">Email:</strong>{" "}
                <a
                  href="mailto:shubhamprakash681@gmail.com"
                  className="text-brand hover:underline font-medium break-all"
                >
                  shubhamprakash681@gmail.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
