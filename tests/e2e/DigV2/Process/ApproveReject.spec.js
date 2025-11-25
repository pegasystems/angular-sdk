const { test, expect } = require('@playwright/test');
const config = require('../../../config');
const common = require('../../../common');

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1720, height: 1080 });
  await page.goto(config.config.baseUrl, { waitUntil: 'networkidle' });
});

test.describe('E2E test', () => {
  test('should login, create case and run different test cases for Approve and Reject actions', async ({ page }) => {
    await common.login(config.config.apps.digv2.user.username, config.config.apps.digv2.user.password, page);

    await common.verifyHomePage(page);

    await common.createCase('Process', page);

    await page.locator('button:has-text("Approve")').click();

    let caseView = await page.locator('div[id="case-view"]');

    await expect(caseView.locator('span >> text="Resolved-Completed"')).toBeVisible();

    /** Creating another Process case-type */
    await common.createCase('Process', page);

    await page.locator('button:has-text("Reject")').click();

    caseView = await page.locator('div[id="case-view"]');

    await expect(caseView.locator('span >> text="Resolved-Rejected"')).toBeVisible();
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
