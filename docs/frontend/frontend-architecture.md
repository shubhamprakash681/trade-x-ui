# TradeX — Frontend Architecture Plan

> Based on Phase 0 backend analysis. Pending user approval before implementation.

---

## 1. Technology Stack

| Layer          | Technology                     | Version        |
| -------------- | ------------------------------ | -------------- |
| Framework      | Next.js (App Router)           | 16             |
| Language       | TypeScript (strict)            | 5.x            |
| Server State   | TanStack Query                 | 5.x            |
| Client State   | Zustand                        | 5.x            |
| Styling        | Tailwind CSS                   | 4.x            |
| Charts         | TradingView Lightweight Charts | 4.x            |
| WebSocket      | @stomp/stompjs                 | 7.x            |
| HTTP Client    | Axios                          | 1.x            |
| Testing        | Vitest + RTL + MSW + Playwright| Latest         |

---

## 2. Project Structure

```
trade-x-ui/
├── public/
│   └── favicon.ico
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Auth group (no layout)
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── forgot-password/page.tsx
│   │   ├── (protected)/              # Authenticated layout
│   │   │   ├── layout.tsx            # Sidebar + navbar + auth guard
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── markets/page.tsx
│   │   │   ├── stocks/
│   │   │   │   └── [symbol]/page.tsx
│   │   │   ├── portfolio/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── holdings/page.tsx
│   │   │   │   └── orders/page.tsx
│   │   │   ├── watchlist/page.tsx
│   │   │   ├── alerts/page.tsx
│   │   │   ├── notifications/page.tsx
│   │   │   ├── transactions/page.tsx
│   │   │   └── profile/page.tsx
│   │   ├── layout.tsx                # Root layout (providers)
│   │   ├── page.tsx                  # Redirect to /dashboard
│   │   └── not-found.tsx
│   ├── api/                          # API service layer
│   │   ├── client.ts                 # Axios instance (base URL, auth, interceptors)
│   │   ├── auth.api.ts
│   │   ├── stocks.api.ts
│   │   ├── market.api.ts
│   │   ├── portfolio.api.ts
│   │   ├── orders.api.ts
│   │   ├── prices.api.ts
│   │   ├── watchlist.api.ts
│   │   ├── alerts.api.ts
│   │   ├── notifications.api.ts
│   │   └── dashboard.api.ts
│   ├── components/
│   │   ├── ui/                       # Reusable UI primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── ErrorState.tsx
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   └── ThemeToggle.tsx
│   │   ├── market/
│   │   │   ├── StockCard.tsx
│   │   │   ├── StockSearch.tsx
│   │   │   ├── MarketMoverCard.tsx
│   │   │   └── TrendingStock.tsx
│   │   ├── charts/
│   │   │   └── PriceChart.tsx
│   │   ├── portfolio/
│   │   │   ├── PortfolioSummary.tsx
│   │   │   ├── HoldingRow.tsx
│   │   │   └── HoldingsTable.tsx
│   │   ├── orders/
│   │   │   ├── OrderForm.tsx
│   │   │   └── OrderHistoryTable.tsx
│   │   ├── watchlist/
│   │   │   └── WatchlistItem.tsx
│   │   └── alerts/
│   │       ├── AlertForm.tsx
│   │       └── AlertCard.tsx
│   ├── hooks/                        # TanStack Query hooks
│   │   ├── useAuth.ts
│   │   ├── useStocks.ts
│   │   ├── useMarket.ts
│   │   ├── usePortfolio.ts
│   │   ├── useOrders.ts
│   │   ├── usePrices.ts
│   │   ├── useWatchlist.ts
│   │   ├── useAlerts.ts
│   │   ├── useNotifications.ts
│   │   └── useDashboard.ts
│   ├── store/                        # Zustand stores (client-only state)
│   │   ├── auth.store.ts
│   │   ├── theme.store.ts
│   │   └── websocket.store.ts
│   ├── types/                        # TypeScript type definitions
│   │   ├── api.ts                    # ApiError, pagination
│   │   ├── auth.ts
│   │   ├── stock.ts
│   │   ├── market.ts
│   │   ├── portfolio.ts
│   │   ├── order.ts
│   │   ├── price.ts
│   │   ├── watchlist.ts
│   │   ├── alert.ts
│   │   ├── notification.ts
│   │   └── dashboard.ts
│   ├── utils/
│   │   ├── format.ts                 # Currency, percentage, number formatting
│   │   ├── date.ts                   # Date/time utilities
│   │   └── cn.ts                     # classNames utility
│   ├── websocket/
│   │   └── StompClient.ts            # WebSocket manager
│   ├── providers/
│   │   ├── QueryProvider.tsx          # TanStack Query provider
│   │   ├── AuthProvider.tsx           # Auth context
│   │   └── ThemeProvider.tsx          # Theme context
│   └── constants/
│       └── routes.ts
├── .env.example
├── .env.local
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── vitest.config.ts
├── playwright.config.ts
└── package.json
```

---

## 3. Routing Plan

| Route                    | Auth | Component             | Description                    |
| ------------------------ | ---- | --------------------- | ------------------------------ |
| `/login`                 | No   | LoginPage             | Login form                     |
| `/register`              | No   | RegisterPage          | Registration form              |
| `/forgot-password`       | No   | ForgotPasswordPage    | Password recovery (OTP flow)   |
| `/`                      | Yes  | Redirect → /dashboard | —                              |
| `/dashboard`             | Yes  | DashboardPage         | Aggregated dashboard           |
| `/markets`               | Yes  | MarketsPage           | Stock list (paginated + search)|
| `/stocks/[symbol]`       | Yes  | StockDetailPage       | Stock detail + chart + trade   |
| `/portfolio`             | Yes  | PortfolioPage         | Summary + holdings             |
| `/portfolio/holdings`    | Yes  | HoldingsPage          | Holdings detail                |
| `/portfolio/orders`      | Yes  | OrdersPage            | Order history                  |
| `/watchlist`             | Yes  | WatchlistPage         | User watchlist                 |
| `/alerts`                | Yes  | AlertsPage            | Price alerts                   |
| `/notifications`         | Yes  | NotificationsPage     | Alert notifications            |
| `/transactions`          | Yes  | TransactionsPage      | Ledger transactions            |
| `/profile`               | Yes  | ProfilePage           | User profile + settings        |

---

## 4. Authentication Architecture

### Token Storage

Based on backend analysis:
- Backend uses **JWT Bearer tokens** in the `Authorization` header
- Backend does **not** use HttpOnly cookies
- Frontend must store tokens in memory (Zustand) and/or `localStorage` for persistence across tabs/refreshes

### Auth Flow

```
1. Login/Signup → Backend returns { accessToken, refreshToken, user }
2. Store in Zustand → persist to localStorage (encrypted if possible)
3. Axios interceptor attaches Authorization: Bearer <accessToken> to every request
4. On 401 response → attempt token refresh using refreshToken
5. If refresh fails → clear state → redirect to /login
6. On logout → POST /api/auth/logout with refreshToken → clear state
7. On app load → check stored tokens → call GET /api/users/me to validate session
```

### Route Protection

- `(protected)/layout.tsx` wraps all authenticated routes
- Check auth state on mount; redirect to `/login` if not authenticated
- Show loading skeleton while validating stored session

---

## 5. API Client Architecture

### Axios Instance

```typescript
// Central configuration
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: attach auth token
// Response interceptor: handle 401 → refresh flow
// Response interceptor: normalize error to ApiError
```

### Error Handling Strategy

1. Axios response interceptor catches non-2xx responses
2. Extracts `ApiError` from response body
3. On 401: attempts silent refresh via `/api/auth/refresh`
4. On refresh failure: clears auth → redirects to `/login`
5. All other errors: propagated to TanStack Query `onError` handlers

---

## 6. Server State (TanStack Query)

### Query Key Convention

```typescript
['stocks']                    // GET /api/stocks
['stocks', symbol]            // GET /api/stocks/{symbol}
['stocks', 'search', query]   // GET /api/stocks/search?q=
['market', 'history', symbol] // GET /api/market/history/{symbol}
['market', 'candle', symbol]  // GET /api/market/candle/{symbol}
['market', 'gainers']         // GET /api/market/gainers
['market', 'losers']          // GET /api/market/losers
['market', 'trending']        // GET /api/market/trending
['portfolio']                 // GET /api/portfolio
['portfolio', 'summary']      // GET /api/portfolio/summary
['portfolio', 'holdings']     // GET /api/portfolio/holdings
['orders', 'history']         // GET /api/orders/history
['transactions']              // GET /api/transactions
['prices', 'latest']          // GET /api/prices/latest
['prices', symbol]            // GET /api/prices/{symbol}
['watchlist']                 // GET /api/watchlist
['alerts']                    // GET /api/alerts
['notifications']             // GET /api/notifications
['dashboard']                 // GET /api/dashboard
['user', 'me']                // GET /api/users/me
```

### Mutation Invalidation Rules

| Mutation               | Invalidate                                        |
| ---------------------- | ------------------------------------------------- |
| Buy order              | `portfolio`, `portfolio.summary`, `portfolio.holdings`, `orders.history`, `transactions` |
| Sell order             | Same as buy                                       |
| Add watchlist          | `watchlist`, `dashboard`                          |
| Remove watchlist       | `watchlist`, `dashboard`                          |
| Create alert           | `alerts`, `dashboard`                             |
| Delete alert           | `alerts`, `dashboard`                             |
| Update profile         | `user.me`                                         |
| Change password        | None                                              |

---

## 7. Client State (Zustand)

### Auth Store

```typescript
interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (response: AuthResponse) => void;
  logout: () => void;
  setUser: (user: UserResponse) => void;
  setTokens: (access: string, refresh: string) => void;
}
```

### Theme Store

```typescript
interface ThemeState {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}
```

### WebSocket Store

```typescript
interface WebSocketState {
  connected: boolean;
  prices: Map<string, PriceTickMessage>;
  setConnected: (connected: boolean) => void;
  updatePrice: (tick: PriceTickMessage) => void;
}
```

---

## 8. WebSocket Integration

### Architecture

```
StompClient.ts (singleton)
  ├── connect() → STOMP /ws
  ├── subscribe('/topic/market') → update Zustand price store
  ├── subscribe('/topic/{symbol}') → update Zustand price store
  ├── unsubscribe()
  ├── disconnect()
  └── auto-reconnect (built-in @stomp/stompjs)
```

### Integration Points

| Page/Component        | Subscription                    | Purpose                        |
| --------------------- | ------------------------------- | ------------------------------ |
| Dashboard             | `/topic/market`                 | Live prices for all stocks     |
| Stock Detail           | `/topic/{symbol}`              | Live price for viewed stock    |
| Markets page          | `/topic/market`                 | Live prices for stock list     |
| Portfolio (holdings)  | `/topic/market`                 | Live P/L updates               |
| Watchlist             | `/topic/market`                 | Live prices for watched stocks |

---

## 9. Chart Strategy

### Historical Data

- Fetch via `GET /api/market/history/{symbol}?from=...&to=...`
- Render with TradingView Lightweight Charts
- Full OHLCV data → **candlestick chart**
- Support time range selection (1M, 3M, 6M, 1Y, 5Y, Max)

### Live Updates

- Subscribe to `/topic/{symbol}` via STOMP
- On each tick → update the current candle in the chart
- **Do NOT** refetch entire history on each tick

---

## 10. Environment Configuration

### `.env.example`

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_WS_BASE_URL=ws://localhost:8080/ws
```

### Production

```
NEXT_PUBLIC_API_BASE_URL=https://api.tradex.shubhamprakash681.in
NEXT_PUBLIC_WS_BASE_URL=wss://api.tradex.shubhamprakash681.in/ws
```

---

## 11. Testing Strategy

| Layer       | Tool                | Coverage Focus                                      |
| ----------- | ------------------- | --------------------------------------------------- |
| Unit        | Vitest              | Formatters, utilities, store logic                   |
| Component   | Vitest + RTL        | Forms, tables, cards, modals                         |
| Integration | Vitest + RTL + MSW  | Login flow, search→detail, buy→portfolio             |
| E2E         | Playwright          | Full user journeys                                   |

### MSW Setup

Mock all API endpoints using MSW (Mock Service Worker) handlers based on the backend API map. Response shapes must match actual backend DTOs.

---

## 12. Design System Summary

- **Framework:** Tailwind CSS with custom CSS variables for theming
- **Color palette:** As specified in `FrontendInstruction.md` §11
- **Typography:** Inter font family (Google Fonts)
- **Dark mode:** CSS variables toggled via `data-theme` attribute
- **Components:** Custom UI primitives (no component library dependency)
- **Responsive:** Mobile-first with proper mobile navigation
- **Charts:** TradingView Lightweight Charts with brand colors

---

## 13. Key Design Decisions

| Decision                                | Rationale                                        |
| --------------------------------------- | ------------------------------------------------ |
| Axios over fetch                        | Interceptors, automatic JSON, timeout, cancel    |
| `@stomp/stompjs` for WebSocket          | Backend uses STOMP; no SockJS; built-in reconnect|
| Token in localStorage                   | Backend requires Bearer header (no HttpOnly cookies available) |
| Per-page WebSocket subscriptions        | Avoid unnecessary data flow; subscribe/unsubscribe on mount/unmount |
| TanStack Query for all server state     | Caching, retry, stale-while-revalidate, invalidation |
| Zustand only for client state           | Avoid duplicating server state in global stores  |
| All orders are market orders            | Backend only supports `EXECUTED` status — no limit orders |
| No pagination for orders/transactions   | Backend returns full list (no pagination params in controllers) |
| Dashboard API aggregates everything     | `/api/dashboard` combines watchlist, alerts, notifications, gainers, losers, trending |

---

## 14. Backend Gaps

> Features with limited or missing backend support. Frontend will work around these where possible.

### Gap 1 — No read/unread state for notifications

- **Expected:** `read` field on notifications, `PATCH` endpoint to mark as read, unread count
- **Evidence:** `UserNotification` entity and `NotificationController` have no `read` field or update endpoint
- **Frontend workaround:** Display notifications as a simple chronological list without read/unread distinction

### Gap 2 — Order history has no pagination or filtering

- **Expected:** `Pageable` support, filters by side/symbol/date range
- **Evidence:** `OrderController.history()` returns `List<OrderResponse>` with no `Pageable` parameter
- **Frontend workaround:** Client-side pagination and filtering if the list grows large

### Gap 3 — Transaction history has no pagination or filtering

- **Expected:** Same as orders
- **Evidence:** `TransactionController.transactions()` returns `List<TransactionResponse>` with no `Pageable`
- **Frontend workaround:** Same client-side approach as orders

### Gap 4 — No "today's P/L" metric

- **Expected:** `todayPnl` / `todayPnlPercent` field in portfolio summary
- **Evidence:** `PortfolioSummaryResponse` has `unrealizedPnl` (total, based on average price vs reference price) but no daily P/L
- **Frontend workaround:** Show unrealized P/L only; omit "today's P/L" from dashboard

### Gap 5 — No user avatar/profile image

- **Expected:** Avatar upload or URL field on user entity
- **Evidence:** `User` entity has only `id`, `email`, `fullName`, `roles`, `createdAt`, `updatedAt`
- **Frontend workaround:** Generate initials-based avatar from `fullName`
