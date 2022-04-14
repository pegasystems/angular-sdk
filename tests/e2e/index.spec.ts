import { test, expect, Page } from "@playwright/test";
import config from "../config";
import { Login } from "../common";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3500/portal");
});

test.describe("E2E test", () => {
  test("should login,create and send for discount", async ({ page }) => {
    await Login(
      config.apps.mediaCo.rep.username,
      config.apps.mediaCo.rep.password,
      page
    );

    const announcementBanner = page.locator(".psdk-announcement");
    const whatsNew = announcementBanner.locator("a");
    await expect(announcementBanner).toBeVisible();
    await expect(whatsNew).toHaveAttribute("href", "https://design.pega.com");

    const todoArea = page.locator(".psdk-todo");
    const todoHeader = todoArea.locator(".psdk-todo-header");
    const assignmentCount = todoHeader.locator(".psdk-assignment-count");

    await expect(assignmentCount).toBeVisible();

    const workList = todoArea.locator(".psdk-todo-assignments");
    await expect(workList).toBeVisible();

    /* create case */
    await page.hover(".psdk-appshell-nav");

    const appShellNav = page.locator(".psdk-appshell-nav");
    const appShellNavHeader = appShellNav.locator(".psdk-nav-header");
    const portalName = appShellNavHeader.locator(".psdk-nav-portal-name");

    await expect(portalName).toHaveText("User Portal");

    const createMenu = appShellNav.locator(".create-menu");
    const createButton = createMenu.locator("button:first-child");
    await createButton.click();
    const caseButton = createMenu.locator('button:has-text("New Service")');
    await caseButton.click();

    await page.locator("#mat-input-0").click();

    // Click button:has-text("Submit")
    await page.locator('button:has-text("Submit")').click();

    await page.locator("#mat-input-0").fill("John");

    // Press Tab
    await page.locator("#mat-input-0").press("Tab");

    await page.locator("#mat-input-1").fill("Legend");

    await page.locator("#mat-input-2").click();

    await page.locator("#mat-input-2").fill("Doe");

    await page.locator('input[role="combobox"]').click();

    // Click text=-- (Sr)
    await page.locator("text=-- (Sr)").click();

    await page.locator('input[type="email"]').click();

    // Fill input[type="email"]
    await page.locator('input[type="email"]').fill("john@legend.com");

    await page.locator("#mat-input-5").click();

    // Click [aria-label="Open calendar"]
    await page.locator('[aria-label="Open calendar"]').click();

    // Click [aria-label="April 30\, 2022"]
    await page.locator('[aria-label="April 30\\, 2022"]').click();

    // Click button:has-text("Submit")
    await page.locator('button:has-text("Submit")').click();

    await page.locator("#mat-input-6").click();

    await page.locator("#mat-input-6").fill("One street");

    await page.locator("#mat-input-7").click();

    // Fill City
    await page.locator("#mat-input-7").fill("Anchorage");

    await page.locator('mat-select[role="combobox"] span').click();

    // Click AL
    await page.locator('div[role="listbox"] >> text=AL').click();

    await page.locator("#mat-input-8").click();

    // Fill Zip Code
    await page.locator("#mat-input-8").fill("99504");

    await page
      .locator(
        'app-assignment-card div:has-text("CancelSave for laterBackSubmit")'
      )
      .first()
      .click();

    // Fill [placeholder="\(201\) 555-0123"]
    await page
      .locator('input[placeholder="\\(201\\) 555-0123"]')
      .fill("2015550111");
    // Click app-assignment-card div:has-text("CancelSave for laterBackSubmit") >> nth=0
    await page
      .locator(
        'app-assignment-card div:has-text("CancelSave for laterBackSubmit")'
      )
      .first()
      .click();

    // Click button:has-text("Submit")
    await page.locator('button:has-text("Submit")').click();

    await page.waitForSelector(".mat-checkbox-inner-container", {
      visible: true,
    });

    await page.locator(".mat-checkbox-inner-container").first().click();

    // Click text=Deluxe
    await page.locator("text=Deluxe").click();

    // Click text=Premium
    await page.locator("text=Premium").click();

    // Click #mat-checkbox-3 .mat-checkbox-layout .mat-checkbox-inner-container
    await page
      .locator(
        "#mat-checkbox-3 .mat-checkbox-layout .mat-checkbox-inner-container"
      )
      .click();

    // Click text=300 Mbps
    await page.locator("text=300 Mbps").click();

    // Click text=Phone Package
    await page.locator("text=Phone Package").click();

    // Click text=International Full
    await page.locator("text=International Full").click();

    // Click button:has-text("Submit")
    await page.locator('button:has-text("Submit")').click();

    await page.locator('textarea[type="text"]').click();

    await page.locator('textarea[type="text"]').click();

    await page
      .locator('textarea[type="text"]')
      .fill("Please provide discount on internet package");

    // Click text=Send to manager for discount
    await page.locator("text=Send to manager for discount").click();

    // Click button:has-text("Submit")
    await page.locator('button:has-text("Submit")').click();

    // Click text=Thank you! The next step in this case has been routed appropriately.
    await page
      .locator(
        "text=Thank you! The next step in this case has been routed appropriately."
      )
      .click();
  });
});

test.afterEach(async ({ page }) => {
  await page.close();
});
