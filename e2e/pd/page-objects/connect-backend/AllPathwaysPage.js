import { expect } from "@playwright/test";
import { runtimeConfig } from "../../config";

const { BASE_URL } = runtimeConfig;

export class AllPathwaysPage {
  constructor(page) {
    this.page = page;
    this.pathWayCard = this.page.getByRole("link", {
      name: "Creative Core Pathway",
    });
    this.pathWayContent = this.page.locator('[class*="pathwayStats_"]').first();
  }

  async isPageDisplayed() {
    await this.page.waitForURL(`${BASE_URL}/pathways`);
    await this.page.waitForLoadState("domcontentloaded");
    await expect(this.pathWayCard).toBeVisible({ timeout: 60000 });
  }

  async openPathway() {
    await this.page.waitForTimeout(1000);
    await this.pathWayCard.click();
  }

  async isPathwayDisplayed() {
    await this.page.waitForURL(`${BASE_URL}/pathway/**`);
    await this.page.waitForLoadState("domcontentloaded");
    await expect(this.pathWayContent).toBeVisible({ timeout: 60000 });
  }
}
