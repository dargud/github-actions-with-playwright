import { expect, request, test } from '@playwright/test';
import { PDDetailPage } from '../../page-objects/newApp/PDDetailPage'
import { LoginPage } from '../../page-objects/LoginPage';
import { MailSlurp } from 'mailslurp-client';
import { MailslurpWidget } from '../../Widgets/MailslurpWidget';

test.describe('New web app Smoke suite', () => {
    const baseUrl = {
        "dev": process.env.BASE_URL_DEV,
        "stage": process.env.BASE_URL_STG,
        "devLogin": process.env.LOGIN_URL_DEV,
        "stageLogin": process.env.LOGIN_URL_STG
    };

    const key = {
        "dev": process.env.GOOGLE_API_KEY_DEV,
        "stage": process.env.GOOGLE_API_KEY_STG
    };

    const origin = {
        "dev": process.env.ORIGIN_DEV,
        "stage": process.env.ORIGIN_STG
    };

    const adminCredentials = {
        "email": process.env.ADMIN_EMAIL,
        "password": process.env.ADMIN_PASS
    };

    // Test email template
    let email = {
        'id': '', 
        'address': '',
    };

    // Test user
    let user = {
        'id': '',
        'email': process.env.TEST_USER_EMAIL,
        'fullName': 'e2e test user',
        'password': process.env.TEST_USER_PASS
    };

    // Organisation and course data
    const organizationID = process.env.ORGANIZATION_ID;
    const pathId = process.env.PATH_ID;
    const podId = process.env.POD_ID;

    // Test email data
    const apiKey = process.env.SLURP_API_KEY;

    test.beforeEach(async({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.open(baseUrl.devLogin);
        await loginPage.login(user);
        await page.waitForURL(`${origin.dev}/ed-pd/course/unity-pd`);
    });

    test.afterEach(async ({ page }) => {
        await page.close();
    });

    test.skip('API: create a new user', async({ page, request }) => { // TODO: move to the BeforeAll hook
        const loginPage = new LoginPage(page);
        
        // Create test email
        const mailslurp = new MailSlurp({ apiKey });
        const { id, emailAddress } = await mailslurp.createInbox();

        email.id = id;
        email.address = emailAddress;

        user.id = id
        user.email = emailAddress;
        user.password = 'Qwerty1!';

        // console.log(email);
        // console.log(user);

        // Login to get an Admin idToken
        const responseSecondStep = await request.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${key.stage}`, {
            headers: {
                authority: "identitytoolkit.googleapis.com",
                origin: origin.stage
            },
            data: {
                "returnSecureToken": true,
                "email": adminCredentials.email,
                "password": adminCredentials.password,
                "clientType": "CLIENT_TYPE_WEB"
            }
        });
        expect(responseSecondStep.status()).toBe(200);
        const responseBodySecondStep = await responseSecondStep.json();
        const idToken = responseBodySecondStep.idToken; 
        console.log(idToken);

        //Create a new user        
        const responseUserData = await request.post(`${baseUrl.stage}/users/admin/user`, {
            headers: {
                Authorization: `Bearer ${idToken}`
            },
            data: {
                "email": email.address,
                "fullName": user.fullName
            }
        });
        expect(responseUserData.status()).toBe(201);  
        // const responseBodyUserData = await responseUserData.json();
        // const userId = responseBodyUserData.id;
        // console.log('userID: ' + userId)

        // Add entitlements
        const responseEntitlementData = await request.post(`${baseUrl.stage}/entitlements/${pathId}/assign-to-user`, {
            headers: {
                Authorization: `Bearer ${idToken}`
            },
            data: {
                "organizationID": organizationID,
                "entitledUserID": `${userId}` // For some reason it woks only this way. In Postman too.
            }
        });
        expect(responseEntitlementData.status()).toBe(200);

        // Add a course
        const responseCourseData = await request.post(`${baseUrl.stage}/courses/admin/course/${pathId}/add-user`, {
            headers: {
                Authorization: `Bearer ${idToken}`
            },
            data: {
                "userID": `${userId}` // For some reason it woks only this way. In Postman too.
            }
        });
        expect(responseCourseData.status()).toBe(200);

        // Add a pod
        const responsePodData = await request.put(`${baseUrl.stage}/courses/admin/add-user-to-pod`, {
            headers: {
                Authorization: `Bearer ${idToken}`
            },
            data: {
                "userID": `${userId}`, // For some reason it woks only this way. In Postman too.
                "podID": podId
            }
        });
        expect(responsePodData.status()).toBe(200);

        // Login to create a password and get confirmation link
        await loginPage.open(baseUrl.stageLogin);
        await loginPage.sendConfirmationLinkFor(user);
        await page.goto(baseUrl.stageLogin);
        await page.waitForSelector('[id="ui-sign-in-email-input"]');
        await page.fill('[id="ui-sign-in-email-input"]', user.email);
        await page.click('button[type="submit"]');
        await page.waitForSelector('[id="ui-sign-in-name-input"]');
        await page.fill('[id="ui-sign-in-name-input"]', user.fullName);
        await page.fill('[id="ui-sign-in-new-password-input"]', user.password);
        await page.click('button[type="submit"]');

        // Get the confirmation link
        let emailData = await mailslurp.waitForLatestEmail(email.id);

        const body = emailData.body; 
        const extractedLink = body.match(/https?:\/\/(\.)?\b([-a-zA-Z0-9()@:%_\+.~#?&//=;]*)/)[0]; 
        const emailConfirmationLink = extractedLink.replace(/amp;/g, '');
        // console.log(body);
        // console.log("The URL before: " + extractedLink);
        // console.log("The URL after: " + emailConfirmationLink);

        // Confirm account
        await page.goto(emailConfirmationLink);
        await expect(page.getByText('Thank you for verifying your account')).toBeVisible();
    });

    test('The user can sign in with all valid data', async({ page }) => {
        // Covered with beforeEach hook
    });

    test('The user can see the course page after login', async({ page }) => {
        // Covered with beforeEach hook
    });

    test('The user can see the course details', async({ page }) => { // We need to specify what exactly to check
        const onPDDetailPage = new PDDetailPage(page);
        await onPDDetailPage.isCourseDetailsDisplayed();
    });

    test('The user can see the Your Pod details', async({ page }) => { // We need to specify what exactly to check
        const onPDDetailPage = new PDDetailPage(page);
        await onPDDetailPage.isCourseInstructorDetailsDisplayed();
    });

    test('The user can see the Pacing guide', async({ page }) => { // We need to specify what exactly to check
        const onPDDetailPage = new PDDetailPage(page);
        await onPDDetailPage.isCoursePacingGuideDisplayed();
    });

    test('The user can see the Task for a week', async({ page }) => {
        const onPDDetailPage = new PDDetailPage(page);
        await onPDDetailPage.isCoursePacingGuideSectionDisplayed();
    });

    test('The user can complete a single step of weekly task', async({ page }) => {
        const onPDDetailPage = new PDDetailPage(page);
        await onPDDetailPage.completeSingleTutorialStep();
    });

    test('The user can complete all steps of weekly task', async({ page }) => {
        const onPDDetailPage = new PDDetailPage(page);
        await onPDDetailPage.completeAllTutorialSteps();
    });

    test.skip('The user can complete a Tutorial', async({ page }) => {

    });

    test.skip('The user can complete a Exercise', async({ page }) => {
        // To finish Exercise I need at least: 
        // - Exercise test data to pass it
        // - Pass the Captcha
    });

    test.skip('The user can complete a Quiz', async({ page }) => {
        // To finish a Quiz I need at least: 
        // - Quiz answers to pass it
    });

    test.skip('The user can see a week status: Not started', async({ page }) => {
        // I don't know how to get this state for the testing porpose
    });

    test('The user can see a week status: Not complete', async({ page }) => {
        await expect(page.locator('[class="h-fit rounded-xl border px-4 text-sm border-error-extraDark bg-error-extraLight text-error-extraDark"]').first())
            .toBeVisible();
    });

    test.skip('The user can see a week status: In progress', async({ page }) => {
        // I don't know how to get this state for the testing porpose
    });

    test('The user can see a week status: Completed', async({ page }) => {
        await expect(page.locator('[class="h-fit rounded-xl border px-4 text-sm border-success-extraDark bg-success-extraLight text-success-extraDark"]').first())
            .toBeVisible();
    });

    test.skip('The user can complete whole course', async({ page }) => { 
        // To finish a whole course I need at least: 
        // - Exercise test data to pass it
        // - Pass the Captcha
        // - Quiz answers to pass it
    });
});
