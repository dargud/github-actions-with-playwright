import { expect } from "@playwright/test";

export class MyLearningPage {
  constructor(page) {
    this.page = page;
    this.welcomeMessage = page.getByRole("heading");
    this.signinButton = page.getByRole("button", { name: "Sign in" }).first();
    this.tabInActiveState = this.page.locator('[class*="active_"]');
  }

  async isPageDisplayed() {
    await expect(await this.page.url()).toContain("/u/");
    await expect(
      this.tabInActiveState.filter({ hasText: "Activity" })
    ).toBeVisible();
  }

  async openTab(name) {
    const tab = this.page.getByRole("button", { name: name }).first();
    await tab.click();
    await expect(this.tabInActiveState.filter({ hasText: name })).toBeVisible();
  }
}
