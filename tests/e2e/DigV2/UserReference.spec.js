/* eslint-disable no-template-curly-in-string */
/* eslint-disable no-undef */

const { test, expect } = require("@playwright/test");
const config = require("../../config");
const common = require("../../common");

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3500/portal");
});

test.describe("E2E test", () => {
  test("should login, create case and run different test cases for User Reference", async ({
    page,
  }) => {
    await common.Login(
      config.config.apps.digv2.user.username,
      config.config.apps.digv2.user.password,
      page
    );

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
    const complexFieldsCaseBtn = await page.locator(
      'button[id="create-case"] > span:has-text("Complex Fields")'
    );
    await complexFieldsCaseBtn.click();

    /** Selecting User Reference from the Category dropdown */
    const selectedCategory = page.locator(
      'mat-select[data-test-id="76729937a5eb6b0fd88c42581161facd"]'
    );
    await selectedCategory.click();
    await page.locator('mat-option > span:has-text("UserReference")').click();

    await page.locator('button:has-text("submit")').click();

    /** selecting user from autocomplete field  */
    const searchBoxInput = page.locator('input[data-test-id="75c6db46c48c2d7bb102c91d13ed766e"]');
    await searchBoxInput.type("user");
    const firstSearchboxOption = page.locator('div[role="listbox"]>mat-option:first-child');
    await firstSearchboxOption.click();
    const selectedUser = firstSearchboxOption.innerHTML;

    /** selecting user from dropdown field  */
    const dropdownInput = page.locator(
      'mat-select[data-test-id="12781aa4899d4a2141570b5e52b27156"]'
    );
    await dropdownInput.click();
    const firstDropdownOption = page.locator('div[role="listbox"]>mat-option:first-child');
    await firstDropdownOption.click();

    /** check readonly user reference value is same as dropdown selected user */
    const user = await page.locator('app-operator span[class="mat-button-wrapper"]').innerHTML;
    await expect(user).toBe(selectedUser);
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
