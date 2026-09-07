"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "Is TradeX completely free to use?",
    answer:
      "Yes, TradeX is 100% free. There are no brokerage charges, no subscription fees, and no hidden costs. It is an educational portfolio paper trading application built to help traders practice risk-free.",
  },
  {
    question: "Do I need to submit PAN, Aadhaar, or link a bank account?",
    answer:
      "Not at all. Because TradeX deals exclusively in simulated virtual currency, you never have to provide sensitive personal identification, bank accounts, or undergo KYC verification. A simple email and password is all you need.",
  },
  {
    question: "How realistic is the market data?",
    answer:
      "TradeX models market dynamics with simulated real-time ticks, realistic bid/ask spreads, and multi-timeframe price movement. Charts are rendered using TradingView Lightweight Charts, the exact charting engine utilized by top fintech brokerages worldwide.",
  },
  {
    question: "What order types are supported?",
    answer:
      "TradeX supports Market orders (instant execution at current prevailing price) and Limit orders (execution only when the market hits or improves upon your specified trigger price).",
  },
  {
    question: "Can I use TradeX on my mobile device?",
    answer:
      "Yes! TradeX is built with a mobile-first responsive architecture. The interface seamlessly adapts from ultra-wide trading monitor setups down to smartphone displays, complete with responsive candlestick charts and quick-action sheets.",
  },
  {
    question: "Can I switch between Light and Dark mode?",
    answer:
      "Yes. TradeX comes with dedicated Light, Dark, and System theme modes crafted using a high-contrast financial palette with distinct profit (green) and loss (red) indicators.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  function toggle(index: number) {
    setOpenIndex(openIndex === index ? null : index);
  }

  return (
    <section id="faq" className="py-20 bg-bg-primary">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14 space-y-3">
          <span className="rounded-full border border-brand/20 bg-brand/10 px-3.5 py-1 text-xs font-semibold text-brand uppercase tracking-wider">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-text-secondary">
            Everything you need to know about trading on the TradeX simulation platform.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="rounded-xl border border-border-primary bg-bg-secondary transition-all overflow-hidden"
              >
                <button
                  onClick={() => toggle(index)}
                  className="flex w-full items-center justify-between p-3.5 sm:p-5 text-left transition-colors hover:bg-bg-tertiary/50 cursor-pointer gap-2"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-semibold text-text-primary pr-2 break-words">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-text-secondary transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-brand" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-3.5 pb-3.5 pt-1 sm:px-5 sm:pb-5 text-xs sm:text-sm text-text-secondary leading-relaxed border-t border-border-primary/40 break-words">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
