import { expect } from "@playwright/test";
import { runtimeConfig } from "../../config";

const { BASE_URL } = runtimeConfig;

export class LivePage {
  constructor(page) {
    this.page = page;
  }

  async isPageDisplayed() {
    await this.page.waitForURL(`${BASE_URL}/live-calendar`);
    // await this.page.waitForLoadState("domcontentloaded");
    await expect(this.page.locator("h1")).toContainText("Learn from experts");
  }
}
