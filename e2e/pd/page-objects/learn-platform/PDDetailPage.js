import { PodWidget } from "../../Widgets/PDDetailPage/PodWidget";
import { CourseWidget } from "../../Widgets/PDDetailPage/CourseWidget";
import { PacingGuideWidget } from "../../Widgets/PDDetailPage/PacingGuideWidget";
import { expect } from "@playwright/test";

export class PDDetailPage {
    constructor(page) {
        this.page = page;
        this.podForm = new PodWidget(page);
        this.courseForm = new CourseWidget(page);
        this.pacingForm = new PacingGuideWidget(page);
    };

    async isCourseInstructorDetailsDisplayed() {
        await this.podForm.isPodNameDisplayed();
        await this.podForm.isPodAdvisorDisplayed();
        await this.podForm.isPodDescriptionDisplayed();
    };

    async isCourseDetailsDisplayed() {
        await this.courseForm.isCourseTitleDisplayed();
        await this.courseForm.isCourseDescriptionDisplayed();
        await this.courseForm.isWelcomeVideoDisplayed();
    };

    async isCoursePacingGuideDisplayed() { 
        await this.pacingForm.isPacingGuideDisplayed(); 
    };
    
    async isCoursePacingGuideSectionDisplayed() { 
        await this.pacingForm.isPacingGuideSectionDisplayed(); 
    };

    async completeSingleTutorialStep() {
        await this.page.locator('button[class="Accordion_accordionToggle__Whi0S"]')
            .first()
            .click();
        await this.page.locator('[class="StatusList_listItemContentWrapper__sWYUC"]')
            .first()
            .click();
        await this.page.waitForSelector('[data-testid="sidebar"]');
        await this.page.getByRole('button', {name: 'Mark step as complete'})
            .first()
            .click();
        await expect(this.page.getByRole('button', {name: 'Mark step as incomplete'}).first()).toBeVisible();
    };

    async completeAllTutorialSteps() {
        await this.page.locator('button[class="Accordion_accordionToggle__Whi0S"]')
            .first()
            .click();
        await this.page.locator('[class="StatusList_listItemContentWrapper__sWYUC"]')
            .first()
            .click();
        await this.page.waitForSelector('[data-testid="sidebar"]');
        await this.page.getByRole('button', {name: 'Mark all complete and continue'})
            .click();
    };

    async completeTutorial() {

    };

    async completeCourse() {

    };
};