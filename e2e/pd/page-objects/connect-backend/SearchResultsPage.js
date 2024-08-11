import { expect } from "@playwright/test";
import { runtimeConfig } from "../../config";

const { BASE_URL } = runtimeConfig;

export class SearchResultsPage {
  constructor(page) {
    this.page = page;
    this.searchInput = page.locator('input[type="search"]').first();
    this.searchResultItem = page.locator('[class*="list-row_"]').first();
  }

  async isPageDisplayed() {
    await this.page.waitForURL(`${BASE_URL}/search?k=**`);
    await this.page.waitForLoadState("load");
    await expect(this.searchResultItem).toBeVisible({ timeout: 60000 });
  }

  async searchForCourseWithName(searchRequest) {
    await this.searchInput.fill(searchRequest);
    await this.searchInput.press("Enter");
    await expect(this.searchInput).toHaveAttribute("value", searchRequest);
  }

  async openFirstSearchResult() {
    //Click a very first search result
    const firstSearchResult = await this.page
      .locator('a[class*="list-row_"]')
      .first();
    const courseName = await firstSearchResult
      .locator('[class*="content-title_"]')
      .textContent();
    await firstSearchResult.click();

    //Check is the user on the course page
    const pageTitle = await this.page.locator("h1");

    if (courseName != null) {
      await expect(pageTitle).toHaveText(courseName);
    } else {
      console.debug("Course name is empty");
    }
  }

  async clearFilterWithName(name) {
    const clearAllBtn = this.page
      .locator('[class*="filter-item-button_"]')
      .filter({ hasText: name })
      .locator('[class*="icon-close_"]');
    await clearAllBtn.click();
    await expect(clearAllBtn).not.toBeVisible({ timeout: 60000 });
  }

  async clickFilterWithNameAndSelectOption(name, option) {
    const levelBtn = this.page.getByRole("button", { name: name });
    const levelMenuItem = this.page.locator(`[value="${option}"]`);
    const filterResult = this.page.getByRole("button", { name: option });
    await levelBtn.click();
    await levelMenuItem.click();
    await expect(filterResult).toBeVisible({ timeout: 60000 });
  }

  async filterBy(option) {
    const filterBtn = this.page.locator('[class*="filter-item-button_"]');
    const filterMenuItem = this.page
      .locator('[class*="select-item-label_"]')
      .filter({ hasText: option });
    await filterBtn.filter({ hasText: "Best Match" }).click();
    await filterMenuItem.click();
    await expect(filterBtn.filter({ hasText: `${option}` })).toBeVisible({
      timeout: 60000,
    });
  }
}
