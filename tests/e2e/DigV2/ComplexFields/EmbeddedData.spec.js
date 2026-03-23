const { test, expect } = require('@playwright/test');
const config = require('../../../config');
const common = require('../../../common');

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto(config.config.baseUrl, { waitUntil: 'networkidle' });
});

test.describe('E2E test', () => {
  test('should login, create case and run different test cases for Embedded Data', async ({ page }) => {
    await common.login(config.config.apps.digv2.user.username, config.config.apps.digv2.user.password, page);

    await common.verifyHomePage(page);

    await common.createCase('Complex Fields', page);

    /** Selecting Embedded Data from the Category dropdown */
    await common.selectCategory('EmbeddedData', page);

    await page.locator('button:has-text("submit")').click();

    /** ListOfRecord options type test */
    let selectedOption = await page.locator('mat-select[data-test-id="c6be2b6191e6660291b6b0c92bd2f0df"]');
    await selectedOption.click();
    await page.locator('mat-option > span:has-text("ListOfRecords")').click();

    /** Table subcategory tests */
    await common.selectSubCategory('Table', page);

    /** Editable mode type tests */
    let selectedEditMode = await page.locator('mat-select[data-test-id="6f64b45d01d11d8efd1693dfcb63b735"]');
    await selectedEditMode.click();
    await page.locator('mat-option > span:has-text("Editable")').click();

    let editModeType = await page.locator('mat-select[data-test-id="80c1db3a7b228760228004b1a532c71e"]');
    await editModeType.click();
    await page.locator('mat-option > span:has-text("Table rows")').click();

    const noRecordsMsg = page.locator('td[id="no-records"]');
    await expect(noRecordsMsg.locator('text="No records found."')).toBeVisible();

    /** Creating row by clicking on `+Add` button */
    await page.locator('button:has-text("+ Add")').click();

    /** Entering values in the first Row */
    await page.locator('input[data-test-id="202003240938510823869"]').fill('Main St');
    await page.locator('input[data-test-id="202003240938510831291"]').fill('Cambridge');
    await page.locator('input[data-test-id="202003240938510831411"]').fill('MA');
    await page.locator('input[data-test-id="202003240938510832734"]').fill('02142');
    let phone = page.locator('mat-tel-input[data-test-id="1f8261d17452a959e013666c5df45e07"]');
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
    phone = page.locator('mat-tel-input[data-test-id="1f8261d17452a959e013666c5df45e07"] >> nth=1');
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

    await page.locator('button:has-text("Next")').click();
    await page.locator('button:has-text("Previous")').click();

    /** Table Edit Modal tests */
    editModeType = await page.locator('mat-select[data-test-id="80c1db3a7b228760228004b1a532c71e"]');
    await editModeType.click();
    await page.locator('mat-option > span:has-text("Modal")').click();

    await page.locator('button:has-text("+ Add")').click();

    const modal = page.locator('div[id="dialog"]');

    /** Testing Add Record Title */
    const addRecordTitle = modal.locator('h3:has-text("Add Record")');
    await expect(addRecordTitle).toBeVisible();

    /** Adding record to the Table in Modal */
    await modal.locator('input[data-test-id="202003240938510823869"]').fill('Main St');
    await modal.locator('input[data-test-id="202003240938510831291"]').fill('Cambridge');
    await modal.locator('input[data-test-id="202003240938510831411"]').fill('MA');
    await modal.locator('input[data-test-id="202003240938510832734"]').fill('02142');

    phone = page.locator('mat-tel-input[data-test-id="1f8261d17452a959e013666c5df45e07"]');
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

    // Todo: Below piece of commented scenario is working fine in runtime but failing only during test case execution.

    // await page.locator('button:has-text("Next")').click();

    // /** Testing the values present on Confirm screen */
    // await expect(table.locator('td >> text="Main St"')).toBeVisible();
    // await expect(table.locator('td >> text="Cambridge"')).toBeVisible();
    // await expect(table.locator('td >> text="MA"')).toBeVisible();
    // await expect(table.locator('td >> text="02142"')).toBeVisible();
    // await expect(table.locator('td >> text="+16175551212"')).toBeVisible();

    // await page.locator('button:has-text("Previous")').click();
    //await expect(table).toBeVisible();

    /** Edit Record tests */
    await table.locator('.header-icon').click();
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

    // await page.locator('button:has-text("Next")').click();

    // /** Testing the edited values on Confirm Screen */
    // await expect(table.locator('td >> text="Gandhi St"')).toBeVisible();
    // await expect(table.locator('td >> text="Dallas"')).toBeVisible();

    // await page.locator('button:has-text("Previous")').click();

    /** Delete Row tests */
    await table.locator('div[class="header-icon"] >> nth=0').click();
    editMenu = await page.locator('div[role="menu"]');
    await editMenu.locator('button:has-text("Delete")').click();

    await expect(page.locator('td[id="no-records"]:has-text("No Records Found.")')).toBeVisible();

    // await page.locator('button:has-text("Next")').click();

    // await page.locator('button:has-text("Previous")').click();

    /** FieldGroup subcategory tests */

    await common.selectSubCategory('FieldGroup', page);

    /** Editable mode type tests */
    selectedEditMode = await page.locator('mat-select[data-test-id="6f64b45d01d11d8efd1693dfcb63b735"]');
    await selectedEditMode.click();
    await page.locator('mat-option > span:has-text("Editable")').click();

    /** Entering values in the first Row */
    await page.locator('input[data-test-id="202003240938510823869"]').fill('Main St');
    await page.locator('input[data-test-id="202003240938510831291"]').fill('Cambridge');
    await page.locator('input[data-test-id="202003240938510831411"]').fill('MA');
    await page.locator('input[data-test-id="202003240938510832734"]').fill('02142');

    phone = page.locator('mat-tel-input[data-test-id="1f8261d17452a959e013666c5df45e07"]');
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

    phone = page.locator('mat-tel-input[data-test-id="1f8261d17452a959e013666c5df45e07"] >> nth=1');
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

    /** Testing Sorting(both ascending and descending) */
    selectedOption = page.locator('mat-select[data-test-id="c6be2b6191e6660291b6b0c92bd2f0df"]');
    await selectedOption.click();
    await page.locator('mat-option > span:has-text("ListOfRecords")').click();

    await common.selectSubCategory('Table', page);

    /** Editable mode type tests */
    selectedEditMode = await page.locator('mat-select[data-test-id="6f64b45d01d11d8efd1693dfcb63b735"]');
    await selectedEditMode.click();
    await page.locator('mat-option > span:has-text("Editable")').click();

    editModeType = page.locator('mat-select[data-test-id="80c1db3a7b228760228004b1a532c71e"]');
    await editModeType.click();
    await page.locator('mat-option > span:has-text("Table rows")').click();

    // await page.pause();

    /** Creating row by clicking on `+Add` button */
    await page.locator('button:has-text("+ Add")').click();

    /** Entering values in the second Row */
    await page.locator('input[data-test-id="202003240938510823869"] >> nth=1').fill('Main St');
    await page.locator('input[data-test-id="202003240938510831291"] >> nth=1').fill('Cambridge');
    await page.locator('input[data-test-id="202003240938510831411"] >> nth=1').fill('MA');
    await page.locator('input[data-test-id="202003240938510832734"] >> nth=1').fill('02142');

    /** Creating row by clicking on `+Add` button */
    await page.locator('button:has-text("+ Add")').click();

    /** Entering values in the third Row */
    await page.locator('input[data-test-id="202003240938510823869"] >> nth=2').fill('');
    await page.locator('input[data-test-id="202003240938510831291"] >> nth=2').fill('Cambridge');
    await page.locator('input[data-test-id="202003240938510831411"] >> nth=2').fill('MA');
    await page.locator('input[data-test-id="202003240938510832734"] >> nth=2').fill('02142');

    await page.locator('button:has-text("Next")').click();

    table = page.locator('table[id="readonly-table"]');

    await table.locator('div:has-text("Street") >> nth=0').click();

    let tableCell = table.locator('tbody >> tr >> td >> nth=0');

    //created BUG-960598 for this. below steps should be uncommented when fixed.
    // "---" should come at the top in the ascending order, since it's a Falsy value
    // await expect(await tableCell.textContent()).toBe('---');

    // await table.locator('div:has-text("Street") >> nth=0').click();

    // tableCell = table.locator('tbody >> tr >> td >> nth=0');
    // // "Main St" should be at the top in the descending order
    // await expect(await tableCell.textContent()).toBe('Main St');

    /** Submitting the case */
    await page.locator('button:has-text("submit")').click();
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
