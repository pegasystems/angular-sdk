const path = require('path');
const { test, expect } = require('@playwright/test');
const config = require('../../config');
const common = require('../../common');

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto(config.config.baseUrl, { waitUntil: 'networkidle' });
});

let caseID;
test.describe('E2E test', () => {
  test('should login, create and send for discount', async ({ page }) => {
    await common.login(config.config.apps.mediaCo.rep.username, config.config.apps.mediaCo.rep.password, page);

    await common.verifyHomePage(page);

    const navbar = page.locator('app-navbar');
    await navbar.locator('div[class="psdk-appshell-nav"]').hover();

    const createCase = page.locator('mat-list-item[id="create-case-button"]');
    await createCase.click();

    const newServiceCase = await page.locator('mat-list-item[id="case-list-item"] > span:has-text("New Service")');
    await newServiceCase.click();

    const firstNameInput = page.locator('input[data-test-id="BC910F8BDF70F29374F496F05BE0330C"]');
    await firstNameInput.click();
    await firstNameInput.fill('John');

    const middleNameInput = page.locator('input[data-test-id="D3691D297D95C48EF1A2B7D6523EF3F0"]');
    await middleNameInput.click();
    await middleNameInput.fill('');

    const lastNameInput = page.locator('input[data-test-id="77587239BF4C54EA493C7033E1DBF636"]');
    await lastNameInput.click();
    await lastNameInput.fill('Doe');

    const suffix = page.locator('input[data-test-id="56E6DDD1CB6CEC596B433440DFB21C17"]');
    await suffix.click();
    await page.locator('mat-option:has-text("Jr")').click();

    const emailInput = page.locator('input[data-test-id="CE8AE9DA5B7CD6C3DF2929543A9AF92D"]');
    await emailInput.click();
    await emailInput.fill('john@doe.com');

    const serviceDateInput = page.locator('input[data-test-id="E0BA356AE552ACD4326D51E61F4279AC"]');
    await serviceDateInput.click();
    const futureDate = common.getFutureDate();
    await serviceDateInput.fill(futureDate);

    await page.locator('button:has-text("submit")').click();

    const streetInput = page.locator('input[data-test-id="D61EBDD8A0C0CD57C22455E9F0918C65"]');
    await streetInput.click();
    await streetInput.fill('Main St');

    const cityInput = page.locator('input[data-test-id="57D056ED0984166336B7879C2AF3657F"]');
    await cityInput.click();
    await cityInput.fill('Cambridge');

    caseID = await page.locator('div[id="caseId"]').textContent();

    const state = page.locator('mat-select[data-test-id="46A2A41CC6E552044816A2D04634545D"]');
    await state.click();
    await page.locator('mat-option:has-text("MA")').click();

    const postalCodeInput = page.locator('input[data-test-id="572ED696F21038E6CC6C86BB272A3222"]');
    await postalCodeInput.click();
    await postalCodeInput.fill('02142');

    const phone = page.locator('mat-tel-input[data-test-id="1F8261D17452A959E013666C5DF45E07"]');
    const countrySelector = phone.locator('button');
    await countrySelector.click();
    await page.locator('div.flag.US >> nth=0').click();
    await phone.locator('input[type="tel"]').fill('(201) 555-0123');

    await page.locator('button:has-text("submit")').click();

    const tvPackage = page.locator('mat-checkbox[data-test-id="0B3244CEB2CE9879260EB560BD7A811E"]');
    await tvPackage.click();

    await page.locator('text=Premium').click();

    const internetPackage = page.locator('mat-checkbox[data-test-id="C05A1E5DECC321D9792E9A9E15184BE5"]');
    await internetPackage.click();

    await page.locator('text=300 Mbps').click();

    const phonePackage = page.locator('mat-checkbox[data-test-id="7CF3F86883596E49D8D7298CC5B928A2"]');
    await phonePackage.click();

    await page.locator('text=International Full').click();

    await page.locator('button:has-text("submit")').click();

    const otherNotes = page.locator('textarea[data-test-id="F4C6F851B00D5518BF888815DE279ABA"]');
    await otherNotes.click();
    await otherNotes.fill('Thanks for the service!');

    const sendToMgr = page.locator('mat-checkbox[data-test-id="C3B43E79AEC2D689F0CF97BD6AFB7DC4"]');
    await sendToMgr.click();

    const filePath = path.join(__dirname, '../../../src/assets/cableinfo.jpg');
    const attachInputId = await page.locator('div[id="attachment-container"] >> input').getAttribute('id');
    await page.setInputFiles(`#${attachInputId}`, filePath);
    await page.waitForTimeout(5000);
    await expect(page.locator('mat-spinner')).not.toBeVisible();

    await page.locator('button:has-text("submit")').click();

    const todo = await page.locator('div[class="psdk-todo-assignments"]');
    await expect(todo).toBeVisible();

    // Todo: This will be fixed as part of BUG-960405
    // const attachmentCount = await page.locator('div[id="attachments-count"]').textContent();
    // await expect(Number(attachmentCount)).toBeGreaterThan(0);
  }, 10000);

  test('should enter a discount value($) and send to tech', async ({ page }) => {
    await common.login(config.config.apps.mediaCo.manager.username, config.config.apps.mediaCo.manager.password, page);

    await common.verifyHomePage(page);

    const caseButton = page.locator(`button:has-text('${caseID}')`);
    await caseButton.click();

    const mgrDiscountInput = page.locator('input[data-test-id="D69ECA63310344EDB0D0F9881CF9B662"]');

    await mgrDiscountInput.fill('20');

    await page.locator('button:has-text("submit")').click();

    const todo = await page.locator('div[class="psdk-todo-assignments"]');
    await expect(todo).toBeVisible();
  }, 10000);

  test('should modify(if required) the actual services/packages to be installed and resolve the case', async ({ page }) => {
    await common.login(config.config.apps.mediaCo.tech.username, config.config.apps.mediaCo.tech.password, page);

    await common.verifyHomePage(page);

    const caseButton = page.locator(`button:has-text('${caseID}')`);
    await caseButton.click();

    const tvConnected = page.locator('mat-checkbox[data-test-id="EEF2AA5E42FD9F0FB0A44EA0B2D52921"]');
    await tvConnected.click();

    const internetConnected = page.locator('mat-checkbox[data-test-id="C43FA5D99B9290C0885E058F641CAB8D"]');
    await internetConnected.click();

    await page.locator('button:has-text("submit")').click();

    await page.locator('text=RESOLVED-COMPLETED').click();
  }, 10000);

  test('should show available portals for admin login', async ({ page }) => {
    await common.login(config.config.apps.mediaCo.admin.username, config.config.apps.mediaCo.admin.password, page);

    const defaultPortalErrorMessage = page.locator('div[data-test-id="defaultPortalErrorMessage"]');
    await expect(defaultPortalErrorMessage).toBeVisible();

    const mediaCoBtn = page.locator('div[class="portal-list-item"]>> text="WebPortal"');
    await expect(mediaCoBtn).toBeVisible();
    await mediaCoBtn.click();

    await common.verifyHomePage(page);
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
