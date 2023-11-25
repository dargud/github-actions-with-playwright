import { expect } from "@playwright/test";
import { MailslurpWidget } from "../Widgets/MailslurpWidget";
// import { MailSlurp } from 'mailslurp-client';

export class LoginPage { 
    constructor(page) {
        this.page = page;
        this.loginInput = this.page.locator('[id="ui-sign-in-email-input"]');
        this.userFullName = this.page.locator('[id="ui-sign-in-name-input"]');
        this.newPassword = this.page.locator('[id="ui-sign-in-new-password-input"]');
        this.password = this.page.locator('[id="ui-sign-in-password-input"]'); 
        this.confirmBtn = this.page.locator('button[type="submit"]');
        this.mailslurp = new MailslurpWidget(page);
        // this.mailslurp = new MailSlurp('3f266825fecd338059a261fd8b4d4b603b70f876799d39aef6b9caa37cb39c2c')
    };

    async open(baseUrl) {
        await this.page.goto(baseUrl);
    };

    async isLoginInputDisplayed() {
        await this.page.waitForSelector('[id="ui-sign-in-email-input"]');
        await expect(this.page.locator('[id="ui-sign-in-email-input"]')).toBeVisible();
    };

    async isUserNameInputDisplayed() { 
        await this.page.waitForSelector('[id="ui-sign-in-name-input"]');
        await expect(this.page.locator('[id="ui-sign-in-name-input"]')).toBeVisible();
    };

    async isPasswordInputDisplayed() { 
        await this.page.waitForSelector('[id="ui-sign-in-password-input"]');
        await expect(this.page.locator('[id="ui-sign-in-password-input"]')).toBeVisible();
    };

    async isVerificateEmailPageDisplayed() {
        await expect(this.page).toHaveURL('https://connect-staging.unity.com/ed-pd/email-verification');
    };

    async login(user) {
        await this.isLoginInputDisplayed()
        await this.loginInput.fill(user.email);
        await this.confirmBtn.click();
        await this.isPasswordInputDisplayed();
        await this.password.fill(user.password);
        await this.confirmBtn.click();
    };

    async sendConfirmationLinkFor(user) {
        await this.isLoginInputDisplayed()
        await this.loginInput.fill(user.email);
        await this.confirmBtn.click();
        await this.isUserNameInputDisplayed();
        await this.userFullName.fill(user.fullName);
        await this.newPassword.fill(user.password);
        await this.confirmBtn.click();
        await this.isVerificateEmailPageDisplayed();

        // Get the confirmation link
        // const email = await mailslurp.waitForLatestEmail(user.id);
        // const body = email.body; 
        // const emailConfirmationLink = body.match(/https?:\/\/(\.)?\b([-a-zA-Z0-9()@:%_\+.~#?&//=;]*)/)[0]; 
        // console.log(body);
        // console.log("The extracted URL: " + emailConfirmationLink);

        const emailConfirmationLink = await this.mailslurp.extractConfirmationLink(user.id);

        // Confirm account
        await page.goto(emailConfirmationLink); 
    };

    async confirmAccount(link) {
        await this.page.goto(link);
    };
};