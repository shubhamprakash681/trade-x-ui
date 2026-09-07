# TradeX UI Deployment

## Required build-time values

`NEXT_PUBLIC_*` values are embedded into the browser bundle. Provide the production URLs while building the image:

```text
NEXT_PUBLIC_API_BASE_URL=https://api.tradex.example
NEXT_PUBLIC_WS_BASE_URL=https://api.tradex.example
```

The WebSocket client derives `wss://…/ws` from the second value. Do not include a trailing slash.

## Docker

```bash
docker compose build \
  --build-arg NEXT_PUBLIC_API_BASE_URL=https://api.tradex.example \
  --build-arg NEXT_PUBLIC_WS_BASE_URL=https://api.tradex.example
docker compose up -d
```

The image is a non-root Next.js standalone server on port 3000. Put TLS termination/reverse proxy infrastructure in front of it. Proxy `/` to port 3000 and ensure WebSocket upgrade headers are passed for `/ws` at the API origin.

## Release checks

```bash
npm ci
npm run lint
npm run test
npm run build
```

The frontend never contains backend secrets. Configure only public API and WebSocket base URLs in the build environment.
