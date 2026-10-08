class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('.error-message');
  }

  async goto(url) {
    return this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  }

  async login(email, password) {
    await this.emailInput.pressSequentially(email, { delay: 80 });
    await this.passwordInput.pressSequentially(password, { delay: 80 });
    await this.loginButton.click();
  }
}

module.exports = { LoginPage };
