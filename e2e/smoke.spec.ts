import { expect, test } from "@playwright/test";

test.skip("authentication flow requires an isolated backend/MSW browser fixture", async () => {
  await expect(true).toBeTruthy();
});
