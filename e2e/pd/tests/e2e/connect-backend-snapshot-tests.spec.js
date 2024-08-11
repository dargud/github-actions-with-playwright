import { test, expect } from "@playwright/test";
import { PageManager } from "../../page-objects/index.js";
import { runtimeConfig } from "../../config.js";

const { USER_EMAIL, USER_PASS, ENV, BASE_URL } = runtimeConfig;

const user = {
  email: USER_EMAIL,
  password: USER_PASS,
};

test.describe("Connected BE (not logined user): Snapshot tests", () => {
  test.use({
    viewport: { width: 1440, height: 900 },
  });

  test("Connected BE: Home page", async ({ page }) => {
    const app = new PageManager(page);
    await page.goto(`${BASE_URL}`);
    await page.waitForLoadState("networkidle");
    await app.cookies.hide();
    await expect(await page.screenshot()).toMatchSnapshot(
      `${ENV}-home-page.png`,
      {
        maxDiffPixels: 100000,
      }
    );
  });

  test("Connected BE: Pathways page", async ({ page }) => {
    const app = new PageManager(page);
    await page.goto(`${BASE_URL}/pathways`);
    await page.waitForLoadState("networkidle");
    await app.cookies.hide();
    await expect(await page.screenshot()).toMatchSnapshot(
      `${ENV}-pathways-page.png`,
      {
        maxDiffPixels: 100000,
      }
    );
  });

  test("Connected BE: Creative Core pathway", async ({ page }) => {
    const app = new PageManager(page);
    await page.goto(`${BASE_URL}/pathway/creative-core`);
    await page.waitForLoadState("networkidle");
    await app.cookies.hide();
    await expect(await page.screenshot()).toMatchSnapshot(
      `${ENV}-creative-core-pathway-page.png`,
      {
        maxDiffPixels: 100000,
      }
    );
  });

  test("Connected BE: All live learning events page, Open for registration", async ({
    page,
  }) => {
    const app = new PageManager(page);
    await page.goto(`${BASE_URL}/live-calendar/?tab=opening`);
    await page.waitForLoadState("networkidle");
    await app.cookies.hide();
    await expect(await page.screenshot()).toMatchSnapshot(
      `${ENV}-events-open-for-registration-page.png`,
      {
        maxDiffPixels: 100000,
      }
    );
  });

  test("Connected BE: All live learning events page, Previously recorded", async ({
    page,
  }) => {
    const app = new PageManager(page);
    await page.goto(`${BASE_URL}/live-calendar/?tab=previous`);
    await page.waitForLoadState("networkidle");
    await app.cookies.hide();
    await expect(await page.screenshot()).toMatchSnapshot(
      `${ENV}-events-previously-recorded-page.png`,
      {
        maxDiffPixels: 100000,
      }
    );
  });

  test("Connected BE: All Courses page", async ({ page }) => {
    const app = new PageManager(page);
    await page.goto(`${BASE_URL}/courses`);
    await page.waitForLoadState("networkidle");
    await app.cookies.hide();
    await expect(await page.screenshot()).toMatchSnapshot(
      `${ENV}-courses-page.png`,
      {
        maxDiffPixels: 100000,
      }
    );
  });

  test("Connected BE: Course page", async ({ page }) => {
    const app = new PageManager(page);
    const sideBar = page.locator('[class*="side-bar_"]').first();

    if (ENV == "stg") {
      await page.goto(
        `${BASE_URL}/course/ar-development-create-marketing-apps`
      );
    } else {
      await page.goto(`${BASE_URL}/course/create-with-ar-face-filters`);
    }

    await page.waitForLoadState("networkidle");
    await app.cookies.hide();
    await sideBar.waitFor();
    await expect(await page.screenshot()).toMatchSnapshot(
      `${ENV}-course-page.png`,
      {
        maxDiffPixels: 100000,
      }
    );
  });

  test("Connected BE: All Projects page", async ({ page }) => {
    const app = new PageManager(page);
    await page.goto(`${BASE_URL}/projects`);
    await page.waitForLoadState("networkidle");
    await app.cookies.hide();
    await expect(await page.screenshot()).toMatchSnapshot(
      `${ENV}-projects-page.png`,
      {
        maxDiffPixels: 100000,
      }
    );
  });

  test("Connected BE: Project page", async ({ page }) => {
    const app = new PageManager(page);
    const sideBar = page.locator('[class*="side-bar_"]').first();

    if (ENV == "stg") {
      await page.goto(
        `${BASE_URL}/project/build-a-3d-world?courseId=600fe123edbc2a001f8da8d3`
      );
    } else {
      await page.goto(
        `${BASE_URL}/project/prototype-a-game-with-unity-muse-AI`
      );
    }

    await page.waitForLoadState("networkidle");
    await app.cookies.hide();
    await sideBar.waitFor();
    await expect(await page.screenshot()).toMatchSnapshot(
      `${ENV}-project-page.png`,
      {
        maxDiffPixels: 100000,
      }
    );
  });

  test("Connected BE: All Tutorials page", async ({ page }) => {
    const app = new PageManager(page);
    await page.goto(`${BASE_URL}/tutorials`);
    await page.waitForLoadState("networkidle");
    await app.cookies.hide();
    await expect(await page.screenshot()).toMatchSnapshot(
      `${ENV}-tutorials-page.png`,
      {
        maxDiffPixels: 100000,
      }
    );
  });

  test("Connected BE: Tutorial page", async ({ page }) => {
    const app = new PageManager(page);
    const sideBar = page.locator('[class*="side-bar_"]').first();

    if (ENV == "stg") {
      await page.goto(
        `${BASE_URL}/tutorial/getting-started-installing-unity-and-download-project-files?uv=2019.3&courseId=600fe123edbc2a001f8da8d3&projectId=600fe0e2edbc2a001f8da8ca`
      );
    } else {
      await page.goto(`${BASE_URL}/tutorial/6629dd6bedbc2a0e64f34aa7`);
    }

    await page.waitForLoadState("networkidle");
    await app.cookies.hide();
    await sideBar.waitFor();
    await expect(await page.screenshot()).toMatchSnapshot(
      `${ENV}-tutorial-page.png`,
      {
        maxDiffPixels: 100000,
      }
    );
  });

  test("Connected BE: Educator Hub", async ({ page }) => {
    const app = new PageManager(page);
    await page.goto(`${BASE_URL}/educators`);
    await page.waitForLoadState("networkidle");
    await app.cookies.hide();
    await expect(await page.screenshot()).toMatchSnapshot(
      `${ENV}-educator-hub-page.png`,
      {
        maxDiffPixels: 100000,
      }
    );
  });

  test("Connected BE: FAQ", async ({ page }) => {
    const app = new PageManager(page);
    await page.goto(`${BASE_URL}/faq`);
    await page.waitForLoadState("networkidle");
    await app.cookies.hide();
    await expect(await page.screenshot()).toMatchSnapshot(
      `${ENV}-faq-page.png`,
      {
        maxDiffPixels: 100000,
      }
    );
  });
});

test.describe("Connected BE (logined user): Snapshot tests", () => {
  test.use({
    viewport: { width: 1440, height: 900 },
  });

  test.beforeEach(async ({ page }) => {
    test.slow(); // Delete after page performance improvements
    const app = new PageManager(page);

    // Prepare the page for the login:
    await page.goto(`${BASE_URL}`);
    await page.waitForLoadState("networkidle");

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

  test("Connected BE: Home page", async ({ page }) => {
    const app = new PageManager(page);
    await page.waitForTimeout(1000 * 1);
    await app.cookies.hide();
    await expect(await page.screenshot()).toMatchSnapshot(
      `${ENV}-logined-user-home-page.png`,
      {
        maxDiffPixels: 100000,
      }
    );
  });

  test("Connected BE: My Learning page", async ({ page }) => {
    const app = new PageManager(page);
    if (await app.tutorial.welcomeScreen.isVisible()) {
      await app.tutorial.clickDismissButton();
    }
    await app.header.clickMyLearning();
    await page.waitForLoadState("networkidle");
    await app.myLearningPage.isPageDisplayed();
    await app.cookies.hide();
    await expect(await page.screenshot()).toMatchSnapshot(
      `${ENV}-logined-user-my-learning-page.png`,
      {
        maxDiffPixels: 100000,
      }
    );
  });

  test("Connected BE: My profile", async ({ page }) => {
    const app = new PageManager(page);
    if (await app.tutorial.welcomeScreen.isVisible()) {
      await app.tutorial.clickDismissButton();
    }
    await app.header.clickMyLearning();
    await app.myLearningPage.isPageDisplayed();
    await app.myLearningPage.openTab("My Profile");
    await app.cookies.hide();
    await expect(await page.screenshot()).toMatchSnapshot(
      `${ENV}-my-profile-page.png`,
      {
        maxDiffPixels: 100000,
      }
    );
  });

  test("Connected BE: Settings", async ({ page }) => {
    const app = new PageManager(page);
    if (await app.tutorial.welcomeScreen.isVisible()) {
      await app.tutorial.clickDismissButton();
    }
    await app.header.clickMyLearning();
    await app.myLearningPage.isPageDisplayed();
    await app.myLearningPage.openTab("Settings");
    await app.cookies.hide();
    await expect(await page.screenshot()).toMatchSnapshot(
      `${ENV}-settings-page.png`,
      {
        maxDiffPixels: 100000,
      }
    );
  });
});
