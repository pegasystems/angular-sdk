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

  test('should login, create case and run the Date tests', async ({ page }) => {
    await common.login(config.config.apps.digv2.user.username, config.config.apps.digv2.user.password, page);

    await common.verifyHomePage(page);

    /** Click on the Create Case button */
    await common.createCase('Form Field', page);

    /** Selecting Date from the Category dropdown */
    await common.selectCategory('Date', page, true);

    /** Selecting Required from the Sub Category dropdown */
    await common.selectSubCategory('Required', page);

    await page.locator('button:has-text("submit")').click();

    await expect(page.locator('mat-error')).toBeVisible();

    /** Required tests */
    const requiredDate = page.locator('input[data-test-id="4aeccb2d830e2836aebba27424c057e1"]');
    // const requiredDateInput = requiredDate.locator('input');
    await requiredDate.click();
    const futureDate = common.getFutureDate();
    await requiredDate.fill(futureDate);
    requiredDate.blur();

    await expect(page.locator('mat-error')).toBeHidden();

    attributes = await common.getAttributes(requiredDate);
    await expect(attributes.includes('required')).toBeTruthy();

    const notRequiredDate = page.locator('input[data-test-id="3f56f9d617e6174716d7730f8d69cce5"]');
    // const notRequiredDateInput = notRequiredDate.locator('input');
    attributes = await common.getAttributes(notRequiredDate);
    await expect(attributes.includes('required')).toBeFalsy();

    /** Selecting Disable from the Sub Category dropdown */
    await common.selectSubCategory('Disable', page);

    // /** Disable tests */
    const alwaysDisabledDate = page.locator('input[data-test-id="058f04d806163a3ea0ad42d63a44bff8"]');
    // const alwaysDisabledDateInput = alwaysDisabledDate.locator('input');
    attributes = await common.getAttributes(alwaysDisabledDate);
    await expect(attributes.includes('disabled')).toBeTruthy();

    const conditionallyDisabledDate = page.locator('input[data-test-id="1064f84bc0ba8525d5f141869fb73a3d"]');
    // const conditionallyDisabledDateInput = conditionallyDisabledDate.locator('input');
    attributes = await common.getAttributes(conditionallyDisabledDate);
    if (isDisabled) {
      await expect(attributes.includes('disabled')).toBeTruthy();
    } else {
      await expect(attributes.includes('disabled')).toBeFalsy();
    }

    const neverDisabledDate = page.locator('input[data-test-id="3cf7f70f60efb4035b562b6d5994badd"]');
    // const neverDisabledDateInput = neverDisabledDate.locator('input');
    attributes = await common.getAttributes(neverDisabledDate);
    await expect(attributes.includes('disabled')).toBeFalsy();

    /** Selecting Update from the Sub Category dropdown */
    await common.selectSubCategory('Update', page);

    /** Update tests */
    // const readonlyDate = page.locator('input[data-test-id="ffde26c63aa11b0de746587bc02779ee"]');
    // attributes = await common.getAttributes(readonlyDate);
    // await expect(attributes.includes('readonly')).toBeTruthy();

    const editableDate = page.locator('input[data-test-id="80f5dcc587f457378158bb305ec858a8"]');
    // const editableDateInput = editableDate.locator('input');
    await editableDate.click();
    await editableDate.fill(futureDate);
    attributes = await common.getAttributes(editableDate);
    await expect(attributes.includes('readonly')).toBeFalsy();

    /** Selecting Visibility from the Sub Category dropdown */
    await common.selectSubCategory('Visibility', page);

    /** Visibility tests */
    await expect(page.locator('input[data-test-id="8d1ca7132d5ebd69ccc69b850cf0e114"]')).toBeVisible();

    const neverVisibleDate = await page.locator('input[data-test-id="2d575befd938b2cf573f6cdee8d2c194"]');
    await expect(neverVisibleDate).not.toBeVisible();

    const conditionallyVisibleDate = await page.locator('input[data-test-id="2a50b142f72fe68effc573bb904c8364"]');
    // const conditionallyVisibleDateInput = conditionallyVisibleDate.locator('input');
    if (isVisible) {
      await expect(conditionallyVisibleDate).toBeVisible();
    } else {
      await expect(conditionallyVisibleDate).not.toBeVisible();
    }
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
