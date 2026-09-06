# TradeX — Backend API Map

> **Source of truth:** Backend Java source code at `trade-x-api/`.
> **Gateway base URL (local):** `http://localhost:8080`
> **Gateway base URL (prod):** `https://api.tradex.shubhamprakash681.in`

---

## Common Conventions

### Authentication

- **Mechanism:** JWT Bearer tokens in the `Authorization` header.
- **Header format:** `Authorization: Bearer <access_token>`
- **Access token TTL:** 30 minutes
- **Refresh token TTL:** 7 days
- **Token type:** HMAC-SHA256 signed JWTs
- **JWT claims:** `sub` (userId as string), `email`, `roles` (array), `typ` ("access" | "refresh")
- **Public endpoints (no auth required):** `/api/auth/signup`, `/api/auth/login`, `/api/auth/refresh`, `/api/auth/password-recovery/request`, `/api/auth/password-recovery/reset`, `/api/auth/logout`, `/ws`, `/swagger-ui/**`, `/v3/api-docs/**`

### Gateway Behaviour

The API Gateway validates JWT tokens and injects internal headers (`X-User-Id`, `X-User-Email`, `X-User-Roles`) before forwarding to downstream services. Individual services use Spring Security with `@AuthenticationPrincipal JwtPrincipal` to extract the authenticated user.

### Error Response Format

All services use a common error record:

```json
{
  "timestamp": "2026-09-05T18:30:00Z",
  "status": 400,
  "error": "Bad request",
  "message": "Validation failed",
  "details": ["email: must not be blank", "password: size must be between 8 and 80"]
}
```

**TypeScript type:**
```typescript
interface ApiError {
  timestamp: string;     // ISO-8601 Instant
  status: number;
  error: string;
  message: string;
  details: string[];
}
```

### Timestamp Format

- All timestamps are `LocalDateTime` serialized as ISO-8601 strings (e.g. `"2026-09-05T18:30:00"`)
- No timezone info — assumed server-local time
- Exception: `ApiError.timestamp` is `Instant` (e.g. `"2026-09-05T13:00:00Z"`)

### Monetary Values

- All monetary/price values use `BigDecimal`, serialized as JSON numbers
- Precision: 18 digits, scale varies (2 for money, 4 for prices/quantities)

---

## 1. Auth Service

**Base path:** `/api/auth`

### POST `/api/auth/signup`

**Auth:** Public

**Request:**
```json
{
  "email": "user@example.com",
  "fullName": "John Doe",
  "password": "securepassword123"
}
```

**Validation:**
| Field      | Rules                                |
| ---------- | ------------------------------------ |
| `email`    | `@NotBlank`, `@Email`                |
| `fullName` | `@NotBlank`, `@Size(min=2, max=120)` |
| `password` | `@NotBlank`, `@Size(min=8, max=80)`  |

**Response (201 Created):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "John Doe",
    "roles": ["ROLE_USER"],
    "createdAt": "2026-09-05T18:30:00"
  }
}
```

**Errors:**
| Status | Condition                |
| ------ | ------------------------ |
| 400    | Validation failed        |
| 409    | Email already registered |

---

### POST `/api/auth/login`

**Auth:** Public

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Validation:**
| Field      | Rules              |
| ---------- | ------------------ |
| `email`    | `@NotBlank`, `@Email` |
| `password` | `@NotBlank`        |

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "John Doe",
    "roles": ["ROLE_USER"],
    "createdAt": "2026-09-05T18:30:00"
  }
}
```

**Errors:**
| Status | Condition               |
| ------ | ----------------------- |
| 400    | Validation failed       |
| 401    | Invalid email/password  |

---

### POST `/api/auth/refresh`

**Auth:** Public

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Validation:**
| Field          | Rules       |
| -------------- | ----------- |
| `refreshToken` | `@NotBlank` |

**Response (200):** Same as login/signup `AuthResponse`.

**Errors:**
| Status | Condition              |
| ------ | ---------------------- |
| 401    | Invalid/revoked/expired refresh token |

---

### POST `/api/auth/logout`

**Auth:** Public

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response:** `204 No Content`

---

### POST `/api/auth/password-recovery/request`

**Auth:** Public

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Validation:**
| Field   | Rules              |
| ------- | ------------------ |
| `email` | `@NotBlank`, `@Email` |

**Response:** `204 No Content` (OTP sent to email)

**Errors:**
| Status | Condition      |
| ------ | -------------- |
| 404    | User not found |

---

### POST `/api/auth/password-recovery/reset`

**Auth:** Public

**Request:**
```json
{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "newsecurepassword123"
}
```

**Validation:**
| Field         | Rules                               |
| ------------- | ----------------------------------- |
| `email`       | `@NotBlank`, `@Email`               |
| `otp`         | `@NotBlank`                         |
| `newPassword` | `@NotBlank`, `@Size(min=8, max=80)` |

**Response:** `204 No Content`

**Errors:**
| Status | Condition              |
| ------ | ---------------------- |
| 400    | Invalid/expired OTP    |
| 404    | User not found         |

---

## 2. User Service

**Base path:** `/api/users`

### GET `/api/users/me`

**Auth:** Required

**Response (200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "fullName": "John Doe",
  "roles": ["ROLE_USER"],
  "createdAt": "2026-09-05T18:30:00"
}
```

**Errors:**
| Status | Condition      |
| ------ | -------------- |
| 401    | Not authenticated |
| 404    | User not found |

---

### PUT `/api/users/me`

**Auth:** Required

**Request:**
```json
{
  "fullName": "Jane Doe"
}
```

**Validation:**
| Field      | Rules                                |
| ---------- | ------------------------------------ |
| `fullName` | `@NotBlank`, `@Size(min=2, max=120)` |

**Response (200):** `UserResponse` (same as `/me`).

---

### PUT `/api/users/password`

**Auth:** Required

**Request:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newsecurepassword123"
}
```

**Validation:**
| Field             | Rules                               |
| ----------------- | ----------------------------------- |
| `currentPassword` | `@NotBlank`                         |
| `newPassword`     | `@NotBlank`, `@Size(min=8, max=80)` |

**Response:** `204 No Content`

**Errors:**
| Status | Condition                    |
| ------ | ---------------------------- |
| 401    | Current password is incorrect |
| 404    | User not found               |

---

## 3. Stock Service (Market Service)

**Base path:** `/api/stocks`

### GET `/api/stocks`

**Auth:** Required (gateway enforced)

**Query parameters:**
| Param  | Type     | Required | Default    | Description            |
| ------ | -------- | -------- | ---------- | ---------------------- |
| `q`    | `string` | No       | —          | Search/filter query    |
| `page` | `int`    | No       | `0`        | Page number (0-based)  |
| `size` | `int`    | No       | `20`       | Page size              |
| `sort` | `string` | No       | `symbol`   | Sort field             |

**Response (200):** Spring `Page<StockResponse>`
```json
{
  "content": [
    {
      "symbol": "RELIANCE",
      "name": "Reliance Industries Limited",
      "exchange": "NSE",
      "sector": "Energy",
      "referencePrice": 2940.10,
      "synthetic": false
    }
  ],
  "pageable": { "pageNumber": 0, "pageSize": 20, "sort": { "sorted": true } },
  "totalPages": 1,
  "totalElements": 15,
  "last": true,
  "first": true,
  "numberOfElements": 15,
  "size": 20,
  "number": 0,
  "empty": false
}
```

---

### GET `/api/stocks/search`

**Auth:** Required

**Query parameters:**
| Param | Type     | Required | Description       |
| ----- | -------- | -------- | ----------------- |
| `q`   | `string` | Yes      | Search query      |

**Response (200):** `StockResponse[]`
```json
[
  {
    "symbol": "RELIANCE",
    "name": "Reliance Industries Limited",
    "exchange": "NSE",
    "sector": "Energy",
    "referencePrice": 2940.10,
    "synthetic": false
  }
]
```

---

### GET `/api/stocks/{symbol}`

**Auth:** Required

**Path params:** `symbol` — stock ticker symbol (case-insensitive, normalized to uppercase)

**Response (200):** `StockResponse`
```json
{
  "symbol": "TCS",
  "name": "Tata Consultancy Services Limited",
  "exchange": "NSE",
  "sector": "Technology",
  "referencePrice": 3890.70,
  "synthetic": false
}
```

**Errors:**
| Status | Condition       |
| ------ | --------------- |
| 404    | Stock not found |

---

## 4. Market History Service (Market Service)

**Base path:** `/api/market`

### GET `/api/market/history/{symbol}`

**Auth:** Required

**Path params:** `symbol`

**Query parameters:**
| Param  | Type        | Required | Format       | Description  |
| ------ | ----------- | -------- | ------------ | ------------ |
| `from` | `LocalDate` | No       | `YYYY-MM-DD` | Start date   |
| `to`   | `LocalDate` | No       | `YYYY-MM-DD` | End date     |

**Response (200):** `CandleResponse[]`
```json
[
  {
    "symbol": "RELIANCE",
    "interval": "1d",
    "candleTime": "2026-09-05T00:00:00",
    "open": 2935.50,
    "high": 2955.75,
    "low": 2920.10,
    "close": 2940.10,
    "volume": 1245678
  }
]
```

---

### GET `/api/market/candle/{symbol}`

**Auth:** Required

**Response (200):** Single `CandleResponse` (latest candle for the symbol)

---

### GET `/api/market/gainers`

**Auth:** Required

**Response (200):** `MarketMoverResponse[]`
```json
[
  {
    "symbol": "TCS",
    "name": "Tata Consultancy Services Limited",
    "price": 3920.50,
    "changeAmount": 29.80,
    "changePercent": 0.77,
    "volume": 452300,
    "asOf": "2026-09-05T15:30:00"
  }
]
```

---

### GET `/api/market/losers`

**Auth:** Required

**Response (200):** `MarketMoverResponse[]` (same schema as gainers)

---

### GET `/api/market/trending`

**Auth:** Required

**Response (200):** `MarketTrendResponse[]`
```json
[
  {
    "symbol": "RELIANCE",
    "name": "Reliance Industries Limited",
    "price": 2940.10,
    "changePercent": 1.25,
    "score": 85.50,
    "reason": "High volume activity",
    "asOf": "2026-09-05T15:30:00"
  }
]
```

---

### GET `/api/admin/market/status`

**Auth:** Required (admin context)

**Response (200):** `MarketStatusResponse`
```json
{
  "startTime": "2016-01-01T00:00:00",
  "endTime": "2026-09-05T00:00:00",
  "interval": "1d",
  "supportedSymbols": 15,
  "symbols": [
    {
      "symbol": "RELIANCE",
      "candles": 3560,
      "firstTime": "2016-01-01T00:00:00",
      "latestTime": "2026-09-05T00:00:00",
      "complete": true
    }
  ]
}
```

---

### POST `/api/admin/market/regenerate`

**Auth:** Required (admin context)

**Response (200):** `MarketStatusResponse` (same as above, after regeneration)

---

## 5. Portfolio Service

**Base path:** `/api/portfolio`

### GET `/api/portfolio`

**Auth:** Required

**Response (200):** `PortfolioResponse`
```json
{
  "summary": {
    "cashBalance": 850000.00,
    "holdingsValue": 150000.00,
    "totalValue": 1000000.00,
    "investedValue": 145000.00,
    "unrealizedPnl": 5000.00,
    "unrealizedPnlPercent": 3.45
  },
  "holdings": [
    {
      "symbol": "RELIANCE",
      "stockName": "Reliance Industries Limited",
      "quantity": 10.0000,
      "averagePrice": 2900.0000,
      "lastPrice": 2940.1000,
      "investedValue": 29000.00,
      "marketValue": 29401.00,
      "unrealizedPnl": 401.00,
      "unrealizedPnlPercent": 1.38
    }
  ]
}
```

> **Note:** If the user has no portfolio account yet, one is auto-created with ₹10,00,000.00 starting cash.

---

### GET `/api/portfolio/summary`

**Auth:** Required

**Response (200):** `PortfolioSummaryResponse`
```json
{
  "cashBalance": 850000.00,
  "holdingsValue": 150000.00,
  "totalValue": 1000000.00,
  "investedValue": 145000.00,
  "unrealizedPnl": 5000.00,
  "unrealizedPnlPercent": 3.45
}
```

---

### GET `/api/portfolio/holdings`

**Auth:** Required

**Response (200):** `HoldingResponse[]`
```json
[
  {
    "symbol": "RELIANCE",
    "stockName": "Reliance Industries Limited",
    "quantity": 10.0000,
    "averagePrice": 2900.0000,
    "lastPrice": 2940.1000,
    "investedValue": 29000.00,
    "marketValue": 29401.00,
    "unrealizedPnl": 401.00,
    "unrealizedPnlPercent": 1.38
  }
]
```

---

## 6. Order Service (Portfolio Service)

**Base path:** `/api/orders`

### POST `/api/orders/buy`

**Auth:** Required

**Request:**
```json
{
  "symbol": "RELIANCE",
  "quantity": 10
}
```

**Validation:**
| Field      | Rules                                 |
| ---------- | ------------------------------------- |
| `symbol`   | `@NotBlank`, `@Size(max=32)`          |
| `quantity` | `@NotNull`, `@DecimalMin("0.0001")`   |

**Response (200):** `OrderResponse`
```json
{
  "id": 1,
  "userId": 1,
  "symbol": "RELIANCE",
  "stockName": "Reliance Industries Limited",
  "side": "BUY",
  "quantity": 10.0000,
  "price": 2940.1000,
  "totalAmount": 29401.00,
  "status": "EXECUTED",
  "createdAt": "2026-09-05T18:30:00"
}
```

**Errors:**
| Status | Condition              |
| ------ | ---------------------- |
| 400    | Insufficient cash      |
| 400    | Validation failed      |
| 404    | Stock not found        |

> **Note:** All orders are immediately executed at the stock's `referencePrice`. Only market orders are supported — there is no limit/stop order type.

---

### POST `/api/orders/sell`

**Auth:** Required

**Request:** Same as buy (`OrderRequest`).

**Response (200):** `OrderResponse` (same schema, `side` = `"SELL"`)

**Errors:**
| Status | Condition                          |
| ------ | ---------------------------------- |
| 400    | No holding for this stock          |
| 400    | Insufficient quantity to sell      |
| 400    | Validation failed                  |

---

### GET `/api/orders/history`

**Auth:** Required

**Response (200):** `OrderResponse[]` (ordered by `createdAt` DESC)

---

## 7. Transaction Service (Portfolio Service)

**Base path:** `/api/transactions`

### GET `/api/transactions`

**Auth:** Required

**Response (200):** `TransactionResponse[]`
```json
[
  {
    "id": 1,
    "orderId": 1,
    "type": "BUY",
    "amount": 29401.00,
    "description": "Bought 10.0000 stocks of RELIANCE",
    "createdAt": "2026-09-05T18:30:00"
  }
]
```

---

## 8. Price Stream Service

**Base path:** `/api/prices`

### GET `/api/prices/latest`

**Auth:** Required

**Response (200):** `PriceResponse[]`
```json
[
  {
    "symbol": "RELIANCE",
    "price": 2942.35,
    "previousPrice": 2940.10,
    "changeAmount": 2.25,
    "changePercent": 0.08,
    "synthetic": false,
    "timestamp": "2026-09-05T18:30:15"
  }
]
```

---

### GET `/api/prices/{symbol}`

**Auth:** Required

**Response (200):** Single `PriceResponse`

---

### GET `/api/prices/history`

**Auth:** Required

**Query parameters:**
| Param    | Type     | Required | Default | Description       |
| -------- | -------- | -------- | ------- | ----------------- |
| `symbol` | `string` | No       | —       | Filter by symbol  |
| `limit`  | `int`    | No       | `100`   | Max results       |

**Response (200):** `PriceResponse[]`

---

## 9. Watchlist Service (Notification Service)

**Base path:** `/api/watchlist`

### GET `/api/watchlist`

**Auth:** Required

**Response (200):** `WatchlistResponse[]`
```json
[
  {
    "id": 1,
    "symbol": "RELIANCE",
    "stockName": "Reliance Industries Limited",
    "exchange": "NSE",
    "createdAt": "2026-09-05T18:30:00"
  }
]
```

---

### POST `/api/watchlist`

**Auth:** Required

**Request:**
```json
{
  "symbol": "TCS"
}
```

**Validation:**
| Field    | Rules                        |
| -------- | ---------------------------- |
| `symbol` | `@NotBlank`, `@Size(max=32)` |

**Response (201 Created):** `WatchlistResponse`

**Errors:**
| Status | Condition               |
| ------ | ----------------------- |
| 409    | Already in watchlist    |
| 404    | Stock not found         |

---

### DELETE `/api/watchlist/{symbol}`

**Auth:** Required

**Response:** `204 No Content`

---

## 10. Alert Service (Notification Service)

**Base path:** `/api/alerts`

### GET `/api/alerts`

**Auth:** Required

**Response (200):** `AlertResponse[]`
```json
[
  {
    "id": 1,
    "symbol": "RELIANCE",
    "stockName": "Reliance Industries Limited",
    "targetPrice": 3000.00,
    "condition": "ABOVE",
    "status": "ACTIVE",
    "triggeredPrice": null,
    "triggeredAt": null,
    "createdAt": "2026-09-05T18:30:00"
  }
]
```

---

### POST `/api/alerts`

**Auth:** Required

**Request:**
```json
{
  "symbol": "RELIANCE",
  "targetPrice": 3000.00,
  "condition": "ABOVE"
}
```

**Validation:**
| Field         | Rules                                  |
| ------------- | -------------------------------------- |
| `symbol`      | `@NotBlank`, `@Size(max=32)`           |
| `targetPrice` | `@NotNull`, `@DecimalMin("0.0001")`    |
| `condition`   | `@NotNull` — enum: `ABOVE`, `BELOW`   |

**Response (201 Created):** `AlertResponse`

---

### DELETE `/api/alerts`

**Auth:** Required

**Query parameters (at least one required):**
| Param    | Type   | Description               |
| -------- | ------ | ------------------------- |
| `id`     | `Long` | Delete specific alert     |
| `symbol` | `string` | Delete all alerts for symbol |

**Response:** `204 No Content`

---

### DELETE `/api/alerts/{id}`

**Auth:** Required

**Response:** `204 No Content`

---

## 11. Notification Service

**Base path:** `/api/notifications`

### GET `/api/notifications`

**Auth:** Required

**Query parameters:**
| Param   | Type  | Required | Default | Description   |
| ------- | ----- | -------- | ------- | ------------- |
| `limit` | `int` | No       | `100`   | Max results   |

**Response (200):** `NotificationResponse[]`
```json
[
  {
    "id": 1,
    "symbol": "RELIANCE",
    "title": "Price Alert Triggered",
    "message": "RELIANCE crossed ₹3000.00",
    "alertId": 1,
    "createdAt": "2026-09-05T18:30:00"
  }
]
```

---

## 12. Dashboard Service (Notification Service)

**Base path:** `/api/dashboard`

### GET `/api/dashboard`

**Auth:** Required

**Response (200):** `DashboardResponse`
```json
{
  "watchlist": [ /* WatchlistResponse[] */ ],
  "alerts": [ /* AlertResponse[] */ ],
  "notifications": [ /* NotificationResponse[] (max 10) */ ],
  "topGainers": [ /* MarketMoverResponse[] */ ],
  "topLosers": [ /* MarketMoverResponse[] */ ],
  "trendingStocks": [ /* MarketTrendResponse[] */ ]
}
```

> **Note:** This is an aggregation endpoint. It calls watchlist, alerts, notifications (limit 10), gainers, losers, and trending internally.

---

## Enums Summary

| Enum              | Values                 | Service              |
| ----------------- | ---------------------- | -------------------- |
| `UserRoles`       | `ROLE_USER`, `ROLE_ADMIN` | Auth Service      |
| `OrderSide`       | `BUY`, `SELL`          | Portfolio Service    |
| `OrderStatus`     | `EXECUTED`             | Portfolio Service    |
| `AlertCondition`  | `ABOVE`, `BELOW`       | Notification Service |
| `AlertStatus`     | `ACTIVE`, `TRIGGERED`  | Notification Service |

---

## Supported Stocks

15 stocks seeded by `SupportedStockCatalog`:

| Symbol       | Name                                | Exchange | Sector                  | Ref. Price  |
| ------------ | ----------------------------------- | -------- | ----------------------- | ----------- |
| RELIANCE     | Reliance Industries Limited         | NSE      | Energy                  | 2940.10     |
| TCS          | Tata Consultancy Services Limited   | NSE      | Technology              | 3890.70     |
| INFY         | Infosys Limited                     | NSE      | Technology              | 1525.35     |
| HDFCBANK     | HDFC Bank Limited                   | NSE      | Banking                 | 1695.40     |
| ICICIBANK    | ICICI Bank Limited                  | NSE      | Banking                 | 1120.25     |
| SBIN         | State Bank of India                 | NSE      | Banking                 | 835.80      |
| ITC          | ITC Limited                         | NSE      | Consumer Goods          | 432.15      |
| LT           | Larsen & Toubro Limited             | NSE      | Infrastructure          | 3615.60     |
| AXISBANK     | Axis Bank Limited                   | NSE      | Banking                 | 1185.35     |
| BHARTIARTL   | Bharti Airtel Limited               | NSE      | Telecom                 | 1418.75     |
| MARUTI       | Maruti Suzuki India Limited         | NSE      | Automobile              | 12750.40    |
| TITAN        | Titan Company Limited               | NSE      | Consumer Discretionary  | 3520.15     |
| ASIANPAINT   | Asian Paints Limited                | NSE      | Consumer Goods          | 2935.25     |
| NIFTYBEES    | Nippon India ETF Nifty 50 BeES      | NSE      | ETF                     | 275.50      |
| BANKBEES     | Nippon India ETF Bank BeES          | NSE      | ETF                     | 515.25      |
