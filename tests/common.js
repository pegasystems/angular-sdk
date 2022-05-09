const Login = async (username, password, page) => {
    await page.locator("#txtUserID").type(username);
    await page.locator("#txtPassword").type(password);
    await page.locator('#submit_row .loginButton').click();
}
  
module.exports = {
    Login
};
  