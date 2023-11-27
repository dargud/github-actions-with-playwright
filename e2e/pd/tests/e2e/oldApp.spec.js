import { expect, test } from '@playwright/test'
import { LearnPage } from '../../page-objects/oldApp/LearnPage.js';
import { SearchResultsPage } from '../../page-objects/oldApp/SearchResultsPage.js';
import { HeaderOfAnyPage } from '../../page-objects/oldApp/HeaderOfAnyPage.js';
import { AllCoursesPage } from '../../page-objects/oldApp/AllCoursesPage.js';
import { SingleCoursePage } from '../../page-objects/oldApp/SingleCoursePage.js';
import { SingleTutorialPage, TutorialPage } from '../../page-objects/oldApp/SingleTutorialPage.js';
import { AllPathwaysPage } from '../../page-objects/oldApp/AllPathwaysPage.js';
import { SinglePathwayPage } from '../../page-objects/oldApp/SinglePathwayPage.js';

test.describe('Smoke test suite, without logged in user', () => { 
    test.beforeEach(async ({ page }) => {
        test.slow(); //Delete after page performance improvements 
        let onLearnPage = new LearnPage (page);

        //Prepare the page for tests:
        await page.goto(process.env.URLPROD);
        await expect(page).toHaveURL(process.env.URLPROD);
        await onLearnPage.clickDismissButton();
        await onLearnPage.isMessageDisplayed('Welcome to Unity Learn');
    });

    test('Browse and Search for Content @Smoke', async ({ page }) => {
        // As a learner, I can browse content, browse topics, and search.

        test.slow(); //Delete after page performance improvements 
        let onLearnPage = new LearnPage (page);
        let onHeader = new HeaderOfAnyPage (page);
        let onSearchResultsPage = new SearchResultsPage (page);

        // Load https://learn.unity.com
        // A part of beforeEach hook

        // Scroll down to Featured Content and click on a card
        // await onLearnPage.openFeaturedContentPage(page);

        // const contentName = await page.locator('.slider-title')
        //     .first()
        //     .textContent();
        await page.locator('[aria-label="carousel"]').click();
        // const contentPageName = await page.locator('h1').textContent();
        // await expect(contentPageName).toContain(contentName);

        // Select Browse from top navigation and choose a topic (e.g. Scripting)
        // await onHeader.clickBrowseAndSelectItem(page, 'Scripting');

        // Open the Browse menu
        await page.getByRole('button', { name: 'Browse' }).click();
        await expect(page.locator('[class="browses-container_2-zC2B4X"]')).toBeVisible();

        // Open the Scripting page
        await page.getByRole('link', { name:  'Scripting' })
            .first()
            .click();
        await expect(page.getByRole('searchbox', { name: 'What do you want to learn?' })).toBeVisible();
        await expect(page.url()).toContain('https://learn.unity.com/search?k=%5B%22tag%3A5814655a090915001868ebec%22%5D');

        // Un-select topic from drop-down menu, type "Cinemachine" into keyword field, 
        // and press return
        await onSearchResultsPage.topicsMenuClearAll(page);    
        await onSearchResultsPage.searchForCourseWithName('Cinemachine');
        // Select "Intermediate" level from drop-down menu
        await onSearchResultsPage.clickLevelAndSelectOption(page, 'Intermediate');
        // Select "Top Rated" sorting option
        await onSearchResultsPage.filterByOption(page, 'Top Rated');
    });

    test.afterEach(async ({ page }) => {
        await page.close();
    });
});

test.describe('Smoke test suite, with loginned user', () => {
    test.beforeEach(async ({ page }) => {
        test.slow(); //Delete after page performance improvements 
        let onLearnPage = new LearnPage (page);

        //Prepare the page for the login:
        await page.goto('https://learn.unity.com');
        await expect(page).toHaveURL('https://learn.unity.com');
        await onLearnPage.clickDismissButton();
        await onLearnPage.isMessageDisplayed('Welcome to Unity Learn');
        await onLearnPage.clickSigninButton();

        //Work with the login iFrame:
        await onLearnPage.addEmail('daryna.gudyma@unity3d.com');
        await onLearnPage.addPassword('Cartier1992');
        await onLearnPage.confirmLogin();
        await onLearnPage.isLoggedin(page);
    });

    test('Unity ID Sign In @Smoke', async ({ page }) => {
        // As a learner, I want to sign in to track my learning progress
        let onHeader = new HeaderOfAnyPage (page);

        // Load https://learn.unity.com
        // If already signed in, select "sign out" from profile menu
        // Select "Sign in" from profile drop down menu
        // Fill appropriate Unity ID credentials and click "sign in" button
        // ~ The part above is covered by before each hook ~

        // Visit "My Learning" in top navigation
        await onHeader.myLearningClick(page);
    });

    test('View and Start a Course @Smoke', async ({ page }) => {
        // As a learner, I want to view courses on the platform, 
        // and "start" a course to add it to the My Learning dashboard
        let onHeader = new HeaderOfAnyPage (page);
        let onAllCoursesPage = new AllCoursesPage (page);
        let onCoursePage = new SingleCoursePage (page);

        // Repeat Test Case 2a-2d to sign in
        // ~ The part above is covered by before each hook ~

        // Select Browse from the top navigation, select "Course," 
        // and select "Browse all courses"
        // await onHeader.clickBrowseAndSelectItem(page, 'View all Courses');
        await page.getByRole('button', { name: 'Browse' }).click();
        await expect(page.locator('[class="browses-container_2-zC2B4X"]')).toBeVisible({ timeout: 60000 });
        await page.getByRole('link', { name: 'View all Courses' }).click();
        // await expect(page.locator('[class="slider-content_2iZPdBKF"]').first()).toBeVisible({ timeout: 60000 });
        await expect(page.url()).toContain('https://learn.unity.com/courses');

        // // Click on a the card image for any course not yet started
        // await onAllCoursesPage.openCourse(page);
        const courseName = await page.locator('[class="title_1VxiLhbY"]')
            .first()
            .textContent();
        await page.locator('[class="card-content_1UQ-eWB2"]')
            .first()
            .click();
        await page.waitForSelector('h1');
        const txt = await page.locator('[class="title_1-ELah66"]').textContent();
        await expect(txt).toContain(courseName);

        // Click into a project or tutorial within the course. If a project, 
        // click into a tutorial whin the project.
        // await onCoursePage.tutorialOpen();
        await page.locator('.side-bar_2e52vwUL')
            .filter({ hasText: 'Tutorial'})
            .first()
            .click();

        // Scroll down to tutorial steps and click "mark step as completed"
        // await onCoursePage.markStepAsCompleted();
        await page.waitForSelector('button[label="Mark step as completed"]');
        await page.locator('button[label="Mark step as completed"]')
            .first()
            .click();
        await expect(page.locator('[class="dot_n92J-EQX completed_3PTIgtA-"]'))
            .toBeVisible();
        // await page.waitForSelector('[class="dot_n92J-EQX completed_3PTIgtA-"]');

        // Return to Learn homepage
        // await onHeader.logoClick();
        await page.locator('[class="logo_18ZLO9NM"]').click();
        // await page.waitForSelector('[class="main_2loOtLwr"]');
        await expect(page.getByRole('heading', { name: 'Welcome back Daryna Gudyma' }))
            .toBeVisible({ timeout: 60000 });

        // Visit "My Learning" in top navigation
        // await onHeader.myLearningClick();
        await onHeader.myLearningClick(page);
        await expect(page.locator('[class="activity-recent_3azCplJS"]')).toBeVisible();

        // Delete test data
        // await page.waitForSelector('[[class="view-all_amLfULk0"]]');
        await page.getByRole('link', { name: 'View all' })
            .first()
            .click();
        await page.waitForSelector('[class="item-card_39fK3ctv"]');
        await page.locator('[class="item-card_39fK3ctv"]').first().click();
        await page.locator('button[label="Mark step as incomplete"]')
            .first()
            .click();
        await onHeader.myLearningClick(page);
        await page.getByRole('link', { name: 'View all' }).click();
        await page.waitForSelector('[class="item-card_39fK3ctv"]');
        await page.locator('[class="item-display_L7867QW9"]').click();
        await page.locator('[class="hidden-button_1-kkpX0b"]').click();
    });

    test('Complete and evaluate a Tutorial @Smoke', async ({ page }) => { // Need to handle the test data deleting. A part ot steps are commented.
        // As a learner, I want to mark tutorials complete 
        // and provide my feedback to the content creators
        let onHeader = new HeaderOfAnyPage (page);
        let onAllCoursesPage = new AllCoursesPage (page);
        let onCoursePage = new SingleCoursePage (page);

        // Open a tutorial page and click one required step complete, or repeat test case 3a-3e
        // Select Browse from the top navigation, select "Course," 
        // and select "Browse all courses"
        // await onHeader.clickBrowseAndSelectItem(page, 'View all Courses');
        await page.getByRole('button', { name: 'Browse' }).click();
        await expect(page.locator('[class="browses-container_2-zC2B4X"]')).toBeVisible({ timeout: 60000 });
        await page.getByRole('link', { name: 'View all Courses' }).click();
        // await expect(page.locator('[class="slider-content_2iZPdBKF"]').first()).toBeVisible({ timeout: 60000 });
        await expect(page.url()).toContain('https://learn.unity.com/courses');

        // // Click on a the card image for any course not yet started
        // await onAllCoursesPage.openCourse(page);
        const courseName = await page.locator('[class="title_1VxiLhbY"]')
            .first()
            .textContent();
        await page.locator('[class="card-content_1UQ-eWB2"]')
            .first()
            .click();
        await page.waitForSelector('h1');
        const txt = await page.locator('[class="title_1-ELah66"]').textContent();
        await expect(txt).toContain(courseName);

        // Click into a project or tutorial within the course. If a project, 
        // click into a tutorial whin the project.
        // await onCoursePage.tutorialOpen();
        await page.locator('.side-bar_2e52vwUL')
            .filter({ hasText: 'Tutorial'})
            .last()
            .click();

        // Scroll down to tutorial steps and click "mark step as completed"
        // await onCoursePage.markStepAsCompleted();
        await page.waitForSelector('button[label="Mark step as completed"]');
        await page.locator('button[label="Mark step as completed"]')
            .first()
            .click();
        await expect(page.locator('[class="dot_n92J-EQX completed_3PTIgtA-"]'))
            .toBeVisible();
        // await page.waitForSelector('[class="dot_n92J-EQX completed_3PTIgtA-"]');

        // ~~~~~~~~

        // Scroll to final required step in tutorial and click "mark all complete and continue"
        // await onCoursePage.markAllStepsAsCompleted();
        await page.locator('button[label="Mark all complete and continue"]')
            .click();
        // await page.waitForSelector('[class="thumbnail_JHcHx79V completed_2HqeXUcR"]');
        // await expect(page.locator('[class="thumbnail_JHcHx79V completed_2HqeXUcR"]'))
        //     .first()
        //     .toBeVisible();

        // ~~~ CANNOT BE PASSED BEFORE TEST DATA DELETE ~~~
 
        // // Click "OK" to continue from XP Earned modal (if shown)
        // // await onCoursePage.xpEarnedClickOK();
        // await expect(page.locator('[class="title_1jeH3zOJ"]')
        //     .filter({ hasText: 'XP Earned' }))
        //     .first()
        //     .toBeVisible();
        // await page.locator('button[label="continue"]')
        //     .first()
        //     .click();

        // // Select one of the emoji options
        // // await onCoursePage.setEmojy(page, 'Starry');
        // await expect(page.locator('[class="summary-feedback_1KtCsTos"]')
        //     .first())
        //     .toBeVisible();
        // await page.locator('.botton-smiling').click();
        // await expect(page.locator('[class="feedback-form_3cNYkKcA"]')
        //     .first())
        //     .toBeVisible();

        // // Select one of the "Why did you choose this rating" options, 
        // // await onCoursePage.whyDidYouChooseThisRatingWithOption(page, '<Option>');
        // await page.locator('input[type="radio"]')
        //     .filter({ hasText: 'Clear instructions' })
        //     .first()
        //     .click();
        // await expect(page.locator('input[type="radio"]')
        //     .filter({ hasText: 'Clear instructions' })
        //     .first())
        //     .toBeChecked();

        // // type feedback into the text field, and click "Submit feedback and continue"
        // // await onCoursePage.fillInCommentWithText('<some test text>');
        // // await onCoursePage.submitFeedbackAndContinue();
        // await page.locator('textarea[placeholder="Explain your rating to help us improve our content"]')
        //     .first()
        //     .fill("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.");
        // await page.locator('[label="Submit feedback and continue"]')
        //     .first()
        //     .click();
        // await expect(page.locator('[class="summary-feedback_1KtCsTos"]')
        //     .first())
        //     .not
        //     .toBeVisible();

        // Clear test data:
        // Restart completed course
        await onHeader.myLearningClick(page);
        await page.locator('button[class="tab_2SDQIqg1"]')
            .filter({ hasText: 'Completed' })
            .click();
        await page.waitForSelector('[class="item-card-inner_1dD27GyL"]');
        await page.locator('[class="item-card-inner_1dD27GyL"]').click();
        await page.locator('button[label="Start again"]').click();

        // Delete the course from In Progress
        await onHeader.myLearningClick(page);
        await page.getByRole('link', { name: 'View all' }).click();
        await page.waitForSelector('[class="item-card_39fK3ctv"]');
        await page.locator('[class="item-display_L7867QW9"]').click();
        await page.locator('[class="hidden-button_1-kkpX0b"]').click();
    });

    test('Add a Comment @Smoke', async ({ page }) => {
        // As a learner, I want to read and add comments related to the steps of a tutorial
        let onLearnPage = new LearnPage (page);
        let onTutorialPage = new SingleTutorialPage (page);

        // Repeat Test Case 2a-2d to sign in
        // ~ The part above is covered by before each hook ~

        // Navigate to any tutorial, e.g. click one of the tutorials 
        // from the "Get Rolling with Bite Sized Lessons" element on Homepage
        // await onLearnPage.openBitesizeTutorial();
        await page.waitForSelector('[class="lesson-item_166RM3e5"]');
        const courseName = await page.locator('[class="lesson-item_166RM3e5"]')
            .first()
            .filter({ hasText: 'Get ready for Unity Essentials' })
            .textContent();
        await page.locator('[class="lesson-item_166RM3e5"]')
            .filter({ hasText: 'Get ready for Unity Essentials' })
            .click();
        await page.waitForSelector('h1');
        const txt = await page.locator('[class="title_1-ELah66"]').textContent();
        await expect(txt).toContain(courseName);        

        // Click Comment icon in top right to open Comments drawer
        // await onTutorialPage.commentOpen();
        await page.waitForSelector('[class="operate-item_2n9Aii70 comment_cJLWS9eS"]');
        await page.locator('[class="operate-item_2n9Aii70 comment_cJLWS9eS"]').click();
        await expect(page.locator('[class="drawer-container_3HcXgi5X"]')).toBeVisible();

        // Close comments drawer
        // await onTutorialPage.commentClose();
        await page.locator('[class="button-close_3TlmZZrh"]').click();
        // await expect(page.locator('[class="drawer-container_3HcXgi5X"]')).not.toBeVisible();

        // Scroll down to first step in the tutorial 
        // and click the comments icon below the step name
        // await onTutorialPage.tutorialCommentOpen();
        await page.locator('[class="operate-item_3uNVhOzv"]')
            .first()
            .click();
        await expect(page.locator('[class="drawer-container_3HcXgi5X"]')).toBeVisible();

        // Type comment into text field and click "Comment"
        // await onTutorialPage.tutorialCommentFillInWithText('some test text');
        // await onTutorialPage.tutorialCommentConfirm();
        await page.getByRole('textbox', { name: 'Ask a question or leave a comment on this step…' })
            .fill('Lorem Ipsum is simply dummy text of the printing and typesetting industry.');
        await expect(page.getByRole('button', { name: 'Comment', exact: true }))
            .toBeEnabled();
        await page.getByRole('button', { name: 'Comment', exact: true })
            .click();
        await expect(page.getByText('Lorem Ipsum is simply dummy text of the printing and typesetting industry.'))
            .toBeVisible();

        // Delete test content:
        await page.getByText('Lorem Ipsum is simply dummy text of the printing and typesetting industry.').hover();
        await page.getByRole('button', { name: 'Delete' })
            .first()
            .click();
        await expect(page.locator('[class="dialog-contents_3sffEnR5"]')).toBeVisible();
        await page.locator('button[label="Yes"]').click();
    });

    test.skip('Complete a Quiz @Smoke', async ({ page }) => { // Need the list of right answers here
        // As a learner, I want to submit responses to questions in a quiz, and pass the quiz if I meet the minimum number of correct answers

        // Repeat Test Case 2a-2d to sign in
        // ~ The part above is covered by before each hook ~

        // Navigate to any quiz, e.g. load https://learn.unity.com/quiz/explore-unity-quiz
        await page.goto('https://learn.unity.com/quiz/explore-unity-quiz');
        // If quiz has already been attempted, and a retake is possible, click "Retake Quiz" button
        // Provide responses to all of the questions in the quiz. Provide fewer than the number of required correct answers to pass. 
        await page.waitForSelector('[class="question-card_eJa7ogVg"]');

        // Click "Submit Answers" 
        
        // Dismiss modal
        
        // Wait until cooldown period is over (if necessary), click "Retake Quiz" button. 
        
        // Provide responses to all questions. Provide more than the number of required correct answers. Click "Submit Answers"
    });

    test.skip('Upload an Exercise Submission @Smoke', async ({ page }) => { // Temporarily blocked by Capcha
        // As a learner, I can submit a project to a WebGL-based exercise.
        let onTutorialPage = new SingleTutorialPage (page);

        // Repeat Test Case 2a-2d to sign in
        // ~ The part above is covered by before each hook ~

        // Navigate to a WebGL-based "exercise", e.g. load: https://learn.unity.com/tutorial/challenge-sprite-pachinko?labelRequired=true&pathwayId=5f7bcab4edbc2a0023e9c38f&missionId=5f777d9bedbc2a001f6f5ec7
        await page.goto('https://learn.unity.com/tutorial/challenge-sprite-pachinko?labelRequired=true&pathwayId=5f7bcab4edbc2a0023e9c38f&missionId=5f777d9bedbc2a001f6f5ec7');
        await page.waitForSelector('button[label="Mark step as completed"]');
        // Mark all required steps complete that appear before the Submission step
        // await onTutorialPage.markAllStepsAsCompleted();
        await page.getByRole('button', { name: 'Mark step as completed' })
            .first()
            .click();
        await expect(page.locator('button[label="Mark step as completed"]').first()).not.toBeVisible();

        // await page.waitForSelector('button[label="Mark step as completed"]').first()
        await page.getByRole('button', { name: 'Mark step as completed' })
            .nth(1)
            .click();

        await page.getByRole('button', { name: 'Mark step as completed' })
            .last()
            .click();      

        // Scroll down to Submission Step. Paste a valid link to 
        // a WebGL project hosted on Unity Play, e.g. https://play.unity.com/mg/fps/boomer-shooter, 
        // enter some text in the description, then click "Save and Preview Submission"
        // await onTutorialPage.addWebGLLink('https://play.unity.com/mg/fps/boomer-shooter');
        // await onTutorialPage.addDiscription('some test description');
        await page.locator('input[placeholder="Insert WebGL URL"]').fill('https://play.unity.com/mg/fps/boomer-shooter');
        // await page.waitForSelector('[class="card-link_I-F39_bx"]');
        // await expect(page.locator('[class="card-link_I-F39_bx"]')).toBeVisible();
        await page.locator('textarea[limit="300"]').fill('Some valid discription');
        await page.locator('[class="container_2vk1nNna"]')
            .first()
            .click();
        await page.locator('button[label="Save and preview submission"]').click();
        await page.waitForSelector('[class="submission-card_1XhJCIll"]');

        // Scroll down to Submission Preview. 
        // Complete captcha challenge. 
        // Click "Submit and Continue"
        // await onTutorialPage.setViewableBy('<Option>');
        // await onTutorialPage.clickSaveAndPreviewSubmission();

        // Exit completion modal and scroll down to Submission Gallery
        // ~~~ need to doble check this step ~~~

        // Delete test data:
        // await page.goto('https://learn.unity.com/tutorial/challenge-sprite-pachinko?labelRequired=true&pathwayId=5f7bcab4edbc2a0023e9c38f&missionId=5f777d9bedbc2a001f6f5ec7');
        // await page.locator('button[label="Mark step as incomplete"]')
        //     .first()
        //     .click();

        // await page.locator('button[label="Mark step as incomplete"]')
        //     .nth(1)
        //     .click();

        // await page.locator('button[label="Mark step as incomplete"]')
        //     .nth(2)
        //     .click();
    });

    test('Resume a Pathway @Smoke', async ({ page }) => {
        // As a learner, I want to resume a Pathway I have started in the same content where I last had activity.
        let onLearnPage = new LearnPage (page);
        let onHeader = new HeaderOfAnyPage (page);
        let onAllPathwaysPage = new AllPathwaysPage (page);
        let onPathwayPage = new SinglePathwayPage (page);

        // Repeat Test Case 2a-2d to sign in
        // ~ The part above is covered by before each hook ~

        // If a pathway is not started, navigate to a pathway and click "Start Pathway"
        // await onHeader.pathwaysClick();
        await page.getByRole('link', {name: 'Pathways'}).click();
        await expect(page).toHaveURL('https://learn.unity.com/pathways');

        // Select a content set within the mission and click "start mission"
        // await onAllPathwaysPage.openPathwayWithName('<Name>');
        await page.getByRole('link', {name: 'Unity Essentials Pathway'}).click();
        // await onPathwayPage.startPathway();
        // await page.getByRole('button', {hasText: 'Start Pathway'}).click();
        await page.locator('[class="button_3FcydOnq size-default_2EFLx8BH primary_3v9qoGld"]').click();

        // Using left-rail navigation, skip ahead to a later tutorial in the content set.
        // Mark one step of that tutorial as complete.
        // await onPathwayPage.markStepAsCompleted();
        await page.locator('button[label="Resume mission"]')
            .first()
            .click();
        await page.waitForSelector('button[label="Mark step as completed"]');
        await page.getByRole('button', { name: 'Mark step as completed' })
            .first()
            .click();

        // Close site and browser. Reopen and return to Learn. Sign in if necessary.
        //Prepare the page for the login:
        await page.goto('https://learn.unity.com');
        await expect(page).toHaveURL('https://learn.unity.com');
        await onLearnPage.isLoggedin(page);

        // Click on the Pathway card in the Your Pathway section
        // await onLearnPage.openPathway();
        await page.waitForSelector('[class="pathway_2B08MQ79"]');
        await expect(page.locator('[class="pathway_2B08MQ79"]')).toBeVisible();

        // await page.locator('[class="pathway_2B08MQ79"]').click();
        // await expect(page.locator('button[label="Resume mission"]')).toBeVisible();
        
        // Delete test data:
        await onHeader.myLearningClick(page);
        await page.waitForSelector('[class="item-card_39fK3ctv"]');
        await page.locator('[class="item-card_39fK3ctv"]').click();
        await page.locator('button[label="Mark step as incomplete"]').click();
        await onHeader.myLearningClick(page);
        await page.getByRole('link', { name: 'View all' }).click();
        await page.waitForSelector('[class="item-card_39fK3ctv"]');
        await page.locator('[class="item-display_L7867QW9"]').click();
        await page.locator('[class="hidden-button_1-kkpX0b"]').click();
    });

    test.skip('Complete a Pathway @Smoke', async ({ page }) => { // Temporarily blocked by Capcha
        // As a learner, I want to complete a pathway by completing all Missions and Pathway checkpoints in the Pathway.
        
        // Repeat Test Case 2a-2d to sign in
        // ~ The part above is covered by before each hook ~

        // Repeat Test Case 8b-g for all Missions in the Pathway

        // Complete ALL Pathway checkpoint assessments (projects added to all exercises, all quizzes passed)
        // Navigate to homepage
        // Navigate to My Learning
    });

    test.afterEach(async ({ page }) => {
        await page.close();
    });
});