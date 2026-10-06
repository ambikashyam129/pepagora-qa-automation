const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { users } = require('../utils/testData');

test.describe('Login', () => {
  // Login must start from a logged-out browser, not the shared saved session.
  test.use({ storageState: { cookies: [], origins: [] } });

  test('should login successfully with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const { email, password } = users.existingUser;

    await loginPage.goto('/login');
    await loginPage.login(email, password);

    await expect(page).not.toHaveURL(/login/);
  });

  test('should show an error with invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const { email, password } = users.invalidUser;

    await loginPage.goto('/login');
    await loginPage.login(email, password);

    await expect(loginPage.errorMessage).toBeVisible();
  });
});
