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
    await this.page.waitForLoadState("domcontentloaded");
    await expect(this.tutorialCard).toBeVisible();
  }

  async openTutorial() {
    await this.page.waitForTimeout(1000);
    await this.tutorialCard.click();
  }

  async isTutorialDisplayed() {
    await this.page.waitForURL(`${BASE_URL}/tutorial/**`);
    await this.page.waitForLoadState("domcontentloaded");
    await expect(this.tutorialContent).toBeVisible();
  }
}
