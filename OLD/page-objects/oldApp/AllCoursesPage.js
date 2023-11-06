import { Locator, Page, expect } from "@playwright/test"

exports.AllCoursesPage = class AllCoursesPage {
    constructor (page) {

    };

    async openCourse (page) {
        await page.locator('[class="card-content_1UQ-eWB2"]')
            .first()
            .click();
    };
};