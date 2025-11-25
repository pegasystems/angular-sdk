const { test, expect } = require('@playwright/test');

const config = require('../../../config');
const common = require('../../../common');

// These values represent the data values used for the conditions and are initialised in pyDefault DT
const isDisabled = true;
const isVisible = true;

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto(config.config.baseUrl, { waitUntil: 'networkidle' });
});

test.describe('E2E test', () => {
  let attributes;

  test('should login, create case and run the Location tests', async ({ page }) => {
    await common.login(config.config.apps.digv2.user.username, config.config.apps.digv2.user.password, page);

    await common.verifyHomePage(page);

    await common.createCase('Form Field', page);

    /** Selecting Location from the Category dropdown */
    await common.selectCategory('Location', page);

    /** Selecting Required from the Sub Category dropdown */
    await common.selectSubCategory('Required', page);

    await page.locator('button:has-text("submit")').click();
    await expect(page.locator('mat-error')).toBeVisible();

    /** Validating Required scenario */
    const requiredLocationField = page.locator('input[data-test-id="5d234240d150ee2ad896ca0be0e01fd3"]');
    await requiredLocationField.fill('Hitech City, Hyderabad');
    await page.waitForSelector('mat-option');
    const firstOption = page.locator('mat-option').first();
    await firstOption.click();

    await expect(requiredLocationField).not.toHaveValue('');
    await expect(page.locator('mat-error')).toBeHidden();

    attributes = await common.getAttributes(requiredLocationField);
    expect(attributes.includes('required')).toBeTruthy();

    const nonRequiredLocationField = page.locator('input[data-test-id="e4c3274b192b2696223fe7c86c635b75"]');
    attributes = await common.getAttributes(nonRequiredLocationField);
    expect(attributes.includes('required')).toBeFalsy();

    /** Selecting Disable from the Sub Category dropdown */
    await common.selectSubCategory('Disable', page);

    /** Validating Disabled scenario */
    const alwaysDisabledLocation = page.locator('input[data-test-id="43067a18c1d1c66f64f01e7e274c6396"]');
    attributes = await common.getAttributes(alwaysDisabledLocation);
    expect(attributes.includes('disabled')).toBeTruthy();

    const conditionallyDisabledLocation = page.locator('input[data-test-id="878f51dda2d3d8279c962e2f65172ac3"]');
    attributes = await common.getAttributes(conditionallyDisabledLocation);
    if (isDisabled) {
      expect(attributes.includes('disabled')).toBeTruthy();
    } else {
      expect(attributes.includes('disabled')).toBeFalsy();
    }

    const neverDisabledLocation = page.locator('input[data-test-id="a98054547fce446cbe5d4f9fb06c922c"]');
    attributes = await common.getAttributes(neverDisabledLocation);
    expect(attributes.includes('disabled')).toBeFalsy();

    /** Selecting Update from the Sub Category dropdown */
    await common.selectSubCategory('Update', page);

    const editableLocation = page.locator('input[data-test-id="666e146bbb2d7e31be1a66c4ea52f453"]');
    await editableLocation.fill('Hitech City, Hyderabad');
    await page.waitForSelector('mat-option');
    const editableLocationFirstOption = page.locator('mat-option').first();
    await editableLocationFirstOption.click();

    attributes = await common.getAttributes(editableLocation);
    expect(attributes.includes('readonly')).toBeFalsy();

    /** Selecting Visibility from the Sub Category dropdown */
    await common.selectSubCategory('Visibility', page, true);

    /** Visibility tests */
    await expect(page.locator('input[data-test-id="4d056e06ff67ee10b252d5d96d373c91"]')).toBeVisible();

    const neverVisibleLocation = await page.locator('input[data-test-id="804db68b1b68c6e908079a1cab23fcdc"]');
    await expect(neverVisibleLocation).not.toBeVisible();

    const conditionallyVisibleLocation = await page.locator('input[data-test-id="4b7ffe4018eb786ba3d11aa195f7d98d"]');

    if (isVisible) {
      await expect(conditionallyVisibleLocation).toBeVisible();
    } else {
      await expect(conditionallyVisibleLocation).not.toBeVisible();
    }

    /** Label tests */
    await common.selectSubCategory('Label', page);

    const defaultLabelLocationField = page.locator('input[data-test-id="1d1f18e5499018ff649dd30066ba2270"]');
    await expect(defaultLabelLocationField).toBeVisible();
    const defaultLabel = await defaultLabelLocationField.locator('xpath=ancestor::mat-form-field//mat-label').textContent();

    expect(defaultLabel).toBe('LocationDefaultLabel');

    const customLabelLocationField = page.locator('input[data-test-id="88de9f842705651ff0dae0556755a43e"]');
    await expect(customLabelLocationField).toBeVisible();
    const customLabel = await customLabelLocationField.locator('xpath=ancestor::mat-form-field//mat-label').textContent();

    expect(customLabel).toBe('Enter location (custom label)');

    const customPlaceholderHelperField = page.locator('input[data-test-id="df7f2d2aa61b4ebfddb604ae39cb7374"]');
    await expect(customPlaceholderHelperField).toBeVisible();
    const placeholder = await customPlaceholderHelperField.getAttribute('placeholder');
    expect(placeholder).toBe('Enter location');
    const helper = await customPlaceholderHelperField.locator('xpath=ancestor::mat-form-field//mat-hint').textContent();
    expect(helper).toBe('You can either enter place name or coordinates ');

    /** Selecting Map Visibility from the Sub Category dropdown */
    await common.selectSubCategory('Map Visibility', page);

    /** Map Visibility tests */
    const mapVisibilityLocationField = page.locator('input[data-test-id="ce5f551ab012660f2358544a1ce8dede"]');
    await expect(mapVisibilityLocationField).toBeVisible();
    let component = mapVisibilityLocationField.locator('xpath=ancestor::app-location');
    await expect(component.locator('google-map')).toHaveCount(1);

    /** To check map is hidden */
    const mapHiddenLocationField = page.locator('input[data-test-id="ad80fd801feb0799ca829d6eedb8902a"]');
    component = mapHiddenLocationField.locator('xpath=ancestor::app-location');
    await expect(component.locator('google-map')).toHaveCount(0);

    /** To verify if the populated value is coordinates. */
    const onlyCoordsLocationField = page.locator('input[data-test-id="41b59bdbb86495ae2db766c2944d4d7b"]');
    await onlyCoordsLocationField.fill('Hitech City, Hyderabad');
    await page.waitForSelector('mat-option');
    const onlyCoordsLocationFirstOption = page.locator('mat-option').first();
    await onlyCoordsLocationFirstOption.click();

    const coordinates = await onlyCoordsLocationField.inputValue();
    const regex = /^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/;
    expect(regex.test(coordinates.trim())).toBe(true);
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
