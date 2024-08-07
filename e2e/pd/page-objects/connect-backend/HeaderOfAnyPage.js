import { expect } from "@playwright/test";
import { runtimeConfig } from "../../config";

const { BASE_URL, ENV } = runtimeConfig;

export class HeaderOfAnyPage {
  constructor(page) {
    this.page = page;
    this.searchInput = page.getByPlaceholder("What do you want to learn?");
    this.browseContainer = page.locator('[class*="browses-container_"]');
  }

  async searchFor(request) {
    await this.searchInput.fill(request);
    await this.searchInput.press("Enter");
    const searchResult = await this.page.getByRole("searchbox", {
      name: "What do you want to learn?",
    });
    await expect(searchResult).toHaveAttribute("value", request);
  }

  async clickMyLearning() {
    let myLearningBtn = this.page.getByRole("link", {
      name: "My Learning",
      exact: true,
    });

    if (await myLearningBtn.isVisible()) {
      await myLearningBtn.click();
    } else {
      myLearningBtn = this.page.getByRole("button", {
        name: "My Learning",
      });
      await myLearningBtn.click();
    }

    await expect(await this.page.url()).toContain("/u/");
    const activityTab = this.page
      .locator('[class*="tab-inner_"]')
      .filter({ hasText: "Activity" });
    await expect(activityTab).toBeVisible();
  }

  async clickPathways() {
    let pathwaysBtn = this.page.getByRole("link", {
      name: "Pathways",
      exact: true,
    });
    await this.page.waitForTimeout(1000);
    await pathwaysBtn.click();
  }

  async clickBrowseAndSelectItem(item) {
    const browseBtn = this.page.getByRole("button", { name: "Browse" }).first();
    const topicItem = this.page.getByRole("link", { name: item }).first();

    await this.page.waitForTimeout(1000);
    await browseBtn.click();
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(1000);
    await topicItem.click();
    await this.page.waitForTimeout(1000);
  }

  async clickLiveButton() {
    let liveBtn = this.page.getByRole("link", { name: "Live", exact: true });
    await this.page.waitForTimeout(1000);
    await liveBtn.click();
  }

  async clickEducatorsHub() {
    const educatorsHeader = this.page
      .getByRole("banner")
      .getByRole("link", { name: "Educator Hub" });
    const accessNowBtn = this.page.getByRole("link", { name: "Access Now" });
    let educatorHubBtn = this.page
      .locator('[class*="headingLink_"]')
      .filter({ hasText: "Educator Hub" });

    await this.page.waitForTimeout(1000);
    if (await educatorHubBtn.isVisible()) {
      await educatorHubBtn.click();
    } else {
      educatorHubBtn = this.page.getByRole("button", { name: "For Educators" });
      await educatorHubBtn.click();

      await this.page.waitForLoadState("networkidle");
      await accessNowBtn.click();
      await this.page.waitForURL(`${BASE_URL}/educators`);
    }

    await this.page.waitForLoadState("networkidle");
    await expect(educatorsHeader).toBeVisible();
  }

  async clickUserMenuButton() {
    let userMenuBtn = this.page.locator('button[aria-label="User Menu"]');
    if (await userMenuBtn.isVisible()) {
      await userMenuBtn.click();
    } else {
      userMenuBtn = this.page.locator('[class="cursor-pointer"]');
      await userMenuBtn.click();
    }

    await expect(this.page.getByText("FAQ", { exact: true })).toBeVisible();
  }

  async selectItemFromUserMenu(item) {
    let userMenuItem = this.page.locator('[class*="item-name_"]');
    if (await userMenuItem.first().isVisible()) {
      await userMenuItem.filter({ hasText: item }).click();
    } else {
      userMenuItem = this.page.locator('button[class*="box-border"]');
      await userMenuItem.filter({ hasText: item }).click();
    }
  }
}
