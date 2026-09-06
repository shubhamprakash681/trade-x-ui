# TradeX — Frontend Development Instructions

## Project Identity

**TradeX** is a production-inspired paper-trading platform inspired by modern investment applications such as Groww and INDmoney.

- TradeX does **NOT** perform real financial transactions and does **NOT** connect to real brokers.
- The Spring Boot backend is **already implemented and deployed**.
- The objective is to build a **complete, production-quality Next.js frontend** that consumes the existing backend.

---

## Table of Contents

1. [Primary Objective](#1-primary-objective)
2. [Absolute Rules](#2-absolute-rules)
3. [Phase 0 — Reverse-Engineer Backend](#3-phase-0--reverse-engineer-backend)
4. [Frontend Architecture](#4-frontend-architecture)
5. [TypeScript Requirements](#5-typescript-requirements)
6. [API Client](#6-api-client)
7. [Server State](#7-server-state)
8. [Client State](#8-client-state)
9. [Authentication](#9-authentication)
10. [Routing](#10-routing)
11. [UI & Design](#11-ui--design)
12. [Dashboard](#12-dashboard)
13. [Stock Detail](#13-stock-detail)
14. [Historical Chart](#14-historical-chart)
15. [Live Market Streaming](#15-live-market-streaming)
16. [Live Chart Strategy](#16-live-chart-strategy)
17. [Buy / Sell](#17-buy--sell)
18. [Portfolio](#18-portfolio)
19. [Orders](#19-orders)
20. [Watchlist](#20-watchlist)
21. [Alerts](#21-alerts)
22. [Notifications](#22-notifications)
23. [Loading, Error & Empty States](#23-loading-error--empty-states)
24. [Accessibility](#24-accessibility)
25. [Performance](#25-performance)
26. [Search](#26-search)
27. [Security](#27-security)
28. [Financial Formatting](#28-financial-formatting)
29. [Date / Time](#29-date--time)
30. [Market Data Rule](#30-market-data-rule)
31. [Testing](#31-testing)
32. [API Contract Validation](#32-api-contract-validation)
33. [Code Quality](#33-code-quality)
34. [Git Safety](#34-git-safety)
35. [Documentation](#35-documentation)
36. [Development Phases](#36-development-phases)
37. [Definition of Done](#37-definition-of-done)
38. [Handling Backend Gaps](#38-handling-backend-gaps)
39. [Priority Order](#39-priority-order)
40. [Final Principle](#40-final-principle)
41. [Startup Instruction](#41-startup-instruction)

---

## 1. Primary Objective

Build the complete TradeX frontend using:

| Layer              | Technology                                                   |
| ------------------ | ------------------------------------------------------------ |
| Framework          | Next.js (App Router)                                         |
| Language           | TypeScript (strict mode)                                     |
| Server State       | TanStack Query / React Query                                 |
| Client State       | Zustand                                                      |
| Styling            | Tailwind CSS                                                 |
| Components         | High-quality component library where appropriate             |
| Charts             | TradingView Lightweight Charts (or suitable alternative)     |
| WebSocket          | Native WebSocket or STOMP client (per backend implementation)|

The frontend **must** integrate with the existing backend. The backend is the **source of truth**.

### Never

- Invent APIs.
- Invent DTO structures.
- Invent authentication behaviour.
- Invent WebSocket protocols.
- Modify backend behaviour merely to simplify frontend implementation.
- Modify backend source code unless explicitly instructed.

---

## 2. Absolute Rules

### Rule 1 — Backend is the source of truth

Before implementing **any** frontend feature:

1. Inspect the corresponding backend controller.
2. Inspect request DTOs.
3. Inspect response DTOs.
4. Inspect relevant service / business logic.
5. Inspect validation annotations.
6. Inspect enums.
7. Inspect security configuration.
8. Inspect exception handling.
9. Inspect pagination / filtering behaviour.
10. Inspect WebSocket configuration for real-time features.

Only **then** implement the frontend.

### Rule 2 — Never invent an endpoint

If an expected feature does not have a backend API:

1. Identify the gap.
2. Document it (see [§38 — Handling Backend Gaps](#38-handling-backend-gaps)).
3. Do **not** silently invent the endpoint.
4. Do **not** modify the backend unless explicitly instructed.

### Rule 3 — Do not modify backend

The existing backend is considered completed. Do not:

- Modify Java code
- Modify Spring configuration
- Change API contracts, DTOs, or database schema
- Rename backend endpoints
- Change authentication behaviour

…unless explicitly instructed.

---

## 3. Phase 0 — Reverse-Engineer Backend

> **Do not begin frontend implementation during this phase.**

### What to Inspect

| Category           | Artefacts                                                                   |
| ------------------ | --------------------------------------------------------------------------- |
| Build              | Root `pom.xml`, module `pom.xml` files                                      |
| API                | Controllers, DTOs, entities, enums, services, repositories                  |
| Security           | Security config, JWT implementation, exception handling                     |
| Real-time          | WebSocket configuration, Kafka-facing interfaces (if relevant)              |
| Config             | `application.yml`, `application.properties`, Swagger/OpenAPI config         |
| Infrastructure     | Docker configuration, README files, database migrations                     |

### What to Identify

- Authentication & authorisation (access tokens, refresh tokens, roles/permissions)
- Pagination, sorting, filtering
- Validation rules
- Error response structure
- Timestamp & monetary value formats
- WebSocket protocol, authentication, topics, and message formats

### Phase 0 Deliverables

Create the following documentation files:

| File                                       | Contents                                                         |
| ------------------------------------------ | ---------------------------------------------------------------- |
| `docs/frontend/backend-api-map.md`         | Every endpoint with method, path, auth, request/response, errors |
| `docs/frontend/backend-websocket.md`       | Connection URL, auth, protocol, topics, schema, reconnect, heartbeat |
| `docs/frontend/frontend-architecture.md`   | App structure, routing, API client, state, WebSocket, testing, env config |

`backend-api-map.md` must include a table per service:

| Service | Method | Endpoint | Authentication | Request | Response | Errors |
| ------- | ------ | -------- | -------------- | ------- | -------- | ------ |

Include representative JSON examples based on **actual** backend DTOs.

**After creating these documents → STOP.** Report findings and backend gaps. Do not guess.

---

## 4. Frontend Architecture

Use **feature-oriented** architecture:

```text
frontend/
├── public/
├── src/
│   ├── api/
│   │   ├── client.ts
│   │   ├── auth.api.ts
│   │   ├── stocks.api.ts
│   │   ├── market.api.ts
│   │   ├── portfolio.api.ts
│   │   ├── orders.api.ts
│   │   ├── watchlist.api.ts
│   │   └── notifications.api.ts
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   ├── market/
│   │   ├── portfolio/
│   │   ├── orders/
│   │   └── charts/
│   ├── features/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── market/
│   │   ├── portfolio/
│   │   ├── orders/
│   │   ├── watchlist/
│   │   ├── alerts/
│   │   └── notifications/
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   ├── routes/
│   ├── store/
│   ├── types/
│   ├── utils/
│   ├── websocket/
│   └── constants/
├── .env.local
├── package.json
├── tsconfig.json
└── next.config.ts
```

Adjust the structure if the actual project warrants it. Do not create unnecessary abstractions.

---

## 5. TypeScript Requirements

- Use **strict** TypeScript.
- Avoid `any`. Prefer `unknown` when a type genuinely cannot be known.
- Every backend DTO consumed by the frontend must have a corresponding TypeScript type/interface.
- Do not duplicate the same interface across files.

---

## 6. API Client

Create **one** centralized HTTP client. It must handle:

- Base URL
- JSON headers
- Authorization header
- Timeouts
- Common error handling
- `401` handling
- Refresh-token flow (if supported by backend)
- Request cancellation where appropriate

> **Do not** scatter raw `fetch` / `axios` calls throughout components.
> Components must call API services/hooks.

---

## 7. Server State

Use **TanStack Query** for all server state. Example hooks:

```text
useStocks()        useStock(symbol)       useMarketHistory(symbol)
usePortfolio()     useHoldings()          useOrders()
useWatchlist()     useAlerts()            useNotifications()
```

Configure caching, stale times, retries, invalidation, and optimistic updates where appropriate.

> Do not put server data into global state unnecessarily.

---

## 8. Client State

Use global state **only** for genuine client state:

- Authentication state
- Theme / UI preferences
- Sidebar open/closed
- Selected chart interval

> Do not duplicate React Query data in Zustand.

---

## 9. Authentication

Inspect the backend first to determine:

- `Authorization` header vs. HttpOnly cookie
- Access token / refresh token / session mechanism

Implement **exactly** what the backend expects. Support where applicable:

- Signup, login, logout
- Session restoration
- Token refresh
- Protected routes
- `401` / expired-session handling

> Never store sensitive tokens in `localStorage` unless the backend architecture explicitly requires it. Prefer secure HttpOnly cookies when supported.

---

## 10. Routing

Conceptual routes (verify backend support before implementing):

```text
/login              /register
/                   /dashboard
/markets            /stocks/:symbol
/portfolio          /portfolio/holdings     /portfolio/orders
/watchlist          /alerts
/notifications      /profile                /settings
```

---

## 11. UI & Design

Create a polished modern fintech interface inspired by modern investment platforms — **without** cloning Groww or INDmoney.

**Design principles:** Clean · Minimal · Professional · Data-focused · Responsive · Accessible

- Avoid excessive gradients and unnecessary animations.
- Desktop → professional navigation/sidebar layout.
- Mobile → proper mobile navigation and responsive components (not merely a compressed desktop UI).

### Color Palette

Use the following curated palette. Define these as CSS custom properties / Tailwind config tokens so the entire theme can be swapped in one place.

#### Brand Colors

| Token               | Light Mode | Dark Mode  | Usage                                      |
| -------------------- | ---------- | ---------- | ------------------------------------------ |
| `--brand-primary`    | `#6366F1`  | `#818CF8`  | Primary buttons, active nav, links, accents |
| `--brand-primary-hover` | `#4F46E5` | `#6366F1` | Hover state for primary elements            |
| `--brand-secondary`  | `#0EA5E9`  | `#38BDF8`  | Secondary actions, info badges, chart lines |
| `--brand-accent`     | `#8B5CF6`  | `#A78BFA`  | Highlights, selected states, focus rings    |

#### Semantic / Financial Colors

| Token               | Light Mode | Dark Mode  | Usage                                      |
| -------------------- | ---------- | ---------- | ------------------------------------------ |
| `--color-profit`     | `#10B981`  | `#34D399`  | Positive P/L, gainers, buy confirmations    |
| `--color-profit-bg`  | `#ECFDF5`  | `#064E3B`  | Profit indicator backgrounds                |
| `--color-loss`       | `#EF4444`  | `#F87171`  | Negative P/L, losers, sell indicators       |
| `--color-loss-bg`    | `#FEF2F2`  | `#7F1D1D`  | Loss indicator backgrounds                  |
| `--color-warning`    | `#F59E0B`  | `#FBBF24`  | Pending orders, alerts, caution states      |
| `--color-warning-bg` | `#FFFBEB`  | `#78350F`  | Warning backgrounds                         |
| `--color-info`       | `#3B82F6`  | `#60A5FA`  | Informational banners, tooltips             |

#### Surface / Background Colors

| Token                | Light Mode | Dark Mode  | Usage                                      |
| --------------------- | ---------- | ---------- | ------------------------------------------ |
| `--bg-primary`        | `#FFFFFF`  | `#0F172A`  | Main page background                       |
| `--bg-secondary`      | `#F8FAFC`  | `#1E293B`  | Cards, panels, sidebar                     |
| `--bg-tertiary`       | `#F1F5F9`  | `#334155`  | Hover rows, input fields, code blocks      |
| `--bg-elevated`       | `#FFFFFF`  | `#1E293B`  | Modals, dropdowns, popovers               |
| `--border-primary`    | `#E2E8F0`  | `#334155`  | Card borders, dividers                     |
| `--border-secondary`  | `#CBD5E1`  | `#475569`  | Input borders, table lines                 |

#### Text Colors

| Token                | Light Mode | Dark Mode  | Usage                                      |
| --------------------- | ---------- | ---------- | ------------------------------------------ |
| `--text-primary`      | `#0F172A`  | `#F8FAFC`  | Headings, primary content                  |
| `--text-secondary`    | `#475569`  | `#94A3B8`  | Descriptions, labels, secondary info       |
| `--text-tertiary`     | `#94A3B8`  | `#64748B`  | Placeholders, timestamps, disabled text    |
| `--text-inverse`      | `#FFFFFF`  | `#0F172A`  | Text on brand/colored backgrounds          |

#### Chart Colors

| Token                | Hex        | Usage                                      |
| --------------------- | ---------- | ------------------------------------------ |
| `--chart-line`        | `#6366F1`  | Primary chart line / area fill             |
| `--chart-candle-up`   | `#10B981`  | Bullish candle body                        |
| `--chart-candle-down`  | `#EF4444` | Bearish candle body                        |
| `--chart-volume`      | `#94A3B8`  | Volume bars                                |
| `--chart-grid`        | `#E2E8F0`  | Grid lines (light) / `#1E293B` (dark)      |
| `--chart-crosshair`   | `#64748B`  | Crosshair / tooltip lines                  |

#### Gradient Accents (use sparingly)

```css
/* Hero / feature card backgrounds */
--gradient-brand:   linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #0EA5E9 100%);

/* Profit summary card */
--gradient-profit:  linear-gradient(135deg, #10B981 0%, #059669 100%);

/* Portfolio value header */
--gradient-surface: linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%);  /* light */
                    linear-gradient(180deg, #1E293B 0%, #0F172A 100%);  /* dark  */
```

> **Note:** Always pair colour with a secondary indicator (icon ▲▼, +/− prefix, or label) for gain/loss — do not rely on colour alone (accessibility).

---

## 12. Dashboard

Implement supported sections:

| Section            | Data Source                     |
| ------------------ | ------------------------------- |
| Portfolio summary  | Total investment, current value |
| P/L                | Overall P/L, today's P/L       |
| Market overview    | Gainers, losers, trending       |
| Watchlist          | User watchlist                  |
| Recent orders      | Order history                   |

> Only display data **actually available** through backend APIs. Never fabricate market information.

---

## 13. Stock Detail

Route: `/stocks/:symbol`

**Display:** company name, symbol, current price, price change, percentage change.

- Chart intervals → determined by backend capabilities.
- OHLC data → candlestick chart.
- Close-only data → line / area chart.
- Open, High, Low, Previous Close, Volume → display only if provided by backend.

---

## 14. Historical Chart

Use TradingView Lightweight Charts (or equivalent).

**Requirements:**

- Responsive
- Zoom & pan
- Tooltip
- Timestamp & price formatting
- Large dataset handling
- Missing data handling

> Do not manually render thousands of SVG elements.

---

## 15. Live Market Streaming

Inspect the **actual** backend WebSocket configuration. Do not assume STOMP, SockJS, native WebSocket, topic names, or authentication method.

Implement a robust WebSocket manager:

```text
connect()   disconnect()   subscribe()   unsubscribe()   reconnect()
```

Handle: network failure, server restart, browser tab suspension, duplicate subscriptions, malformed messages.

> Avoid unnecessary React re-renders.

---

## 16. Live Chart Strategy

> Do **not** refetch the entire chart for every live tick.

```text
Historical REST API  →  Initial chart render

WebSocket tick  →  Update current price  →  Update current candle  →  Re-render
```

The backend remains authoritative.

---

## 17. Buy / Sell

Before building the order form, inspect the actual:

- Order DTO, order endpoint, validation, response, and errors.

> If backend supports **only** market orders → do not create limit-order UI.

Implement: stock, order type, quantity, price (where applicable), estimated amount, confirmation, success/error handling.

After a successful trade → invalidate relevant portfolio, holdings, and orders queries.

---

## 18. Portfolio

**Summary:** total investment, current value, total P/L, today's P/L.

**Holdings table:**

| Column         | Description        |
| -------------- | ------------------ |
| Stock          | Symbol / name      |
| Quantity       | Shares held        |
| Average price  | Cost basis         |
| Current price  | Live / last price  |
| Investment     | Qty × avg price    |
| Current value  | Qty × current      |
| P/L            | Absolute gain/loss |
| P/L %          | Percentage change  |

> Backend is authoritative for financial calculations.

---

## 19. Orders

Display supported fields: Order ID, Symbol, Side, Quantity, Price, Amount, Status, Created at.

Support pagination and filters **only** when backend supports them.

---

## 20. Watchlist

If supported: add stock, remove stock, view current price & daily change, open stock detail.

Use backend APIs and React Query invalidation.

---

## 21. Alerts

If supported: create alert, list alerts, delete alert. **Do not** invent alert types or conditions.

---

## 22. Notifications

If supported: unread indicator, notification list, timestamp, type, read/unread state. Only implement APIs actually exposed by the backend.

---

## 23. Loading, Error & Empty States

Every asynchronous screen needs appropriate UI:

- **Loading:** Skeletons, inline loading, button loading states
- **Errors:** Handle `401`, `403`, `404`, `409`, `422`, `500`, and network errors
- **Empty:** Every collection needs an empty state

> Never expose raw backend stack traces. Do not use a full-screen spinner for every API call.

---

## 24. Accessibility

Follow WCAG-oriented practices:

- Semantic HTML & keyboard navigation
- Visible focus indicators & labels
- ARIA attributes only where necessary
- Sufficient colour contrast
- Accessible dialogs

> Do not rely solely on colour for gain/loss indicators.

---

## 25. Performance

**Avoid:** unnecessary re-renders, polling when WebSocket exists, duplicate requests, huge component files, expensive calculations during render.

**Use (where justified):** React Query caching, debounced search, memoisation, virtualisation, lazy loading, code splitting.

> Do not optimise prematurely.

---

## 26. Search

Stock search should:

- Debounce input (avoid API call on every keystroke)
- Show loading & empty states
- Support keyboard navigation
- Navigate to stock detail on selection

> Use backend search — do not maintain a duplicate frontend stock database.

---

## 27. Security

**Never:** hardcode credentials, commit secrets, expose backend secrets, trust client-side authorisation, rely on frontend-only admin controls.

**Environment variables:**

```text
NEXT_PUBLIC_API_BASE_URL
NEXT_PUBLIC_WS_BASE_URL
```

Create `.env.example`. Never commit `.env`.

---

## 28. Financial Formatting

Create **centralised** utilities for:

- Currency (e.g. `₹1,24,500.50`)
- Percentage (e.g. `+2.45%`, `-1.21%`)
- Quantity, price, large numbers
- Timestamps

Use Indian formatting where appropriate.

> Do not make authoritative financial calculations in the frontend.

---

## 29. Date / Time

Inspect backend timestamp format first (ISO-8601 / epoch seconds / epoch milliseconds). Create centralised date/time conversion utilities.

---

## 30. Market Data Rule

The backend-generated market data is **authoritative**. The frontend must **NOT** independently generate or simulate:

- Price movement
- P/L calculations
- Portfolio value
- Order execution

All business calculations must come from backend APIs.

---

## 31. Testing

### Unit Tests

Formatters, calculations, validation, API transformation, utility functions.

### Component Tests

Login, stock search, order form, portfolio, watchlist.

### Integration Tests

```text
login → dashboard       stock → chart
buy → portfolio         watchlist → stock
```

Use **MSW** for API mocking. Do not make unit tests dependent on a deployed backend.

### E2E (Playwright)

Critical flows:

```text
Register → Login → Search stock → Open stock → View chart →
Buy stock → View holding → Sell stock → View order →
Add watchlist → Remove watchlist → Create alert → Logout
```

---

## 32. API Contract Validation

Before implementing each feature:

```text
Backend DTO  →  TypeScript type  →  API response  →  UI usage
```

If a mismatch occurs → **STOP** and inspect the backend. Do not guess.

---

## 33. Code Quality

**Follow:** SOLID (where applicable), DRY, separation of concerns, single responsibility, composition over inheritance, reusable components, meaningful naming.

**Avoid:** God components/hooks/stores, 1000-line files, duplicate API clients, duplicate types.

---

## 34. Git Safety

Before making changes:

```bash
git status
```

**Do not:** reset user changes, delete unrelated files, overwrite existing frontend work without inspection, modify backend.

**Suggested commit messages:**

```text
feat(frontend): initialize Next.js application
feat(auth): implement authentication
feat(market): implement market dashboard
feat(charts): implement historical charts
feat(realtime): implement WebSocket streaming
feat(trading): implement paper trading
feat(portfolio): implement portfolio dashboard
feat(watchlist): implement watchlist
feat(alerts): implement alerts
test(frontend): add frontend test suite
chore(frontend): productionise frontend
```

---

## 35. Documentation

Maintain:

```text
docs/frontend/
├── backend-api-map.md
├── backend-websocket.md
├── frontend-architecture.md
├── frontend-api-client.md
├── frontend-state-management.md
└── frontend-testing.md
```

Update documentation when implementation changes.

---

## 36. Development Phases

> Do not attempt to implement the entire frontend in one step.

| Phase | Name                   | Key Deliverables                                                        |
| ----- | ---------------------- | ----------------------------------------------------------------------- |
| 0     | Backend Analysis       | `backend-api-map.md`, `backend-websocket.md`, `frontend-architecture.md` — **no UI** |
| 1     | Frontend Foundation    | Next.js + TS + Tailwind + routing + API client + error handling + base layout + theme |
| 2     | Authentication         | Login, register, logout, session restoration, protected routes          |
| 3     | Market                 | Dashboard, stock search/list, stock detail, historical charts           |
| 4     | Real-Time Market       | WebSocket connection, subscriptions, live prices, live chart updates    |
| 5     | Trading                | Buy, sell, confirmation, order history, portfolio, holdings, P/L        |
| 6     | Product Features       | Watchlist, alerts, notifications, gainers, losers, trending             |
| 7     | Polish                 | Responsive design, accessibility, skeletons, empty/error states, animations |
| 8     | Testing                | Unit, component, integration, and E2E tests                            |
| 9     | Production             | Production build, Dockerfile, Nginx (if needed), env config, deployment docs |

### Phase Validation

At the end of each phase, run:

```bash
npm install
npm run dev
npm run build
npm run lint
npm run test
```

Fix **all** errors before moving to the next phase.

---

## 37. Definition of Done

A feature is **DONE** only when:

- [ ] UI implemented
- [ ] Backend integration verified
- [ ] TypeScript compiles
- [ ] Lint passes
- [ ] Tests pass
- [ ] Loading state exists
- [ ] Error state exists
- [ ] Empty state exists (where applicable)
- [ ] Responsive behaviour implemented
- [ ] Accessibility considered
- [ ] No unnecessary `console.log` statements
- [ ] No hardcoded API URLs
- [ ] No secrets committed
- [ ] Documentation updated

> Never claim tests passed unless they were actually executed.

---

## 38. Handling Backend Gaps

When the backend lacks a required capability, document it:

```text
BACKEND GAP

Feature:         <feature>
Expected:        <description>
Evidence:        <backend files inspected>
Required API:    <suggestion>
Frontend status: NOT IMPLEMENTED — awaiting backend support
```

> Do not silently work around backend limitations.

---

## 39. Priority Order

When making implementation decisions:

1. Backend contract correctness
2. Security
3. Functional correctness
4. Type safety
5. Maintainability
6. Performance
7. Accessibility
8. Visual polish

> Do not sacrifice backend integration correctness for visual appearance.

---

## 40. Final Principle

Treat TradeX as a **real production engineering project**.

The goal is **NOT**:
> "Generate a pretty Next.js UI."

The goal **IS**:
> "Build a maintainable, type-safe, responsive, production-quality frontend that correctly integrates with the existing TradeX Spring Boot backend."

- Always inspect before implementing.
- Always verify before assuming.
- Never invent backend contracts.

---

## 41. Startup Instruction

When starting frontend development in this repository:

1. Read this `FrontendInstruction.md`.
2. Inspect the entire backend repository.
3. Inspect the existing Git state.
4. Identify whether a frontend already exists.
5. Identify backend services and API boundaries.
6. Identify REST and WebSocket contracts.
7. Create the Phase 0 documentation.
8. **STOP after Phase 0.**
9. Report findings and backend gaps.
10. Wait for approval before implementing Phase 1.

> Do not start generating the frontend immediately.
