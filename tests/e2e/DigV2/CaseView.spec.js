/** We're testing the visibility of tabs within the Case Summary area in the Case View here, more tests to be added in the future. */

const { test, expect } = require('@playwright/test');
const config = require('../../config');
const common = require('../../common');

// These values represent the visibility(as authored in the app) of the tabs
const detailsTabVisible = false;
const caseHistoryTabVisible = true;

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('http://localhost:3500/portal');
});

test.describe('E2E test', () => {
  test('should login, create case and run different test cases for Case View', async ({ page }) => {
    await common.login(config.config.apps.digv2.user.username, config.config.apps.digv2.user.password, page);

    /** Testing announcement banner presence */
    const announcementBanner = page.locator('h2:has-text("Announcements")');
    await expect(announcementBanner).toBeVisible();

    /** Testing worklist presence */
    const worklist = page.locator('div[id="worklist"]:has-text("My Worklist")');
    await expect(worklist).toBeVisible();

    /** Click on the Create Case button */
    const createCase = page.locator('mat-list-item[id="create-case-button"]');
    await createCase.click();

    /** Creating a Complex Fields case-type */
    const complexFieldsCase = page.locator('mat-list-item[id="case-list-item"] > span:has-text("Complex Fields")');
    await complexFieldsCase.click();

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
});

test.afterEach(async ({ page }) => {
  await page.close();
});
