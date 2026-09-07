"use client";

import { useState } from "react";
import { LineChart, Briefcase, Layers, Bell, ArrowUpRight, TrendingUp, Check, Plus } from "lucide-react";

type TabKey = "charts" | "portfolio" | "orders" | "alerts";

interface TabConfig {
  id: TabKey;
  label: string;
  icon: React.ElementType;
  title: string;
  subtitle: string;
}

const TABS: TabConfig[] = [
  {
    id: "charts",
    label: "Live Charts",
    icon: LineChart,
    title: "High-Resolution Technical Charts",
    subtitle:
      "Inspect intraday and historical price trends with TradingView-powered Lightweight Charts, candlestick visualizations, and volume indicators.",
  },
  {
    id: "portfolio",
    label: "Portfolio Analytics",
    icon: Briefcase,
    title: "Real-Time Net Worth & Holding Metrics",
    subtitle:
      "Track your simulated assets with institutional clarity. View total investment, current valuation, and individual stock P&L breakdowns.",
  },
  {
    id: "orders",
    label: "Order Execution",
    icon: Layers,
    title: "Simulated Market & Limit Orders",
    subtitle:
      "Execute simulated trades with instantaneous order matching, transparent fees, and detailed transaction ledger logs.",
  },
  {
    id: "alerts",
    label: "Alerts & Watchlist",
    icon: Bell,
    title: "Smart Target Price Trigger Engine",
    subtitle:
      "Curate your personalized stock watchlist and set price notifications that trigger immediately when target price levels are crossed.",
  },
];

export function InteractivePreview() {
  const [activeTab, setActiveTab] = useState<TabKey>("charts");

  const currentTab = TABS.find((t) => t.id === activeTab)!;

  return (
    <section className="py-20 bg-bg-secondary/40 border-t border-border-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 space-y-3">
          <span className="rounded-full border border-brand-secondary/20 bg-brand-secondary/10 px-3.5 py-1 text-xs font-semibold text-brand-secondary uppercase tracking-wider">
            Interactive Product Tour
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            Designed for Speed, Engineered for Precision
          </h2>
          <p className="text-sm sm:text-base text-text-secondary">
            Switch between core workflows to see how TradeX streamlines your trading routine.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex overflow-x-auto pb-2 mb-8 justify-start sm:justify-center -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="inline-flex rounded-xl bg-bg-secondary p-1 border border-border-primary gap-1 shrink-0">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 sm:gap-2 rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-brand text-white shadow-sm"
                      : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary"
                  }`}
                >
                  <tab.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Display Container */}
        <div className="rounded-xl sm:rounded-2xl border border-border-primary bg-bg-secondary p-4 sm:p-8 shadow-xl min-w-0 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center min-w-0">
            {/* Explanatory side */}
            <div className="lg:col-span-4 space-y-3 sm:space-y-4 min-w-0">
              <h3 className="text-xl sm:text-2xl font-bold text-text-primary">{currentTab.title}</h3>
              <p className="text-xs sm:text-sm leading-relaxed text-text-secondary">{currentTab.subtitle}</p>

              <div className="space-y-2 pt-2 text-xs text-text-secondary">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-profit" />
                  <span>Zero lag simulated quote streaming</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-profit" />
                  <span>Interactive zoom and responsive layouts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-profit" />
                  <span>Full Light and Dark theme compatibility</span>
                </div>
              </div>
            </div>

            {/* Interactive Mock Display */}
            <div className="lg:col-span-8 rounded-lg sm:rounded-xl border border-border-primary bg-bg-primary p-3 sm:p-5 shadow-inner min-w-0">
              {activeTab === "charts" && (
                <div className="space-y-3 sm:space-y-4 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-primary pb-3 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 min-w-0">
                      <span className="font-bold text-sm sm:text-base text-text-primary">TCS</span>
                      <span className="text-xs text-text-tertiary hidden xs:inline">Tata Consultancy</span>
                      <span className="rounded bg-profit-bg px-1.5 sm:px-2 py-0.5 text-[11px] sm:text-xs font-semibold text-profit">
                        +₹45.60 (+1.12%)
                      </span>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      {["1D", "1W", "1M", "1Y", "ALL"].map((period) => (
                        <span
                          key={period}
                          className={`rounded px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-[11px] font-medium ${
                            period === "1D" ? "bg-brand text-white" : "text-text-tertiary hover:text-text-primary"
                          }`}
                        >
                          {period}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Simulated Candle and Line Chart */}
                  <div className="h-56 w-full flex flex-col justify-end p-2 bg-bg-secondary/40 rounded-lg relative overflow-hidden">
                    <svg viewBox="0 0 500 140" className="w-full h-full" preserveAspectRatio="none">
                      {/* Grid lines */}
                      <line
                        x1="0"
                        y1="35"
                        x2="500"
                        y2="35"
                        stroke="currentColor"
                        className="text-border-primary"
                        strokeDasharray="3 3"
                      />
                      <line
                        x1="0"
                        y1="70"
                        x2="500"
                        y2="70"
                        stroke="currentColor"
                        className="text-border-primary"
                        strokeDasharray="3 3"
                      />
                      <line
                        x1="0"
                        y1="105"
                        x2="500"
                        y2="105"
                        stroke="currentColor"
                        className="text-border-primary"
                        strokeDasharray="3 3"
                      />
                      {/* Candlesticks */}
                      <g className="opacity-90">
                        {/* Up candles */}
                        <line x1="40" y1="90" x2="40" y2="60" stroke="#10B981" strokeWidth="1" />
                        <rect x="36" y="70" width="8" height="15" fill="#10B981" rx="1" />

                        <line x1="80" y1="80" x2="80" y2="40" stroke="#10B981" strokeWidth="1" />
                        <rect x="76" y="55" width="8" height="20" fill="#10B981" rx="1" />

                        <line x1="120" y1="75" x2="120" y2="45" stroke="#EF4444" strokeWidth="1" />
                        <rect x="116" y="50" width="8" height="18" fill="#EF4444" rx="1" />

                        <line x1="160" y1="85" x2="160" y2="35" stroke="#10B981" strokeWidth="1" />
                        <rect x="156" y="45" width="8" height="25" fill="#10B981" rx="1" />

                        <line x1="200" y1="65" x2="200" y2="25" stroke="#10B981" strokeWidth="1" />
                        <rect x="196" y="35" width="8" height="20" fill="#10B981" rx="1" />

                        <line x1="240" y1="55" x2="240" y2="20" stroke="#EF4444" strokeWidth="1" />
                        <rect x="236" y="25" width="8" height="15" fill="#EF4444" rx="1" />

                        <line x1="280" y1="45" x2="280" y2="15" stroke="#10B981" strokeWidth="1" />
                        <rect x="276" y="20" width="8" height="20" fill="#10B981" rx="1" />

                        <line x1="320" y1="35" x2="320" y2="10" stroke="#10B981" strokeWidth="1" />
                        <rect x="316" y="15" width="8" height="16" fill="#10B981" rx="1" />

                        <line x1="360" y1="40" x2="360" y2="18" stroke="#EF4444" strokeWidth="1" />
                        <rect x="356" y="22" width="8" height="12" fill="#EF4444" rx="1" />

                        <line x1="400" y1="30" x2="400" y2="8" stroke="#10B981" strokeWidth="1" />
                        <rect x="396" y="12" width="8" height="14" fill="#10B981" rx="1" />

                        <line x1="440" y1="25" x2="440" y2="5" stroke="#10B981" strokeWidth="1" />
                        <rect x="436" y="8" width="8" height="15" fill="#10B981" rx="1" />
                      </g>
                    </svg>
                  </div>
                </div>
              )}

              {activeTab === "portfolio" && (
                <div className="space-y-4 min-w-0">
                  <div className="grid grid-cols-1 min-[440px]:grid-cols-3 gap-2.5 sm:gap-3">
                    <div className="rounded-lg bg-bg-secondary p-2.5 sm:p-3 border border-border-primary min-w-0">
                      <span className="text-[10px] sm:text-[11px] text-text-tertiary">Total Portfolio</span>
                      <p className="text-sm sm:text-base font-bold text-text-primary truncate">₹10,54,320.00</p>
                    </div>
                    <div className="rounded-lg bg-bg-secondary p-2.5 sm:p-3 border border-border-primary min-w-0">
                      <span className="text-[10px] sm:text-[11px] text-text-tertiary">Invested Amount</span>
                      <p className="text-sm sm:text-base font-bold text-text-primary truncate">₹6,80,000.00</p>
                    </div>
                    <div className="rounded-lg bg-bg-secondary p-2.5 sm:p-3 border border-border-primary min-w-0">
                      <span className="text-[10px] sm:text-[11px] text-text-tertiary">Total Returns</span>
                      <p className="text-sm sm:text-base font-bold text-profit truncate">+₹54,320.00 (+7.98%)</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto w-full">
                    <table className="w-full min-w-[340px] text-left text-xs">
                      <thead>
                        <tr className="border-b border-border-primary text-text-tertiary">
                          <th className="pb-2 font-medium">Stock</th>
                          <th className="pb-2 font-medium">Qty</th>
                          <th className="pb-2 font-medium">Avg. Buy</th>
                          <th className="pb-2 font-medium">LTP</th>
                          <th className="pb-2 text-right font-medium">P&L</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-primary/50">
                        <tr>
                          <td className="py-2.5 font-semibold text-text-primary">RELIANCE</td>
                          <td className="py-2.5">50</td>
                          <td className="py-2.5">₹2,840.00</td>
                          <td className="py-2.5">₹2,984.50</td>
                          <td className="py-2.5 text-right font-semibold text-profit">+₹7,225.00</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 font-semibold text-text-primary">TCS</td>
                          <td className="py-2.5">30</td>
                          <td className="py-2.5">₹3,980.00</td>
                          <td className="py-2.5">₹4,120.80</td>
                          <td className="py-2.5 text-right font-semibold text-profit">+₹4,224.00</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 font-semibold text-text-primary">TATAMOTORS</td>
                          <td className="py-2.5">100</td>
                          <td className="py-2.5">₹940.00</td>
                          <td className="py-2.5">₹1,024.40</td>
                          <td className="py-2.5 text-right font-semibold text-profit">+₹8,440.00</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "orders" && (
                <div className="space-y-4 min-w-0">
                  <div className="flex items-center justify-between border-b border-border-primary pb-3 min-w-0">
                    <span className="font-bold text-sm text-text-primary">Recent Simulated Orders</span>
                    <span className="text-xs text-text-tertiary">Real-time status matching</span>
                  </div>

                  <div className="space-y-2.5 min-w-0">
                    {[
                      { id: "ORD-9281", stock: "RELIANCE", type: "BUY", qty: 25, price: "₹2,984.50", status: "FILLED" },
                      { id: "ORD-9280", stock: "INFY", type: "SELL", qty: 15, price: "₹1,842.15", status: "FILLED" },
                      { id: "ORD-9279", stock: "HDFCBANK", type: "BUY", qty: 40, price: "₹1,648.90", status: "FILLED" },
                    ].map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between gap-2 rounded-lg bg-bg-secondary p-2.5 sm:p-3 border border-border-primary min-w-0"
                      >
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                          <span
                            className={`rounded px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-bold shrink-0 ${
                              order.type === "BUY" ? "bg-profit-bg text-profit" : "bg-loss-bg text-loss"
                            }`}
                          >
                            {order.type}
                          </span>
                          <div className="min-w-0">
                            <p className="font-semibold text-xs text-text-primary truncate">{order.stock}</p>
                            <p className="text-[10px] text-text-tertiary truncate">{order.id} · Today, 11:42 AM</p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="font-semibold text-xs text-text-primary">
                            {order.qty} sh @ {order.price}
                          </p>
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-profit">
                            <Check className="h-3 w-3 shrink-0" /> {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "alerts" && (
                <div className="space-y-4 min-w-0">
                  <div className="flex items-center justify-between border-b border-border-primary pb-3 min-w-0">
                    <span className="font-bold text-sm text-text-primary">Configured Price Triggers</span>
                    <button className="inline-flex items-center gap-1 rounded-md bg-brand/10 px-2 py-1 text-xs font-medium text-brand shrink-0">
                      <Plus className="h-3 w-3" /> New Alert
                    </button>
                  </div>

                  <div className="space-y-2.5 min-w-0">
                    {[
                      { stock: "RELIANCE", condition: "Price crosses above", target: "₹3,000.00", active: true },
                      { stock: "TCS", condition: "Price crosses below", target: "₹4,050.00", active: true },
                      { stock: "TATAMOTORS", condition: "Price crosses above", target: "₹1,050.00", active: true },
                    ].map((alert, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between gap-2 rounded-lg bg-bg-secondary p-2.5 sm:p-3 border border-border-primary min-w-0"
                      >
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                          <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-md bg-brand-secondary/10 text-brand-secondary">
                            <Bell className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-xs text-text-primary truncate">{alert.stock}</p>
                            <p className="text-[10px] sm:text-[11px] text-text-secondary truncate">
                              {alert.condition} <span className="font-bold text-text-primary">{alert.target}</span>
                            </p>
                          </div>
                        </div>

                        <span className="rounded-full bg-profit-bg px-2 sm:px-2.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-profit shrink-0">
                          ACTIVE
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
