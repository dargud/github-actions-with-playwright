import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { PageManager } from "../../page-objects/index";
import { runtimeConfig } from "../../config";

const { USER_EMAIL, USER_PASS, BASE_URL } = runtimeConfig;

const user = {
  email: USER_EMAIL,
  password: USER_PASS,
};
const tags = ["wcag22a", "wcag22aa"];

test.describe.only("Connected BE (not logined user): Accessibility tests", () => {
  test("Connected BE: Home page", async ({ page }, testInfo) => {
    await page.goto(`${BASE_URL}`);
    // await page.waitForLoadState("domcontentloaded");
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(tags)
      .analyze();

    await testInfo.attach("home-page-accessibility-scan-results", {
      body: JSON.stringify(accessibilityScanResults, null, 2),
      contentType: "application/json",
    });

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("Connected BE: All live learning events page, Open for registration", async ({
    page,
  }, testInfo) => {
    await page.goto(`${BASE_URL}/live-calendar/?tab=opening`);
    // await page.waitForLoadState("domcontentloaded");
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(tags)
      .analyze();

    await testInfo.attach(
      "events-open-for-registration-accessibility-scan-results",
      {
        body: JSON.stringify(accessibilityScanResults, null, 2),
        contentType: "application/json",
      }
    );

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("Connected BE: All live learning events page, Previously recorded", async ({
    page,
  }, testInfo) => {
    await page.goto(`${BASE_URL}/live-calendar/?tab=previous`);
    // await page.waitForLoadState("domcontentloaded");
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(tags)
      .analyze();

    await testInfo.attach(
      "events-previously-recorded-accessibility-scan-results",
      {
        body: JSON.stringify(accessibilityScanResults, null, 2),
        contentType: "application/json",
      }
    );

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("Connected BE: All Pathways page", async ({ page }, testInfo) => {
    await page.goto(`${BASE_URL}/pathways`);
    // await page.waitForLoadState("domcontentloaded");
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(tags)
      .analyze();

    await testInfo.attach("pathways-page-accessibility-scan-results", {
      body: JSON.stringify(accessibilityScanResults, null, 2),
      contentType: "application/json",
    });

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("Connected BE: Pathway page", async ({ page }, testInfo) => {
    const app = new PageManager(page);
    await page.goto(`${BASE_URL}`);
    if (await app.tutorial.welcomeScreen.isVisible()) {
      await app.tutorial.clickDismissButton();
    }
    await app.header.clickBrowseAndSelectItem("View all Pathways");
    await app.allPathwaysPage.isPageDisplayed();
    await app.allPathwaysPage.openPathway();
    await app.allPathwaysPage.isPathwayDisplayed();
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(tags)
      .analyze();

    await testInfo.attach("creative-core-accessibility-scan-results", {
      body: JSON.stringify(accessibilityScanResults, null, 2),
      contentType: "application/json",
    });

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("Connected BE: All Courses page", async ({ page }, testInfo) => {
    await page.goto(`${BASE_URL}/courses`);
    // await page.waitForLoadState("domcontentloaded");
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(tags)
      .analyze();

    await testInfo.attach("courses-page-accessibility-scan-results", {
      body: JSON.stringify(accessibilityScanResults, null, 2),
      contentType: "application/json",
    });

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("Connected BE: Course page", async ({ page }, testInfo) => {
    const app = new PageManager(page);
    await page.goto(`${BASE_URL}`);
    if (await app.tutorial.welcomeScreen.isVisible()) {
      await app.tutorial.clickDismissButton();
    }
    await app.header.clickBrowseAndSelectItem("View all Courses");
    await app.allCoursesPage.isPageDisplayed();
    await app.allCoursesPage.openCourse();
    await app.allCoursesPage.isCourseDisplayed();
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(tags)
      .analyze();

    await testInfo.attach("course-page-accessibility-scan-results", {
      body: JSON.stringify(accessibilityScanResults, null, 2),
      contentType: "application/json",
    });

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("Connected BE: All Projects page", async ({ page }, testInfo) => {
    await page.goto(`${BASE_URL}/projects`);
    // await page.waitForLoadState("domcontentloaded");
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(tags)
      .analyze();

    await testInfo.attach("projects-page-accessibility-scan-results", {
      body: JSON.stringify(accessibilityScanResults, null, 2),
      contentType: "application/json",
    });

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("Connected BE: Project page", async ({ page }, testInfo) => {
    const app = new PageManager(page);
    await page.goto(`${BASE_URL}`);
    if (await app.tutorial.welcomeScreen.isVisible()) {
      await app.tutorial.clickDismissButton();
    }
    await app.header.clickBrowseAndSelectItem("View all Projects");
    await app.allProjectsPage.isPageDisplayed();
    await app.allProjectsPage.openProject();
    await app.allProjectsPage.isProjectDisplayed();
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(tags)
      .analyze();

    await testInfo.attach("project-page-accessibility-scan-results", {
      body: JSON.stringify(accessibilityScanResults, null, 2),
      contentType: "application/json",
    });

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("Connected BE: All Tutorials page", async ({ page }, testInfo) => {
    await page.goto(`${BASE_URL}/tutorials`);
    // await page.waitForLoadState("domcontentloaded");
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(tags)
      .analyze();

    await testInfo.attach("tutorials-page-accessibility-scan-results", {
      body: JSON.stringify(accessibilityScanResults, null, 2),
      contentType: "application/json",
    });

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("Connected BE: Tutorial page", async ({ page }, testInfo) => {
    const app = new PageManager(page);
    await page.goto(`${BASE_URL}`);
    if (await app.tutorial.welcomeScreen.isVisible()) {
      await app.tutorial.clickDismissButton();
    }
    await app.header.clickBrowseAndSelectItem("View all Tutorials");
    await app.allTutorialsPage.isPageDisplayed();
    await app.allTutorialsPage.openTutorial();
    await app.allTutorialsPage.isTutorialDisplayed();
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(tags)
      .analyze();

    await testInfo.attach("tutorial-page-accessibility-scan-results", {
      body: JSON.stringify(accessibilityScanResults, null, 2),
      contentType: "application/json",
    });

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("Connected BE: Educator Hub", async ({ page }, testInfo) => {
    await page.goto(`${BASE_URL}/educators`);
    // await page.waitForLoadState("domcontentloaded");
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(tags)
      .analyze();

    await testInfo.attach("educator-hub-accessibility-scan-results", {
      body: JSON.stringify(accessibilityScanResults, null, 2),
      contentType: "application/json",
    });

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test.skip("Connected BE: Browse -> Editor Essentials page", async ({
    page,
  }, testInfo) => {
    await page.goto(
      `${BASE_URL}/search?k=%5B%22tag%3A5d5d0e927fbf7d009e2715c0%22%5D`
    );
    // await page.waitForLoadState("domcontentloaded");
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(tags)
      .analyze();

    await testInfo.attach(
      "browse-editor-essentials-accessibility-scan-results",
      {
        body: JSON.stringify(accessibilityScanResults, null, 2),
        contentType: "application/json",
      }
    );

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("Connected BE: FAQ", async ({ page }, testInfo) => {
    await page.goto(`${BASE_URL}/faq`);
    // await page.waitForLoadState("domcontentloaded");
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(tags)
      .analyze();

    await testInfo.attach("faq-accessibility-scan-results", {
      body: JSON.stringify(accessibilityScanResults, null, 2),
      contentType: "application/json",
    });

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

test.describe("Connected BE (logined user): Accessibility tests", () => {
  test.beforeEach(async ({ page }) => {
    test.slow(); // Delete after page performance improvements
    const app = new PageManager(page);

    // Prepare the page for the login:
    await page.goto(`${BASE_URL}`);
    // await page.waitForLoadState("domcontentloaded");
    if (await app.tutorial.welcomeScreen.isVisible()) {
      await app.tutorial.clickDismissButton();
    }

    // Work with the login iFrame:
    await app.loginView.login(user);
    await app.homePage.isLoggedin();

    // await page.waitForLoadState("domcontentloaded");
    if (await app.tutorial.welcomeScreen.isVisible()) {
      await app.tutorial.clickDismissButton();
    }
  });

  test("Connected BE: Home page", async ({ page }, testInfo) => {
    await page.goto(`${BASE_URL}`);
    // await page.waitForLoadState("domcontentloaded");
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(tags)
      .analyze();

    await testInfo.attach("home-page-accessibility-scan-results", {
      body: JSON.stringify(accessibilityScanResults, null, 2),
      contentType: "application/json",
    });

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("Connected BE: My Learning page", async ({ page }, testInfo) => {
    const app = new PageManager(page);
    await app.header.clickMyLearning();
    await app.myLearningPage.isPageDisplayed();
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(tags)
      .analyze();

    await testInfo.attach("my-profile-accessibility-scan-results", {
      body: JSON.stringify(accessibilityScanResults, null, 2),
      contentType: "application/json",
    });

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("Connected BE: My profile", async ({ page }, testInfo) => {
    const app = new PageManager(page);
    await app.header.clickMyLearning();
    await app.myLearningPage.isPageDisplayed();
    await app.myLearningPage.openTab("My Profile");
    // await page.waitForLoadState("domcontentloaded");
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(tags)
      .analyze();

    await testInfo.attach("my-profile-accessibility-scan-results", {
      body: JSON.stringify(accessibilityScanResults, null, 2),
      contentType: "application/json",
    });

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("Connected BE: Settings", async ({ page }, testInfo) => {
    const app = new PageManager(page);
    await app.header.clickMyLearning();
    await app.myLearningPage.isPageDisplayed();
    await app.myLearningPage.openTab("Settings");
    // await page.waitForLoadState("domcontentloaded");
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(tags)
      .analyze();

    await testInfo.attach("my-profile-accessibility-scan-results", {
      body: JSON.stringify(accessibilityScanResults, null, 2),
      contentType: "application/json",
    });

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
