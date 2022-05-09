const {test} = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3500/embedded");
});

test.describe("E2E test", () => {
  test("should launch, select a service plan and fill details", async ({ page }) => {

    const silverPlan = await page.locator('button:has-text("SHOP NOW") >> nth=0');
    await silverPlan.click();

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

    await page.locator('button:has-text("next")').click();

    const streetInput = await page.locator('input[data-test-id="D61EBDD8A0C0CD57C22455E9F0918C65"]');
    await streetInput.click();
    await streetInput.type("Main St");

    await page.locator('button:has-text("previous")').click();

    await page.locator('h2:has-text("Customer Info")').click();

    await page.locator('button:has-text("next")').click();

    await page.locator('h2:has-text("Customer Address")').click();

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

    await page.locator('button:has-text("next")').click();

    const dataServiceInput = await page.locator('input[data-test-id="1321FA74451B96BC02663B0EF96CCBB9"]');
    await dataServiceInput.click();
    const date = `${new Date().getMonth()+2}/${new Date().getDate()}/${new Date().getFullYear()}`;
    await dataServiceInput.type(date);

    await page.locator('button:has-text("next")').click();

    await page.locator('button:has-text("submit")').click();

    //  Click text=Thank you! The next step in this case has been routed appropriately.
      await page
        .locator(
          "text=Thanks for selecting a package with us. "
        )
        .click();
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});