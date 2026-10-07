const { expect } = require('@playwright/test');

class BuyingRequestEnrichmentPage {
  constructor(page) {
    this.page = page;
    this.smartQuestionsHeading = page.getByRole('heading', { name: 'Smart Questions' });
    this.questionGroups = page.locator('text=/\\*\\s*$/').locator('xpath=following-sibling::*[1]');
    this.flexibleButton = page.getByRole('button', { name: 'Flexible' });
    this.oneTimeButton = page.getByRole('button', { name: 'One-time' });
    this.anyNegotiableButton = page.getByRole('button', { name: 'Any / Negotiable' });
    this.noEvaluateQuotesButton = page.getByRole('button', { name: "No, I'll evaluate quotes" });
    this.cashOnDeliveryButton = page.getByRole('button', { name: 'Cash on delivery', exact: true });
    this.publishButton = page.getByRole('button', { name: 'Publish as a Hot Lead' });
    this.viewInPlatformButton = page.getByRole('button', { name: 'View in Platform' });
    this.successMessage = this.viewInPlatformButton;
  }

  async goto(url) {
    await this.page.goto(url);
  }

  async continueToEnrich() {
    const cookies = this.page.getByRole('button', { name: 'Accept cookies' });
    if (await cookies.isVisible().catch(() => false)) {
      await cookies.click();
    }

    await this.page.getByRole('button', { name: /^Enriched post/ }).click();
    const continueToEnrichButton = this.page.getByRole('button', { name: 'Continue to Enrich' });
    await continueToEnrichButton.scrollIntoViewIfNeeded();

    await expect(async () => {
      if (await this.smartQuestionsHeading.isVisible().catch(() => false)) return;
      await continueToEnrichButton.click();
      await expect(this.smartQuestionsHeading).toBeVisible({ timeout: 5000 });
    }).toPass({ timeout: 30000 });
  }

  async enrichRequest() {
    const groupCount = await this.questionGroups.count();
    for (let i = 0; i < groupCount; i++) {
      const firstOption = this.questionGroups.nth(i).getByRole('button').first();
      if (await firstOption.isVisible().catch(() => false)) {
        await firstOption.click();
      }
    }

    await this.flexibleButton.click();
    await this.oneTimeButton.click();
    await this.anyNegotiableButton.click();
    await this.noEvaluateQuotesButton.click();
    await this.cashOnDeliveryButton.click();

    const dismiss = this.page.getByRole('button', { name: 'Dismiss' });
    if (await dismiss.isVisible().catch(() => false)) {
      await dismiss.click();
    }

    await this.publishButton.click();
    await expect(this.successMessage).toBeVisible({ timeout: 30000 });
  }
}

module.exports = { BuyingRequestEnrichmentPage };
