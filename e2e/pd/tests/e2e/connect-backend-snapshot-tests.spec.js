import { test, expect } from "@playwright/test";

const baseUrl = "https://learn.unity.com";
const prefix = process.env.PREFIX;

test.describe("Connected BE (not logined user): Snapshot tests", () => {
  test("Connected BE: Home page", async ({ page }) => {
    await page.goto(baseUrl);
    await page.waitForTimeout(1000 * 1);
    await expect(await page.screenshot()).toMatchSnapshot(
      `${prefix}-home-page.png`,
      {
        maxDiffPixels: 100000,
      }
    );
  });

  test("Connected BE: Pathways page", async ({ page }) => {
    await page.goto(`${baseUrl}/pathways`);
    await page.waitForLoadState();
    await expect(await page.screenshot()).toMatchSnapshot(
      `${prefix}-pathways-page.png`,
      {
        maxDiffPixels: 100000,
      }
    );
  });

});
