import { Client, type StompSubscription } from "@stomp/stompjs";
import type { PriceResponse } from "@/types/api.types";
import { useWebSocketStore } from "@/store/websocket.store";

type PriceListener = (price: PriceResponse) => void;

function brokerUrl(): string {
  const base = process.env.NEXT_PUBLIC_WS_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
  const url = new URL(base);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  url.pathname = `${url.pathname.replace(/\/$/, "")}/ws`;
  return url.toString();
}

function isPriceResponse(value: unknown): value is PriceResponse {
  if (!value || typeof value !== "object") return false;
  const tick = value as Record<string, unknown>;
  return typeof tick.symbol === "string" && typeof tick.price === "number" && typeof tick.previousPrice === "number" && typeof tick.changeAmount === "number" && typeof tick.changePercent === "number" && typeof tick.synthetic === "boolean" && typeof tick.timestamp === "string";
}

class MarketStream {
  private client: Client | null = null;
  private listeners = new Map<string, Set<PriceListener>>();
  private subscriptions = new Map<string, StompSubscription>();

  connect(): void {
    if (this.client?.active) return;
    useWebSocketStore.getState().setStatus("connecting");
    this.client = new Client({
      brokerURL: brokerUrl(),
      reconnectDelay: 5_000,
      heartbeatIncoming: 10_000,
      heartbeatOutgoing: 10_000,
      onConnect: () => {
        useWebSocketStore.getState().setStatus("connected");
        this.subscriptions.clear();
        for (const symbol of this.listeners.keys()) this.subscribeTopic(symbol);
      },
      onWebSocketClose: () => useWebSocketStore.getState().setStatus("disconnected"),
      onWebSocketError: () => useWebSocketStore.getState().setStatus("error"),
      onStompError: () => useWebSocketStore.getState().setStatus("error"),
    });
    this.client.activate();
  }

  disconnect(): void {
    this.subscriptions.clear();
    if (this.client) void this.client.deactivate();
    this.client = null;
    useWebSocketStore.getState().setStatus("disconnected");
  }

  subscribe(symbol: string, listener: PriceListener): () => void {
    const normalizedSymbol = symbol.toUpperCase();
    const listeners = this.listeners.get(normalizedSymbol) ?? new Set<PriceListener>();
    listeners.add(listener);
    this.listeners.set(normalizedSymbol, listeners);
    this.connect();
    if (this.client?.connected) this.subscribeTopic(normalizedSymbol);

    return () => this.unsubscribe(normalizedSymbol, listener);
  }

  private unsubscribe(symbol: string, listener: PriceListener): void {
    const listeners = this.listeners.get(symbol);
    if (!listeners) return;
    listeners.delete(listener);
    if (listeners.size) return;
    this.listeners.delete(symbol);
    this.subscriptions.get(symbol)?.unsubscribe();
    this.subscriptions.delete(symbol);
    if (!this.listeners.size) this.disconnect();
  }

  private subscribeTopic(symbol: string): void {
    if (!this.client?.connected || this.subscriptions.has(symbol)) return;
    const subscription = this.client.subscribe(`/topic/${symbol}`, (message) => {
      try {
        const payload: unknown = JSON.parse(message.body);
        if (!isPriceResponse(payload)) return;
        this.listeners.get(symbol)?.forEach((listener) => listener(payload));
      } catch {
        // A malformed message must not end a valid market subscription.
      }
    });
    this.subscriptions.set(symbol, subscription);
  }
}

export const marketStream = new MarketStream();
