const { test, expect } = require('@playwright/test');

const path = require('path');

const config = require('../../../config');
const common = require('../../../common');

// These values represent the data values used for the conditions and are initialised in pyDefault DT
const isDisabled = true;

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto(config.config.baseUrl, { waitUntil: 'networkidle' });
});

test.describe('E2E test', () => {
  let attributes;

  test('should login, create case and run the Attachment tests', async ({ page }) => {
    await common.login(config.config.apps.digv2.user.username, config.config.apps.digv2.user.password, page);

    await common.verifyHomePage(page);

    await common.createCase('Form Field', page);

    /** Selecting Attachment from the Category dropdown */
    await common.selectCategory('Attachment', page);

    /** Selecting Required from the Sub Category dropdown */
    await common.selectSubCategory('Required', page);

    const cableChatFilePath = path.join(__dirname, '../../../../src/assets/cablechat.jpg');
    const cableInfoFilePath = path.join(__dirname, '../../../../src/assets/cableinfo.jpg');
    const zeroBytesFilePath = path.join(__dirname, '../../../../src/assets/zerobytes');

    // Checking required  attachment field
    await page.locator('button:has-text("submit")').click();

    await expect(page.locator('span:has-text("Cannot be blank")')).toBeVisible();
    await page.setInputFiles(`#AttachmentRequired`, cableChatFilePath);

    await expect(page.locator('span:has-text("Cannot be blank")')).toBeHidden();

    /** Selecting Disable from the Sub Category dropdown */
    await common.selectSubCategory('Disable', page);

    // Disable tests
    const alwaysDisabledAttachment = page.locator('app-attachment').filter({ hasText: 'AttachmentDisabledAlways' }).getByRole('button');

    attributes = await common.getAttributes(alwaysDisabledAttachment);
    expect(attributes.includes('disabled')).toBeTruthy();

    const conditionallyDisabledAttachment = page.locator('app-attachment').filter({ hasText: 'AttachmentDisabledCondition' }).getByRole('button');
    attributes = await common.getAttributes(conditionallyDisabledAttachment);
    if (isDisabled) {
      expect(attributes.includes('disabled')).toBeTruthy();
    } else {
      expect(attributes.includes('disabled')).toBeFalsy();
    }

    const neverDisabledAttachment = page.locator('app-attachment').filter({ hasText: 'AttachmentDisabledNever' }).getByRole('button');
    attributes = await common.getAttributes(neverDisabledAttachment);
    await page.setInputFiles(`#AttachmentDisabledNever`, cableChatFilePath);
    expect(attributes.includes('disabled')).toBeFalsy();

    /** Testing Single mode attachments */
    await common.selectSubCategory('Single', page);

    const singleAttachment = page.locator('div[id="attachment-container"]');
    await expect(singleAttachment.locator('button:has-text("Choose a file")')).toBeVisible();
    await page.setInputFiles(`#Attachment`, cableChatFilePath);
    await expect(page.locator('div >> text="cablechat.jpg"')).toBeVisible();
    await expect(page.locator('span:has-text("Choose a file")')).toBeHidden();

    await page.locator('button[id="delete-attachment"]').click();

    await expect(singleAttachment.locator('button:has-text("Choose a file")')).toBeVisible();

    /** Testing Multiple mode attachments */
    await common.selectSubCategory('Multiple', page);

    const multipleAttachment = page.locator('div[id="attachment-container"]');
    await expect(singleAttachment.locator('button:has-text("Choose files")')).toBeVisible();
    await page.setInputFiles(`#AttachmentList`, [cableChatFilePath, cableInfoFilePath]);

    await expect(page.locator('div >> text="cableinfo.jpg"')).toBeVisible();
    await expect(page.locator('div >> text="cablechat.jpg"')).toBeVisible();

    await expect(multipleAttachment.locator('button:has-text("Choose files")')).toBeVisible();

    /** Testing invalid attachment case by uploading an empty file */
    await page.setInputFiles(`#AttachmentList`, [zeroBytesFilePath]);
    await expect(page.locator(`div >> text="Empty file can't be uploaded."`)).toBeVisible();

    await page.locator('div[class="psdk-attachment-card"]').filter({ hasText: 'Unable to upload file' }).locator('#delete-attachment').click();

    await page.locator('button:has-text("submit")').click();

    // Raised bug BUG-960405
    // await page.locator('button[id="setting-button"] >> nth=0').click();

    // /** Download attachment */
    // const menuSelector = await page.locator('div[role="menu"]');
    // await menuSelector.locator('button >> text="Download"').click();

    // await page.locator('button[id="setting-button"] >> nth=0').click();

    // /** Delete attachment */
    // await menuSelector.locator('button >> text="Delete"').click();
    // await expect(page.locator('div >> text="cableinfo.jpg"')).toBeVisible();
    // await expect(page.locator('div >> text="cablechat.jpg"')).toBeHidden();
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
