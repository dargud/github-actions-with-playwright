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
    await expect(this.welcomeScreen).toBeVisible({ timeout: 60000 });
  }

  async clickDismissButton() {
    await expect(this.dismissBtn).toBeVisible({ timeout: 60000 });
    await this.dismissBtn.click();
    await expect(this.welcomeScreen).not.toBeVisible({ timeout: 60000 });
  }

  async clickStartTourButton() {
    await expect(this.startTourBtn).toBeVisible({ timeout: 60000 });
    await this.startTourBtn.click();
    await expect(this.welcomeScreen).not.toBeVisible({ timeout: 60000 });
  }

  async isTourTipDisplayed() {
    await expect(this.tourTip).toBeVisible({ timeout: 60000 });
  }
}
