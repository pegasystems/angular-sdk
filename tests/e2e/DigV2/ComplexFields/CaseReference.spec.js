const { test, expect } = require('@playwright/test');
const config = require('../../../config');
const common = require('../../../common');

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto(config.config.baseUrl, { waitUntil: 'networkidle' });
});

test.describe('E2E test', () => {
  test('should login, create case and run different test cases for Case Reference', async ({ page }) => {
    await common.login(config.config.apps.digv2.user.username, config.config.apps.digv2.user.password, page);

    await common.verifyHomePage(page);

    // /** Creating a Query case-type which will be referred by Complex Fields case type */
    await common.createCase('Query', page);

    let modal = page.locator('div[id="dialog"]');
    await modal.waitFor({ state: 'visible' });

    /** Value to be typed in the Name input */
    const name = 'John Doe';

    await modal.locator('input').fill(name);
    await modal.locator('button:has-text("submit")').click();

    await expect(page.getByRole('row', { name: ' Product Name ' })).toBeVisible();
    // /** Storing case-id of the newly created Query case-type(s), will be used later */
    const caseID = [];

    caseID.push(await page.locator('div[id="caseId"]').textContent());

    /** Creating another Query case-type which will be used for ListOfRecords mode */
    await common.createCase('Query', page);

    modal = page.locator('div[id="dialog"]');
    await modal.waitFor({ state: 'visible' });

    await modal.locator('input').fill(name);
    await modal.locator('button:has-text("submit")').click();
    await expect(modal).not.toBeVisible();

    caseID.push(await page.locator('div[id="caseId"]').textContent());

    /** Creating a Complex Fields case-type */
    /** opening all case types */
    await common.createCase('Complex Fields', page);

    /** Selecting CaseReference from the Category dropdown */
    await common.selectCategory('CaseReference', page);

    await page.locator('button:has-text("submit")').click();

    /** Field sub category tests */

    const selectedSubCategory = await page.locator('mat-select[data-test-id="c2adefb64c594c6b634b3be9a40f6c83"]');
    await selectedSubCategory.click();
    await page.locator('mat-option > span:has-text("Field")').click();

    /** Dropdown-Local field type tests */
    const selectedTestName = page.locator('mat-select[data-test-id="3e9562266329f358c8fad0ce1094def9"]');
    await selectedTestName.click();
    await page.locator('mat-option > span:has-text("Dropdown-Local")').click();

    await page.locator('mat-select[data-test-id="83b6f3f7c774ee2157bfd81b548b07bf"]').click();
    await page.locator('mat-option > span:has-text("Coffee")').click();

    await page.locator('button:has-text("Next")').click();

    await expect(page.locator('text="Coffee"')).toBeVisible();

    await page.locator('button:has-text("Previous")').click();

    /** Text field type tests */
    await selectedTestName.click();
    await page.locator('mat-option > span:has-text("Text")').click();

    await page.locator('mat-select[role="combobox"] >> nth=2').click();

    await page.locator(`mat-option > span:has-text("${name}") >> nth=0`).click();

    await page.locator('button:has-text("Next")').click();

    await expect(page.locator(`text="${name}"`)).toBeVisible();

    await page.locator('button:has-text("Previous")').click();

    /** Dropdown-DP field type tests */
    await selectedTestName.click();
    await page.locator('mat-option > span:has-text("Dropdown-DP")').click();

    await page.locator('mat-select[data-test-id="311f2f128456b3bf37c7568da9ac1898"]').click();
    await page.locator('mat-option > span:has-text("Dropdown")').click();

    await page.locator('button:has-text("Next")').click();

    await expect(page.locator('text="Dropdown"')).toBeVisible();

    await page.locator('button:has-text("Previous")').click();

    /** Mode tests */
    await selectedSubCategory.click();
    await page.locator('mat-option > span:has-text("Mode")').click();

    /** SingleRecord mode type tests */
    await selectedTestName.click();
    await page.locator('mat-option > span:has-text("SingleRecord")').click();
    let table = page.locator('table[id="list-view"]');
    await expect(table.getByText(' Case ID ')).toBeVisible();
    await page.locator('input[id="search"]').pressSequentially(caseID[0], { delay: 100 });
    const selectedRow = await page.locator(`tr:has-text("${caseID[0]}")`);
    await selectedRow.locator("td >> input[type='radio']").click();

    await page.locator('button:has-text("Next")').click();

    await expect(page.locator(`text="${caseID[0]}"`)).toBeVisible();

    await page.locator('button:has-text("Previous")').click();

    /** ListOfRecords mode type tests */
    await selectedTestName.click();
    await page.locator('mat-option > span:has-text("ListOfRecords")').click();
    table = page.locator('table[id="list-view"]');
    await expect(table.getByText(' Case ID ')).toBeVisible();
    await page.locator('input[id="search"]').pressSequentially(caseID[0], { delay: 100 });
    const selectedRow1 = await page.locator(`tr:has-text("${caseID[0]}")`);
    await selectedRow1.locator('mat-checkbox').click();

    await page.locator('input[id="search"]').clear();
    await page.locator('input[id="search"]').pressSequentially(caseID[1], { delay: 100 });
    const selectedRow2 = await page.locator(`tr:has-text("${caseID[1]}")`);
    await selectedRow2.locator('mat-checkbox').click();

    await page.locator('button:has-text("Next")').click();

    await expect(page.locator(`td >> text="${caseID[1]}"`)).toBeVisible();

    /** Submitting the case */
    await page.locator('button:has-text("submit")').click();
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
