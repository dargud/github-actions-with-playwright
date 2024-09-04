import { expect } from "@playwright/test";
import { runtimeConfig } from "../../config";

const { BASE_URL } = runtimeConfig;

export class AllCoursesPage {
  constructor(page) {
    this.page = page;
    this.courseCard = this.page.locator('[class*="course-card_"]').first();
    this.courseContentItem = this.page.locator('[class*="main-info_"]');
  }

  async isPageDisplayed() {
    await this.page.waitForURL(`${BASE_URL}/courses`);
    await this.page.waitForLoadState("domcontentloaded");
    await expect(this.courseCard).toBeVisible({ timeout: 60000 });
  }

  async openCourse() {
    await this.page.waitForTimeout(1000);
    await this.courseCard.click();
  }

  async isCourseDisplayed() {
    await this.page.waitForURL(`${BASE_URL}/course/**`);
    await this.page.waitForLoadState("domcontentloaded");
    await expect(this.courseContentItem).toBeVisible({ timeout: 60000 });
  }
}
