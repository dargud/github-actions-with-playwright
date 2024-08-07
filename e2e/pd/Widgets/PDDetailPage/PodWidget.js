import { expect } from '@playwright/test'

export class PodWidget {
    constructor(page) {
        this.page = page;
        this.podName = this.page.locator('[data-testid="pod-name"]');
        this.podAdvisor = this.page.locator('[data-testid="pod-advisor"]');
        this.podDescription = this.page.locator('[data-testid="pod-description"]');
    }

    async isPodNameDisplayed() { 
        await expect(this.podName).toBeVisible(); 
    };

    async isPodAdvisorDisplayed() { 
        await expect(this.podAdvisor).toBeVisible(); 
    };

    async isPodDescriptionDisplayed() { 
        await expect(this.podDescription).toBeVisible(); 
    };
};
