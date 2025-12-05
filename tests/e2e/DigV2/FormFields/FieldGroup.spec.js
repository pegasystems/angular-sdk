const { test, expect } = require('@playwright/test');

const config = require('../../../config');
const common = require('../../../common');

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto(config.config.baseUrl, { waitUntil: 'networkidle' });
});

test.describe('E2E test', () => {
  test('should login, create case and run the FieldGroup tests', async ({ page }) => {
    await common.login(config.config.apps.digv2.user.username, config.config.apps.digv2.user.password, page);

    await common.verifyHomePage(page);

    /** Click on the Create Case button */
    await common.createCase('Form Field', page);

    /** Selecting Group from the Category dropdown */
    await common.selectCategory('Group', page);

    /** Selecting Editable from the Sub Category dropdown */
    await common.selectSubCategory('Editable', page);

    // Editable Field Group Tests
    await expect(page.getByText('Field Group with Instructions')).toBeVisible();
    await expect(page.getByText('Instruction text for Field Group')).toBeVisible();

    await page.locator('input[data-test-id="e168c363420fd1c9a8554611faeaf032"]').fill('John Doe');
    await page.locator('mat-checkbox[data-test-id="a032469ff9249c2c8b2899b2c9a5dc92"] >> input[type="checkbox"]').check();
    await page.locator('mat-select[data-test-id="768a96ac6004939bb62c0530652bdc7c"]').click();
    await page.getByRole('option', { name: 'United States' }).click();

    /** Selecting ReadOnly from the Sub Category dropdown */
    await common.selectSubCategory('ReadOnly', page);

    // ReadOnly Tests
    await expect(page.getByText('ReadOnly Text input')).toBeVisible();
    await expect(page.getByText('John Doe')).toBeVisible();
    await expect(page.getByText('ReadOnly Boolean')).toBeVisible();
    await expect(page.getByText('Yes')).toBeVisible();
    await expect(page.getByText('ReadyOnly Dropdown')).toBeVisible();
    await expect(page.getByText('United States')).toBeVisible();

    /** Selecting Collapsible from the Sub Category dropdown */
    await common.selectSubCategory('Collapsible', page);

    // Collapsible Tests
    await expect(page.getByText('Collapsible Field Group')).toBeVisible();
    await expect(page.locator('input[data-test-id="861d2d04e52d59e8b85a27fd5b4aef28"]')).toHaveValue('John Doe');
    await expect(await page.locator('mat-select[data-test-id="8e70e124867b68bec5cbf1f2f25da383"] >> span >> span').textContent()).toBe(
      'United States'
    );

    // Collapse Field Group
    await page.locator('span[id="field-group-header"] mat-icon').click();
    await expect(page.locator('input[data-test-id="861d2d04e52d59e8b85a27fd5b4aef28"]')).toBeHidden();

    // Expand Field Group
    await page.locator('span[id="field-group-header"] mat-icon').click();
    await expect(page.locator('input[data-test-id="861d2d04e52d59e8b85a27fd5b4aef28"]')).toBeVisible();
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
