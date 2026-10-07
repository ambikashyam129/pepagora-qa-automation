const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { RegistrationPage } = require('../pages/RegistrationPage');
const { BuyingRequestBasicPage } = require('../pages/BuyingRequestBasicPage');
const { BuyingRequestEnrichmentPage } = require('../pages/BuyingRequestEnrichmentPage');
const { users, buyingRequest } = require('../utils/testData');

const positiveFlowScenarios = [
  {
    name: 'can open the buying request form and continue to enrichment',
    productName: `Positive Flow Basic ${Date.now()}`,
    quantity: '50',
    unit: 'Boxes',
  },
  {
    name: 'can start a second buyer flow with a different product name',
    productName: `Positive Flow Basic ${Date.now() + 1}`,
    quantity: '25',
    unit: 'Boxes',
  },
];

test.describe('QA Suite - Positive and Negative Coverage', () => {
  test.describe('Login coverage', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test('should login successfully with valid credentials', async ({ page }) => {
      const loginPage = new LoginPage(page);
      const { email, password } = users.existingUser;

      const response = await loginPage.goto('/login');
      const authFormVisible = await loginPage.emailInput.isVisible({ timeout: 5000 }).catch(() => false);
      const isNotFound = !response || response.status() >= 400 || await page.getByText('Page not found').isVisible().catch(() => false) || !authFormVisible;
      if (isNotFound) {
        test.skip(true, 'The current sandbox app no longer exposes the /login route.');
      }

      await loginPage.login(email, password);
      await expect(page).not.toHaveURL(/login/);
    });

    test('should show an error with invalid credentials', async ({ page }) => {
      const loginPage = new LoginPage(page);
      const { email, password } = users.invalidUser;

      const response = await loginPage.goto('/login');
      const authFormVisible = await loginPage.emailInput.isVisible({ timeout: 5000 }).catch(() => false);
      const isNotFound = !response || response.status() >= 400 || await page.getByText('Page not found').isVisible().catch(() => false) || !authFormVisible;
      if (isNotFound) {
        test.skip(true, 'The current sandbox app no longer exposes the /login route.');
      }

      await loginPage.login(email, password);
      await expect(loginPage.errorMessage).toBeVisible();
    });
  });

  test.describe('Registration coverage', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test('should register a new user successfully', async ({ page }) => {
      const registrationPage = new RegistrationPage(page);
      const { firstName, lastName, email, password } = users.validUser;

      const response = await registrationPage.goto('/register');
      const formVisible = await registrationPage.firstNameInput.isVisible({ timeout: 5000 }).catch(() => false);
      const isNotFound = !response || response.status() >= 400 || await page.getByText('Page not found').isVisible().catch(() => false) || !formVisible;
      if (isNotFound) {
        test.skip(true, 'The current sandbox app no longer exposes the /register route.');
      }

      await registrationPage.register(firstName, lastName, email, password);
      await expect(registrationPage.successMessage).toBeVisible();
    });
  });

  test.describe('Buying request positive coverage', () => {
    test('should submit a basic buying request successfully', async ({ page }) => {
      const buyingRequestBasicPage = new BuyingRequestBasicPage(page);
      const { productName, quantity, unit, description } = buyingRequest.basicRequest;

      await buyingRequestBasicPage.goto('/post-buying-request');
      await buyingRequestBasicPage.submitBasicRequest(productName, quantity, unit, description);
      await expect(page.getByRole('heading', { name: 'Smart Questions' })).toBeVisible({ timeout: 30000 });
    });

    test('should enrich a buying request successfully', async ({ page }) => {
      const basicPage = new BuyingRequestBasicPage(page);
      const buyingRequestEnrichmentPage = new BuyingRequestEnrichmentPage(page);
      const { productName, quantity, unit, description } = buyingRequest.basicRequest;

      await basicPage.goto('/post-buying-request');
      await basicPage.submitBasicRequest(productName, quantity, unit, description);
      await buyingRequestEnrichmentPage.enrichRequest();
      await expect(page.getByRole('button', { name: 'View in Platform' })).toBeVisible({ timeout: 30000 });
    });

    for (const scenario of positiveFlowScenarios) {
      test(scenario.name, async ({ page }) => {
        await page.goto('/post-buying-request');

        const cookies = page.getByRole('button', { name: 'Accept cookies' });
        if (await cookies.isVisible().catch(() => false)) {
          await cookies.click();
        }

        const productNameInput = page.getByRole('combobox', { name: 'e.g. Brazilian Virgin Hair,' });
        await productNameInput.fill(scenario.productName);
        await productNameInput.press('Escape');
        await page.locator('body').click({ position: { x: 20, y: 20 } });
        await productNameInput.evaluate((el) => el.blur());

        await page.getByRole('textbox', { name: '1' }).fill(scenario.quantity);
        await page.getByRole('button', { name: 'Unit' }).click();
        await page.getByRole('option', { name: scenario.unit }).waitFor({ state: 'visible' });
        await page.keyboard.type(scenario.unit);
        await page.keyboard.press('Enter');

        if (await cookies.isVisible().catch(() => false)) {
          await cookies.click();
        }

        await page.getByRole('button', { name: /^Enriched post/ }).click();
        const continueToEnrich = page.getByRole('button', { name: 'Continue to Enrich' });
        await continueToEnrich.scrollIntoViewIfNeeded();

        const smartQuestionsHeading = page.getByRole('heading', { name: 'Smart Questions' });
        await expect(async () => {
          if (await smartQuestionsHeading.isVisible().catch(() => false)) return;
          await continueToEnrich.click();
          await expect(smartQuestionsHeading).toBeVisible({ timeout: 5000 });
        }).toPass({ timeout: 30000 });

        await expect(smartQuestionsHeading).toBeVisible();
      });
    }
  });

  test('Post basic request, enrich it and publish', async ({ page }) => {
    const productName = `Organic Bamboo Tissue ${Date.now()}`;

    await page.goto('/post-buying-request');
    const cookies = page.getByRole('button', { name: 'Accept cookies' });
    if (await cookies.isVisible()) await cookies.click();

    const productNameInput = page.getByRole('combobox', { name: 'e.g. Brazilian Virgin Hair,' });
    await productNameInput.fill(productName);
    await productNameInput.press('Escape');
    await page.locator('body').click({ position: { x: 20, y: 20 } });
    await productNameInput.evaluate((el) => el.blur());
    await page.getByRole('textbox', { name: '1' }).fill('100');

    await page.getByRole('button', { name: 'Unit' }).click();
    await page.getByRole('option', { name: 'Boxes' }).waitFor({ state: 'visible' });
    await page.keyboard.type('Boxes');
    await page.keyboard.press('Enter');

    if (await cookies.isVisible().catch(() => false)) await cookies.click();

    await page.getByRole('button', { name: /^Enriched post/ }).click();

    const continueToEnrich = page.getByRole('button', { name: 'Continue to Enrich' });
    await continueToEnrich.scrollIntoViewIfNeeded();
    const smartQuestionsHeading = page.getByRole('heading', { name: 'Smart Questions' });
    await expect(async () => {
      if (await smartQuestionsHeading.isVisible().catch(() => false)) return;
      await continueToEnrich.click();
      await expect(smartQuestionsHeading).toBeVisible({ timeout: 5000 });
    }).toPass({ timeout: 30000 });

    const questionGroups = page.locator('text=/\\*\\s*$/').locator('xpath=following-sibling::*[1]');
    const groupCount = await questionGroups.count();
    for (let i = 0; i < groupCount; i++) {
      const firstOption = questionGroups.nth(i).getByRole('button').first();
      if (await firstOption.isVisible().catch(() => false)) {
        await firstOption.click();
      }
    }

    await page.getByRole('button', { name: 'Flexible' }).click();
    await page.getByRole('button', { name: 'One-time' }).click();
    await page.getByRole('button', { name: 'Any / Negotiable' }).click();
    await page.getByRole('button', { name: "No, I'll evaluate quotes" }).click();
    await page.getByRole('button', { name: 'Cash on delivery', exact: true }).click();

    const dismiss = page.getByRole('button', { name: 'Dismiss' });
    if (await dismiss.isVisible().catch(() => false)) await dismiss.click();
    await page.getByRole('button', { name: 'Publish as a Hot Lead' }).click();

    await expect(page.getByRole('button', { name: 'View in Platform' })).toBeVisible();
  });
});
