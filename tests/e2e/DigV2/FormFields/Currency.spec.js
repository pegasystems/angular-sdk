const { test, expect } = require('@playwright/test');

const config = require('../../../config');
const common = require('../../../common');

// These values represent the data values used for the conditions and are initialised in pyDefault DT
const isDisabled = true;
const isVisible = true;

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto(config.config.baseUrl, { waitUntil: 'networkidle' });
});

test.describe('E2E test', () => {
  let attributes;

  test('should login, create case and run the Currency tests', async ({ page }) => {
    await common.login(config.config.apps.digv2.user.username, config.config.apps.digv2.user.password, page);

    await common.verifyHomePage(page);

    /** Click on the Create Case button */
    await common.createCase('Form Field', page);

    /** Selecting Currency from the Category dropdown */
    await common.selectCategory('Currency', page);

    /** Selecting Required from the Sub Category dropdown */
    await common.selectSubCategory('Required', page);

    /** Required tests */
    const notRequiredCurrency = page.locator('input[data-test-id="cab671a0ad307780a2de423a3d19924e"]');
    attributes = await common.getAttributes(notRequiredCurrency);
    await expect(attributes.includes('required')).toBeFalsy();

    const requiredCurrency = page.locator('input[data-test-id="77af0bd660f2e0276e23a7db7d48235a"]');
    attributes = await common.getAttributes(requiredCurrency);
    await expect(attributes.includes('required')).toBeTruthy();

    /** Selecting Disable from the Sub Category dropdown */
    await common.selectSubCategory('Disable', page);

    // /** Disable tests */
    const alwaysDisabledCurrency = page.locator('input[data-test-id="0d14f3717305e0238966749e6a853dad"]');
    attributes = await common.getAttributes(alwaysDisabledCurrency);
    await expect(attributes.includes('disabled')).toBeTruthy();

    const conditionallyDisabledCurrency = page.locator('input[data-test-id="d5e33df8e1d99971f69b7c0015a5ea58"]');
    attributes = await common.getAttributes(conditionallyDisabledCurrency);
    if (isDisabled) {
      await expect(attributes.includes('disabled')).toBeTruthy();
    } else {
      await expect(attributes.includes('disabled')).toBeFalsy();
    }

    const neverDisabledCurrency = page.locator('input[data-test-id="40fba95f48961ac8ead17beca7535294"]');
    attributes = await common.getAttributes(neverDisabledCurrency);
    await expect(attributes.includes('disabled')).toBeFalsy();

    /** Selecting Update from the Sub Category dropdown */
    await common.selectSubCategory('Update', page);

    /** Update tests */
    const readonlyCurrency = page.locator('input[data-test-id="32bc05c9bac42b8d76ea72511afa89d0"]');
    attributes = await common.getAttributes(readonlyCurrency);
    await expect(attributes.includes('readonly')).toBeTruthy();
    await expect(await readonlyCurrency.inputValue()).toBe('$20.00');

    const editableCurrency = page.locator('input[data-test-id="837e53069fc48e63debdee7fa61fbc1a"]');

    editableCurrency.fill('120');

    attributes = await common.getAttributes(editableCurrency);
    await expect(attributes.includes('readonly')).toBeFalsy();

    const currencyAsDecimal = page.locator('input[data-test-id="a792300f2080cdbcf7a496220fa7a44e"]');
    attributes = await common.getAttributes(currencyAsDecimal);
    await expect(attributes.includes('readonly')).toBeTruthy();
    await expect(await currencyAsDecimal.inputValue()).toBe('$20.00');

    /** Selecting Visibility from the Sub Category dropdown */
    await common.selectSubCategory('Visibility', page);

    /** Visibility tests */
    await expect(page.locator('input[data-test-id="756f918704ee7dcd859928f068d02633"]')).toBeVisible();

    const neverVisibleCurrency = await page.locator('input[data-test-id="5aa7a927ac4876abf1fcff6187ce5d76"]');
    await expect(neverVisibleCurrency).not.toBeVisible();

    const conditionallyVisibleCurrency = await page.locator('input[data-test-id="730a18d88ac68c9cc5f89bf5f6a5caea"]');

    if (isVisible) {
      await expect(conditionallyVisibleCurrency).toBeVisible();
    } else {
      await expect(conditionallyVisibleCurrency).not.toBeVisible();
    }
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
