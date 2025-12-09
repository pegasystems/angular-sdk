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

  test('should login, create case and run the Percentage tests', async ({ page }) => {
    await common.login(config.config.apps.digv2.user.username, config.config.apps.digv2.user.password, page);

    await common.verifyHomePage(page);

    /** Click on the Create Case button */
    await common.createCase('Form Field', page);

    await common.selectCategory('Percentage', page);

    /** Selecting Required from the Sub Category dropdown */
    await common.selectSubCategory('Required', page);

    await page.locator('button:has-text("submit")').click();
    await expect(page.locator('mat-error')).toBeVisible();

    /** Required tests */
    const requiredPercentage = page.locator('input[data-test-id="86a805ca8375ed5df057777df74dd085"]');
    attributes = await common.getAttributes(requiredPercentage);
    await expect(attributes.includes('required')).toBeTruthy();

    const notrequiredPercentage = page.locator('input[data-test-id="b1de2a4d96400570b2f6de9defed1adc"]');
    attributes = await common.getAttributes(notrequiredPercentage);
    await expect(attributes.includes('required')).toBeFalsy();

    /** Selecting Disable from the Sub Category dropdown */
    await common.selectSubCategory('Disable', page);

    // /** Disable tests */
    const alwaysDisabledPercentage = page.locator('input[data-test-id="7900b3bd0ac7a6a59b1f5fe9b23749c4"]');
    attributes = await common.getAttributes(alwaysDisabledPercentage);
    await expect(attributes.includes('disabled')).toBeTruthy();

    const conditionallyDisabledPercentage = page.locator('input[data-test-id="2ba7bcc4ab57debc35f68e4dfd2c15d8"]');
    attributes = await common.getAttributes(conditionallyDisabledPercentage);
    if (isDisabled) {
      await expect(attributes.includes('disabled')).toBeTruthy();
    } else {
      await expect(attributes.includes('disabled')).toBeFalsy();
    }

    const neverDisabledPercentage = page.locator('input[data-test-id="bbbf1d564583c33adcd086b330fcb1f7"]');
    attributes = await common.getAttributes(neverDisabledPercentage);
    await expect(attributes.includes('disabled')).toBeFalsy();

    /** Selecting Update from the Sub Category dropdown */
    await common.selectSubCategory('Update', page);

    /** Update tests */
    // const readonlyPercentage = page.locator(
    //   'input[data-test-id="4d28c40ee619dafd16f7f4813e18ece6"]'
    // );
    // attributes = await common.getAttributes(readonlyPercentage);
    // await expect(attributes.includes('readonly')).toBeTruthy();

    const editablePercentage = page.locator('input[data-test-id="2cf58b575154624084c009d2648659ad"]');
    editablePercentage.fill('10000');

    attributes = await common.getAttributes(editablePercentage);
    await expect(attributes.includes('readonly')).toBeFalsy();

    /** Selecting Visibility from the Sub Category dropdown */
    await common.selectSubCategory('Visibility', page);

    /** Visibility tests */
    await expect(page.locator('input[data-test-id="bc2c3cb45ab755e262b381abbb0307fa"]')).toBeVisible();

    const neverVisiblePercentage = await page.locator('input[data-test-id="a3584329c24e284dda8d3771e72bca20"]');
    await expect(neverVisiblePercentage).not.toBeVisible();

    const conditionallyVisiblePercentage = await page.locator('input[data-test-id="d73817df2fef4a70f74349d3c70f10a5"]');

    if (isVisible) {
      await expect(conditionallyVisiblePercentage).toBeVisible();
    } else {
      await expect(conditionallyVisiblePercentage).not.toBeVisible();
    }
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
