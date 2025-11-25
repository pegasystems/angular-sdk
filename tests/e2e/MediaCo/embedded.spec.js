const { test, expect } = require('@playwright/test');
const common = require('../../common');
const config = require('../../config');

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto(config.config.baseEmbedUrl, { waitUntil: 'networkidle' });
});

test.describe('E2E test', () => {
  test('should launch, select a service plan and fill details', async ({ page }) => {
    const silverPlan = page.locator('button:has-text("Buy now") >> nth=0');
    await silverPlan.click();

    const storageOption = page.locator('mat-card:has-text("128 gb")');
    await storageOption.click();

    const colorOption = page.locator('mat-card:has-text("Caribbean blue")');
    await colorOption.click();

    await page.locator('button:has-text("Next")').click();

    await expect(page.locator('mat-label:has-text("Would you like to keep your number or generate a new one?")')).toBeVisible();
    await page.locator('mat-radio-button:has-text("Keep my number") input[type="radio"]').check();

    await expect(page.locator('mat-label:has-text("Do you have a trade-in?")')).toBeVisible();
    await page.locator('mat-radio-button:has-text("Yes") input[type="radio"]').check();

    const paymentOption = page.locator('mat-card:has-text("Monthly")');
    await paymentOption.click();

    await page.locator('button:has-text("Next")').click();

    await common.fillTextInput(page, 'BC910F8BDF70F29374F496F05BE0330C', 'John');

    await common.fillTextInput(page, '77587239BF4C54EA493C7033E1DBF636', 'Doe');

    await common.selectDateFromPicker(page, '6', 'June', '2000');

    await common.fillTextInput(page, '643a860f992333b8600ea264aca7c4fc', 'Johndoe@gmail.com');

    const phoneControl = page.locator('mat-tel-input[data-test-id="1e4dbc7eaa78468a3bc1448a3d68d906"]');
    const countrySelector = phoneControl.locator('button');
    await countrySelector.click();
    await page.locator('text=United States >> nth=0').click();
    const phoneInput = phoneControl.locator('input');
    await phoneInput.click();
    await phoneInput.fill('6175551212');

    await page.locator('button:has-text("Next")').click();

    await common.fillTextInput(page, 'c2b63e85bd5e4dc9b6cf5a4693847e06', 'John Doe');

    await common.fillTextInput(page, 'a44217022190f5734b2f72ba1e4f8a79', '1234567');

    await common.selectDateFromPicker(page, '6', 'June', '2030');

    await page.locator('button:has-text("Next")').click();

    // Enter Street
    await common.fillTextInput(page, 'D61EBDD8A0C0CD57C22455E9F0918C65', '123 Main St');
    // Enter Apartment
    await common.fillTextInput(page, '73786cb2bc433cfb06603ab61f15e04e', 'Apt 4');
    // Enter city
    await common.fillTextInput(page, '57D056ED0984166336B7879C2AF3657F', 'Anytown');
    // Enter state
    await common.fillTextInput(page, '46A2A41CC6E552044816A2D04634545D', 'New York');
    // Enter postal code
    await common.fillTextInput(page, '572ED696F21038E6CC6C86BB272A3222', '12345');

    await page.locator('button:has-text("Submit")').click();

    const paragraphElement = page.locator('.resolution-card p');
    await expect(paragraphElement).toBeVisible();
    await expect(paragraphElement).toHaveText(
      ' We have received your order of a Oceonix 25. It will ship out within 1 business day to Apt 4. Your tracking information will be sent to Johndoe@gmail.com.  Thank you for your business! '
    );
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
