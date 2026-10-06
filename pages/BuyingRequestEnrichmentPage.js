class BuyingRequestEnrichmentPage {
  constructor(page) {
    this.page = page;
    this.categorySelect = page.locator('#category');
    this.targetPriceInput = page.locator('#targetPrice');
    this.deliveryLocationInput = page.locator('#deliveryLocation');
    this.deliveryDateInput = page.locator('#deliveryDate');
    this.attachmentInput = page.locator('#attachment');
    this.saveButton = page.locator('button[type="submit"]');
    this.successMessage = page.locator('.success-message');
  }

  async goto(url) {
    await this.page.goto(url);
  }

  async enrichRequest(category, targetPrice, deliveryLocation, deliveryDate) {
    await this.categorySelect.selectOption(category);
    await this.targetPriceInput.fill(targetPrice);
    await this.deliveryLocationInput.fill(deliveryLocation);
    await this.deliveryDateInput.fill(deliveryDate);
    await this.saveButton.click();
  }
}

module.exports = { BuyingRequestEnrichmentPage };
