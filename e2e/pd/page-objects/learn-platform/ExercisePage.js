import { PodWidget } from "../../Widgets/PDDetailPage/PodWidget";
import { CourseWidget } from "../../Widgets/PDDetailPage/CourseWidget";
import { PacingGuideWidget } from "../../Widgets/PDDetailPage/PacingGuideWidget";

export class ExercisePage {
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

    async isCoursePacingGuideDisplayed() { await this.pacingForm.isPacingGuideDisplayed(); };
    async isCoursePacingGuideSectionDisplayed() { await this.pacingForm.isPacingGuideSectionDisplayed(); };

    async completeSingleTutoriaStep() {

    }

    async completeAllTutoriaSteps() {

    }

    async completeAllTutoriaSteps() {

    }

    async completeCourse() {

    }
};