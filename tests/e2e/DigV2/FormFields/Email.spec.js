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

  test('should login, create case and run the Email tests', async ({ page }) => {
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

    /** Creating a Form Field case-type */
    const formFieldCase = page.locator('mat-list-item[id="case-list-item"] > span:has-text("Form Field")');
    await formFieldCase.click();

    /** Selecting Email from the Category dropdown */
    const selectedCategory = page.locator('mat-select[data-test-id="76729937a5eb6b0fd88c42581161facd"]');
    await selectedCategory.click();
    await page.getByRole('option', { name: 'Email' }).click();

    /** Selecting Required from the Sub Category dropdown */
    let selectedSubCategory = page.locator('mat-select[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Required' }).click();

    await page.locator('button:has-text("submit")').click();

    await expect(page.locator('mat-error')).toBeVisible();

    /** Required tests */
    const requiredEmail = page.locator('input[data-test-id="96fa7548c363cdd5adb29c2c2749e436"]');

    requiredEmail.fill('John@doe.com');
    await expect(page.locator('mat-error')).toBeHidden();

    attributes = await common.getAttributes(requiredEmail);
    await expect(attributes.includes('required')).toBeTruthy();

    const notRequiredEmail = page.locator('input[data-test-id="ead104471c2e64511e7593a80b823e42"]');
    attributes = await common.getAttributes(notRequiredEmail);
    await expect(attributes.includes('required')).toBeFalsy();

    /** Selecting Disable from the Sub Category dropdown */
    selectedSubCategory = page.locator('mat-select[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Disable' }).click();

    // /** Disable tests */
    const alwaysDisabledEmail = page.locator('input[data-test-id="b949bbfd05d3e96a0102055e448dd7ab"]');
    attributes = await common.getAttributes(alwaysDisabledEmail);
    await expect(attributes.includes('disabled')).toBeTruthy();

    const conditionallyDisabledEmail = page.locator('input[data-test-id="23104b6fc0da1045beb3f037698201aa"]');
    attributes = await common.getAttributes(conditionallyDisabledEmail);
    if (isDisabled) {
      await expect(attributes.includes('disabled')).toBeTruthy();
    } else {
      await expect(attributes.includes('disabled')).toBeFalsy();
    }

    const neverDisabledEmail = page.locator('input[data-test-id="15d6a12d383c87b8695f8f11523af8c6"]');
    attributes = await common.getAttributes(neverDisabledEmail);
    await expect(attributes.includes('disabled')).toBeFalsy();

    /** Selecting Update from the Sub Category dropdown */
    selectedSubCategory = page.locator('mat-select[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Update' }).click();

    /** Update tests */
    // const readonlyEmail = page.locator(
    //   'input[data-test-id="88ee5a6a4cc37dab09907ea81c546a19"]'
    // );
    // attributes = await common.getAttributes(readonlyEmail);
    // await expect(attributes.includes('readonly')).toBeTruthy();

    const editableEmail = page.locator('input[data-test-id="c75f8a926bb5e08fd8342f7fe45dc344"]');
    await editableEmail.fill('Johndoe.com');
    await editableEmail.blur();
    await page.waitForResponse('**/actions/SelectTest/refresh');
    const validMsg = "Invalid value specified for EmailEditable. Value doesn\\'t adhere to the Validate: ValidEmailAddress";
    await expect(page.locator(`mat-error:has-text("${validMsg}")`)).toBeVisible();
    editableEmail.fill('John@doe.com');
    await editableEmail.blur();
    await expect(page.locator(`mat-error:has-text("${validMsg}")`)).toBeHidden();

    attributes = await common.getAttributes(editableEmail);
    await expect(attributes.includes('readonly')).toBeFalsy();

    /** Selecting Visibility from the Sub Category dropdown */
    selectedSubCategory = page.locator('mat-select[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Visibility' }).click();

    /** Visibility tests */
    await expect(page.locator('input[data-test-id="c30b8043cb501907a3e7b186fb37a85b"]')).toBeVisible();

    const neverVisibleEmail = await page.locator('input[data-test-id="5aa7a927ac4876abf1fcff6187ce5d76"]');
    await expect(neverVisibleEmail).not.toBeVisible();

    const conditionallyVisibleEmail = await page.locator('input[data-test-id="7f544a3551e7d7e51222dec315e7add5"]');

    if (isVisible) {
      await expect(conditionallyVisibleEmail).toBeVisible();
    } else {
      await expect(conditionallyVisibleEmail).not.toBeVisible();
    }
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
