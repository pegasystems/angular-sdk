const { test, expect } = require('@playwright/test');

const config = require('../../../config');
const common = require('../../../common');

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto(config.config.baseUrl, { waitUntil: 'networkidle' });
});

test.describe('E2E test', () => {
  test('should login, create case and run different test cases for RichText', async ({ page }) => {
    await common.login(config.config.apps.digv2.user.username, config.config.apps.digv2.user.password, page);

    await common.verifyHomePage(page);

    /** Creating a RichText Editor case-type */
    await common.createCase('RichText Editor', page);

    const instructionText = page.locator('div[id="instruction-text"]');

    const heading = instructionText.locator('h1:has-text("Heading 1")');
    await expect(heading).toBeVisible();

    const link = instructionText.locator('a:has-text("Hyperlink")');
    await expect(link).toBeVisible();

    const italicText = instructionText.locator('em:has-text("Italic text")');
    await expect(italicText).toBeVisible();

    const boldText = instructionText.locator('strong:has-text("Bold text")');
    await expect(boldText).toBeVisible();

    const listItem = instructionText.locator('li:has-text("India")');
    await expect(listItem).toBeVisible();

    const image = instructionText.locator('img');
    await expect(image).toBeDefined();

    const table = instructionText.locator('table');
    await expect(table).toBeDefined();

    /** Submitting the case */
    await page.locator('button:has-text("submit")').click();
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
