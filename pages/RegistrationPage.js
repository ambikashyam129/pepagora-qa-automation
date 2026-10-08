class RegistrationPage {
  constructor(page) {
    this.page = page;
    this.firstNameInput = page.locator('#firstName');
    this.lastNameInput = page.locator('#lastName');
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.confirmPasswordInput = page.locator('#confirmPassword');
    this.registerButton = page.locator('button[type="submit"]');
    this.successMessage = page.locator('.success-message');
  }

  async goto(url) {
    return this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  }

  async register(firstName, lastName, email, password) {
    await this.firstNameInput.pressSequentially(firstName, { delay: 80 });
    await this.lastNameInput.pressSequentially(lastName, { delay: 80 });
    await this.emailInput.pressSequentially(email, { delay: 80 });
    await this.passwordInput.pressSequentially(password, { delay: 80 });
    await this.confirmPasswordInput.pressSequentially(password, { delay: 80 });
    await this.registerButton.click();
  }
}

module.exports = { RegistrationPage };
