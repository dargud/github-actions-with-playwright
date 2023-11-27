import { Locator, Page, expect } from "@playwright/test"

exports.LearnPage = class LearnPage {
    constructor (page) {
        this.page = page;
        this.welcomeMessage = page.locator('h1');
        this.dismissButton = page.getByRole('button', { name: 'Dismiss' });
        this.signinButton = page.getByRole('button', { name: 'Sign in' }).first();
        this.emailInput = page.frameLocator('#iFrameResizer0')
            .locator('#conversations_create_session_form_email');
        this.passwordInput = page.frameLocator('#iFrameResizer0')
            .locator('#conversations_create_session_form_password');
        this.confirmLoginButton = page.frameLocator('#iFrameResizer0')
            .locator('input[type="submit"]');
        this.userAvatarButton = page.locator('button[aria-label="User Menu"]');
        this.featuredContentCard = page.locator('[class="slider-title text-3xl"]').first();
    };

    async clickDismissButton () {
        await this.dismissButton.click();
    };

    async isMessageDisplayed (message) {
        await expect(this.welcomeMessage)
            .toContainText(message);
    };

    async clickSigninButton () {
        await this.signinButton.click();
    };

    async addEmail(email) {
        await this.emailInput.fill(email);
    };

    async addPassword(password) {
        await this.passwordInput.fill(password);
    };

    async confirmLogin() {
        await this.confirmLoginButton.click();
    };

    async isLoggedin (page) {
        await expect(page.getByRole('heading', { name: 'Welcome back Test Account' })).toBeVisible({ timeout: 60000 });
    };

    async clickUserAvatarAndSelectOption (page, option) {
        await this.userAvatarButton.click({ timeout: 60000 });

        switch (option) {
            case 'Account': {
                await page.locator('a[class="profile-link_2eqXy_lv"]').click();
                const pageName = await page.getByRole('heading', { name: 'My Account Settings' });
                await expect(pageName).toBeVisible({ timeout: 60000 });
                break;
            }
            case 'Content Creator': {
                break;
            }
            case 'Learning Architecture': {
                break;
            }
            case 'Community Moderator': {
                break;
            }
            case 'FAQ': {
                break;
            }
            case 'Settings': {
                break;
            }
            case 'Sign out': {
                break;
            }
            default: {
                break; 
            }
        };
    };

    async openFeaturedContentPage(page) {
        const contentName = await this.featuredContentCard.textContent();
        await this.featuredContxentCard.click();
        const contentPageName = await page.locator('h1').textContent();
        await expect(contentPageName).toContain(contentName);
    };

    async openBitesizeTutorial () {
        
    };
};