import { Locator, Page, expect } from "@playwright/test"

export class HeaderOfAnyPage {
    constructor (page) {
        this.page = page;
        this.searchInput = page.getByPlaceholder('What do you want to learn?');
        this.browseDropdownButton = page.getByRole('button', { name: 'Browse' });
    }

    //search some course with Name
    async searchForCourseWithName(page, searchRequest) {
        await this.searchInput.fill(searchRequest);
        await this.searchInput.press('Enter');
        const searchResult = await page.getByRole('searchbox', { name: 'What do you want to learn?' });
        await expect(searchResult).toHaveAttribute('value', searchRequest);
    };

    async clickBrowseAndSelectItem (page, item) {
        await this.browseDropdownButton.click();
        await expect(page.locator('[class="browses-container_2-zC2B4X"]')).toBeVisible({ timeout: 60000 });

        switch (item) {
            case 'Scripting': 
                await page.getByRole('link', { name: 'Scripting' }).click();
                await expect(page.getByRole('searchbox', { name: 'What do you want to learn?' })).toBeVisible({ timeout: 60000 });
                await expect(page.url()).toContain('https://learn.unity.com/search?k=%5B%22tag%3A5814655a090915001868ebec%22%5D');
                break;
            case 'View all Courses': 
                await page.getByRole('link', { name: 'View all Courses' }).click();
                // await expect(page.locator('[class="slider-content_2iZPdBKF"]').first()).toBeVisible({ timeout: 60000 });
                // await expect(page.url()).toContain('https://learn.unity.com/courses');
                break;
            default: 
                break;
        };

        const txt = await pagegetByRole('searchbox', { name: 'What do you want to learn?' });
        await expect(txt).toHaveText('What do you want to learn?');
    };

    async myLearningClick () {
        // await expect(this.page.locator('[href="/u/65624910edbc2a48dcdc7617"]')
        //     .filter({ hasText: 'My Learning'}))
        //     .toBeVisible();
        await this.page.locator('[href="/u/65624910edbc2a48dcdc7617"]')
            .click();
        await expect(this.page.locator('[class="tab-inner_2o0yL8MG"]')
            .filter({ hasText: 'Activity' }))
            .toBeVisible();
        await expect(await this.page.url()).toContain('https://learn.unity.com/u/6464cee2edbc2a02144973d5');
    };

    async logoClick () {
        
    };
};