import { expect } from "@playwright/test";

export class TutorialWidget {
  constructor(page) {
    this.page = page;
    this.welcomeScreen = this.page
      .locator('[class*="learn_welcome_unity_"]')
      .first();
    this.dismissBtn = this.page.locator('button[label="Dismiss"]').first();
    this.startTourBtn = this.page.locator('button[label="Start tour"]').first();
    this.tourTip = this.page.locator('[class*="tour-tip_"]');
  }

  async isWelcomeScreenDisplayed() {
    await expect(this.welcomeScreen).toBeVisible();
  }

  async clickDismissButton() {
    await expect(this.dismissBtn).toBeVisible();
    await this.dismissBtn.click();
    await expect(this.welcomeScreen).not.toBeVisible();
  }

  async clickStartTourButton() {
    await expect(this.startTourBtn).toBeVisible();
    await this.startTourBtn.click();
    await expect(this.welcomeScreen).not.toBeVisible();
  }

  async isTourTipDisplayed() {
    await expect(this.tourTip).toBeVisible();
  }
}
