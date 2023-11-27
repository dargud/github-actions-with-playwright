import { expect, request, test } from '@playwright/test';
import { PDDetailPage } from '../../page-objects/newApp/PDDetailPage'
import { LoginPage } from '../../page-objects/LoginPage';
import { MailSlurp } from 'mailslurp-client';

test.describe('New web app Smoke suite', () => {
    const baseUrl = {
        "dev": "https://learn-backend-4fovaspuqa-uc.a.run.app",
        "stage": "https://connect-staging.unity.com/api/ed-pd",
        "devLogin": "https://connect-int.unity.com/ed-pd/login",
        "stageLogin": "https://connect-staging.unity.com/ed-pd/login"
    };

    const key = {
        "dev": "AIzaSyCl97WXU2Vm2LoZG5oLoD8AM633WuueK6Q",
        "stage": "AIzaSyAGqMm9jenpsQsL0xc7SS5C6EO51_66QYg"
    };

    const origin = {
        "dev": "https://connect-int.unity.com",
        "stage": "https://connect-staging.unity.com"
    };

    const adminCredentials = {
        "email": "admin@unity3d.com",
        "password": "v665mBU,%MgxJbt"
    };

    // Test email template
    let email = {
        'id': '', 
        'address': '',
    };

    // Test user
    let user = {
        'id': '',
        'email': 'anxhelosako+3@gmail.com',
        'fullName': 'e2e test user',
        'password': 'Anxhelo21'
    };

    // Organisation and course data
    const organizationID = "8f20761f-e00e-4ff5-bab3-d761bb095f60";
    const pathId = 1;
    const podId = 1;

    // Test email data
    const apiKey = 'e2efa88c55e5fac9266624cd19e3d65356509d4a26dfb6fa100fffdb50688fa7';

    test.beforeEach(async({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.open(baseUrl.devLogin);
        await loginPage.login(user);
        await page.waitForURL(`${origin.dev}/ed-pd/course/unity-pd`);
    });

    test.afterEach(async ({ page }) => {
        await page.close();
    });

    test('API: create a new user', async({ page, request }) => { // TODO: move to the BeforeAll hook
        const loginPage = new LoginPage(page);
        
        // Create test email
        const mailslurp = new MailSlurp({ apiKey });
        const { id, emailAddress } = await mailslurp.createInbox();

        email.id = id;
        email.address = emailAddress;

        user.id = id
        user.email = emailAddress;
        user.password = 'Qwerty1!';

        console.log(email);
        console.log(user);
        // email = {
        //     id: 'b1c4df71-83b3-4f80-9b6b-f6f848fd7c13',
        //     address: 'b1c4df71-83b3-4f80-9b6b-f6f848fd7c13@mailslurp.com',
        // };

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
        const responseBodyUserData = await responseUserData.json();
        const userId = responseBodyUserData.id;
        console.log(userId)
        // const userId = '6547d750526fa62a6320af04'; 

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
        // await loginPage.open(baseUrl.stageLogin);
        // await loginPage.sendConfirmationLinkFor(user);
        await page.goto(baseUrl.stageLogin);
        await page.waitForSelector('[id="ui-sign-in-email-input"]');
        await page.fill('[id="ui-sign-in-email-input"]', user.email);
        await page.click('button[type="submit"]');
        await page.waitForSelector('[id="ui-sign-in-name-input"]');
        await page.fill('[id="ui-sign-in-name-input"]', user.fullName);
        await page.fill('[id="ui-sign-in-new-password-input"]', user.password);
        await page.click('button[type="submit"]');

        // Get the confirmation link
        const emailData = await mailslurp.waitForLatestEmail(email.id);
        const body = emailData.body; 
        const emailConfirmationLink = body.match(/https?:\/\/(\.)?\b([-a-zA-Z0-9()@:%_\+.~#?&//=;]*)/)[0]; 
        console.log(body);
        console.log("The extracted URL: " + emailConfirmationLink);

        // const link = await testEmail.extractConfirmationLink(email.id);
        // Confirm account
        await page.goto(emailConfirmationLink);
        // await loginPage.confirmAccount(link);
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

    test.skip('The user can see a week status: Not complete', async({ page }) => {
        await expect(page.locator('[class="h-fit rounded-xl border px-4 text-sm border-error-extraDark bg-error-extraLight text-error-extraDark"]').first())
            .toBeVisible();
    });

    test.skip('The user can see a week status: In progress', async({ page }) => {
        // I don't know how to get this state for the testing porpose
    });

    test.skip('The user can see a week status: Completed', async({ page }) => {
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

                      