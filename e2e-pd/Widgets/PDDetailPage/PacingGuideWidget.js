import { expect } from "@playwright/test";

exports.PacingGuideWidget = class PacingGuideWidget {
    constructor(page) {
        this.page = page;
        this.pacingGuide = this.page.locator('[class="md:max-w-lg"]');
        this.pacingGuideSection = this.page.locator('button[class="Accordion_accordionToggle__Whi0S"]');
        this.openAccordionBtn = this.page.locator('[class="Accordion_icon__rHFRy"]');
        this.pacingStep = this.page.locator('[class="StatusList_listItemContent-md__4b4uV"]');
    };

    async isPacingGuideDisplayed() { 
        await expect(this.pacingGuide).toBeVisible() 
    };

    async isPacingGuideSectionDisplayed() { 
        await expect(this.pacingGuideSection.first()).toBeVisible() 
    };

    async openAccordionOfWeek(week = 0) {
        await this.openAccordionBtn
            .nth(week)
            .click();
    };

    async openTutorial() {
        this.pacingStep
            .filter({ 'hasText': 'Tutorial' })
            .first()
            .click();
    };

    async openExercise() {
        this.pacingStep
            .filter({ 'hasText': 'Exercise' })
            .first()
            .click();
    };

    async openQuiz() {
        this.pacingStep
            .filter({ 'hasText': 'Quiz' })
            .first()
            .click();
    };
};