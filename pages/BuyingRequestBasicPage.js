const { expect } = require('@playwright/test');

class BuyingRequestBasicPage {
  constructor(page) {
    this.page = page;
    this.productNameInput = page.getByRole('combobox', { name: 'e.g. Brazilian Virgin Hair,' });
    this.quantityInput = page.getByRole('textbox', { name: '1' });
    this.unitButton = page.getByRole('button', { name: 'Unit' });
    this.descriptionInput = page.getByRole('textbox', { name: /Description|description|Tell us/i }).first();
    this.enrichedPlanButton = page.getByRole('button', { name: /^Enriched post/ });
    this.continueToEnrichButton = page.getByRole('button', { name: 'Continue to Enrich' });
    this.smartQuestionsHeading = page.getByRole('heading', { name: 'Smart Questions' });
  }

  async goto(url) {
    await this.page.goto(url);
  }

  async submitBasicRequest(productName, quantity, unit, description) {
    const cookies = this.page.getByRole('button', { name: 'Accept cookies' });
    if (await cookies.isVisible().catch(() => false)) {
      await cookies.click();
    }

    await this.productNameInput.fill(productName);
    await this.productNameInput.press('Escape');
    await this.page.locator('body').click({ position: { x: 20, y: 20 } });
    await this.productNameInput.evaluate((el) => el.blur());
    await this.quantityInput.fill(quantity);

    await this.unitButton.click();
    await this.page.getByRole('option', { name: new RegExp(`^${unit}$`, 'i') }).waitFor({ state: 'visible' });
    await this.page.keyboard.type(unit);
    await this.page.keyboard.press('Enter');

    if (await cookies.isVisible().catch(() => false)) {
      await cookies.click();
    }

    await this.enrichedPlanButton.click();
    await this.continueToEnrichButton.scrollIntoViewIfNeeded();

    await expect(async () => {
      if (await this.smartQuestionsHeading.isVisible().catch(() => false)) return;
      await this.continueToEnrichButton.click();
      await expect(this.smartQuestionsHeading).toBeVisible({ timeout: 5000 });
    }).toPass({ timeout: 30000 });
  }
}

module.exports = { BuyingRequestBasicPage };
