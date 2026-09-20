# Master Prompt: Elevate TradeX UI to Institutional-Grade Workstation

Copy and paste the entire prompt block below into your AI coding assistant (e.g. Claude 3.7 Sonnet / Claude Opus, Antigravity, or Gemini):

```markdown
# MISSION: ELEVATE TradeX UI TO AN INSTITUTIONAL-GRADE LUXURY FINTECH WORKSTATION

## 1. PROJECT OBJECTIVE & IDENTITY
You are enhancing the production Next.js 15+ frontend in `trade-x-ui`.
TradeX is connected to an active Spring Boot trading backend. The goal is to dramatically elevate TradeX into an **institutional-grade, ultra-premium trading platform** that surpasses `trade-app-ui` in visual elegance, polish, and UX, while maintaining a **completely distinct identity** and zero regressions in functionality.

---

### CRITICAL MANDATES & CONSTRAINTS:

1. **Do NOT Clone TradeApp's Cyber-Terminal Theme**:
   - `trade-app-ui` uses a harsh neon cyber-terminal aesthetic (pitch black `#07080B`, carbon glass `#0D0F17`, radioactive neon green `#00F59B`, hot pink `#FF3B69`, top horizon nav).
   - `trade-x-ui` MUST follow an **"Titanium Midnight / Institutional Precision"** aesthetic:
     - Deep Obsidian Navy canvas (`#0A0E17` / `#0D1322` with subtle radial luminescent sheen).
     - Frosted Slate surfaces (`#111726`) with delicate hairline borders (`rgba(255, 255, 255, 0.08)`) and inner bevel reflections (`inset 0 1px 0 0 rgba(255, 255, 255, 0.05)`).
     - Electric Sapphire brand accents (`#3B82F6` / `#2563EB`).
     - Luminescent Jade Emerald (`#10B981` / `#05DF72`) for positive P&L / Buy actions.
     - Velvety Ruby Coral (`#F43F5E` / `#E11D48`) for negative P&L / Sell actions.
     - Solar Flare Amber (`#F59E0B`) for warnings and indicators.
     - Glacier Cyan (`#06B6D4` / `#38BDF8`) for telemetry / sector tags.
   - Dual-engine typography: Clean humanist sans (`Inter`) for UI chrome and headings; strict **tabular monospace** (`font-mono tabular-nums tracking-tight`) for all financial figures, prices, quantities, and P&L.

2. **Preserve Static Architecture & Layout Shell**:
   - DO NOT remove or replace `AppShell`, `Sidebar`, `Navbar`, or `Footer`. The left collapsible sidebar navigation is a signature feature of TradeX and must remain fully functional.
   - DO NOT break atomic component props (`Button`, `Card`, `Input`, `Spinner`, `Toast`) so all existing unit tests in `trade-x-ui` stay green.
   - DO NOT alter unrelated static pages (e.g. `/about`, `/privacy`, `/terms`).

3. **Overhaul the Two Target Pages (from provided screenshots)**:
   - **Page 1: Pro Trading Workstation (`src/app/(protected)/stocks/[symbol]/page.tsx`)**:
     - Upgrade from a basic vertical stack into a high-density, multi-pane trading workstation.
     - Top Telemetry Bar: Symbol, exchange, sector badge, 24H High/Low visual range meter, live pulsing price & % delta.
     - Center/Left Canvas: Interactive candlestick chart (`PriceChart`) with timeframe & range chips, plus bottom drawer for Active Position (with 1-click **Liquidate Position** button) and Execution History table.
     - Right Docked Rail: **Fast Order Ticket** (`src/components/orders/fast-order-ticket.tsx`) with Buy/Sell toggle, quick quantity presets (`+10`, `+50`, `+100`, `50%`, `MAX`), estimated capital calculator, and **Simulated Level-2 Depth / Order Book** (`src/components/market/order-book-depth.tsx`).
   - **Page 2: Portfolio Vault & Risk Matrix (`src/app/(protected)/portfolio/page.tsx`)**:
     - Header: "Portfolio Vault & P&L Matrix", subtitle, and "Explore Markets" quick action.
     - 4-Card KPI Bento Grid: Net Worth, Available Margin / Cash (with % Liquidity Reserve indicator), Invested Capital, and Unrealized P&L (with arrow icon & return %).
     - Visual **Asset Allocation Breakdown Bar**: Multi-color segmented progress bar with interactive legend showing each holding's % of capital and active deployed amount.
     - **Open Holdings Matrix Table**: Live WebSocket price streaming for all rows, Invested Value, Market Value, Unrealized P&L, plus row-level **Trade** link and 1-click **Liquidate** sell action.

4. **Zero Backend Modifications**:
   - The Spring Boot backend is the source of truth. Use existing API client and existing hooks:
     - `usePortfolio()`, `useBuyOrder()`, `useSellOrder()`, `useOrderHistory()` from `@/hooks/use-portfolio`
     - `useStock()`, `useMarketHistory()` from `@/hooks/use-stocks` and `@/hooks/use-market`
     - `useLivePrice()`, `useLivePrices()` from `@/hooks/use-live-price` and `@/hooks/use-live-prices`
     - `useWatchlist()`, `useAddToWatchlist()`, `useRemoveFromWatchlist()` from `@/hooks/use-notification-features`
     - Formatters from `@/lib/utils` (`formatCurrency`, `formatPercent`, `formatQuantity`, `getPnlColor`, etc.)

---

## 2. DESIGN TOKENS SPECIFICATION (`src/app/globals.css`)

Update `src/app/globals.css` with the complete Titanium Midnight design tokens:

```css
@import "tailwindcss";

/* ─── Titanium Midnight Design System ──────────────────────────────────────── */

:root {
  /* Brand */
  --brand-primary: #2563eb;
  --brand-primary-hover: #1d4ed8;
  --brand-secondary: #0284c7;
  --brand-accent: #4f46e5;

  /* Semantic / Financial */
  --color-profit: #059669;
  --color-profit-bg: #ecfdf5;
  --color-loss: #e11d48;
  --color-loss-bg: #fff1f2;
  --color-warning: #d97706;
  --color-warning-bg: #fffbeb;
  --color-info: #2563eb;

  /* Surfaces (Light) */
  --bg-primary: #f8fafc;
  --bg-secondary: #ffffff;
  --bg-tertiary: #f1f5f9;
  --bg-elevated: #ffffff;
  --border-primary: #e2e8f0;
  --border-secondary: #cbd5e1;

  /* Text (Light) */
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-tertiary: #94a3b8;
  --text-inverse: #ffffff;

  /* Chart (Light) */
  --chart-line: #2563eb;
  --chart-candle-up: #059669;
  --chart-candle-down: #e11d48;
  --chart-volume: #94a3b8;
  --chart-grid: #e2e8f0;
  --chart-crosshair: #64748b;

  /* Gradients & Shadows */
  --gradient-brand: linear-gradient(135deg, #2563eb 0%, #4f46e5 50%, #0284c7 100%);
  --gradient-profit: linear-gradient(135deg, #059669 0%, #047857 100%);
  --gradient-loss: linear-gradient(135deg, #e11d48 0%, #be123c 100%);
  --gradient-surface: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
}

.dark {
  /* Brand */
  --brand-primary: #3b82f6;
  --brand-primary-hover: #60a5fa;
  --brand-secondary: #38bdf8;
  --brand-accent: #6366f1;

  /* Semantic / Financial */
  --color-profit: #10b981;
  --color-profit-bg: rgba(16, 185, 129, 0.12);
  --color-loss: #f43f5e;
  --color-loss-bg: rgba(244, 63, 94, 0.12);
  --color-warning: #f59e0b;
  --color-warning-bg: rgba(245, 158, 11, 0.12);
  --color-info: #38bdf8;

  /* Surfaces (Titanium Midnight) */
  --bg-primary: #0a0e17;
  --bg-secondary: #111726;
  --bg-tertiary: #172033;
  --bg-elevated: #1a243a;
  --border-primary: rgba(255, 255, 255, 0.08);
  --border-secondary: rgba(255, 255, 255, 0.15);

  /* Text (Dark) */
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --text-tertiary: #64748b;
  --text-inverse: #0a0e17;

  /* Chart (Dark) */
  --chart-line: #3b82f6;
  --chart-candle-up: #10b981;
  --chart-candle-down: #f43f5e;
  --chart-volume: rgba(148, 163, 184, 0.35);
  --chart-grid: rgba(255, 255, 255, 0.04);
  --chart-crosshair: #94a3b8;

  /* Gradients & Shadows */
  --gradient-brand: linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #38bdf8 100%);
  --gradient-profit: linear-gradient(135deg, #10b981 0%, #059669 100%);
  --gradient-loss: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%);
  --gradient-surface: linear-gradient(180deg, #111726 0%, #0a0e17 100%);
}

@theme inline {
  --color-brand: var(--brand-primary);
  --color-brand-hover: var(--brand-primary-hover);
  --color-brand-secondary: var(--brand-secondary);
  --color-brand-accent: var(--brand-accent);

  --color-profit: var(--color-profit);
  --color-profit-bg: var(--color-profit-bg);
  --color-loss: var(--color-loss);
  --color-loss-bg: var(--color-loss-bg);
  --color-warning: var(--color-warning);
  --color-warning-bg: var(--color-warning-bg);
  --color-info: var(--color-info);

  --color-bg-primary: var(--bg-primary);
  --color-bg-secondary: var(--bg-secondary);
  --color-bg-tertiary: var(--bg-tertiary);
  --color-bg-elevated: var(--bg-elevated);
  --color-border-primary: var(--border-primary);
  --color-border-secondary: var(--border-secondary);

  --color-text-primary: var(--text-primary);
  --color-text-secondary: var(--text-secondary);
  --color-text-tertiary: var(--text-tertiary);
  --color-text-inverse: var(--text-inverse);

  --color-chart-line: var(--chart-line);
  --color-chart-candle-up: var(--chart-candle-up);
  --color-chart-candle-down: var(--chart-candle-down);
  --color-chart-volume: var(--chart-volume);
  --color-chart-grid: var(--chart-grid);
  --color-chart-crosshair: var(--chart-crosshair);

  --font-sans: "Inter", ui-sans-serif, system-ui, -apple-system, sans-serif;
  --font-mono: "JetBrains Mono", "Geist Mono", ui-monospace, SFMono-Regular, monospace;
}

/* Glassmorphic luxury panel */
.glass-panel {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.35), inset 0 1px 0 0 rgba(255, 255, 255, 0.05);
}

/* Scrollbar polish */
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: var(--border-secondary);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--text-tertiary);
}
```

---

## 3. PRO TRADING WORKSTATION ENHANCEMENT (`stocks/[symbol]/page.tsx`)

### New Components to Create:

#### A. `src/components/orders/fast-order-ticket.tsx`
Create a high-impact fast order execution ticket matching the pro trading panel in Screenshot 1:
- Props: `{ stock: StockResponse; holding?: HoldingResponse }`.
- Mode Toggle: BUY / LONG (Jade Emerald) vs SELL / SHORT (Ruby Coral).
- Live Telemetry Row:
  - Execution Price: `formatCurrency(currentPrice)`
  - Available Margin / Cash: fetched via `usePortfolio().data?.summary.cashBalance`
  - Current Open Position: `{holding?.quantity ?? 0} shares` (`formatQuantity`)
- Quantity Input:
  - Input field formatted for numeric / decimal quantity.
  - Quick preset buttons: `+10`, `+50`, `+100`, `50%`, `MAX`. Clicking them recalculates quantity based on available cash (for BUY) or owned shares (for SELL).
- Estimated Capital: `formatCurrency(quantity * currentPrice)`. Show warning if estimated capital exceeds available cash.
- Action Button:
  - Full-width tactile button: `EXECUTE BUY {qty} SHARES` / `EXECUTE SELL {qty} SHARES`.
  - Color dynamically matches mode (Emerald for BUY, Coral for SELL).
  - Handles loading spinner and triggers `useBuyOrder()` or `useSellOrder()`.
  - Displays instant toast with execution details.

#### B. `src/components/market/order-book-depth.tsx`
Create a simulated Level-2 Order Book and Depth ladder:
- Props: `{ currentPrice: number; symbol: string }`.
- Tabs: `ORDER BOOK (L2)` and `RECENT TRADES (TAPE)`.
- Table columns: `PRICE`, `SIZE`, `TOTAL`.
- Generates 5 simulated ask rows (red text with depth fill bar) and 5 simulated bid rows (green text with depth fill bar) around `currentPrice`, with realistic spread calculation (e.g. `Spread: 0.10 (0.01%)`).
- Updates subtly as live price updates.

#### C. Redesign `src/app/(protected)/stocks/[symbol]/page.tsx`
Replace the single-column layout with the responsive workstation layout:
1. **Top Telemetry Header Bar**:
   - Back link to `/markets`.
   - Symbol (e.g., `ASIANPAINT`), Exchange badge (`NSE`), Sector pill badge (`Consumer Goods`), Synthetic badge if applicable.
   - Star Watchlist Toggle with tooltip.
   - Center 24H High/Low visual range slider: `24H L: ₹...` | gradient meter with marker | `24H H: ₹...`.
   - Right: Live price indicator with pulsing green dot, formatted live price, and percentage change with trending icon.
2. **2-Pane Cockpit Layout (`grid grid-cols-1 lg:grid-cols-12 gap-4`)**:
   - **Left / Center Column (`lg:col-span-8 xl:col-span-8 flex flex-col gap-4`)**:
     - Candlestick Chart Card containing `PriceChart` with custom timeframe chips (`1s`, `1m`, `1h`, `D`, `W`, `M`) and range chips (`1D`, `5D`, `1M`, `3M`, `6M`, `1Y`, `5Y`, `All`).
     - **Bottom Studio Drawer**:
       - Tab 1: **OPEN POSITION ({count})**:
         - Grid showing: `POSITION` (shares), `AVG PRICE`, `MARKET VALUE`, `UNREALIZED P&L` (amount + %).
         - **Liquidate Position** Button: Styled in ruby coral (`bg-loss text-white`). Clicking executes market sell for all owned shares with toast confirmation.
       - Tab 2: **EXECUTIONS ({count})**:
         - Filtered table of past executions for this symbol from `useOrderHistory(0, 50)`, showing execution timestamp, side badge, executed quantity, and price.
   - **Right Column (`lg:col-span-4 xl:col-span-4 flex flex-col gap-4`)**:
     - Fast Order Ticket (`FastOrderTicket`).
     - Depth Tape Simulator (`OrderBookDepth`).

---

## 4. PORTFOLIO VAULT & RISK MATRIX ENHANCEMENT (`portfolio/page.tsx`)

### Components to Update:

#### A. Overhaul `src/components/portfolio/portfolio-summary.tsx`
Redesign into an executive KPI bento grid and visual asset allocation bar matching Screenshot 2:
- Props: `{ summary: PortfolioSummaryResponse; holdings: HoldingResponse[] }`.
- **4-Card Top KPI Grid**:
  1. `PORTFOLIO NET WORTH`: `formatCurrency(summary.totalValue)` with caption *"Cash + Open Equity positions"*.
  2. `AVAILABLE MARGIN / CASH`: `formatCurrency(summary.cashBalance)` with dynamic badge *"{((summary.cashBalance / summary.totalValue) * 100).toFixed(1)}% Liquidity Reserve"*.
  3. `INVESTED CAPITAL`: `formatCurrency(summary.investedValue)` with caption *"Market Value: {formatCurrency(summary.holdingsValue)}"*.
  4. `UNREALIZED P&L`: `formatCurrency(summary.unrealizedPnl)` in emerald/coral font, with `ArrowUpRight`/`ArrowDownRight` icon and return percentage *"{formatPercent(summary.unrealizedPnlPercent)} Return"*.
- **Asset Allocation Visual Breakdown Bar**:
  - Horizontal multi-colored progress bar where each holding is allocated a width percentage: `(holding.marketValue / summary.holdingsValue) * 100`.
  - Slices colored in a vibrant, sophisticated palette (emerald, cyan, sapphire, amber, violet, rose).
  - Legend row below the bar showing: colored dot, stock symbol, % allocation, and active deployed capital.

#### B. Overhaul `src/components/portfolio/holdings-table.tsx`
Upgrade to the "Open Holdings Matrix" matching Screenshot 2:
- Props: `{ holdings: HoldingResponse[] }`.
- Hook Integration: Call `useLivePrices(symbols)` to stream real-time price updates for all owned stocks.
- Table Columns:
  1. `INSTRUMENT`: Symbol link (`/stocks/{symbol}`) in bold + company name in small font.
  2. `SHARES`: `formatQuantity(holding.quantity)`.
  3. `AVG. PRICE`: `formatCurrency(holding.averagePrice)`.
  4. `LAST / LIVE PRICE`: Displays real-time live price (or `holding.lastPrice`) with subtle pulse animation on price ticks.
  5. `INVESTED VALUE`: `formatCurrency(holding.investedValue)`.
  6. `MARKET VALUE`: `formatCurrency(livePrice * holding.quantity)`.
  7. `UNREALIZED P&L`: Bold P&L amount + percentage return badge.
  8. `ACTIONS`:
     - **Trade** Button: Links to `/stocks/{symbol}`.
     - **Liquidate** Button: Styled in ruby coral (`bg-loss text-white text-xs px-3 py-1.5 rounded-lg hover:opacity-90 active:scale-95`).
       - Clicking opens a quick confirmation dialog or directly executes `useSellOrder().mutateAsync({ symbol, quantity })`.
       - Displays success toast: `Liquidated {quantity} shares of {symbol} @ {price}`.

#### C. Update `src/app/(protected)/portfolio/page.tsx`
- Header: Title **"Portfolio Vault & P&L Matrix"**, subtitle *"Real-time mark-to-market valuations and risk allocations."*, and **"Explore Markets"** button linking to `/markets`.
- Pass both `summary` and `holdings` to `PortfolioSummary`.
- Render `HoldingsTable` inside the executive glass panel with title **"OPEN HOLDINGS MATRIX ({count})"** and a *"LIVE VALUATIONS"* indicator.

---

## 5. VERIFICATION & DEFINITION OF DONE

1. **Static Shell Integrity**: Ensure the left collapsible `Sidebar` and top `Navbar` render smoothly on desktop and mobile. No static layout components are deleted.
2. **TypeScript Strictness**: Run `npx tsc --noEmit` and ensure **0 errors**.
3. **Tests Passing**: Run `npm run test` (or `npx vitest run`) and ensure all existing unit tests in `src/components/` and `src/hooks/` pass.
4. **WebSocket & P&L Accuracy**: Verify live STOMP prices update the charts, ticker bar, order book, and portfolio holdings in real-time without page reloads.

Proceed with implementing the changes in `trade-x-ui`!
```

