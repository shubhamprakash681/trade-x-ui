import Link from "next/link";
import { Mail, Heart, ShieldCheck, ExternalLink } from "lucide-react";
import { GithubIcon, LinkedinIcon, YoutubeIcon } from "@/components/atoms/social-icons";
import { Logo } from "@/components/atoms/logo";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border-primary bg-bg-secondary text-text-secondary w-full min-w-0">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:py-12 sm:px-6 lg:px-8 w-full min-w-0">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 min-w-0">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4 min-w-0">
            <Link href="/" className="inline-block" aria-label="TradeX Home">
              <Logo size="md" />
            </Link>
            <p className="text-sm leading-relaxed text-text-secondary">
              TradeX is a production-inspired paper trading platform inspired by modern fintech leaders like Groww,
              INDmoney, and Delta Exchange. Practice trading simulated equities with real-time market dynamics and zero
              financial risk.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border border-border-primary bg-bg-primary px-3 py-1 text-xs font-medium text-text-tertiary">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-profit" />
              <span>100% Risk-Free Simulation</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          {/* Col 2: Quick Links */}
          <div className="min-w-0">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-primary">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="transition-colors hover:text-brand hover:underline">
                  About TradeX
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition-colors hover:text-brand hover:underline">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="transition-colors hover:text-brand hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/markets" className="transition-colors hover:text-brand hover:underline">
                  Live Markets
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="transition-colors hover:text-brand hover:underline">
                  Trading Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Platform Features */}
          <div className="min-w-0">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-primary">Platform Features</h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand shrink-0" />
                <span>₹10,00,000 Virtual Capital</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand shrink-0" />
                <span>Real-Time WebSocket Tickers</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand shrink-0" />
                <span>TradingView Lightweight Charts</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand shrink-0" />
                <span>Instant Market & Limit Orders</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand shrink-0" />
                <span>Target Price & Alert Engine</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Connect With Me (Shubham Prakash) */}
          <div className="min-w-0">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-primary">Connect With Me</h3>
            <p className="mb-4 text-sm text-text-secondary">
              A personal portfolio project developed by{" "}
              <span className="font-medium text-text-primary">Shubham Prakash</span>.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://github.com/shubhamprakash681"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-primary bg-bg-primary text-text-secondary transition-colors hover:border-brand hover:text-brand"
                aria-label="GitHub Profile"
                title="GitHub"
              >
                <GithubIcon className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com/in/shubhamprakash681"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-primary bg-bg-primary text-text-secondary transition-colors hover:border-brand hover:text-brand"
                aria-label="LinkedIn Profile"
                title="LinkedIn"
              >
                <LinkedinIcon className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com/@shubhamprakash5520"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-primary bg-bg-primary text-text-secondary transition-colors hover:border-brand hover:text-brand"
                aria-label="YouTube Channel"
                title="YouTube"
              >
                <YoutubeIcon className="h-4 w-4" />
              </a>
              <a
                href="mailto:shubhamprakash681@gmail.com"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-primary bg-bg-primary text-text-secondary transition-colors hover:border-brand hover:text-brand"
                aria-label="Send an email to Shubham Prakash"
                title="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
            <div className="mt-4">
              <a
                href="https://videoshare.shubhamprakash681.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-text-tertiary transition-colors hover:text-brand break-all"
              >
                <span>Check out VideoShare project</span>
                <ExternalLink className="h-3 w-3 shrink-0" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-border-primary" />

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between gap-4 text-center text-xs text-text-tertiary md:flex-row md:text-left min-w-0">
          <p>
            Made with <Heart className="inline h-3.5 w-3.5 fill-loss text-loss" /> by{" "}
            <a
              href="https://github.com/shubhamprakash681"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand hover:underline"
            >
              Shubham Prakash
            </a>
          </p>

          <p>© {currentYear} TradeX. A personal portfolio project. All rights reserved.</p>

          <p className="max-w-md text-[11px] leading-tight text-text-tertiary/80 break-words">
            Disclaimer: TradeX is a paper-trading simulation platform for educational purposes only. No real monetary
            investments or brokerage transactions take place.
          </p>
        </div>
      </div>
    </footer>
  );
}
