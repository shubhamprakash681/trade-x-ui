# Frontend Testing

## Commands

```bash
npm run test
npm run test:watch
npm run test:e2e
```

Unit and component tests run in Vitest with jsdom. API-facing tests should use MSW handlers from `src/test/handlers.ts`; they must not call the deployed backend.

Playwright is configured for Chromium. Browser binaries are intentionally not committed; install them on a developer machine or CI runner with `npx playwright install chromium` before running E2E tests. Set `PLAYWRIGHT_START_SERVER=true` to have Playwright start the local Next.js server. The current smoke placeholder is skipped because the authentication and market flows need an isolated backend fixture with seed data.

Coverage priorities for the next additions are login/register failures, stock-search keyboard navigation, buy/sell mutation invalidation, and alert/watchlist workflows.
