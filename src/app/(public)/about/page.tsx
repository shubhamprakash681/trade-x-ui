import Link from "next/link";
import {
  ArrowLeft,
  TrendingUp,
  ShieldCheck,
  Zap,
  BarChart3,
  Bell,
  Wallet,
  Mail,
  ExternalLink,
  Layers,
  Sparkles,
} from "lucide-react";
import { GithubIcon, LinkedinIcon, YoutubeIcon } from "@/components/atoms/social-icons";
import { Button } from "@/components/atoms/button";

export const metadata = {
  title: "About TradeX — Paper Trading Platform",
  description:
    "Learn about TradeX, an institutional-grade paper trading platform developed by Shubham Prakash. Inspired by Groww, INDmoney, and Delta Exchange.",
};

export default function AboutPage() {
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

        <div className="space-y-10 sm:space-y-12 min-w-0">
          {/* Header */}
          <div className="space-y-3 border-b border-border-primary pb-6 sm:pb-8 min-w-0">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
              <Sparkles className="h-3.5 w-3.5 shrink-0" />
              <span>Project Overview</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-text-primary break-words">
              About TradeX
            </h1>
            <p className="text-base sm:text-lg text-text-secondary">
              A production-inspired paper trading platform for simulated stock market investment and practice.
            </p>
            <p className="text-xs text-text-tertiary">
              Last Updated: <span className="text-text-secondary">September 2026</span>
            </p>
          </div>

          {/* Section: Our Story */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-text-primary">Our Story</h2>
            <div className="space-y-3 text-base leading-relaxed text-text-secondary">
              <p>
                <strong className="text-text-primary font-semibold">TradeX</strong> was created as a comprehensive
                software engineering portfolio project to demonstrate the design and implementation of an
                enterprise-grade fintech platform. Inspired by the intuitive, clean interfaces of industry leaders such
                as <span className="text-text-primary font-medium">Groww</span>,{" "}
                <span className="text-text-primary font-medium">INDmoney</span>, and{" "}
                <span className="text-text-primary font-medium">Delta Exchange</span>, TradeX bridges the gap between
                complex financial architecture and seamless user experiences.
              </p>
              <p>
                Real-world trading requires emotional discipline, technical acumen, and a deep understanding of market
                mechanics. However, novice traders often face steep losses while learning the basics on live brokerage
                platforms. TradeX solves this problem by providing an authentic, risk-free simulation where users can
                practice placing Market and Limit orders, analyze candlestick charts, configure price triggers, and
                manage a simulated ₹10,00,000 equity portfolio with zero monetary risk.
              </p>
            </div>
          </section>

          {/* Section: Our Mission */}
          <section className="space-y-4 min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-text-primary">Our Mission</h2>
            <div className="rounded-xl sm:rounded-2xl border border-border-primary bg-bg-secondary p-4 sm:p-8 min-w-0">
              <blockquote className="text-base sm:text-xl font-medium italic text-text-primary leading-relaxed">
                &ldquo;To empower aspiring traders and developers to master stock market dynamics, test quantitative and
                discretionary strategies, and build rock-solid confidence in a realistic, institutional-grade, zero-risk
                simulation environment.&rdquo;
              </blockquote>
            </div>
          </section>

          {/* Section: Key Features */}
          <section className="space-y-4 sm:space-y-6 min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-text-primary">Key Platform Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div className="flex gap-3.5 sm:gap-4 rounded-xl border border-border-primary bg-bg-secondary p-4 sm:p-5 min-w-0">
                <div className="mt-0.5 sm:mt-1 flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <TrendingUp className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm sm:text-base font-semibold text-text-primary mb-1">
                    Real-Time Simulated Market Data
                  </h3>
                  <p className="text-xs sm:text-sm text-text-secondary">
                    Tick-by-tick streaming prices for major Indian and global equities powered by STOMP WebSocket
                    channels.
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5 sm:gap-4 rounded-xl border border-border-primary bg-bg-secondary p-4 sm:p-5 min-w-0">
                <div className="mt-0.5 sm:mt-1 flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-profit/10 text-profit">
                  <Wallet className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm sm:text-base font-semibold text-text-primary mb-1">
                    Virtual Portfolio & P&L Engine
                  </h3>
                  <p className="text-xs sm:text-sm text-text-secondary">
                    Real-time valuation of net holdings, unrealized returns, day gains, and asset allocation breakdown.
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5 sm:gap-4 rounded-xl border border-border-primary bg-bg-secondary p-4 sm:p-5 min-w-0">
                <div className="mt-0.5 sm:mt-1 flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-brand-secondary/10 text-brand-secondary">
                  <BarChart3 className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm sm:text-base font-semibold text-text-primary mb-1">
                    TradingView Lightweight Charts
                  </h3>
                  <p className="text-xs sm:text-sm text-text-secondary">
                    Multi-timeframe candlestick and line charts featuring precise volume bars, crosshairs, and pattern
                    visualization.
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5 sm:gap-4 rounded-xl border border-border-primary bg-bg-secondary p-4 sm:p-5 min-w-0">
                <div className="mt-0.5 sm:mt-1 flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-warning/10 text-warning">
                  <Zap className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm sm:text-base font-semibold text-text-primary mb-1">
                    Fast Simulated Order Matching
                  </h3>
                  <p className="text-xs sm:text-sm text-text-secondary">
                    Execute simulated Market and Limit orders with realistic order fill mechanics and comprehensive
                    audit logs.
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5 sm:gap-4 rounded-xl border border-border-primary bg-bg-secondary p-4 sm:p-5 min-w-0">
                <div className="mt-0.5 sm:mt-1 flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-brand-accent/10 text-brand-accent">
                  <Bell className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm sm:text-base font-semibold text-text-primary mb-1">
                    Target Price Alert System
                  </h3>
                  <p className="text-xs sm:text-sm text-text-secondary">
                    Configure custom threshold alerts and receive immediate notifications when market prices cross your
                    targets.
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5 sm:gap-4 rounded-xl border border-border-primary bg-bg-secondary p-4 sm:p-5 min-w-0">
                <div className="mt-0.5 sm:mt-1 flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-profit/10 text-profit">
                  <ShieldCheck className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm sm:text-base font-semibold text-text-primary mb-1">
                    100% Risk-Free & Free Forever
                  </h3>
                  <p className="text-xs sm:text-sm text-text-secondary">
                    No bank accounts, no KYC documents, no hidden fees, and zero risk of real financial loss.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Architecture & Engineering */}
          <section className="space-y-4 min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-text-primary">Architecture & Engineering Stack</h2>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              TradeX is engineered as a distributed, decoupled full-stack platform:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs">
              <div className="rounded-xl border border-border-primary bg-bg-secondary p-3.5 sm:p-4 space-y-2 min-w-0">
                <div className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                  <Layers className="h-4 w-4 text-brand shrink-0" />
                  <span>Frontend Architecture</span>
                </div>
                <ul className="space-y-1 text-text-secondary list-disc list-inside">
                  <li>Next.js 16 (App Router) & React 19</li>
                  <li>TypeScript in strict mode</li>
                  <li>Tailwind CSS v4 with custom financial design system</li>
                  <li>Zustand for client state management</li>
                  <li>TanStack React Query for server cache</li>
                  <li>TradingView Lightweight Charts</li>
                </ul>
              </div>

              <div className="rounded-xl border border-border-primary bg-bg-secondary p-3.5 sm:p-4 space-y-2 min-w-0">
                <div className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                  <Layers className="h-4 w-4 text-brand-secondary shrink-0" />
                  <span>Backend Microservices</span>
                </div>
                <ul className="space-y-1 text-text-secondary list-disc list-inside">
                  <li>Spring Boot & Spring Cloud Microservices</li>
                  <li>Spring Cloud Gateway with JWT stateless auth</li>
                  <li>Eureka Service Discovery & Config Server</li>
                  <li>Market, Portfolio, and Order Services</li>
                  <li>STOMP WebSocket price broadcasting</li>
                  <li>PostgreSQL database & Kafka event streaming</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section: About the Developer */}
          <section className="space-y-4 border-t border-border-primary pt-8 min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-text-primary">About the Developer</h2>
            <div className="rounded-xl sm:rounded-2xl border border-border-primary bg-bg-secondary p-4.5 sm:p-8 space-y-4 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 min-w-0">
                <div className="min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold text-text-primary">Shubham Prakash</h3>
                  <p className="text-xs sm:text-sm text-text-secondary">
                    Full-Stack Software Engineer · Microservices & Modern Web Architect
                  </p>
                </div>

                <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
                  <a
                    href="https://github.com/shubhamprakash681"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-primary bg-bg-primary text-text-secondary hover:border-brand hover:text-brand transition-colors"
                    aria-label="GitHub"
                  >
                    <GithubIcon className="h-4 w-4" />
                  </a>
                  <a
                    href="https://linkedin.com/in/shubhamprakash681"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-primary bg-bg-primary text-text-secondary hover:border-brand hover:text-brand transition-colors"
                    aria-label="LinkedIn"
                  >
                    <LinkedinIcon className="h-4 w-4" />
                  </a>
                  <a
                    href="https://youtube.com/@shubhamprakash5520"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-primary bg-bg-primary text-text-secondary hover:border-brand hover:text-brand transition-colors"
                    aria-label="YouTube"
                  >
                    <YoutubeIcon className="h-4 w-4" />
                  </a>
                  <a
                    href="mailto:shubhamprakash681@gmail.com"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-primary bg-bg-primary text-text-secondary hover:border-brand hover:text-brand transition-colors"
                    aria-label="Email"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                </div>
              </div>

              <p className="text-xs sm:text-sm leading-relaxed text-text-secondary">
                TradeX is a solo project developed as part of my portfolio. It reflects my passion for engineering
                scalable distributed systems, high-throughput microservices, and clean, accessible user experiences. In
                addition to TradeX, feel free to explore my video streaming portfolio platform,{" "}
                <a
                  href="https://videoshare.shubhamprakash681.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-brand hover:underline inline-flex items-center gap-1"
                >
                  VideoShare <ExternalLink className="h-3 w-3" />
                </a>
                .
              </p>
            </div>
          </section>

          {/* Section: Explore the Platform */}
          <section className="space-y-4 rounded-xl sm:rounded-2xl border border-border-primary bg-bg-secondary p-5 sm:p-8 text-center sm:text-left min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-text-primary">Explore TradeX Today</h2>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-2xl">
              Whether you are here to test a trading strategy, explore the microservices architecture, or review the
              codebase, you are warmly invited to try the platform.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 w-full">
              <Link href="/register" className="w-full sm:w-auto">
                <Button variant="primary" className="w-full sm:w-auto justify-center">
                  Start Paper Trading
                </Button>
              </Link>
              <Link href="/markets" className="w-full sm:w-auto">
                <Button variant="secondary" className="w-full sm:w-auto justify-center">
                  View Live Markets
                </Button>
              </Link>
              <a
                href="mailto:shubhamprakash681@gmail.com"
                className="text-xs text-text-tertiary hover:text-brand hover:underline sm:ml-4 break-all"
              >
                Questions or feedback? shubhamprakash681@gmail.com
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
