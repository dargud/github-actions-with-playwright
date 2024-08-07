import { expect } from "@playwright/test";

export class CourseWidget {
    constructor(page) {
        this.page = page;
        this.courseTitle = this.page.locator('[class="flex flex-col"]');
        this.courseDescription = this.page.locator('[class="mt-4 text-base font-normal leading-7"]');
        this.welcomeVideo = this.page.locator('[id="vjs_video_3_html5_api"]');
    };

    async isCourseTitleDisplayed() { 
        await expect(this.courseTitle.first()).toBeVisible(); 
    };

    async isCourseDescriptionDisplayed() { 
        await expect(this.courseDescription).toBeVisible(); 
    };

    async isWelcomeVideoDisplayed() { 
        await expect(this.welcomeVideo).toBeVisible(); 
    }; 
};