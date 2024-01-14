const { test, expect } = require('@playwright/test');
const config = require('../../config');
const common = require('../../common');

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto(config.config.baseUrl, { waitUntil: 'networkidle' });
});

test.describe('E2E test', () => {
  test('should login, create case and run different test cases for Embedded Data', async ({ page }) => {
    await common.login(config.config.apps.digv2.user.username, config.config.apps.digv2.user.password, page);

    /** Testing announcement banner presence */
    const announcementBanner = page.locator('h2:has-text("Announcements")');
    await expect(announcementBanner).toBeVisible();

    /** Testing worklist presence */
    const worklist = page.locator('div[id="worklist"]:has-text("My Worklist")');
    await expect(worklist).toBeVisible();

    /** Hovering over navbar */
    const navbar = page.locator('app-navbar');
    await navbar.locator('div[class="psdk-appshell-nav"]').hover();

    /** opening all case types */
    const createCase = page.locator('mat-list-item[id="create-case-button"]');
    await createCase.click();

    /** Creating a Complex Fields case-type */
    const complexFieldsCaseBtn = await page.locator('mat-list-item[id="case-list-item"] > span:has-text("Complex Fields")');
    await complexFieldsCaseBtn.click();

    /** Selecting Embedded Data from the Category dropdown */
    const selectedCategory = page.locator('mat-select[data-test-id="76729937a5eb6b0fd88c42581161facd"]');
    await selectedCategory.click();
    await page.locator('mat-option > span:has-text("EmbeddedData")').click();

    await page.locator('button:has-text("submit")').click();

    /** ListOfRecord options type test */
    const selectedOption = await page.locator('mat-select[data-test-id="c6be2b6191e6660291b6b0c92bd2f0df"]');
    await selectedOption.click();
    await page.locator('mat-option > span:has-text("ListOfRecords")').click();

    /** Table subcategory tests */
    let selectedSubCategory = await page.locator('mat-select[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.locator('mat-option > span:has-text("Table")').click();

    /** Editable mode type tests */
    let selectedEditMode = await page.locator('mat-select[data-test-id="6f64b45d01d11d8efd1693dfcb63b735"]');
    await selectedEditMode.click();
    await page.locator('mat-option > span:has-text("Editable")').click();

    const PCoreVersion = await page.evaluate(() => window.PCore.getPCoreVersion());

    if (!PCoreVersion.includes('8.8')) {
      const editModeType = await page.locator('mat-select[data-test-id="80c1db3a7b228760228004b1a532c71e"]');
      await editModeType.click();
      await page.locator('mat-option > span:has-text("Table rows")').click();
    }

    const noRecordsMsg = page.locator('div[id="no-records"]');
    await expect(noRecordsMsg.locator('text="No Records Found."')).toBeVisible();

    /** Creating row by clicking on `+Add` button */
    await page.locator('button:has-text("+ Add")').click();

    /** Entering values in the first Row */
    await page.locator('input[data-test-id="202003240938510823869"]').fill('Main St');
    await page.locator('input[data-test-id="202003240938510831291"]').fill('Cambridge');
    await page.locator('input[data-test-id="202003240938510831411"]').fill('MA');
    await page.locator('input[data-test-id="202003240938510832734"]').fill('02142');
    let phone = page.locator('ngx-mat-intl-tel-input[data-test-id="1f8261d17452a959e013666c5df45e07"]');
    let countrySelector = phone.locator('button.country-selector');
    await countrySelector.click();
    await page.locator('div.flag.US >> nth=0').click();
    await phone.locator('input[type="tel"]').fill('(201) 555-0123');

    await page.locator('button:has-text("+ Add")').click();

    /** Entering values in the second Row */
    await page.locator('input[data-test-id="202003240938510823869"] >> nth=1').fill('Global St');
    await page.locator('input[data-test-id="202003240938510831291"] >> nth=1').fill('California');
    await page.locator('input[data-test-id="202003240938510831411"] >> nth=1').fill('AK');
    await page.locator('input[data-test-id="202003240938510832734"] >> nth=1').fill('03142');
    phone = page.locator('ngx-mat-intl-tel-input[data-test-id="1f8261d17452a959e013666c5df45e07"] >> nth=1');
    countrySelector = phone.locator('button.country-selector');
    await countrySelector.click();
    await page.locator('div.flag.US >> nth=0').click();
    await phone.locator('input[type="tel"]').fill('(201) 444-0213');

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

    /** Testing the deleted row values which shouldn't be present */
    await expect(table.locator('td:has-text("Main St")')).toBeHidden();
    await expect(table.locator('td:has-text("Cambridge")')).toBeHidden();
    await expect(table.locator('td:has-text("MA")')).toBeHidden();
    await expect(table.locator('td:has-text("02142")')).toBeHidden();
    await expect(table.locator('td:has-text("+12015550123")')).toBeHidden();

    await page.locator('button:has-text("Previous")').click();

    await page.locator('button[id="delete-button"]').click();

    /** Table Edit Modal tests */
    const editModeType = await page.locator('mat-select[data-test-id="80c1db3a7b228760228004b1a532c71e"]');
    await editModeType.click();
    await page.locator('mat-option > span:has-text("Modal")').click();

    await page.locator('button:has-text("+ Add")').click();

    const modal = page.locator('div[id="dialog"]');

    /** Testing Add Record Title */
    const addRecordTitle = modal.locator('h3:has-text("Add Record")');
    await expect(addRecordTitle).toBeVisible();

    /** Adding record to the Table in Modal */
    await modal.locator('input[data-test-id="202003240938510823869"]').type('Main St');
    await modal.locator('input[data-test-id="202003240938510831291"]').type('Cambridge');
    await modal.locator('input[data-test-id="202003240938510831411"]').type('MA');
    await modal.locator('input[data-test-id="202003240938510832734"]').type('02142');

    phone = page.locator('ngx-mat-intl-tel-input[data-test-id="1f8261d17452a959e013666c5df45e07"]');
    countrySelector = phone.locator('button.country-selector');
    await countrySelector.click();
    await page.locator('div.flag.US >> nth=0').click();
    await phone.locator('input[type="tel"]').fill('6175551212');

    const country = modal.locator('mat-select[data-test-id="59716c97497eb9694541f7c3d37b1a4d"]');
    await country.click();
    await page.getByRole('option', { name: 'Switzerland' }).click();

    /** submitting the record */
    await modal.locator('button:has-text("submit")').click();

    table = page.locator('table[id="readonly-table"]');

    /** Testing the values present on table */
    await expect(table.locator('td >> text="Main St"')).toBeVisible();
    await expect(table.locator('td >> text="Cambridge"')).toBeVisible();
    await expect(table.locator('td >> text="MA"')).toBeVisible();
    await expect(table.locator('td >> text="02142"')).toBeVisible();
    await expect(table.locator('td >> text="+16175551212"')).toBeVisible();

    await page.locator('button:has-text("Next")').click();

    /** Testing the values present on Confirm screen */
    await expect(table.locator('td >> text="Main St"')).toBeVisible();
    await expect(table.locator('td >> text="Cambridge"')).toBeVisible();
    await expect(table.locator('td >> text="MA"')).toBeVisible();
    await expect(table.locator('td >> text="02142"')).toBeVisible();
    await expect(table.locator('td >> text="+16175551212"')).toBeVisible();

    await page.locator('button:has-text("Previous")').click();

    /** Edit Record tests */
    await table.locator('div[class="header-icon"] >> nth=0').click();
    let editMenu = await page.locator('div[role="menu"]');
    await editMenu.locator('button:has-text("Edit")').click();

    /** Testing Edit Record title */
    const editRecordTitle = modal.locator('h3:has-text("Edit Record")');
    await expect(editRecordTitle).toBeVisible();

    /** Editing the added row */
    await modal.locator('input[data-test-id="202003240938510823869"]').fill('');
    await modal.locator('input[data-test-id="202003240938510823869"]').type('Gandhi St');

    await modal.locator('input[data-test-id="202003240938510831291"]').fill('');
    await modal.locator('input[data-test-id="202003240938510831291"]').type('Dallas');

    await modal.locator('button:has-text("submit")').click();

    /** Testing the edited values on table */
    await expect(table.locator('td >> text="Gandhi St"')).toBeVisible();
    await expect(table.locator('td >> text="Dallas"')).toBeVisible();

    await page.locator('button:has-text("Next")').click();

    /** Testing the edited values on Confirm Screen */
    await expect(table.locator('td >> text="Gandhi St"')).toBeVisible();
    await expect(table.locator('td >> text="Dallas"')).toBeVisible();

    await page.locator('button:has-text("Previous")').click();

    /** Delete Row tests */
    await table.locator('div[class="header-icon"] >> nth=0').click();
    editMenu = await page.locator('div[role="menu"]');
    await editMenu.locator('button:has-text("Delete")').click();

    await expect(page.locator('div[id="no-records"]:has-text("No Records Found.")')).toBeVisible();

    await page.locator('button:has-text("Next")').click();

    await page.locator('button:has-text("Previous")').click();

    /** FieldGroup subcategory tests */

    selectedSubCategory = await page.locator('mat-select[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.locator('mat-option > span:has-text("FieldGroup")').click();

    /** Editable mode type tests */
    selectedEditMode = await page.locator('mat-select[data-test-id="6f64b45d01d11d8efd1693dfcb63b735"]');
    await selectedEditMode.click();
    await page.locator('mat-option > span:has-text("Editable")').click();

    /** Entering values in the first Row */
    await page.locator('input[data-test-id="202003240938510823869"]').fill('Main St');
    await page.locator('input[data-test-id="202003240938510831291"]').fill('Cambridge');
    await page.locator('input[data-test-id="202003240938510831411"]').fill('MA');
    await page.locator('input[data-test-id="202003240938510832734"]').fill('02142');

    phone = page.locator('ngx-mat-intl-tel-input[data-test-id="1f8261d17452a959e013666c5df45e07"]');
    countrySelector = phone.locator('button.country-selector');
    await countrySelector.click();
    await page.locator('div.flag.US >> nth=0').click();
    await phone.locator('input[type="tel"]').fill('(201) 555-0123');

    await page.locator('button:has-text("+ Add")').click();

    /** Entering values in the second Row */
    await page.locator('input[data-test-id="202003240938510823869"] >> nth=1').fill('Global St');
    await page.locator('input[data-test-id="202003240938510831291"] >> nth=1').fill('California');
    await page.locator('input[data-test-id="202003240938510831411"] >> nth=1').fill('AK');
    await page.locator('input[data-test-id="202003240938510832734"] >> nth=1').fill('03142');

    phone = page.locator('ngx-mat-intl-tel-input[data-test-id="1f8261d17452a959e013666c5df45e07"] >> nth=1');
    countrySelector = phone.locator('button.country-selector');
    await countrySelector.click();
    await page.locator('div.flag.US >> nth=0').click();
    await phone.locator('input[type="tel"]').fill('(201) 444-0213');

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
    selectedEditMode = await page.locator('mat-select[data-test-id="6f64b45d01d11d8efd1693dfcb63b735"]');
    await selectedEditMode.click();
    await page.locator('mat-option > span:has-text("Readonly")').click();

    const fieldGroup = page.locator('div[id="field-group"]');

    /** Testing the values that were entered by Editable test */
    await expect(fieldGroup.locator('div >> text="Global St"')).toBeVisible();
    await expect(fieldGroup.locator('div >> text="California"')).toBeVisible();
    await expect(fieldGroup.locator('div >> text="AK"')).toBeVisible();
    await expect(fieldGroup.locator('div >> text="03142"')).toBeVisible();
    await expect(fieldGroup.locator('div >> text="+12014440213"')).toBeVisible();

    await page.locator('button:has-text("Next")').click();

    /** Submitting the case */
    await page.locator('button:has-text("submit")').click();
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
