import { expect, test } from "@playwright/test";
import { runtimeConfig } from "../../config.js";
import { PageManager } from "../../page-objects/index.js";

const { USER_EMAIL, USER_PASS, ENV, BASE_URL } = runtimeConfig;

const user = {
  email: USER_EMAIL,
  password: USER_PASS,
};

/*
  TODO_QA: delete .only from tests
*/

test.describe.only("Connected BE: Smoke without logged in user, common tests", () => {
  test.beforeEach(async ({ page }) => {
    test.slow(); // Delete after page performance improvements
    const app = new PageManager(page);

    // Prepare the page for tests:
    await page.goto(`${BASE_URL}`);
    await page.waitForLoadState("load");
    await expect(page).toHaveURL(`${BASE_URL}`);

    // Close the Tutorial
    if (await app.tutorial.welcomeScreen.isVisible()) {
      await app.tutorial.clickDismissButton();
    }

    await app.homePage.isPageDisplayed();
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test("User can open the main page", async ({ page }) => {
    // Covered by beforeEach hook
  });

  test("User can see the login view", async ({ page }) => {
    test.slow(); // Delete after page performance improvements
    const app = new PageManager(page);

    // Open sing in view
    await page.waitForTimeout(1000);
    await app.header.clickUserMenuButton();
    await page.waitForTimeout(1000);
    await app.header.selectItemFromUserMenu("Sign In");
    // await page.waitForTimeout(3000);
    // await expect(
    //   page
    //     .frameLocator('[id="__next"] iframe')
    //     .getByText("Sign into your Unity ID")
    // ).toBeVisible();
    await app.loginView.isLoginViewDisplayed();
  });

  test("User can open the User menu", async ({ page }) => {
    test.slow(); // Delete after page performance improvements
    // const onHeader = new HeaderOfAnyPage(page);
    const app = new PageManager(page);

    // Open User menu
    await app.header.clickUserMenuButton();
  });

  test("User can open Pathways page", async ({ page }) => {
    test.slow(); // Delete after page performance improvements
    const app = new PageManager(page);

    // Open the Pathways page
    await app.header.clickPathways();
    await app.allPathwaysPage.isPageDisplayed();
  });

  test("User can browse by Topic", async ({ page }) => {
    test.slow(); // Delete after page performance improvements
    const app = new PageManager(page);

    // Open the Browse dropdown
    // Open the Editor Essentials
    await app.header.clickBrowseAndSelectItem("Editor Essentials");
    await app.searchResultsPage.isPageDisplayed();
  });

  test("User can browse by Content type", async ({ page }) => {
    test.slow(); // Delete after page performance improvements
    const app = new PageManager(page);

    // Open the Browse dropdown
    // Open the Courses
    await app.header.clickBrowseAndSelectItem("View all Courses");
    await app.allCoursesPage.isPageDisplayed();
  });

  test("User can open Live calendar page", async ({ page }) => {
    test.slow(); // Delete after page performance improvements
    const app = new PageManager(page);

    // Open the Live calendar page
    await app.header.clickLiveButton();
    await app.livePage.isPageDisplayed();
  });

  test("User can open Educator Hub page", async ({ page }) => {
    test.slow(); //Delete after page performance improvements
    const app = new PageManager(page);

    // Open Educator Hub page
    await app.header.clickEducatorsHub();
  });
});

test.describe("Connected BE: Smoke without logged in user, */learn only", () => {
  test.skip(ENV === "prod", "Isn't relevant for prod");

  test.beforeEach(async ({ page }) => {
    test.slow(); // Delete after page performance improvements

    // Prepare the page for tests:
    await page.goto(`${BASE_URL}`);
    await page.waitForLoadState("load");
    await expect(page).toHaveURL(`${BASE_URL}`);
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test("User can see a tutorial", async ({ page }) => {
    test.slow(); // Delete after page performance improvements
    const app = new PageManager(page);
    await app.tutorial.isWelcomeScreenDisplayed();
  });

  test("User can start a tutorial", async ({ page }) => {
    test.slow(); // Delete after page performance improvements
    const app = new PageManager(page);
    await app.tutorial.isWelcomeScreenDisplayed();
    await app.tutorial.clickStartTourButton();
    await app.tutorial.isTourTipDisplayed();
  });

  test("User can cancel a tutorial", async ({ page }) => {
    test.slow(); // Delete after page performance improvements
    const app = new PageManager(page);
    await app.tutorial.isWelcomeScreenDisplayed();
    await app.tutorial.clickDismissButton();
  });
});

test.describe("Connected BE: Smoke with logged in user", () => {
  test.beforeEach(async ({ page }) => {
    test.slow(); // Delete after page performance improvements
    const app = new PageManager(page);

    // Prepare the page for the login:
    await page.goto(`${BASE_URL}`);
    await page.waitForLoadState("load");
    await expect(page).toHaveURL(`${BASE_URL}`);

    // Work with the login iFrame:
    await page.waitForTimeout(1000);
    if (await app.tutorial.welcomeScreen.isVisible()) {
      await app.tutorial.clickDismissButton();
    }

    await app.loginView.login(user);
    await app.homePage.isLoggedin();

    await page.waitForTimeout(3000);
    await page.waitForLoadState("load");
    if (await app.tutorial.welcomeScreen.isVisible()) {
      await app.tutorial.clickDismissButton();
    }
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test("User can Sign In with Unity ID", async ({ page }) => {
    // Covered by beforeEach hook
  });

  test("User with Unity ID can Sign Out", async ({ page }) => {
    test.slow(); // Delete after page performance improvements
    const app = new PageManager(page);
    await app.header.clickUserMenuButton();
    await app.header.selectItemFromUserMenu("Sign out");
    await app.homePage.isLoggedOut();
  });

  test("User can open My Learning page", async ({ page }) => {
    test.slow(); // Delete after page performance improvements
    const app = new PageManager(page);
    await app.header.clickMyLearning();
    await app.myLearningPage.isPageDisplayed();
  });

  test("User can open Course page", async ({ page }) => {
    test.slow(); // Delete after page performance improvements
    const app = new PageManager(page);
    await app.header.clickBrowseAndSelectItem("View all Courses");
    await app.allCoursesPage.isPageDisplayed();
    await app.allCoursesPage.openCourse();
    await app.allCoursesPage.isCourseDisplayed();
  });

  test("User can open Pathway page", async ({ page }) => {
    test.slow(); // Delete after page performance improvements
    const app = new PageManager(page);
    await app.header.clickBrowseAndSelectItem("View all Pathways");
    await app.allPathwaysPage.isPageDisplayed();
    await app.allPathwaysPage.openPathway();
    await app.allPathwaysPage.isPathwayDisplayed();
  });

  test("User can open Project page", async ({ page }) => {
    test.slow(); // Delete after page performance improvements
    const app = new PageManager(page);
    await app.header.clickBrowseAndSelectItem("View all Projects");
    await app.allProjectsPage.isPageDisplayed();
    await app.allProjectsPage.openProject();
    await app.allProjectsPage.isProjectDisplayed();
  });

  test("User can open Tutorial page", async ({ page }) => {
    test.slow(); // Delete after page performance improvements
    const app = new PageManager(page);
    await app.header.clickBrowseAndSelectItem("View all Tutorials");
    await app.allTutorialsPage.isPageDisplayed();
    await app.allTutorialsPage.openTutorial();
    await app.allTutorialsPage.isTutorialDisplayed();
  });
});
