import { expect } from "@playwright/test";
import { GmailWidget } from "../../Widgets/GmailWidget.js";
import { PageManager } from "../index.js";
import { runtimeConfig } from "../../config.js";

const { ENV } = runtimeConfig;

export class LoginView {
  constructor(page) {
    this.page = page;

    if (ENV == "stg") {
      this.frameLocator = this.page.frameLocator("#iFrameResizer0");
    } else {
      this.frameLocator = this.page.frameLocator('[id="__next"] iframe');
    }

    this.signInBtn = this.page.getByRole("button", { name: "Sign in" }).first();
    this.loginInput = this.frameLocator.locator(
      '[id="conversations_create_session_form_email"]'
    );
    this.userFullNameInput = this.frameLocator.locator(
      '[id="ui-sign-in-name-input"]'
    );
    this.passwordInput = this.frameLocator.locator(
      '[id="conversations_create_session_form_password"]'
    );
    this.verificationCodeInput = this.frameLocator.locator(
      '[id="conversations_email_tfa_required_form_code"]'
    );
    this.confirmBtn = this.frameLocator.getByRole("button", {
      name: "Sign in",
    });
    this.verifyBtn = this.frameLocator.getByRole("button", { name: "Verify" });
  }

  async isLoginViewDisplayed() {
    await expect(this.loginInput).toBeVisible({ timeout: 60000 });
  }

  async #newLoginWith(user) {
    const app = new PageManager(this.page);

    await this.page.waitForTimeout(1000);
    await app.header.clickUserMenuButton();
    await this.page.waitForTimeout(1000);
    await app.header.selectItemFromUserMenu("Sign In");
    await this.page.waitForTimeout(1000);
    await this.loginInput.fill(user.email);
    await this.page.waitForTimeout(1000);
    await this.passwordInput.fill(user.password);
    await this.page.waitForTimeout(1000);
    await this.confirmBtn.click();
  }

  async #oldLoginWith(user) {
    await this.signInBtn.click();
    // await this.loginInput.waitFor();
    await expect(this.loginInput).toBeVisible();
    await this.loginInput.fill(user.email);
    await this.passwordInput.fill(user.password);
    await this.confirmBtn.click();
  }

  async #fillVerificationCodeFor(user) {
    if (await this.verificationCodeInput.isVisible()) {
      const receiverEmail = user.email;
      const mailClient = new GmailWidget();
      const email = await mailClient.getEmail(
        this.page,
        receiverEmail,
        "Security Notice - Verification code for Unity ID"
      );
      const confirmationCode = await mailClient.getConfirmationCodeFrom(email);

      await this.verificationCodeInput.fill(confirmationCode);
      await this.verifyBtn.click();
    }
  }

  async login(user) {
    const oldHomePage = this.page.locator(
      '[placeholder="What do you want to learn?"]'
    );

    if (await oldHomePage.isVisible()) {
      await this.#oldLoginWith(user);
    } else {
      await this.#newLoginWith(user);
    }

    await this.page.waitForTimeout(1000 * 5);
    await this.#fillVerificationCodeFor(user);
  }

  async confirmEmailFor(user) {
    const mailClient = new GmailWidget();

    await this.loginInput.fill(user.email);
    await this.confirmBtn.click();
    await this.userFullName.fill(user.fullName);
    await this.newPassword.fill(user.password);
    await this.confirmBtn.click();

    // Get the confirmation link
    const email = await mailClient.getEmail(
      this.page,
      user.email,
      "Confirm your email address"
    );

    const confirmationLink = await mailClient.getConfirmationLinkFrom(email);
    const verifyBtn = this.page
      .frameLocator("#iFrameResizer0")
      .getByRole("button", { name: "Verify" });
    await page.goto(confirmationLink);
  }
}
