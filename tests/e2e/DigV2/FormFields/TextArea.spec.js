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

  test('should login, create case and run the TextArea tests', async ({ page }) => {
    await common.login(config.config.apps.digv2.user.username, config.config.apps.digv2.user.password, page);

    await common.verifyHomePage(page);

    /** Click on the Create Case button */
    await common.createCase('Form Field', page);

    /** Selecting TextArea from the Category dropdown */
    await common.selectCategory('TextArea', page);

    /** Selecting Required from the Sub Category dropdown */
    await common.selectSubCategory('Required', page);

    /** Required tests */
    const requiredTextArea = page.locator('textarea[data-test-id="b82763ad8469c6be8d3303a773fc3337"]');
    requiredTextArea.fill('This is a textarea');
    attributes = await common.getAttributes(requiredTextArea);
    await expect(attributes.includes('required')).toBeTruthy();

    const notrequiredTextArea = page.locator('textarea[data-test-id="c8e8140c523f01908b73d415ff81e5e9"]');
    attributes = await common.getAttributes(notrequiredTextArea);
    await expect(attributes.includes('required')).toBeFalsy();

    /** Selecting Disable from the Sub Category dropdown */
    await common.selectSubCategory('Disable', page);

    // /** Disable tests */
    const alwaysDisabledTextArea = page.locator('textarea[data-test-id="0a9da72f88e89b62d5477181f60e326d"]');
    attributes = await common.getAttributes(alwaysDisabledTextArea);
    await expect(attributes.includes('disabled')).toBeTruthy();

    const conditionallyDisabledTextArea = page.locator('textarea[data-test-id="ab462bc2f67456422bd65ef803e5f1f7"]');
    attributes = await common.getAttributes(conditionallyDisabledTextArea);
    if (isDisabled) {
      await expect(attributes.includes('disabled')).toBeTruthy();
    } else {
      await expect(attributes.includes('disabled')).toBeFalsy();
    }

    const neverDisabledTextArea = page.locator('textarea[data-test-id="3c91efe71a84d1331627d97d2871b6cc"]');
    attributes = await common.getAttributes(neverDisabledTextArea);
    await expect(attributes.includes('disabled')).toBeFalsy();

    /** Selecting Update from the Sub Category dropdown */
    await common.selectSubCategory('Update', page);

    /** Update tests */
    // const readonlyTextArea = page.locator(
    //   'textarea[data-test-id="77a1ab038e906456b8e8c94c1671518c"]'
    // );
    // attributes = await common.getAttributes(readonlyTextArea);
    // await expect(attributes.includes('readonly')).toBeTruthy();

    const editableTextArea = page.locator('textarea[data-test-id="66e97bb54e9e0ad5860ed79bb7b8e8d4"]');
    editableTextArea.fill('This is a TextArea');

    attributes = await common.getAttributes(editableTextArea);
    await expect(attributes.includes('readonly')).toBeFalsy();

    /** Selecting Visibility from the Sub Category dropdown */
    await common.selectSubCategory('Visibility', page);

    /** Visibility tests */
    await expect(page.locator('textarea[data-test-id="b1173be73e47e82896554ec60a590d6d"]')).toBeVisible();

    const neverVisibleTextArea = await page.locator('textarea[data-test-id="6de0e0e23e9aab0f4fef3d9d4f52c4d8"]');
    await expect(neverVisibleTextArea).not.toBeVisible();

    const conditionallyVisibleTextArea = await page.locator('textarea[data-test-id="4a41d6f28d7a25290f93127d3b5b0c64"]');

    if (isVisible) {
      await expect(conditionallyVisibleTextArea).toBeVisible();
    } else {
      await expect(conditionallyVisibleTextArea).not.toBeVisible();
    }
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
