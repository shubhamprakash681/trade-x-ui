# TradeX — Backend WebSocket Documentation

> **Source of truth:** `price-stream-service/src/main/java/.../config/WebSocketConfig.java` and `PriceEventHandler.java`

---

## Protocol

| Property          | Value                                                  |
| ----------------- | ------------------------------------------------------ |
| **Protocol**      | **STOMP** over WebSocket                               |
| **Library**       | Spring `@EnableWebSocketMessageBroker`                 |
| **Endpoint**      | `/ws`                                                  |
| **SockJS**        | **Not enabled** — raw WebSocket only (no SockJS fallback) |
| **Authentication**| **Not required** — `/ws` is in the gateway's public path list |

---

## Connection

### URL Pattern

| Environment | URL                                           |
| ----------- | --------------------------------------------- |
| Local       | `ws://localhost:8080/ws`                       |
| Production  | `wss://api.tradex.shubhamprakash681.in/ws`    |

### CORS

Allowed origins configured via `tradex.cors.allowed-origins`:
- `http://localhost:3000`
- `http://127.0.0.1:3000`
- `https://tradex.shubhamprakash681.in`
- `https://www.tradex.shubhamprakash681.in`

### STOMP Configuration

```
Application destination prefix: /app
Simple broker prefix:           /topic
```

**Evidence:** `WebSocketConfig.java`:
```java
registry.enableSimpleBroker("/topic");
registry.setApplicationDestinationPrefixes("/app");
```

---

## Topics

### `/topic/market`

**Description:** Receives all live price ticks for every symbol. Every time the market simulator generates a new price, it is broadcast here.

**Message schema:** `PriceResponse`

```json
{
  "symbol": "RELIANCE",
  "price": 2942.35,
  "previousPrice": 2940.10,
  "changeAmount": 2.25,
  "changePercent": 0.08,
  "synthetic": false,
  "timestamp": "2026-09-05T18:30:15"
}
```

### `/topic/{symbol}`

**Description:** Receives live price ticks for a specific symbol only. Example: `/topic/RELIANCE`, `/topic/TCS`.

**Message schema:** Same `PriceResponse` as above.

---

## TypeScript Types

```typescript
interface PriceTickMessage {
  symbol: string;
  price: number;          // BigDecimal → number
  previousPrice: number;
  changeAmount: number;
  changePercent: number;
  synthetic: boolean;
  timestamp: string;      // LocalDateTime ISO string
}
```

---

## Message Flow

```
Market Service → Kafka (tradex.market.prices) → Price Stream Service → PriceKafkaConsumer
                                                                       → PriceEventHandler
                                                                         → Save to DB (PriceHistory)
                                                                         → Update Redis cache
                                                                         → SimpMessagingTemplate.convertAndSend()
                                                                           → /topic/market
                                                                           → /topic/{symbol}
```

---

## Client Implementation Notes

### Library Choice

Since the backend uses **STOMP** over raw WebSocket (no SockJS), the frontend should use:
- **`@stomp/stompjs`** — modern, maintained STOMP client for browsers
- **Do NOT use** `sockjs-client` — the backend does not register SockJS endpoints

### Connection Example (pseudocode)

```typescript
import { Client } from '@stomp/stompjs';

const client = new Client({
  brokerURL: 'ws://localhost:8080/ws',
  onConnect: () => {
    // Subscribe to all market ticks
    client.subscribe('/topic/market', (message) => {
      const tick: PriceTickMessage = JSON.parse(message.body);
      // handle tick
    });

    // Subscribe to specific symbol
    client.subscribe('/topic/RELIANCE', (message) => {
      const tick: PriceTickMessage = JSON.parse(message.body);
      // handle tick
    });
  },
  onStompError: (frame) => {
    console.error('STOMP error', frame);
  },
});

client.activate();
```

### Reconnection Strategy

`@stomp/stompjs` has built-in reconnection support:

```typescript
const client = new Client({
  brokerURL: wsUrl,
  reconnectDelay: 5000,      // 5 second reconnect delay
  heartbeatIncoming: 10000,  // heartbeat from server
  heartbeatOutgoing: 10000,  // heartbeat to server
});
```

### Key Behaviours

| Behaviour              | Notes                                                 |
| ---------------------- | ----------------------------------------------------- |
| **Authentication**     | Not required for WebSocket (public path in gateway)   |
| **Message format**     | JSON body in STOMP MESSAGE frame                      |
| **Tick frequency**     | Determined by the market simulator; expect periodic ticks per symbol |
| **Heartbeat**          | STOMP heartbeat negotiation supported by the simple broker |
| **No server→client RPC** | Server only sends; no client-to-server messages needed (no `/app` destinations used) |
| **Tab suspend**        | Browser may suspend WS connections; rely on `@stomp/stompjs` auto-reconnect |

---

## Backend Gaps (WebSocket)

> No WebSocket-related backend gaps identified. The WebSocket implementation is complete with:
> - STOMP endpoint at `/ws`
> - Market-wide topic at `/topic/market`
> - Per-symbol topics at `/topic/{symbol}`
> - Full Kafka→WebSocket pipeline
