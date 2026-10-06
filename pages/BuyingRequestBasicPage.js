class BuyingRequestBasicPage {
  constructor(page) {
    this.page = page;
    this.productNameInput = page.locator('#productName');
    this.quantityInput = page.locator('#quantity');
    this.unitSelect = page.locator('#unit');
    this.descriptionInput = page.locator('#description');
    this.submitButton = page.locator('button[type="submit"]');
    this.confirmationMessage = page.locator('.confirmation-message');
  }

  async goto(url) {
    await this.page.goto(url);
  }

  async submitBasicRequest(productName, quantity, unit, description) {
    await this.productNameInput.fill(productName);
    await this.quantityInput.fill(quantity);
    await this.unitSelect.selectOption(unit);
    await this.descriptionInput.fill(description);
    await this.submitButton.click();
  }
}

module.exports = { BuyingRequestBasicPage };
