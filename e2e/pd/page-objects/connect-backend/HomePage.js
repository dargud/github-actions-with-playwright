import { expect } from "@playwright/test";

export class HomePage {
  constructor(page) {
    this.page = page;
    this.welcomeMessage = page.getByRole("heading");
    this.signinButton = page.getByRole("button", { name: "Sign in" }).first();
  }

  async isPageDisplayed() {
    await expect(await this.page.url()).toContain("/u/");
    const activityTab = this.page
      .locator('[class*="tab-inner_"]')
      .filter({ hasText: "Activity" });
    await expect(activityTab).toBeVisible();
  }

  async clickSigninButton() {
    await this.signinButton.click();
  }

  async isLoggedin() {
    const welcomeMessage = this.page.getByRole("heading", {
      name: "Welcome back e2e-test-user",
    });
    await expect(welcomeMessage).toBeVisible({ timeout: 60000 });
  }

  async isLoggedOut() {
    const welcomeMessage = this.page.getByRole("heading", {
      name: "Welcome to Unity Learn",
    });
    await expect(welcomeMessage).toBeVisible({ timeout: 60000 });
  }
}
