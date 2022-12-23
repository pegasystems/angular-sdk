/* eslint-disable no-template-curly-in-string */
/* eslint-disable no-undef */

const { test, expect } = require("@playwright/test");
const config = require("../../config");
const common = require("../../common");

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3500/portal");
});

test.describe("E2E test", () => {
  test("should login, create case and run different test cases for Query", async ({ page }) => {
    await common.Login(config.config.apps.digv2.user.username, config.config.apps.digv2.user.password, page);

    /** Testing announcement banner presence */
    const announcementBanner = page.locator('h2:has-text("Announcements")');
    await expect(announcementBanner).toBeVisible();

    /** Testing worklist presence */
    const worklist = page.locator('div[id="worklist"]:has-text("My Worklist")');
    await expect(worklist).toBeVisible();

    /** Hovering over navbar */
    const navbar = page.locator("app-navbar");
    await navbar.locator('div[class="psdk-appshell-nav"]').hover();

    /** opening all case types */
    const createCase = page.locator('button[id="create-button"]');
    await createCase.click();

    /** Creating a Complex Fields case-type */
    const complexFieldsCaseBtn = page.locator('button[id="create-case"] > span:has-text("Complex Fields")');
    await complexFieldsCaseBtn.click();

    /** Selecting Query from the Category dropdown */
    const selectedCategory = page.locator('mat-select[data-test-id="76729937a5eb6b0fd88c42581161facd"]');
    await selectedCategory.click();
    await page.locator('mat-option > span:has-text("Query")').click();

    await page.locator('button:has-text("submit")').click();

    /** selecting SingleRecord option from dropdown  */
    const selectedOption = page.locator(
      'mat-select[data-test-id="365ab066d5dd67171317bc3fc755245a"]'
    );
    await selectedOption.click();
    await page.locator('mat-option >> span:has-text("SingleRecord")').click();

    const detailsFieldsList = page.locator('div[id="details-fields-list"]');

    /** Testing the values present on Confirm screen */
    await expect(detailsFieldsList.locator('span >> text="Sacramento"')).toBeVisible();
    await expect(detailsFieldsList.locator('span >> text="CA"')).toBeVisible();
    await expect(detailsFieldsList.locator('span >> text="2653"')).toBeVisible();

    /** Query as Table */
    /** selecting ListOfReords option from dropdown  */
    await selectedOption.click();
    await page.locator('mat-option > span:has-text("ListOfRecords")').click();

    /** selecting Table option from dropdown  */
    const selectedDisplayAs = page.locator('mat-select[data-test-id="03e83bd975984c06d12c584cb59cc4ad"]');
    await selectedDisplayAs.click();
    await page.locator('mat-option > span:has-text("Table")').click();

    const tableRows = page.locator('app-simple-table table tbody');
    await expect(tableRows).toBeVisible();
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
