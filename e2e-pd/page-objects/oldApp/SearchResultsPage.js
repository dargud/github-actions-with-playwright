import { Locator, Page, expect } from "@playwright/test"

exports.SearchResultsPage = class SearchResultsPage {
    constructor (page) {
        this.searchInput = page.locator('input[type="search"]').first();
    }
    // Filter menu items
    async clickTopicsDropdownButtonAndClickItem (page, item) {
        await page.locator('button[class="filter-item-button_3pD52a19"]').click();
        switch (item) {
            default: break;
        };
    };

    //open some course
    async openCourse (page) {
        //Click a very first search result
        const firstSearchResult = await page.locator('a[class="list-row_3UarrcLH"]').first();
        const courseName = await firstSearchResult.locator('.content-title_aMREoBKV').textContent();
        await firstSearchResult.click();
        
        //Check is the user on the course page
        const pageTitle = await page.locator('h1');
        
        if (courseName != null) {
            await expect(pageTitle).toHaveText(courseName);
        } else {
            await expect(pageTitle).toHaveText('fail case'); 
        };
    };
    
    async topicsMenuClearAll (page) {
        await page.locator('[class="filter-item-button_3pD52a19"]')
            .filter({ hasText: 'Topics' })
            .locator('.icon-close_1oqZyAu8')
            .click();
    };

    async searchForCourseWithName (searchRequest) {
        await this.searchInput.fill(searchRequest);
        await this.searchInput.press('Enter');
        // await expect(this.searchInput).toHaveAttribute('value', `${searchRequest}`);
    };

    async clickLevelAndSelectOption (page, option) {
        await page.getByRole('button', { name: 'Level' }).click();
        // await page.locator('[class="filter-item-button_3pD52a19"]')
        //     .filter({ hasText: 'Level' })
        //     .click();
        await page.getByText(`${option}`).first().click();
        // await page.locator('[class="select-item-label_2aepu3fq"]')
        //     .filter({ hasText: `${option}` })
        //     .click();
    };

    async filterByOption (page, option) {
        // await page.locator('[class="filter-item-button_3pD52a19"]')
        //     .filter({ hasText: 'Best Match' })
        //     .click();
        await page.getByRole('button', { name: 'Best Match' }).click();

        // await page.locator('.select-item-label_2aepu3fq')
        //     .filter({ hasText: `${option}` })
        //     .click();
        await page.locator('[value="rated"]').click();

        await expect(page.locator('[class="filter-item-button_3pD52a19"]')
            .filter({ hasText: `${option}` }))
            .toBeVisible();
    };
};