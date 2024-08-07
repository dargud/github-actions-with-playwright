import { expect, test } from "@playwright/test";
import { PageManager } from "../../page-objects/index.js";
import { runtimeConfig } from "../../config.js";

const { USER_EMAIL, USER_PASS, BASE_URL } = runtimeConfig;

const user = {
  email: USER_EMAIL,
  password: USER_PASS,
};

test.describe("Connected BE: Smoke, project submission", () => {
  test.beforeEach(async ({ page }) => {
    test.slow(); // Delete after page performance improvements
    const app = new PageManager(page);

    // Prepare the page for the login:
    await page.goto(`${BASE_URL}`);
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(`${BASE_URL}`);

    // Work with the login iFrame:
    if (await app.tutorial.welcomeScreen.isVisible()) {
      await app.tutorial.clickDismissButton();
    }

    await app.loginView.login(user);
    await app.homePage.isLoggedin();

    await page.waitForLoadState("networkidle");
    if (await app.tutorial.welcomeScreen.isVisible()) {
      await app.tutorial.clickDismissButton();
    }
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test("Can upload image", async ({ page }) => {
    const app = new PageManager(page);
    await app.projectSubmissionPage.open();
    await app.projectSubmissionPage.upload("image");
    await app.projectSubmissionPage.isImageUploaded();
  });

  test("Can upload video", async ({ page }) => {
    const app = new PageManager(page);
    await app.projectSubmissionPage.open();
    await app.projectSubmissionPage.upload("video");
    await app.projectSubmissionPage.isVideoUploaded();
  });

  test("Can delete uploaded image", async ({ page }) => {
    const app = new PageManager(page);
    await app.projectSubmissionPage.open();
    await app.projectSubmissionPage.upload("image");
    await app.projectSubmissionPage.isImageUploaded();

    const deleteImage = async () => {
      await app.projectSubmissionPage.deleteMediaBtn.click();
    };
    const isDeleted = async () => {
      await expect(
        app.projectSubmissionPage.uplaodedMediaPreview
      ).not.toBeVisible();
    };

    await deleteImage();
    await isDeleted();
  });

  test("Can delete upload video", async ({ page }) => {
    const app = new PageManager(page);
    await app.projectSubmissionPage.open();
    await app.projectSubmissionPage.upload("video");
    await app.projectSubmissionPage.isVideoUploaded();

    const deleteVideo = async () => {
      await app.projectSubmissionPage.deleteMediaBtn.click();
    };
    const isDeleted = async () => {
      await expect(
        app.projectSubmissionPage.uplaodedMediaPreview
      ).not.toBeVisible();
    };

    await deleteVideo();
    await isDeleted();
  });

  test("Can submit a project", async ({ page }) => {
    const app = new PageManager(page);
    await app.projectSubmissionPage.open();

    // Upload an image
    await app.projectSubmissionPage.upload("image");
    await app.projectSubmissionPage.isImageUploaded(true);

    // Upload a video
    await app.projectSubmissionPage.upload("video");
    await app.projectSubmissionPage.isVideoUploaded(true);

    // Save and Submit
    await app.projectSubmissionPage.submit();
    await app.projectSubmissionPage.isSubmited();
    await app.projectSubmissionPage.continue();

    // Delete test data
    await app.projectSubmissionPage.open();
    await app.projectSubmissionPage.deleteTestData();
    await app.projectSubmissionPage.isTestDataDeleted();
  });
});
