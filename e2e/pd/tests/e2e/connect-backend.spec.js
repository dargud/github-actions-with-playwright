import { expect, test } from '@playwright/test'

test.describe('Smoke test suite, without logged in user', () => { 
    test.beforeEach(async ({ page }) => {
        test.slow(); // Delete after page performance improvements 

        // Prepare the page for tests:
        await page.goto("https://learn.unity.com");
        await expect(page).toHaveURL("https://learn.unity.com");
        await page.waitForSelector('[class*="header-wrap_"]');
    });

    test.afterEach(async ({ page }) => {
        await page.close();
    });
    
    test('User can open the main page', async({ page }) => {
        // Covered by beforeEach hook
    });
});
