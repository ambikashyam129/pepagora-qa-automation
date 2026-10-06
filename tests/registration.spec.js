const { test, expect } = require('@playwright/test');
const { RegistrationPage } = require('../pages/RegistrationPage');
const { users } = require('../utils/testData');

test.describe('Registration', () => {
  // Registration must start from a logged-out browser, not the shared saved session.
  test.use({ storageState: { cookies: [], origins: [] } });

  test('should register a new user successfully', async ({ page }) => {
    const registrationPage = new RegistrationPage(page);
    const { firstName, lastName, email, password } = users.validUser;

    await registrationPage.goto('/register');
    await registrationPage.register(firstName, lastName, email, password);

    await expect(registrationPage.successMessage).toBeVisible();
  });
});
