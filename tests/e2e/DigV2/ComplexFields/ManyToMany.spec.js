// Ignoring this test due to this platform bug BUG-834448
const { test, expect } = require('@playwright/test');

const config = require('../../../config');
const common = require('../../../common');
test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto(config.config.baseUrl, { waitUntil: 'networkidle' });
});

test.describe('E2E test', () => {
  test('should login, create case and run different test cases for Many to Many', async ({ page }) => {
    await common.login(config.config.apps.digv2.user.username, config.config.apps.digv2.user.password, page);

    await common.verifyHomePage(page);

    /** Creating a Many to Many case-type */
    await common.createCase('Many to Many', page);

    const ID = '1234';
    const orderID = await page.locator('input[data-test-id="8f2a855dda1f657670e39f50eab1c10e"]');
    await orderID.fill(ID);

    const name = 'John Doe';
    const customerName = await page.locator('input[data-test-id="2ea989f83006e233627987293f4bde0a"]');
    await customerName.fill(name);

    let selectedProduct = await page.locator('tr:has-text("Samsung")');
    const selectedProductTestRow = selectedProduct.locator('input[type="checkbox"]');
    await selectedProductTestRow.click();

    selectedProduct = page.locator('tr:has-text("LG")');
    const selectedProductTestSecondRow = selectedProduct.locator('input[type="checkbox"]');
    await selectedProductTestSecondRow.click();

    selectedProduct = page.locator('tr:has-text("Apple")');
    const selectedProductTestThirdRow = selectedProduct.locator('input[type="checkbox"]');
    await selectedProductTestThirdRow.click();

    await page.locator('button:has-text("submit")').click();

    const table = page.locator('table[id="list-view"]');

    /** Testing the values present on Confirm screen */
    await expect(table.locator(`tr:has-text("${ID}") >> nth=0`)).toBeVisible();
    await expect(table.locator(`tr:has-text("${name}") >> nth=0`)).toBeVisible();
    await expect(table.locator('tr:has-text("Samsung")')).toBeVisible();
    await expect(table.locator('tr:has-text("Washing Machine")')).toBeVisible();
    await expect(table.locator('tr:has-text("LG")')).toBeVisible();
    await expect(table.locator('tr:has-text("Telivision")')).toBeVisible();
    await expect(table.locator('tr:has-text("Apple")')).toBeVisible();
    await expect(table.locator('tr:has-text("Mobile")')).toBeVisible();

    /** Submitting the case */
    await page.locator('button:has-text("submit")').click();
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
