import { defineConfig, devices } from "@playwright/test";
import "dotenv/config";

export default defineConfig({
  timeout: 60000,
  testDir: "tests/e2e",
  // forbidOnly: !!process.env.CI,
  // retries: process.env.CI ? 1 : 0,
  // workers: process.env.CI ? 1 : 4,
  reporter: "html",
  use: {
    headless: true,
    viewport: { width: 1440, height: 900 },
    actionTimeout: 15000,
    ignoreHTTPSErrors: true,
    video: "off",
    screenshot: "off",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "Chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "Firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "Safari",
      use: { ...devices["Desktop Safari"] },
    },
  ],
});
