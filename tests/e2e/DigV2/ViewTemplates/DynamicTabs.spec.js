const { test, expect } = require('@playwright/test');

const config = require('../../../config');
const common = require('../../../common');

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1720, height: 1080 });
  await page.goto(config.config.baseUrl, { waitUntil: 'networkidle' });
});

test.describe('E2E test', () => {
  test('should login, create case and run different test cases for Dynamic Tabs', async ({ page }) => {
    await common.login(config.config.apps.digv2.user.username, config.config.apps.digv2.user.password, page);

    await common.verifyHomePage(page);

    /** Click on the Create Case button */
    await common.createCase('View Templates', page);

    /** Selecting Dynamic Tabs from the Category dropdown */
    await common.selectCategory('Dynamic Tabs', page);

    await page.locator('button:has-text("submit")').click();

    const title = await page.locator('div.template-title-container span:has-text("Dynamic Tabs Template")');
    await expect(title).toBeVisible();

    const tablist = await page.locator('mat-tab-group[id="dynamic-tabs"] div[role="tablist"]');
    const tabpanel = await page.locator('mat-tab-group[id="dynamic-tabs"] mat-tab-body[role="tabpanel"]');

    await expect(tabpanel.nth(0).getByText('Make')).toBeVisible();
    await expect(tabpanel.nth(0).getByText('BMW')).toBeVisible();

    await tablist.locator('div[role="tab"]').nth(1).click();
    expect(await tabpanel.nth(1).getByText('Make')).toBeVisible();
    expect(await tabpanel.nth(1).getByText('Audi')).toBeVisible();

    await tablist.locator('div[role="tab"]').nth(2).click();
    expect(await tabpanel.nth(2).getByText('Make')).toBeVisible();
    expect(await tabpanel.nth(2).getByText('FIAT')).toBeVisible();

    await tablist.locator('div[role="tab"]').nth(3).click();
    expect(await tabpanel.nth(3).getByText('Make')).toBeVisible();
    expect(await tabpanel.nth(3).getByText('Chevrolet')).toBeVisible();

    /** Submitting the case */
    await page.locator('button:has-text("submit")').click();
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
