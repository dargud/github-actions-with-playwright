import { expect } from "@playwright/test";
import { runtimeConfig } from "../../config";

const { BASE_URL } = runtimeConfig;

export class HomePage {
  constructor(page) {
    this.page = page;
    this.signinButton = page.getByRole("button", { name: "Sign in" }).first();
  }

  async isPageDisplayed() {
    const welcomeMessage = this.page.getByRole("heading", {
      name: "Welcome to Unity Learn",
    });
    await this.page.waitForURL(`${BASE_URL}`);
    await this.page.waitForLoadState("load");
    await expect(welcomeMessage).toBeVisible({ timeout: 60000 });
  }

  async clickSigninButton() {
    await this.signinButton.click();
  }

  async isLoggedin() {
    const welcomeMessage = this.page.getByRole("heading", {
      name: "Welcome back e2e-test-user",
    });
    await this.page.waitForURL(`${BASE_URL}`);
    await this.page.waitForLoadState("load");
    await expect(welcomeMessage).toBeVisible({ timeout: 60000 });
  }

  async isLoggedOut() {
    const welcomeMessage = this.page.getByRole("heading", {
      name: "Welcome to Unity Learn",
    });
    await this.page.waitForLoadState("load");
    await expect(welcomeMessage).toBeVisible({ timeout: 60000 });
  }
}
