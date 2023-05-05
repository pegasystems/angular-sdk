const { test, expect } = require("@playwright/test");
const config = require("../../config");
const common = require("../../common");

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto("http://localhost:3500/portal");
});

test.describe("E2E test", () => {
  test("should login, create case and run different test cases for Embedded Data", async ({
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

    /** Selecting Embedded Data from the Category dropdown */
    const selectedCategory = page.locator(
      'mat-select[data-test-id="76729937a5eb6b0fd88c42581161facd"]'
    );
    await selectedCategory.click();
    await page.locator('mat-option > span:has-text("EmbeddedData")').click();

    await page.locator('button:has-text("submit")').click();

    /** ListOfRecord options type test */
    let selectedOption = await page.locator(
      'mat-select[data-test-id="c6be2b6191e6660291b6b0c92bd2f0df"]'
    );
    await selectedOption.click();
    await page.locator('mat-option > span:has-text("ListOfRecords")').click();

    /** Table subcategory tests */
    let selectedSubCategory = await page.locator(
      'mat-select[data-test-id="9463d5f18a8924b3200b56efaad63bda"]'
    );
    await selectedSubCategory.click();
    await page.locator('mat-option > span:has-text("Table")').click();

    /** Editable mode type tests */
    let selectedEditMode = await page.locator(
      'mat-select[data-test-id="6f64b45d01d11d8efd1693dfcb63b735"]'
    );
    await selectedEditMode.click();
    await page.locator('mat-option > span:has-text("Editable")').click();

    const noRecordsMsg = page.locator('div[id="no-records"]');
    await expect(
      noRecordsMsg.locator('text="No Records Found."')
    ).toBeVisible();

    /** Creating row by clicking on `+Add` button */
    await page.locator('button:has-text("+ Add")').click();

    /** Entering values in the first Row */
    await page
      .locator('input[data-test-id="202003240938510823869"]')
      .type("Main St");
    await page
      .locator('input[data-test-id="202003240938510831291"]')
      .type("Cambridge");
    await page
      .locator('input[data-test-id="202003240938510831411"]')
      .type("MA");
    await page
      .locator('input[data-test-id="202003240938510832734"]')
      .type("02142");
    let phone = page.locator(
      'ngx-intl-tel-input[data-test-id="1f8261d17452a959e013666c5df45e07"]'
    );
    let countrySelector = phone.locator('div[class="iti__flag-container"]');
    await countrySelector.click();
    await page.locator("text=United States+1 >> nth=0").click();
    let phoneInput = phone.locator('input[type="tel"]');
    await phoneInput.type("(201) 555-0123");

    await page.locator('button:has-text("+ Add")').click();

    /** Entering values in the second Row */
    await page
      .locator('input[data-test-id="202003240938510823869"] >> nth=1')
      .type("Global St");
    await page
      .locator('input[data-test-id="202003240938510831291"] >> nth=1')
      .type("California");
    await page
      .locator('input[data-test-id="202003240938510831411"] >> nth=1')
      .type("AK");
    await page
      .locator('input[data-test-id="202003240938510832734"] >> nth=1')
      .type("03142");
    phone = page.locator(
      'ngx-intl-tel-input[data-test-id="1f8261d17452a959e013666c5df45e07"] >> nth=1'
    );
    countrySelector = phone.locator('div[class="iti__flag-container"]');
    await countrySelector.click();
    await page.locator("text=United States+1 >> nth=0").click();
    phoneInput = phone.locator('input[type="tel"]');
    await phoneInput.type("(201) 444-0213");

    await page.locator('button:has-text("Next")').click();

    let table = page.locator('table[id="readonly-table"]');

    /** Testing the values present on Confirm screen */
    await expect(table.locator('td:has-text("Global St")')).toBeVisible();
    await expect(table.locator('td:has-text("California")')).toBeVisible();
    await expect(table.locator('td:has-text("AK")')).toBeVisible();
    await expect(table.locator('td:has-text("03142")')).toBeVisible();
    await expect(table.locator('td:has-text("+12014440213")')).toBeVisible();

    await page.locator('button:has-text("Previous")').click();

    await page.locator('button[id="delete-button"] >> nth=0').click();

    await page.locator('button:has-text("Next")').click();

    /** Testing the deleted row values which should n't be present */
    await expect(table.locator('td:has-text("Main St")')).toBeHidden();
    await expect(table.locator('td:has-text("Cambridge")')).toBeHidden();
    await expect(table.locator('td:has-text("MA")')).toBeHidden();
    await expect(table.locator('td:has-text("02142")')).toBeHidden();
    await expect(table.locator('td:has-text("+12015550123")')).toBeHidden();

    await page.locator('button:has-text("Previous")').click();

    await page.locator('button[id="delete-button"]').click();

    /** FieldGroup subcategory tests */

    selectedSubCategory = await page.locator(
      'mat-select[data-test-id="9463d5f18a8924b3200b56efaad63bda"]'
    );
    await selectedSubCategory.click();
    await page.locator('mat-option > span:has-text("FieldGroup")').click();

    /** Editable mode type tests */
    selectedEditMode = await page.locator(
      'mat-select[data-test-id="6f64b45d01d11d8efd1693dfcb63b735"]'
    );
    await selectedEditMode.click();
    await page.locator('mat-option > span:has-text("Editable")').click();

    /** Entering values in the first Row */
    await page
      .locator('input[data-test-id="202003240938510823869"]')
      .type("Main St");
    await page
      .locator('input[data-test-id="202003240938510831291"]')
      .type("Cambridge");
    await page
      .locator('input[data-test-id="202003240938510831411"]')
      .type("MA");
    await page
      .locator('input[data-test-id="202003240938510832734"]')
      .type("02142");

    phone = page.locator(
      'ngx-intl-tel-input[data-test-id="1f8261d17452a959e013666c5df45e07"]'
    );
    countrySelector = phone.locator('div[class="iti__flag-container"]');
    await countrySelector.click();
    await page.locator("text=United States+1 >> nth=0").click();
    phoneInput = phone.locator('input[type="tel"]');
    await phoneInput.type("(201) 555-0123");

    await page.locator('button:has-text("+ Add")').click();

    /** Entering values in the second Row */
    await page
      .locator('input[data-test-id="202003240938510823869"] >> nth=1')
      .type("Global St");
    await page
      .locator('input[data-test-id="202003240938510831291"] >> nth=1')
      .type("California");
    await page
      .locator('input[data-test-id="202003240938510831411"] >> nth=1')
      .type("AK");
    await page
      .locator('input[data-test-id="202003240938510832734"] >> nth=1')
      .type("03142");

    phone = page.locator(
      'ngx-intl-tel-input[data-test-id="1f8261d17452a959e013666c5df45e07"] >> nth=1'
    );
    countrySelector = phone.locator('div[class="iti__flag-container"]');
    await countrySelector.click();
    await page.locator("text=United States+1 >> nth=0").click();
    phoneInput = phone.locator('input[type="tel"]');
    await phoneInput.type("(201) 444-0213");

    await page.locator('button:has-text("Next")').click();

    table = page.locator('table[id="readonly-table"]');

    /** Testing the values present on Confirm screen */
    await expect(table.locator('td:has-text("Global St")')).toBeVisible();
    await expect(table.locator('td:has-text("California")')).toBeVisible();
    await expect(table.locator('td:has-text("AK")')).toBeVisible();
    await expect(table.locator('td:has-text("03142")')).toBeVisible();
    await expect(table.locator('td:has-text("+12014440213")')).toBeVisible();

    await page.locator('button:has-text("Previous")').click();

    await page.locator('button[id="delete-button"] >> nth=0').click();

    await page.locator('button:has-text("Next")').click();

    await expect(table.locator('td:has-text("Main St")')).toBeHidden();
    await expect(table.locator('td:has-text("Cambridge")')).toBeHidden();
    await expect(table.locator('td:has-text("MA")')).toBeHidden();
    await expect(table.locator('td:has-text("02142")')).toBeHidden();
    await expect(table.locator('td:has-text("+12015550123")')).toBeHidden();

    await page.locator('button:has-text("Previous")').click();

    /** Readonly mode type tests */
    selectedEditMode = await page.locator(
      'mat-select[data-test-id="6f64b45d01d11d8efd1693dfcb63b735"]'
    );
    await selectedEditMode.click();
    await page.locator('mat-option > span:has-text("Readonly")').click();

    const fieldGroup = page.locator('div[id="field-group"]');

    /** Testing the values that were entered by Editable test */
    await expect(fieldGroup.locator('span >> text="Global St"')).toBeVisible();
    await expect(fieldGroup.locator('span >> text="California"')).toBeVisible();
    await expect(fieldGroup.locator('span >> text="AK"')).toBeVisible();
    await expect(fieldGroup.locator('span >> text="03142"')).toBeVisible();
    await expect(
      fieldGroup.locator('span >> text="+12014440213"')
    ).toBeVisible();

    await page.locator('button:has-text("Next")').click();

    /** Submitting the case */
    await page.locator('button:has-text("submit")').click();
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
