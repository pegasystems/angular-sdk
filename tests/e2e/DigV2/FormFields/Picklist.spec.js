const { test, expect } = require('@playwright/test');

const config = require('../../../config');
const common = require('../../../common');

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto(config.config.baseUrl, { waitUntil: 'networkidle' });
});

test.describe('E2E test', () => {
  test('should login, create case and run the Email tests', async ({ page }) => {
    await common.login(config.config.apps.digv2.user.username, config.config.apps.digv2.user.password, page);

    await common.verifyHomePage(page);

    /** Click on the Create Case button */
    await common.createCase('Form Field', page);

    await common.selectCategory('PickList', page);

    /** Selecting Datapage from the Sub Category dropdown */
    await common.selectSubCategory('DataPage', page);

    /** Dropdown tests */
    const picklistAs = page.locator('mat-select[data-test-id="683ea3aece0dce7e065d31d43f1c269b"]');
    await picklistAs.click();
    await page.getByRole('option', { name: 'Dropdown' }).click();

    const dropdown = page.locator('mat-select[data-test-id="94cb322b7468c7827d336398e525827e"]');
    await dropdown.click();
    await page.getByRole('option', { name: 'Massachusetts' }).click();

    /** Autocomplete tests */
    await picklistAs.click();
    await page.getByRole('option', { name: 'AutoComplete' }).click();

    const autocomplete = page.locator('input[data-test-id="ed90c4ad051fd65a1d9f0930ec4b2276"]');
    await autocomplete.click();
    await page.locator('mat-option:has-text("Colorado")').click();

    /** Radiobutton tests */
    await picklistAs.click();
    await page.getByRole('option', { name: 'RadioButtons' }).click();

    const radiobutton = page.locator('mat-radio-group[data-test-id="b33340542f8f3efd4e91279520a197cf"]');
    const requiredDateInput = radiobutton.locator('mat-radio-button >> nth=0');
    await requiredDateInput.click();

    const radiobutton2 = page.locator('mat-radio-group[data-test-id="9649dad0b2aee94bc3250d26162cb593"]');
    const requiredDateInput2 = radiobutton2.locator('mat-radio-button >> nth=1');
    await requiredDateInput2.click();

    await page.locator('button:has-text("submit")').click();
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
