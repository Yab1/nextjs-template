import { defineConfig, devices } from "@playwright/test";

// Playwright's own config. The app reads env only in src/env/server.ts.
// eslint-disable-next-line n/no-process-env
const ci = process.env.CI === "true";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: ci,
  retries: ci ? 1 : 0,
  use: {
    baseURL: "http://127.0.0.1:3001",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "yarn start --port 3001",
    url: "http://127.0.0.1:3001",
    reuseExistingServer: !ci,
    timeout: 120_000,
  },
});
