/** We're testing the visibility of tabs within the Case Summary area in the Case View here, more tests to be added in the future. */

const { test, expect } = require('@playwright/test');
const config = require('../../../config');
const common = require('../../../common');

// These values represent the visibility(as authored in the app) of the tabs
const detailsTabVisible = false;
const caseHistoryTabVisible = true;

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto(config.config.baseUrl, { waitUntil: 'networkidle' });
});

test.describe('E2E test', () => {
  test('should login, create case and run different test cases for Case View', async ({ page }) => {
    await common.login(config.config.apps.digv2.user.username, config.config.apps.digv2.user.password, page);

    await common.verifyHomePage(page);

    await common.createCase('Complex Fields', page);

    /** Wait until newly created case loads */
    await expect(page.locator('div[id="case-view"]')).toBeVisible();

    /** Getting the handle of tabs from the DOM */
    const detailsTab = page.locator('button >> span:has-text("Details")');
    const caseHistoryTab = page.locator('button >> span:has-text("Case History")');

    /** Visibility of both(basically more than one) tabs should be set to true in order for them to be displayed otherwise
     *  they won't be displayed and that is what we're testing here. */
    if (detailsTabVisible && caseHistoryTabVisible) {
      await expect(detailsTab).toBeVisible();
      await expect(caseHistoryTab).toBeVisible();
    } else {
      await expect(detailsTab).toBeHidden();
      await expect(caseHistoryTab).toBeHidden();
    }

    /** Submitting the case */
    await page.locator('button:has-text("submit")').click();
  }, 10000);
  test('should login, create case and run test cases for Cancel action on the Assignment', async ({ page }) => {
    await common.login(config.config.apps.digv2.user.username, config.config.apps.digv2.user.password, page);

    /** Testing announcement banner presence */
    await common.verifyHomePage(page);

    /** Click on the Create Case button */
    await common.createCase('Complex Fields', page);

    /** Wait until newly created case loads */
    await expect(page.locator('mat-select[data-test-id="76729937a5eb6b0fd88c42581161facd"]')).toBeVisible();

    await page.locator('button >> span:has-text("Cancel")').click();

    await page.locator('button >> span:has-text("Go")').click();

    await expect(page.locator('mat-select[data-test-id="76729937a5eb6b0fd88c42581161facd"]')).toBeVisible();

    /** Submitting the case */
    await page.locator('button:has-text("submit")').click();
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
