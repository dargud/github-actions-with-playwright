import { expect } from "@playwright/test";

export class Cookie {
  constructor(page) {
    this.page = page;
    this.banner = this.page.locator('[id="onetrust-banner-sdk"]');
    this.acceptAllBtn = this.page.locator('[id="onetrust-accept-btn-handler"]');
  }

  async hide() {
    if (await this.banner.isVisible()) {
      await this.acceptAllBtn.click();
      await expect(this.banner).toBeHidden();
    }
  }
}
