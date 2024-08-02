const { config } = require('./config');

const login = async (username, password, page) => {
  await page.locator('input[id="txtUserID"]').fill(username);
  await page.locator('input[id="txtPassword"]').fill(password);
  await page.locator('#submit_row .loginButton').click();
};

const launchPortal = async ({ page }) => {
  await page.setViewportSize({ width: 1720, height: 1080 });
  await page.goto(`${config.baseUrl}`, { waitUntil: 'networkidle' });
};

const getAttributes = async element => {
  // eslint-disable-next-line no-return-await
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

module.exports = {
  login,
  getAttributes,
  getFutureDate,
  getFormattedDate,
  launchPortal
};
