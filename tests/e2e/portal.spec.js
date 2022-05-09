const {test, expect} = require('@playwright/test');
const config = require('../config');
const common = require('../common');

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3500/portal");
});

test.describe("E2E test", () => {
  test("should login, create and send for discount", async ({ page }) => {
    await common.Login(
      config.config.apps.mediaCo.rep.username,
      config.config.apps.mediaCo.rep.password,
      page
    );

    const announcementBanner = await page.locator('h2:has-text("Announcements")');
    await expect(announcementBanner).toBeVisible();

    const worklist = await page.locator('div[class="psdk-todo-text"]:has-text("My Worklist")');
    await expect(worklist).toBeVisible();

    const navbar = await page.locator('app-navbar');
    await navbar.locator('div[class="psdk-appshell-nav"]').hover();
    
    const createCase = await page.locator('button[id="create-button"]');
    await createCase.click();

    const newServiceCase = await page.locator('button[id="create-case"]');
    await newServiceCase.click();

    const firstNameInput = await page.locator('input[data-test-id="BC910F8BDF70F29374F496F05BE0330C"]');
    await firstNameInput.click();
    await firstNameInput.type("Manasa");

    const middleNameInput = await page.locator('input[data-test-id="D3691D297D95C48EF1A2B7D6523EF3F0"]');
    await middleNameInput.click();
    await middleNameInput.type("");

    const lastNameInput = await page.locator('input[data-test-id="77587239BF4C54EA493C7033E1DBF636"]');
    await lastNameInput.click();
    await lastNameInput.type("Mashetty");

    const suffix = page.locator('input[data-test-id="56E6DDD1CB6CEC596B433440DFB21C17"]');
    await suffix.click();
    await page.locator('mat-option[ng-reflect-value="Jr"]').click();

    const emailInput = await page.locator('input[data-test-id="CE8AE9DA5B7CD6C3DF2929543A9AF92D"]');
    await emailInput.click();
    await emailInput.type("manasa.mashetty@in.pega.com");

    const serviceDateInput = await page.locator('input[data-test-id="E0BA356AE552ACD4326D51E61F4279AC"]');
    await serviceDateInput.click();
    const date = `${new Date().getMonth()+2}/${new Date().getDate()}/${new Date().getFullYear()}`;
    await serviceDateInput.type(date);

    await page.locator('button:has-text("submit")').click();

    const streetInput = await page.locator('input[data-test-id="D61EBDD8A0C0CD57C22455E9F0918C65"]');
    await streetInput.click();
    await streetInput.type("Main St");

    const cityInput = await page.locator('input[data-test-id="57D056ED0984166336B7879C2AF3657F"]');
    await cityInput.click();
    await cityInput.type("Cambridge");

    const state = await page.locator('mat-select[data-test-id="46A2A41CC6E552044816A2D04634545D"]');
    await state.click();
    await page.locator('mat-option[ng-reflect-value="MA"]').click();

    const postalCodeInput = await page.locator('input[data-test-id="572ED696F21038E6CC6C86BB272A3222"]');
    await postalCodeInput.click();
    await postalCodeInput.type("02142");

    const phone = await page.locator('ngx-intl-tel-input[data-test-id="1F8261D17452A959E013666C5DF45E07"]');
    const countrySelector = await phone.locator('div[class="iti__flag-container"]');
    await countrySelector.click();
    await page.locator("text=United States+1 >> nth=0").click();
    const phoneInput = await phone.locator('input[type="tel"]');
    await phoneInput.click();
    await phoneInput.type("(201) 555-0123");

    await page.locator('button:has-text("submit")').click();

    const tvPackage = await page.locator('mat-checkbox[data-test-id="0B3244CEB2CE9879260EB560BD7A811E"]');
    await tvPackage.click();

    await page.locator('text=Premium').click();

    const internetPackage = await page.locator('mat-checkbox[data-test-id="C05A1E5DECC321D9792E9A9E15184BE5"]');
    await internetPackage.click();

    await page.locator('text=300 Mbps').click();

    const phonePackage = await page.locator('mat-checkbox[data-test-id="7CF3F86883596E49D8D7298CC5B928A2"]');
    await phonePackage.click();

    await page.locator('text=International Full').click();

    await page.locator('button:has-text("submit")').click();

    const otherNotes = await page.locator('textarea[data-test-id="F4C6F851B00D5518BF888815DE279ABA"]');
    await otherNotes.click();
    await otherNotes.type("Thanks for the service!");

    const sendToMgr = await page.locator('mat-checkbox[data-test-id="C3B43E79AEC2D689F0CF97BD6AFB7DC4"]');
    await sendToMgr.click();

    await page.locator('button:has-text("submit")').click();


    //  Click text=Thank you! The next step in this case has been routed appropriately.
      await page
        .locator(
          "text=Thank you! The next step in this case has been routed appropriately."
        )
        .click();
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});