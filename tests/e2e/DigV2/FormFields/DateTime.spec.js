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

  test('should login, create case and run the DateTime tests', async ({ page }) => {
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

    /** Selecting Date from the Category dropdown */
    const selectedCategory = page.locator('mat-select[data-test-id="76729937a5eb6b0fd88c42581161facd"]');
    await selectedCategory.click();
    await page.locator('mat-option >> span').getByText('DateTime', { exact: true }).click();

    /** Selecting Required from the Sub Category dropdown */
    let selectedSubCategory = page.locator('mat-select[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Required' }).click();

    await page.locator('button:has-text("submit")').click();

    await expect(page.locator('mat-error')).toBeVisible();

    /** Required tests */
    const requiredDateTime = page.locator('input[data-test-id="8c40204d0a4eee26d94339eee34ac0dd"]');
    const date = new Date();
    const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date
      .getDate()
      .toString()
      .padStart(2, '0')}/${date.getFullYear()}, ${(date.getHours() % 12).toString().padStart(2, '0')}:${date
      .getMinutes()
      .toString()
      .padStart(2, '0')} AM`;
    await requiredDateTime.click();
    await requiredDateTime.pressSequentially(formattedDate);
    requiredDateTime.blur();

    await expect(page.locator('mat-error')).toBeHidden();

    attributes = await common.getAttributes(requiredDateTime);
    await expect(attributes.includes('required')).toBeTruthy();

    const notRequiredDateTime = page.locator('input[data-test-id="4af9f6fe0973eef74015a25fc36784c0"]');
    attributes = await common.getAttributes(notRequiredDateTime);
    await expect(attributes.includes('required')).toBeFalsy();

    /** Selecting Disable from the Sub Category dropdown */
    selectedSubCategory = page.locator('mat-select[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Disable' }).click();

    // /** Disable tests */
    const alwaysDisabledDateTime = page.locator('input[data-test-id="94d0498d6fd5a5aa2db1145100810fc3"]');
    attributes = await common.getAttributes(alwaysDisabledDateTime);
    await expect(attributes.includes('disabled')).toBeTruthy();

    const conditionallyDisabledDateTime = page.locator('input[data-test-id="98882344d484a1122bdb831ace88b0d3"]');
    attributes = await common.getAttributes(conditionallyDisabledDateTime);
    if (isDisabled) {
      await expect(attributes.includes('disabled')).toBeTruthy();
    } else {
      await expect(attributes.includes('disabled')).toBeFalsy();
    }

    const neverDisabledDateTime = page.locator('input[data-test-id="33d5b006df6170d453d52c438271f0eb"]');
    attributes = await common.getAttributes(neverDisabledDateTime);
    await expect(attributes.includes('disabled')).toBeFalsy();

    /** Selecting Update from the Sub Category dropdown */
    selectedSubCategory = page.locator('mat-select[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Update' }).click();

    /** Update tests */
    const editableDateTime = page.locator('input[data-test-id="4e5110fbcaf65441b3e4c763907b5eb8"]');
    await editableDateTime.click();
    await editableDateTime.fill(formattedDate);
    attributes = await common.getAttributes(editableDateTime);
    await expect(attributes.includes('readonly')).toBeFalsy();

    /** Selecting Visibility from the Sub Category dropdown */
    selectedSubCategory = page.locator('mat-select[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Visibility' }).click();

    /** Visibility tests */
    await expect(page.locator('input[data-test-id="f7bace3922d6b19942bcb05f4bbe34ff"]')).toBeVisible();

    const neverVisibleDateTime = await page.locator('input[data-test-id="33d5b006df6170d453d52c438271f0eb"]');
    await expect(neverVisibleDateTime).not.toBeVisible();

    const conditionallyVisibleDateTime = await page.locator('input[data-test-id="d7168c76ee76f4242fee3afbd4c9f745"]');
    if (isVisible) {
      await expect(conditionallyVisibleDateTime).toBeVisible();
    } else {
      await expect(conditionallyVisibleDateTime).not.toBeVisible();
    }
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
