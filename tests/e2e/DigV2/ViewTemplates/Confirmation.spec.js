const { test, expect } = require('@playwright/test');
const config = require('../../../config');
const common = require('../../../common');

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1720, height: 1080 });
  await page.goto(config.config.baseUrl, { waitUntil: 'networkidle' });
});

test.describe('E2E test', () => {
  test('should login, create case and run different test cases for Confirmation', async ({ page }) => {
    await common.login(config.config.apps.digv2.user.username, config.config.apps.digv2.user.password, page);

    await common.verifyHomePage(page);

    await common.createCase('View Templates', page);

    /** Selecting User Reference from the Category dropdown */
    await common.selectCategory('Confirmation', page);

    const caseID = await page.locator('div[id="caseId"]').textContent();

    await page.locator('button:has-text("submit")').click();

    /** Entering some data that will be verified on the Confirmation screen */
    const firstNameInput = page.locator('input[data-test-id="BC910F8BDF70F29374F496F05BE0330C"]');
    await firstNameInput.click();
    await firstNameInput.fill('John');

    const lastNameInput = page.locator('input[data-test-id="77587239BF4C54EA493C7033E1DBF636"]');
    await lastNameInput.click();
    await lastNameInput.fill('Doe');

    const cityInput = page.locator('input[data-test-id="57D056ED0984166336B7879C2AF3657F"]');
    await cityInput.click();
    await cityInput.fill('Cambridge');

    const phone = page.locator('mat-tel-input[data-test-id="1F8261D17452A959E013666C5DF45E07"]');
    const countrySelector = phone.locator('button.country-selector');
    await countrySelector.click();
    await page.locator('div.flag.US >> nth=0').click();
    await phone.locator('input[type="tel"]').fill('(201) 555-0123');

    await page.locator('button:has-text("submit")').click();

    /** Testing the values present on Confirmation screen */
    await expect(page.locator('h2[id="confirm-label"]')).toBeVisible();

    await expect(page.locator('div >> text="John"')).toBeVisible();
    await expect(page.locator('div >> text="Doe"')).toBeVisible();
    await expect(page.locator('div >> text="Cambridge"')).toBeVisible();
    await expect(page.locator('a >> text="+12015550123"')).toBeVisible();

    await expect(page.locator('div >> text="Case View"')).toBeVisible();

    await expect(page.locator('app-default-form').getByText(caseID)).toBeVisible();

    await page.locator('button:has-text("Done")').click();

    /** Testing the values that shouldn't be present now */
    await expect(page.locator('div >> text="John"')).toBeHidden();
    await expect(page.locator('div >> text="Doe"')).toBeHidden();
    await expect(page.locator('div >> text="Cambridge"')).toBeHidden();
    await expect(page.locator('a >> text="+12015550123"')).toBeHidden();

    await expect(page.locator('div >> text="Case View"')).toBeHidden();

    await expect(page.locator(`label >> text=${caseID}`)).toBeHidden();
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
