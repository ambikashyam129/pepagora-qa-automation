const { test, expect } = require('@playwright/test');
const { BuyingRequestEnrichmentPage } = require('../pages/BuyingRequestEnrichmentPage');
const { buyingRequest } = require('../utils/testData');

test.describe('Buying Request - Enrichment', () => {
  test('should enrich a buying request successfully', async ({ page }) => {
    const buyingRequestEnrichmentPage = new BuyingRequestEnrichmentPage(page);
    const { category, targetPrice, deliveryLocation, deliveryDate } = buyingRequest.enrichmentRequest;

    await buyingRequestEnrichmentPage.goto('/buying-request/enrich');
    await buyingRequestEnrichmentPage.enrichRequest(category, targetPrice, deliveryLocation, deliveryDate);

    await expect(buyingRequestEnrichmentPage.successMessage).toBeVisible();
  });
});
