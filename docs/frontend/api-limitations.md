# TradeX — Frontend Guide: API Limitations & Data Constraints

> **Reference:** Mirrors backend specifications from `trade-x-api/API_LIMITATIONS.md`.

---

## Quick Reference for Frontend Engineers

### 1. Chart Data & Resolution Constraints

When querying `/api/market/history/{symbol}`, the backend enforces strict window clamping to protect performance and prevent API cancellations:

| Interval Code | Query Param | Backend Enum | Max Points Returned | Time Window Covered | Recommended Range Preset |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `1s` | `interval=1s` | `SECONDS` | **3,601** | **Latest 1 Hour** | `1D` |
| `1m` | `interval=1m` | `MINUTE` | **5,001** | **$\approx$ 3.5 Days** | `1D`, `5D` |
| `1h` | `interval=1h` | `HOURLY` | **5,001** | **$\approx$ 208 Days** | `1M`, `3M`, `6M` |
| `D` | `interval=D` | `DAILY` | **5,000** | **$\approx$ 13.7 Years** (Full 10Y preserved) | `1M`, `6M`, `YTD`, `1Y`, `5Y`, `All` |
| `W` | `interval=W` | `WEEKLY` | **10,000** | **Full 10Y preserved** | `1Y`, `5Y`, `All` |
| `M` | `interval=M` | `MONTHLY` | **10,000** | **Full 10Y preserved** | `5Y`, `All` |

> [!IMPORTANT]
> **TradingView Interval Identifiers:**
> - `1m` (lowercase) = 1 Minute
> - `1M` (uppercase) = 1 Month
> The backend parser distinguishes case between `1m` and `1M`.

### 2. Timeouts

- **Axios Client Timeout:** Set to `60_000` ms (60 seconds) in `src/api/client.ts`.
- **API History Timeout:** Explicitly configured at 60s in `src/api/market.api.ts`.
- **Gateway Response Timeout:** Configured at 60s on the Spring Cloud Gateway.

### 3. UI Synchronization Best Practices

In `src/app/(protected)/stocks/[symbol]/page.tsx`:
- When user selects `1s`, pair with `1D` (which displays the latest hour of second ticks).
- When user selects `5D`, do not keep `1s`; switch to `1m` or `1h`.
- When user switches from intraday (`1s`, `1m`) to wide ranges (`1M`, `1Y`, `5Y`, `All`), automatically switch the interval to `D`.
- Use `placeholderData: (prev) => prev` in TanStack Query to prevent chart flicker during transitions.

### 4. Other Functional Gaps

- **Orders History:** Returns full list; client should paginate locally if necessary.
- **Notifications:** No `read` status flag; display as a flat reverse-chronological list.
- **Orders:** Market orders only; executed immediately at `referencePrice`.

