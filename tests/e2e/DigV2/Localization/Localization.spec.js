const { test, expect } = require('@playwright/test');
const config = require('../../../config');
const common = require('../../../common');

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto(config.config.baseUrl, { waitUntil: 'networkidle' });
});

test.describe('E2E test', () => {
  test('should login, create case and run different test cases for Embedded Data', async ({ page }) => {
    await common.login(config.config.apps.digv2.localizedUser.username, config.config.apps.digv2.localizedUser.password, page);

    /** Testing announcement banner presence */
    const announcementBanner = page.locator('h2:has-text("Anuncios")');
    await expect(announcementBanner).toBeVisible();

    /** Testing worklist presence */
    const worklist = page.locator('div[id="worklist"]:has-text("Mi lista de trabajo")');
    await expect(worklist).toBeVisible();

    /** Hovering over navbar */
    const navbar = page.locator('app-navbar');
    await navbar.locator('div[class="psdk-appshell-nav"]').hover();

    /** Testing landing pages */
    expect(await page.locator('mat-list-item > span:has-text("Hogar")')).toBeVisible(); // Home
    expect(await page.locator('mat-list-item > span:has-text("Panel de control en línea")')).toBeVisible(); // Inline Dashboard

    /** opening all case types */
    const createCase = page.locator('mat-list-item[id="create-case-button"]');
    await createCase.click();

    /** Creating a Complex Fields case-type */
    const complexFieldsCaseBtn = await page.locator('mat-list-item[id="case-list-item"] > span:has-text("Campos complejos")');
    await complexFieldsCaseBtn.click();

    /** Testing Case summary */
    expect(await page.locator('h1[id="case-name"]:has-text("Campos complejos")')).toBeVisible(); // case type

    const caseviewActions = await page.locator('div[class="psdk-case-view-buttons"]');

    expect(await caseviewActions.locator('button:has-text("Editar")')).toBeVisible(); // edit action
    expect(await caseviewActions.locator('button:has-text("Comportamiento")')).toBeVisible(); // actions menu

    const caseSummary = page.locator('app-material-case-summary');
    expect(caseSummary.locator('dd:has-text("Nuevo")')).toBeVisible(); // case Status

    /** Testing Case history */
    const caseHistory = await page.locator('app-case-history');
    await expect(caseHistory.locator('h2:has-text("Historia del caso")')).toBeVisible();
    await expect(caseHistory.locator('th >> text="Fecha"')).toBeVisible();
    await expect(caseHistory.locator('th >> text="Descripción"')).toBeVisible();
    await expect(caseHistory.locator('th >> text="Interpretado por"')).toBeVisible();

    /** Testing Case view */
    const stages = await page.locator('app-stages');
    // await expect(stages.locator('div >> has-text("Crear")')).toBeVisible();
    await expect(stages.locator('div >> text="Crear"')).toBeVisible();

    await expect(page.locator('h2:has-text("Seleccionar prueba")')).toBeVisible();

    /** Testing action buttons */
    const assignment = await page.locator('app-assignment');
    await expect(assignment.locator('button:has-text("Cancelar")')).toBeVisible();
    await expect(assignment.locator('button:has-text("Entregar")')).toBeVisible();

    /** Selecting Embedded Data from the Category dropdown */
    const selectedCategory = page.locator('mat-select[data-test-id="76729937a5eb6b0fd88c42581161facd"]');
    await selectedCategory.click();
    await page.locator('mat-option > span:has-text("EmbeddedData")').click();

    await page.locator('button:has-text("Entregar")').click();

    /** Testing Multi step */
    await expect(assignment.locator('div[id="multi-step-label"]:has-text("Datos integrados")')).toBeVisible();

    const selectedOption = await page.locator('mat-select[data-test-id="c6be2b6191e6660291b6b0c92bd2f0df"]');
    await selectedOption.click();
    await page.locator('mat-option > span:has-text("ListOfRecords")').click();

    const selectedSubCategory = await page.locator('mat-select[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.locator('mat-option > span:has-text("FieldGroup")').click();

    /** Editable mode type tests */
    const selectedEditMode = await page.locator('mat-select[data-test-id="6f64b45d01d11d8efd1693dfcb63b735"]');
    await selectedEditMode.click();
    await page.locator('mat-option > span:has-text("Editable")').click();

    expect(assignment.locator('label >> text="Número de teléfono"')).toBeVisible();

    await page.locator('button:has-text("Next")').click();

    await expect(assignment.locator('h3:has-text("Dirección de Envío")')).toBeVisible();

    /** Testing table headers */
    await expect(assignment.locator('th >> text="Calle"')).toBeVisible();
    await expect(assignment.locator('th >> text="Ciudad"')).toBeVisible();
    await expect(assignment.locator('th >> text="Estado"')).toBeVisible();
    await expect(assignment.locator('th >> text="Código Postal"')).toBeVisible();
    await expect(assignment.locator('th >> text="Número de teléfono"')).toBeVisible();

    /** Testing file utility */
    const fileUtility = await page.locator('app-file-utility');
    await expect(fileUtility.locator('div >> text="Archivos adjuntos"')).toBeVisible();
    await fileUtility.locator('button[id="file-menu"]').click();

    await expect(page.locator('button:has-text("Agregar archivos")')).toBeVisible();
    await expect(page.locator('button:has-text("Agregar enlaces")')).toBeVisible();

    /** Testing Add files Modal */
    await page.locator('button:has-text("Agregar archivos")').click();
    await expect(fileUtility.locator('h3:has-text("Agregar archivos locales")')).toBeVisible();
    await expect(fileUtility.locator('button:has-text("Cancelar")')).toBeVisible();
    await expect(fileUtility.locator('button:has-text("Adjuntar archivos")')).toBeVisible();

    fileUtility.locator('button:has-text("Cancelar")').click();
    await fileUtility.locator('button[id="file-menu"]').click();

    /** Testing Add links Modal */
    await page.locator('button:has-text("Agregar enlaces")').click();
    await expect(fileUtility.locator('h3:has-text("Agregar enlaces")')).toBeVisible();
    await expect(fileUtility.locator('div >> text="Añadir enlace"')).toBeVisible();

    await expect(fileUtility.locator('button:has-text("Cancelar")')).toBeVisible();
    await expect(fileUtility.locator('button:has-text("Adjuntar enlaces")')).toBeVisible();
    await fileUtility.locator('button:has-text("Cancelar")').click();

    await page.locator('mat-list[id="profile"]').click();
    await page.locator('button:has-text("Desconectarse")').click();
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
