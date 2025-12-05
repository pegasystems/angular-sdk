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

  test('should login, create case and run the Integer tests', async ({ page }) => {
    await common.login(config.config.apps.digv2.user.username, config.config.apps.digv2.user.password, page);

    await common.verifyHomePage(page);

    /** Click on the Create Case button */
    await common.createCase('Form Field', page);

    /** Selecting Integer from the Category dropdown */
    await common.selectCategory('Integer', page);

    /** Selecting Required from the Sub Category dropdown */
    await common.selectSubCategory('Required', page);

    await page.locator('button:has-text("submit")').click();

    await expect(page.locator('mat-error')).toBeVisible();

    /** Required tests */
    const requiredInteger = page.locator('input[data-test-id="0658481a174254dded4a0c1ffe6b8380"]');
    await requiredInteger.fill('10000');
    requiredInteger.blur();
    await expect(page.locator('mat-error')).toBeHidden();

    attributes = await common.getAttributes(requiredInteger);
    await expect(attributes.includes('required')).toBeTruthy();

    const notrequiredInteger = page.locator('input[data-test-id="898ba585340f471eecde6b5e798e4df9"]');
    attributes = await common.getAttributes(notrequiredInteger);
    await expect(attributes.includes('required')).toBeFalsy();

    /** Selecting Disable from the Sub Category dropdown */
    await common.selectSubCategory('Disable', page);

    // /** Disable tests */
    const alwaysDisabledInteger = page.locator('input[data-test-id="54a4d3f4aa52da1985ec70df7cae41bf"]');
    attributes = await common.getAttributes(alwaysDisabledInteger);
    await expect(attributes.includes('disabled')).toBeTruthy();

    const conditionallyDisabledInteger = page.locator('input[data-test-id="880afccc457382196a2164f04aeeb19d"]');
    attributes = await common.getAttributes(conditionallyDisabledInteger);
    if (isDisabled) {
      await expect(attributes.includes('disabled')).toBeTruthy();
    } else {
      await expect(attributes.includes('disabled')).toBeFalsy();
    }

    const neverDisabledInteger = page.locator('input[data-test-id="42369a000d05b1bb387c743252b94085"]');
    attributes = await common.getAttributes(neverDisabledInteger);
    await expect(attributes.includes('disabled')).toBeFalsy();

    /** Selecting Update from the Sub Category dropdown */
    await common.selectSubCategory('Update', page);

    /** Update tests */
    // const readonlyInteger = page.locator(
    //   'input[data-test-id="c6f04035ab4212992a31968bf190875b"]'
    // );
    // attributes = await common.getAttributes(readonlyInteger);
    // await expect(attributes.includes('readonly')).toBeTruthy();

    const editableInteger = page.locator('input[data-test-id="c2aac6ae0d08ac599edf0ea4f27c5437"]');
    editableInteger.fill('10000');

    attributes = await common.getAttributes(editableInteger);
    await expect(attributes.includes('readonly')).toBeFalsy();

    /** Selecting Visibility from the Sub Category dropdown */
    await common.selectSubCategory('Visibility', page);

    /** Visibility tests */
    await expect(page.locator('input[data-test-id="4c6e4bb7d9b71d6b45cd6ae61b9ca334"]')).toBeVisible();

    const neverVisibleInteger = await page.locator('input[data-test-id="98c754d4acf25bb98ea8a2c46b28275c"]');
    await expect(neverVisibleInteger).not.toBeVisible();

    const conditionallyVisibleInteger = await page.locator('input[data-test-id="655ddd9a5d76e464311c32d2b53bf963"]');

    if (isVisible) {
      await expect(conditionallyVisibleInteger).toBeVisible();
    } else {
      await expect(conditionallyVisibleInteger).not.toBeVisible();
    }
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
