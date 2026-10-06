const { test, expect } = require('@playwright/test');
const { BuyingRequestBasicPage } = require('../pages/BuyingRequestBasicPage');
const { buyingRequest } = require('../utils/testData');

test.describe('Buying Request - Basic', () => {
  test('should submit a basic buying request successfully', async ({ page }) => {
    const buyingRequestBasicPage = new BuyingRequestBasicPage(page);
    const { productName, quantity, unit, description } = buyingRequest.basicRequest;

    await buyingRequestBasicPage.goto('/buying-request/new');
    await buyingRequestBasicPage.submitBasicRequest(productName, quantity, unit, description);

    await expect(buyingRequestBasicPage.confirmationMessage).toBeVisible();
  });
});
