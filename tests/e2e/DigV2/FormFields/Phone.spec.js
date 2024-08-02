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

    /** Testing announcement banner presence */
    const announcementBanner = page.locator('h2:has-text("Announcements")');
    await expect(announcementBanner).toBeVisible();

    /** Testing worklist presence */
    const worklist = page.locator('div[id="worklist"]:has-text("My Worklist")');
    await expect(worklist).toBeVisible();

    const createCase = page.locator('mat-list-item[id="create-case-button"]');
    await createCase.click();

    /** Creating a Form Field case-type */
    const formFieldCase = page.locator('mat-list-item[id="case-list-item"] > span:has-text("Form Field")');
    await formFieldCase.click();

    /** Selecting Phone from the Category dropdown */
    const selectedCategory = page.locator('mat-select[data-test-id="76729937a5eb6b0fd88c42581161facd"]');
    await selectedCategory.click();
    await page.getByRole('option', { name: 'Phone' }).click();

    /** Selecting Required from the Sub Category dropdown */
    let selectedSubCategory = page.locator('mat-select[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Required' }).click();

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
    await page.locator('button:has-text("submit")').click();
    await expect(page.locator('mat-error')).toBeVisible();

    const requiredPhone = page.locator('ngx-mat-intl-tel-input[data-test-id="af983eaa1b85b015a7654702abd0b249"] >> input');
    requiredPhone.fill('6175551212');
    await expect(page.locator('mat-error')).toBeHidden();

    /** Selecting Disable from the Sub Category dropdown */
    selectedSubCategory = page.locator('mat-select[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Disable' }).click();

    // /** Disable tests */
    const alwaysDisabledPhone = page.locator('ngx-mat-intl-tel-input[data-test-id="d415da67e9764d6e7cdf3d993cb54f51"] >> input');
    attributes = await common.getAttributes(alwaysDisabledPhone);
    await expect(attributes.includes('disabled')).toBeTruthy();

    const conditionallyDisabledPhone = page.locator('ngx-mat-intl-tel-input[data-test-id="b6cee3728235ed1f6cef7b11ac850ea9"] >> input');
    attributes = await common.getAttributes(conditionallyDisabledPhone);
    if (isDisabled) {
      await expect(attributes.includes('disabled')).toBeTruthy();
    } else {
      await expect(attributes.includes('disabled')).toBeFalsy();
    }

    const neverDisabledPhone = page.locator('ngx-mat-intl-tel-input[data-test-id="b23e38f877c8a40f18507b39893a8d61"] >> input');
    attributes = await common.getAttributes(neverDisabledPhone);
    await expect(attributes.includes('disabled')).toBeFalsy();

    /** Selecting Update from the Sub Category dropdown */
    selectedSubCategory = page.locator('mat-select[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Update' }).click();

    /** Update tests */
    // const readonlyPhone = page.locator(
    //   'input[data-test-id="2c511e68e41cb70907b27a00de6b18b9"]'
    // );
    // attributes = await common.getAttributes(readonlyPhone);
    // await expect(attributes.includes('readonly')).toBeTruthy();

    const editablePhone = page.locator('ngx-mat-intl-tel-input[data-test-id="591e127300787ad31c414b7159469b9e"]');
    const countrySelector = editablePhone.locator('button');
    await countrySelector.click();
    await page.locator('text=United States >> nth=0').click();
    const editablePhoneInput = editablePhone.locator('input');
    await editablePhoneInput.click();
    await editablePhoneInput.fill('6175551212');

    /** Validation tests */
    const validationMsg = 'Invalid Phone';
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
    selectedSubCategory = page.locator('mat-select[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Visibility' }).click();

    /** Visibility tests */
    await expect(page.locator('ngx-mat-intl-tel-input[data-test-id="6637b718c18a1fd292d28b6abaa68d50"] >> input')).toBeVisible();

    const neverVisiblePhone = await page.locator('div[data-test-id="f425267235530e772d7daa0a0881c822"] >> input');
    await expect(neverVisiblePhone).not.toBeVisible();

    const conditionallyVisiblePhone = await page.locator('ngx-mat-intl-tel-input[data-test-id="ad9995a1b5001e6d153d363465371528"] >> input');

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
