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

    await common.verifyHomePage(page);

    /** Click on the Create Case button */
    await common.createCase('Form Field', page);

    /** Selecting Date from the Category dropdown */
    await common.selectCategory('DateTime', page, true);

    /** Selecting Required from the Sub Category dropdown */
    await common.selectSubCategory('Required', page);

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
    await common.selectSubCategory('Disable', page);

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
    await common.selectSubCategory('Update', page);

    /** Update tests */
    const editableDateTime = page.locator('input[data-test-id="4e5110fbcaf65441b3e4c763907b5eb8"]');
    await editableDateTime.click();
    await editableDateTime.fill(formattedDate);
    attributes = await common.getAttributes(editableDateTime);
    await expect(attributes.includes('readonly')).toBeFalsy();

    /** Selecting Visibility from the Sub Category dropdown */
    await common.selectSubCategory('Visibility', page);

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
