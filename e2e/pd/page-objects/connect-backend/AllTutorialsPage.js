import { expect } from "@playwright/test";
import { runtimeConfig } from "../../config";

const { BASE_URL } = runtimeConfig;

export class AllTutorialsPage {
  constructor(page) {
    this.page = page;
    this.tutorialCard = this.page.locator('[class*="tutorial-card_"]').first();
    this.tutorialContent = this.page.locator('[class*="main-info_"]');
  }

  async isPageDisplayed() {
    await this.page.waitForURL(`${BASE_URL}/tutorials`);
    await this.page.waitForLoadState("load");
    await expect(this.tutorialCard).toBeVisible({ timeout: 60000 });
  }

  async openTutorial() {
    await this.page.waitForTimeout(500);
    await this.tutorialCard.click();
  }

  async isTutorialDisplayed() {
    await this.page.waitForURL(`${BASE_URL}/tutorial/**`);
    await this.page.waitForLoadState("load");
    await expect(this.tutorialContent).toBeVisible({ timeout: 60000 });
  }
}
