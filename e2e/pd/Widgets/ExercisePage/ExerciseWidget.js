export class ExerciseWidget {
    constructor(page) {
        this.page = page;
        this.markStepAsCompleteBtn = this.page.getByRole('button', { name: 'Mark step as complete' });
        this.markStepAsIncompleteBtn = this.page.getByRole('button', { name: 'Mark step as incomplete' });
        this.uploadFile = this.page.locator('label[for="file-upload"]');
        this.mediaUrl = this.page.locator('input[id="mediaUrl"]');
        this.submissionTitle = this.page.locator('input[id="title"]');
        this.submissionDescription = this.page.locator('[id="description"]');
        this.viewableByPublic = this.page.locator('[value="public"]');
        this.viewableByPrivate = this.page.locator('[value="private"]');
        this.saveAndPreviewSubmissionBtn = this.page.getByRole('button', { name: 'Save and Preview Submission' });
        
        this.submitAndContinueBtn = this.page.getByRole('button', { name: 'Submit and continue' });
        this.continueWithoutSubmittingBtn = this.page.getByRole('button', { name: 'Continue without submitting' });
    };

    async completeSingleStep() {
        await this.markStepAsCompleteBtn
            .first()
            .click();

        await expect(this.markStepAsIncompleteBtn).toBeVisible();
    };

    async fillSubmissionWithFile() {
        // Upload file 
    };

    async fillSubmissionWithLink() {
        await this.mediaUrl.fill('someMediaURL.com'); // Add a valid media URL
        await this.submissionTitle.fill('Submission title');
        await this.submissionDescription.fill('Submission description');
        await this.viewableByPublic.click()
        await this.saveAndPreviewSubmissionBtn.click();
        // TODO: check how to handle the Captcha step
        await this.submitAndContinueBtn.click();
    };
};