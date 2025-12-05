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

  test('should login, create case and run the Phone tests', async ({ page }) => {
    await common.login(config.config.apps.digv2.user.username, config.config.apps.digv2.user.password, page);

    await common.verifyHomePage(page);

    /** Click on the Create Case button */
    await common.createCase('Form Field', page);

    await common.selectCategory('Phone', page);

    /** Selecting Required from the Sub Category dropdown */
    await common.selectSubCategory('Required', page);

    /** Required tests */
    // const requiredPhone = page.locator(
    //   'div[data-test-id="af983eaa1b85b015a7654702abd0b249"] >> input'
    // );
    // attributes = await common.getAttributes(requiredPhone);
    // await expect(attributes.includes('required')).toBeTruthy();

    // const notrequiredPhone = page.locator(
    //   'div[data-test-id="8e20f3ae84ebed6107f2672dd430500f"] >> input'
    // );
    // attributes = await common.getAttributes(notrequiredPhone);
    // await expect(attributes.includes('required')).toBeFalsy();

    await page.locator('mat-tel-input[data-test-id="af983eaa1b85b015a7654702abd0b249"] >> input').click();
    await page.locator('button:has-text("submit")').click();
    await expect(page.locator('mat-error')).toBeVisible();

    const requiredPhone = page.locator('mat-tel-input[data-test-id="af983eaa1b85b015a7654702abd0b249"] >> input');
    await requiredPhone.fill('6175551212');
    requiredPhone.blur();
    await expect(page.locator('mat-error')).toBeHidden();

    /** Selecting Disable from the Sub Category dropdown */
    await common.selectSubCategory('Disable', page);

    // /** Disable tests */
    const alwaysDisabledPhone = page.locator('mat-tel-input[data-test-id="d415da67e9764d6e7cdf3d993cb54f51"] >> input');
    attributes = await common.getAttributes(alwaysDisabledPhone);
    await expect(attributes.includes('disabled')).toBeTruthy();

    const conditionallyDisabledPhone = page.locator('mat-tel-input[data-test-id="b6cee3728235ed1f6cef7b11ac850ea9"] >> input');
    attributes = await common.getAttributes(conditionallyDisabledPhone);
    if (isDisabled) {
      await expect(attributes.includes('disabled')).toBeTruthy();
    } else {
      await expect(attributes.includes('disabled')).toBeFalsy();
    }

    const neverDisabledPhone = page.locator('mat-tel-input[data-test-id="b23e38f877c8a40f18507b39893a8d61"] >> input');
    attributes = await common.getAttributes(neverDisabledPhone);
    await expect(attributes.includes('disabled')).toBeFalsy();

    /** Selecting Update from the Sub Category dropdown */
    await common.selectSubCategory('Update', page);

    /** Update tests */
    // const readonlyPhone = page.locator(
    //   'input[data-test-id="2c511e68e41cb70907b27a00de6b18b9"]'
    // );
    // attributes = await common.getAttributes(readonlyPhone);
    // await expect(attributes.includes('readonly')).toBeTruthy();

    const editablePhone = page.locator('mat-tel-input[data-test-id="591e127300787ad31c414b7159469b9e"]');
    const countrySelector = editablePhone.locator('button');
    await countrySelector.click();
    await page.locator('text=United States >> nth=0').click();
    const editablePhoneInput = editablePhone.locator('input');
    await editablePhoneInput.click();
    await editablePhoneInput.fill('6175551212');

    /** Validation tests */
    const validationMsg = 'Enter a valid phone number';
    await editablePhoneInput.clear();
    await countrySelector.click();
    await page.locator('text=United States >> nth=0').click();
    await editablePhoneInput.click();
    /** Entering an invalid Phone number */
    await editablePhoneInput.fill('61');
    await editablePhoneInput.blur();
    /** Expecting an error for Invalid phone number */
    await expect(page.locator(`mat-error:has-text("${validationMsg}")`)).toBeVisible();

    /** Entering a valid Phone number */
    await editablePhoneInput.clear();
    await countrySelector.click();
    await page.locator('text=United States >> nth=0').click();
    await editablePhoneInput.fill('6175551212');

    await editablePhoneInput.blur();
    /** Expecting the invalid Phone number error be no longer present */
    await expect(page.locator(`mat-error:has-text("${validationMsg}")`)).toBeHidden();

    attributes = await common.getAttributes(editablePhone);
    await expect(attributes.includes('readonly')).toBeFalsy();

    /** Selecting Visibility from the Sub Category dropdown */
    await common.selectSubCategory('Visibility', page);

    /** Visibility tests */
    await expect(page.locator('mat-tel-input[data-test-id="6637b718c18a1fd292d28b6abaa68d50"] >> input')).toBeVisible();

    const neverVisiblePhone = await page.locator('div[data-test-id="f425267235530e772d7daa0a0881c822"] >> input');
    await expect(neverVisiblePhone).not.toBeVisible();

    const conditionallyVisiblePhone = await page.locator('mat-tel-input[data-test-id="ad9995a1b5001e6d153d363465371528"] >> input');

    if (isVisible) {
      await expect(conditionallyVisiblePhone).toBeVisible();
    } else {
      await expect(conditionallyVisiblePhone).not.toBeVisible();
    }
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
