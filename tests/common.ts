import { Page } from "@playwright/test";

export async function Login(username, password, page: Page) {
  await page.locator("#txtUserID").fill(username);
  await page.locator("#txtPassword").fill(password);
  await page.locator('#submit_row .loginButton').click();
}
