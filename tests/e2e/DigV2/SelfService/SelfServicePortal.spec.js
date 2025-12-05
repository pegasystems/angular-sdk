const { test, expect } = require('@playwright/test');
const config = require('../../../config');
const common = require('../../../common');

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('http://localhost:3500/portal?portal=DigV2SelfService');
});

test.describe('E2E test', () => {
  test('should login and able to render self-service portal', async ({ page }) => {
    await common.login(config.config.apps.digv2.user.username, config.config.apps.digv2.user.password, page);

    /** Testing app name presence */
    const appName = page.locator('div[class="psdk-nav-portal-app"]:has-text("DigV2")');
    await expect(appName).toBeVisible();

    const navLinks = page.locator('mat-toolbar-row[class="mat-toolbar-row"]');

    /** Testing the Home navigation link */
    await expect(navLinks.locator('div[class="psdk-nav-button-span"]:has-text("Home")')).toBeVisible();
    await navLinks.locator('div[class="psdk-nav-button-span"]:has-text("Home")').click();

    await common.verifyHomePage(page);

    /** Testing the My Work navigation link */
    await expect(navLinks.locator('div[class="psdk-nav-button-span"]:has-text("My Work")')).toBeVisible();

    await navLinks.locator('div[class="psdk-nav-button-span"]:has-text("My Work")').click();

    // const myWork = await page.locator('h6:has-text("My Work")');
    // await expect(myWork).toBeVisible();

    /** Testing the Inline Dashboard navigation link */
    await expect(navLinks.locator('div[class="psdk-nav-button-span"]:has-text("Inline Dashboard")')).toBeVisible();

    await navLinks.locator('div[class="psdk-nav-button-span"]:has-text("Inline Dashboard")').click();

    // const inlineDashboard = await page.locator('h4:has-text("Inline Dashboard")');
    // await expect(inlineDashboard).toBeVisible();

    // const worklist1 = await page.locator('h6:has-text("Complex  Fields - List")');
    // await expect(worklist1).toBeVisible();

    await page.locator('div[class="psdk-nav-portal-app"]:has-text("DigV2")').click();

    /** Testing Quick links heading presence */
    const quickLinksHeading = page.locator('h1[class="quick-link-heading"]:has-text("Quick links")');
    await expect(quickLinksHeading).toBeVisible();

    /** Testing the case creation with Quick links */
    const quickLinks = page.locator('ul[class="quick-link-ul-list"]');
    await quickLinks.locator('button:has-text("Complex  Fields")').click();

    await page.locator('button:has-text("Submit")').click();

    await page.locator('div[class="psdk-nav-portal-app"]:has-text("DigV2")').click();

    await expect(page.locator('div[id="worklist"]:has-text("My Tasks")')).toBeVisible();

    await page.close();
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
