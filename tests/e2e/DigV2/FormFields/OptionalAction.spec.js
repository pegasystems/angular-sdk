const { test, expect } = require('@playwright/test');

const config = require('../../../config');
const common = require('../../../common');

test.beforeEach(common.launchPortal);

test.describe('E2E test', () => {
  test('should login, create case and run the Optional Action tests', async ({ page }) => {
    await common.login(config.config.apps.digv2.user.username, config.config.apps.digv2.user.password, page);

    await common.verifyHomePage(page);

    /** Click on the Create Case button */
    await common.createCase('Form Field', page);

    await common.selectCategory('TextInput', page);

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
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
