const { test, expect } = require('@playwright/test');
const config = require('../../../config');
const common = require('../../../common');

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1720, height: 1080 });
  await page.goto(config.config.baseUrl, { waitUntil: 'networkidle' });
});

test.describe('E2E test', () => {
  test('should login, create case and run different test cases for Inline Dashboard template', async ({ page }) => {
    await common.login(config.config.apps.digv2.user.username, config.config.apps.digv2.user.password, page);

    await common.verifyHomePage(page);

    /** Click on the Create Case button */
    await common.createCase('Complex Fields', page);

    await common.selectCategory('DataReference', page, true);

    const caseID = await page.locator('div[id="caseId"]').textContent();

    await page.locator('button:has-text("submit")').click();

    await page.locator('button:has-text("Next")').click();

    const inlineDashboard = page.locator('mat-list-item > span:has-text("Inline Dashboard")');
    await inlineDashboard.click();

    const inlineDashboardTitle = page.locator('h4:has-text("Inline Dashboard")');
    inlineDashboardTitle.click();
    await expect(inlineDashboardTitle).toBeVisible();

    /** Testing Complex Fields list presence */
    const complexFieldsList = page.locator('h3:has-text("Complex  Fields - List")');
    await expect(complexFieldsList).toBeVisible();

    /** Testing My Work List presence */
    const myworkList = page.locator('h3:has-text("My Work List")');
    await expect(myworkList).toBeVisible();

    await expect(page.getByRole('button', { name: ' Case ID ' })).toBeVisible();

    const table = await page.locator('table[id="list-view"] >> nth=0');
    const numOfRows = await table.locator('tbody >> tr').count();

    /* Testing the filters */
    const filters = await page.locator('div[id="filters"]');
    const caseIdInput = filters.getByLabel('Case ID');
    await caseIdInput.click();
    await caseIdInput.pressSequentially(caseID, { delay: 100 });

    const pagination = page.locator('mat-paginator[id="pagination"]');
    await expect(pagination.getByText('1 – 1 of 1')).toBeVisible();

    await expect(table.locator(`td >> text=${caseID}`)).toBeVisible();
    await expect(table.locator('td >> text="Complex  Fields"')).toBeVisible();
    await expect(table.locator('td >> text="User DigV2"')).toBeVisible();
    await expect(table.locator('td >> text="New"')).toBeVisible();

    const today = new Date();
    const day = common.getFormattedDate(today);
    const nextDay = common.getFormattedDate(new Date(today.setDate(today.getDate() + 1)));
    const dateFilter = filters.locator('div:has-text("Create date/time")');
    let dateFilterInput = dateFilter.locator('input[formcontrolname="start"]');
    await dateFilterInput.click();
    await dateFilterInput.pressSequentially(`${day}`);
    dateFilterInput = dateFilter.locator('input[formcontrolname="end"]');
    await dateFilterInput.click();
    await dateFilterInput.pressSequentially(`${nextDay}`);

    const dateCol = await table.locator('td >> nth=2');
    await expect(dateCol.getByText(`${new Date().getDate()}`)).toBeVisible();

    await filters.locator('button:has-text("Clear All")').click();

    await expect(await caseIdInput.inputValue()).toEqual('');
    await expect(await dateFilterInput.inputValue()).toEqual('');

    await expect(await table.locator('tbody >> tr')).toHaveCount(numOfRows);
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
