import { expect } from "@playwright/test";
import { runtimeConfig } from "../../config";

const { BASE_URL } = runtimeConfig;

export class SingleCoursePage {
  constructor(page) {
    this.page = page;
    this.uploadMedia = this.page.locator('[class="underline"]');
    this.uploadedMediaPreview = this.page
      .locator('[class="flex flex-row flex-wrap"]')
      .getByRole("button");
    this.deleteMediaBtn = this.page
      .locator('[class="flex flex-row flex-wrap"]')
      .getByRole("button");
    this.mediaUrl = this.page.locator('[id="mediaUrl"]');
    this.submissionTitle = this.page.locator('[id="title"]');
    this.submissionDescription = this.page.locator('[id="description"]');
    this.viewableByPublic = this.page.locator('input[type="radio"]').first();
    this.viewableByPrivate = this.page.locator('input[type="radio"]').last();
    this.saveAndPreviewBtn = this.page
      .getByRole("button")
      .filter({ hasText: "Save and Preview Submission" });
    this.continueBtn = this.page
      .locator('[href="/ed-pd/course/teach-unity/16/quiz/unity-fundamentals"]')
      .first();
  }

  async open() {
    // TODO_QA: update link to the other one
    await this.page.goto(
      `${BASE_URL}/ed-pd/course/teach-unity/16/exercise/build-your-first-personal-project`
    );
  }

  async upload(fileType) {
    const fileChooserPromise = this.page.waitForEvent("filechooser");
    await this.page.waitForTimeout(1000 * 3);
    await this.uploadMedia.click();
    const fileChooser = await fileChooserPromise;

    switch (fileType) {
      case "image": {
        await fileChooser.setFiles("tests/e2e/upload-files/image.jpg");
        break;
      }
      case "video": {
        await fileChooser.setFiles("tests/e2e/upload-files/video-5mb.mp4");
        break;
      }
      default: {
        console.debug(`Uploading of (${fileType}) is failed`);
        break;
      }
    }
  }

  async isImageUploaded(isFirst = false) {
    const postResumableUpload = await this.page.waitForResponse(
      "**/resumableUpload"
    );
    const postImage = await this.page.waitForResponse("**/upload/image");

    expect(postResumableUpload.status()).toBe(201);
    expect(postImage.status()).toBe(200);

    if (isFirst) {
      await expect(this.uploadedMediaPreview.first()).toBeVisible({
        timeout: 60000,
      });
    } else {
      await expect(this.uploadedMediaPreview).toBeVisible({ timeout: 60000 });
    }
  }

  async isVideoUploaded(isLast = false) {
    const postResumableUpload = await this.page.waitForResponse(
      "**/resumableUpload"
    );
    const postVideoattachment = await this.page.waitForResponse(
      "**/upload/videoattachment"
    );

    expect(postResumableUpload.status()).toBe(201);
    expect(postVideoattachment.status()).toBe(200);

    if (isLast) {
      await expect(this.uploadedMediaPreview.last()).toBeVisible({
        timeout: 60000,
      });
    } else {
      await expect(this.uploadedMediaPreview).toBeVisible({ timeout: 60000 });
    }
  }

  async submit() {
    await this.submissionTitle.fill("Title");
    await this.submissionDescription.fill("Description");
    await this.viewableByPrivate.click();
    await this.saveAndPreviewBtn.click();
  }

  async isSubmited() {
    const postSave = await this.page.waitForResponse("**/save");
    const patchUpdateUserProgress = await this.page.waitForResponse(
      "**/users/progress/updateUserProgress"
    );

    expect(postSave.status()).toBe(200);
    expect(patchUpdateUserProgress.status()).toBe(200);
  }

  async continue() {
    await this.continueBtn.click();
    await expect(this.page).toHaveURL(
      `${BASE_URL}/ed-pd/course/teach-unity/16/quiz/unity-fundamentals`
    );
  }

  async deleteTestData() {
    await this.deleteMediaBtn.last().click();
    await this.deleteMediaBtn.first().click();
    await expect(this.uploadedMediaPreview).not.toBeVisible({ timeout: 60000 });
    await this.saveAndPreviewBtn.click();
  }

  async isTestDataDeleted() {
    const postSave = await this.page.waitForResponse("**/save");
    const patchUpdateUserProgress = await this.page.waitForResponse(
      "**/users/progress/updateUserProgress"
    );

    expect(postSave.status()).toBe(200);
    expect(patchUpdateUserProgress.status()).toBe(200);
  }
}
