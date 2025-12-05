const { test, expect } = require('@playwright/test');
const config = require('../../../config');
const common = require('../../../common');

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto(config.config.baseUrl, { waitUntil: 'networkidle' });
});

test.describe('E2E test', () => {
  test('should login, create case and run different test cases for User Reference', async ({ page }) => {
    await common.login(config.config.apps.digv2.user.username, config.config.apps.digv2.user.password, page);

    await common.verifyHomePage(page);

    await common.createCase('Complex Fields', page);

    /** Selecting User Reference from the Category dropdown */
    await common.selectCategory('UserReference', page);

    await page.locator('button:has-text("submit")').click();

    /** selecting user from autocomplete field  */
    const searchBoxInput = page.locator('input[data-test-id="75c6db46c48c2d7bb102c91d13ed766e"]');
    await searchBoxInput.fill('user');
    const firstSearchboxOption = page.locator('div[role="listbox"]>mat-option:first-child');
    await firstSearchboxOption.click();
    const selectedUser = firstSearchboxOption.innerHTML;

    /** selecting user from dropdown field  */
    const dropdownInput = page.locator('mat-select[data-test-id="12781aa4899d4a2141570b5e52b27156"]');
    await dropdownInput.click();
    const firstDropdownOption = page.locator('div[role="listbox"]>mat-option:first-child');
    await firstDropdownOption.click();

    /** check readonly user reference value is same as dropdown selected user */
    const user = await page.locator('app-operator span[class="mat-button-wrapper"]').innerHTML;
    await expect(user).toBe(selectedUser);
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
