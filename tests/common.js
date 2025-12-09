const { expect } = require('@playwright/test');
const { config } = require('./config');

const createCase = async (caseTypeName, page) => {
  const createCaseBtn = page.locator('mat-list-item[id="create-case-button"]');
  await createCaseBtn.click();
  const caseType = page.locator(`mat-list-item[id="case-list-item"] > span:has-text("${caseTypeName}")`);
  await caseType.click();
};

const launchPortal = async ({ page }) => {
  await page.setViewportSize({ width: 1720, height: 1080 });
  await page.goto(`${config.baseUrl}`, { waitUntil: 'networkidle' });
};

const launchEmbedded = async ({ page }) => {
  await page.setViewportSize({ width: 1720, height: 1080 });
  await page.goto(`${config.baseEmbedUrl}`, { waitUntil: 'networkidle' });
};

const launchSelfServicePortal = async ({ page }) => {
  await page.setViewportSize({ width: 1720, height: 1080 });
  await page.goto(`${config.baseUrl}?portal=DigV2SelfService`, {
    waitUntil: 'networkidle'
  });
};

const login = async (username, password, page) => {
  await page.locator('input[id="txtUserID"]').fill(username);
  await page.locator('input[id="txtPassword"]').fill(password);
  await page.locator('#submit_row .loginButton').click();
};

const getAttributes = async element => {
  return await element.evaluate(async ele => ele.getAttributeNames());
};

const getFormattedDate = date => {
  if (!date) {
    return date;
  }

  return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
};

const getFutureDate = () => {
  const today = new Date();
  // add 2 days to today
  const futureDate = new Date(today.setDate(today.getDate() + 2));

  // Need to get leading zeroes on single digit months and 4 digit year
  return getFormattedDate(futureDate);
};

const selectDateFromPicker = async (page, day, month, year) => {
  /** Open the datepicker popup */
  await page.locator('button[aria-label="Open calendar"]').click();
  /** Switch to multi-year view */
  await page.locator('.mat-calendar-period-button').click();
  /** Navigate back until the desired year is visible */
  while (!(await page.locator(`.mat-calendar-body-cell:has-text("${year}")`).isVisible())) {
    await page.locator('.mat-calendar-previous-button').click();
  }
  /** Select the year */
  await page.locator(`.mat-calendar-body-cell:has-text("${year}")`).click();
  /** Select the month (Angular Material uses short month names like JAN, FEB, JUN) */
  const shortMonth = month.substring(0, 3).toUpperCase();
  await page.locator(`.mat-calendar-body-cell:has-text("${shortMonth}")`).click();
  /** Select the day using aria-label for uniqueness */
  const ariaLabel = `${month} ${day}, ${year}`;
  await page.locator(`[aria-label="${ariaLabel}"]`).click();
};

const selectCategory = async (category, page, exact = false) => {
  const selectedCategory = page.locator('mat-select[data-test-id="76729937a5eb6b0fd88c42581161facd"]');
  await selectedCategory.click();
  await page.getByRole('option', { name: category, exact }).click();
};

const selectSubCategory = async (subCategory, page, exact = false) => {
  const selectedSubCategory = page.locator('mat-select[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
  await selectedSubCategory.click();
  await page.getByRole('option', { name: subCategory, exact }).click();
};

const verifyHomePage = async page => {
  /** Testing announcement banner presence */
  const announcementBanner = page.locator('h2:has-text("Announcements")');
  await expect(announcementBanner).toBeVisible();

  /** Testing worklist presence */
  const worklist = page.locator('div[id="worklist"]:has-text("My Worklist")');
  await expect(worklist).toBeVisible();
};

const fillTextInput = async (page, testID, text) => {
  const input = page.locator(`input[data-test-id="${testID}"]`);
  await input.click();
  await input.fill(text);
};

module.exports = {
  createCase,
  launchPortal,
  launchEmbedded,
  launchSelfServicePortal,
  login,
  getAttributes,
  getFutureDate,
  getFormattedDate,
  selectCategory,
  selectSubCategory,
  verifyHomePage,
  selectDateFromPicker,
  fillTextInput
};
