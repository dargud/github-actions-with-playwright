import { expect } from "@playwright/test";
import { runtimeConfig } from "../../config";

const { BASE_URL } = runtimeConfig;

export class AllProjectsPage {
  constructor(page) {
    this.page = page;
    this.projectCard = this.page.locator('[class*="project-card_"]').first();
    this.projectContent = this.page.locator('[class*="main-info_"]');
  }

  async isPageDisplayed() {
    await this.page.waitForURL(`${BASE_URL}/projects`);
    await this.page.waitForLoadState("networkidle");
    await expect(this.projectCard).toBeVisible();
  }

  async openProject() {
    await this.page.waitForTimeout(1000);
    await this.projectCard.click();
  }

  async isProjectDisplayed() {
    await this.page.waitForURL(`${BASE_URL}/project/**`);
    await this.page.waitForLoadState("networkidle");
    await expect(this.projectContent).toBeVisible();
  }
}
