// ─── Common ───────────────────────────────────────────────────────────────────

export interface ApiError {
  status: number;
  error: string;
  message: string;
  details?: string[];
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface SignupRequest {
  email: string;
  fullName: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserResponse;
}

export interface UserResponse {
  id: number;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  roles: string[];
  createdAt: string;
}

export interface UpdateProfileRequest {
  fullName: string;
  avatarUrl?: string | null;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface PasswordRecoveryRequest {
  email: string;
}

export interface PasswordResetRequest {
  email: string;
  otp: string;
  newPassword: string;
}

// ─── Market / Stocks ──────────────────────────────────────────────────────────

export interface StockResponse {
  symbol: string;
  name: string;
  exchange: string;
  sector: string;
  referencePrice: number;
  synthetic: boolean;
}

export interface CandleResponse {
  symbol: string;
  interval: string;
  candleTime: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketMoverResponse {
  symbol: string;
  name: string;
  price: number;
  changeAmount: number;
  changePercent: number;
  volume: number;
  asOf: string;
}

export interface MarketTrendResponse {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  score: number;
  reason: string;
  asOf: string;
}

// ─── Price Stream ─────────────────────────────────────────────────────────────

export interface PriceResponse {
  symbol: string;
  price: number;
  previousPrice: number;
  changeAmount: number;
  changePercent: number;
  synthetic: boolean;
  timestamp: string;
}

// ─── Portfolio ────────────────────────────────────────────────────────────────

export interface PortfolioSummaryResponse {
  cashBalance: number;
  holdingsValue: number;
  totalValue: number;
  investedValue: number;
  unrealizedPnl: number;
  unrealizedPnlPercent: number;
  todayPnl: number;
  todayPnlPercent: number;
}

export interface HoldingResponse {
  symbol: string;
  stockName: string;
  quantity: number;
  averagePrice: number;
  lastPrice: number;
  closePrice: number;
  investedValue: number;
  marketValue: number;
  unrealizedPnl: number;
  unrealizedPnlPercent: number;
  todayPnl: number;
  todayPnlPercent: number;
}

export interface PortfolioResponse {
  summary: PortfolioSummaryResponse;
  holdings: HoldingResponse[];
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export type OrderSide = "BUY" | "SELL";
export type OrderStatus = "EXECUTED";

export interface OrderRequest {
  symbol: string;
  quantity: number;
}

export interface OrderResponse {
  id: number;
  userId: number;
  symbol: string;
  stockName: string;
  side: OrderSide;
  quantity: number;
  price: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}

// ─── Transactions ─────────────────────────────────────────────────────────────

export type TransactionType = "CREDIT" | "DEBIT";

export interface TransactionResponse {
  id: number;
  type: TransactionType;
  amount: number;
  balanceAfter: number;
  description: string;
  createdAt: string;
}

// ─── Notifications ────────────────────────────────────────────────────────────

export interface NotificationResponse {
  id: number;
  symbol: string;
  title: string;
  message: string;
  alertId: number | null;
  readStatus: boolean;
  createdAt: string;
}

export interface UnreadCountResponse {
  count: number;
}

// ─── Watchlist ─────────────────────────────────────────────────────────────────

export interface WatchlistResponse {
  id: number;
  symbol: string;
  stockName: string;
  exchange: string;
  createdAt: string;
}

// ─── Alerts ───────────────────────────────────────────────────────────────────

export type AlertCondition = "ABOVE" | "BELOW";

export interface AlertRequest {
  symbol: string;
  targetPrice: number;
  condition: AlertCondition;
}

export interface AlertResponse {
  id: number;
  symbol: string;
  stockName: string;
  targetPrice: number;
  condition: AlertCondition;
  status: "ACTIVE" | "TRIGGERED";
  triggeredPrice: number | null;
  triggeredAt: string | null;
  createdAt: string;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface DashboardResponse {
  watchlist: WatchlistResponse[];
  alerts: AlertResponse[];
  notifications: NotificationResponse[];
  topGainers: MarketMoverResponse[];
  topLosers: MarketMoverResponse[];
  trendingStocks: MarketTrendResponse[];
}
