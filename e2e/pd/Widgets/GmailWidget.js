import { expect } from "@playwright/test";
import { get_messages } from "gmail-tester";

export class GmailWidget {
  async #messageChecker(toEmail, subject) {
    const credentials = JSON.parse(process.env.GMAIL_TESTER_CREDENTIALS);
    const token = JSON.parse(process.env.GMAIL_TESTER_TOKEN);

    const email = await get_messages(credentials, token, {
      to: toEmail,
      subject: subject,
      include_body: true,
      after: new Date(Date.now() - 1000 * 60),
    });

    return email;
  }

  async getEmail(page, receiverEmail, subject) {
    let emails = await this.#messageChecker(receiverEmail, subject);
    let startTime = Date.now();

    while (emails.length === 0 && Date.now() - startTime < 1000 * 30) {
      await page.waitForTimeout(1000 * 5);
      emails = await this.#messageChecker(receiverEmail, subject);
    }

    expect(emails.length).toBeGreaterThanOrEqual(1);
    expect(emails[0].subject).toContain(subject);

    return emails[0].body.html;
  }

  async getConfirmationCodeFrom(email) {
    const confirmationCode = email.match(/(?<=is\s)\d{6}/)[0];
    return confirmationCode;
  }

  async getConfirmationLinkFrom(email) {
    const extractedLink = email.match(
      /https?:\/\/(\.)?\b([-a-zA-Z0-9()@:%_\+.~#?&//=;]*)/
    )[0];
    const emailConfirmationLink = extractedLink.replace(/amp;/g, "");

    return emailConfirmationLink;
  }
}
