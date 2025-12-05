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

  test('should login, create case and run the Text Input tests', async ({ page }) => {
    await common.login(config.config.apps.digv2.user.username, config.config.apps.digv2.user.password, page);

    await common.verifyHomePage(page);

    /** Click on the Create Case button */
    await common.createCase('Form Field', page);

    /** Selecting Text Input from the Category dropdown */
    await common.selectCategory('TextInput', page);

    /** Selecting Required from the Sub Category dropdown */
    await common.selectSubCategory('Required', page);

    /** Required tests */
    const requiredTextInput = page.locator('input[data-test-id="6d83ba2ad05ae97a2c75e903e6f8a660"]');
    attributes = await common.getAttributes(requiredTextInput);
    await expect(attributes.includes('required')).toBeTruthy();

    const notRequiredTextInput = page.locator('input[data-test-id="206bc0200017cc475d88b1bf4279cda0"]');
    attributes = await common.getAttributes(notRequiredTextInput);
    await expect(attributes.includes('required')).toBeFalsy();

    /** Selecting Disable from the Sub Category dropdown */
    await common.selectSubCategory('Disable', page);

    // /** Disable tests */
    const alwaysDisabledTextInput = page.locator('input[data-test-id="52ad9e3ceacdb9ccea7ca193c213228a"]');
    attributes = await common.getAttributes(alwaysDisabledTextInput);
    await expect(attributes.includes('disabled')).toBeTruthy();

    const conditionallyDisabledTextInput = page.locator('input[data-test-id="9fd3c38fdf5de68aaa56e298a8c89587"]');
    attributes = await common.getAttributes(conditionallyDisabledTextInput);
    if (isDisabled) {
      await expect(attributes.includes('disabled')).toBeTruthy();
    } else {
      await expect(attributes.includes('disabled')).toBeFalsy();
    }

    const neverDisabledTextInput = page.locator('input[data-test-id="0aac4de2a6b79dd12ef91c6f16708533"]');
    attributes = await common.getAttributes(neverDisabledTextInput);
    await expect(attributes.includes('disabled')).toBeFalsy();

    /** Selecting Update from the Sub Category dropdown */
    await common.selectSubCategory('Update', page);

    /** Update tests */
    // const readonlyTextInput = page.locator(
    //   'input[data-test-id="2fff66b4f045e02eab5826ba25608807"]'
    // );
    // attributes = await common.getAttributes(readonlyTextInput);
    // await expect(attributes.includes('readonly')).toBeTruthy();

    const EditableTextInput = page.locator('input[data-test-id="95134a02d891264bca28c3aad682afb7"]');
    attributes = await common.getAttributes(EditableTextInput);
    await expect(attributes.includes('readonly')).toBeFalsy();

    /** Selecting Visibility from the Sub Category dropdown */
    await common.selectSubCategory('Visibility', page);

    /** Visibility tests */
    await expect(page.locator('input[data-test-id="a03145775f20271d9f1276b0959d0b8e"]')).toBeVisible();

    const neverVisibleTextInput = await page.locator('input[data-test-id="05bf85e34402515bd91335928c06117d"]');
    await expect(neverVisibleTextInput).not.toBeVisible();

    const conditionallyVisibleTextInput = await page.locator('input[data-test-id="d4b374793638017e2ec1b86c81bb1208"]');

    if (isVisible) {
      await expect(conditionallyVisibleTextInput).toBeVisible();
    } else {
      await expect(conditionallyVisibleTextInput).not.toBeVisible();
    }
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
