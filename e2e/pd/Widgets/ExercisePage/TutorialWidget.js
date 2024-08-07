import { expect } from "@playwright/test";

export class TutorialWidget {
    constructor(page) {
        this.page = page;
        this.markStepAsCompleteBtn = this.page.getByRole('button', { name: 'Mark step as complete' });
        this.markStepAsIncompleteBtn = this.page.getByRole('button', { name: 'Mark step as incomplete' });
        this.markAllStepsAsCompleteBtn = this.page.getByRole('button', { name: 'Mark all complete and continue' });
        this.startAgainBtn = this.page.getByRole('button', { name: 'Start again' });
    };

    async completeSingleStep() {
        await this.markStepAsCompleteBtn
            .first()
            .click();

        await expect(this.markStepAsIncompleteBtn).toBeVisible();
    };

    async completeAllSteps() {
        await this.markAllStepsAsCompleteBtn.click();
        await expect(this.startAgainBtn).toBeVisible();
    };

    async restartTutorial() {
        await this.startAgainBtn.click();
        await expect(this.markAllStepsAsCompleteBtn).toBeVisible();
    };
};