const { test, expect } = require('@playwright/test');

const config = require('../../../config');
const common = require('../../../common');

test.beforeEach(common.launchPortal);

test.describe('E2E test', () => {
  test('should login, create case and run the Optional Action tests', async ({ page }) => {
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
    const formFieldsCase = page.locator('mat-list-item[id="case-list-item"] > span:has-text("Form Field")');
    await formFieldsCase.click();

    const selectedCategory = page.locator('mat-select[data-test-id="76729937a5eb6b0fd88c42581161facd"]');
    await selectedCategory.click();
    await page.getByRole('option', { name: 'TextInput' }).click();

    const actions = page.locator('button:has-text("Actions...")');
    await actions.click();

    await page.locator('button[role="menuitem"]:has-text("Multi Step Test")').click();

    let input = page.locator('input[data-test-id="8ca45623e49263849b3bf9f67c03999f"]');
    await input.fill('John Doe');

    await page.locator('button:has-text("Next")').click();

    input = page.locator('input[data-test-id="a45879b4fd9831ffbd28fcc759f051a1"]');
    await input.fill('John@doe.com');

    await page.locator('button:has-text("Submit")').click();

    await page.locator('button:has-text("Go")').click();
    await selectedCategory.click();
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
