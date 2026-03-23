const { test, expect } = require('@playwright/test');
const config = require('../../../config');
const common = require('../../../common');

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto(config.config.baseUrl, { waitUntil: 'networkidle' });
});

test.describe('E2E test', () => {
  test('should login, create case and run different test cases for Query', async ({ page }) => {
    await common.login(config.config.apps.digv2.user.username, config.config.apps.digv2.user.password, page);

    await common.verifyHomePage(page);

    await common.createCase('Complex Fields', page);

    /** Selecting Query from the Category dropdown */
    await common.selectCategory('Query', page);

    await page.locator('button:has-text("submit")').click();

    /** selecting SingleRecord option from dropdown  */
    const selectedOption = page.locator('mat-select[data-test-id="365ab066d5dd67171317bc3fc755245a"]');
    await selectedOption.click();
    await page.locator('mat-option >> span:has-text("SingleRecord")').click();

    const detailsFieldsList = page.locator('div[id="details-fields-list"]');

    /** Testing the values present on Confirm screen */
    await expect(detailsFieldsList.locator('span >> text="Sacramento"')).toBeVisible();
    await expect(detailsFieldsList.locator('span >> text="CA"')).toBeVisible();
    await expect(detailsFieldsList.locator('span >> text="2653"')).toBeVisible();

    /** Query as Table */
    /** selecting ListOfReords option from dropdown  */
    await selectedOption.click();
    await page.locator('mat-option > span:has-text("ListOfRecords")').click();

    /** selecting Table option from dropdown  */
    const selectedDisplayAs = page.locator('mat-select[data-test-id="03e83bd975984c06d12c584cb59cc4ad"]');
    await selectedDisplayAs.click();
    await page.locator('mat-option > span:has-text("Table")').click();

    const tableRows = page.locator('app-simple-table table tbody');
    await expect(tableRows).toBeVisible();
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
