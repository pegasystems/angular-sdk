const { test } = require('@playwright/test');
const common = require('../../common');
const config = require('../../config');

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto(config.config.baseEmbedUrl, { waitUntil: 'networkidle' });
});

test.describe('E2E test', () => {
  test('should launch, select a service plan and fill details', async ({ page }) => {
    const silverPlan = page.locator('button:has-text("SHOP NOW") >> nth=0');
    await silverPlan.click();

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

    await page.locator('button:has-text("next")').click();

    const streetInput = page.locator('input[data-test-id="D61EBDD8A0C0CD57C22455E9F0918C65"]');
    await streetInput.click();
    await streetInput.fill('Main St');

    await page.locator('button:has-text("previous")').click();

    await page.locator('h2:has-text("Customer Info")').click();

    await page.locator('button:has-text("next")').click();

    await page.locator('h2:has-text("Customer Address")').click();

    const cityInput = page.locator('input[data-test-id="57D056ED0984166336B7879C2AF3657F"]');
    await cityInput.click();
    await cityInput.fill('Cambridge');

    const state = page.locator('mat-select[data-test-id="46A2A41CC6E552044816A2D04634545D"]');
    await state.click();
    await page.locator('mat-option:has-text("MA")').click();

    const postalCodeInput = page.locator('input[data-test-id="572ED696F21038E6CC6C86BB272A3222"]');
    await postalCodeInput.click();
    await postalCodeInput.fill('02142');

    const phone = page.locator('ngx-mat-intl-tel-input[data-test-id="1F8261D17452A959E013666C5DF45E07"]');
    const countrySelector = phone.locator('button.country-selector');
    await countrySelector.click();
    await page.locator('div.flag.US >> nth=0').click();
    await phone.locator('input[type="tel"]').fill('(201) 555-0123');

    await page.locator('button:has-text("next")').click();

    const dataServiceInput = page.locator('input[data-test-id="1321FA74451B96BC02663B0EF96CCBB9"]');
    await dataServiceInput.click();
    const futureDate = common.getFutureDate();
    await dataServiceInput.fill(futureDate);

    await page.locator('button:has-text("next")').click();

    await page.locator('button:has-text("submit")').click();

    //  Click text=Thank you! The next step in this case has been routed appropriately.
    await page.locator('text=Thanks for selecting a package with us. ').click();
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
