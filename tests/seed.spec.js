const { test } = require('@playwright/test');

test('seed', async ({ page }) => {
  await page.goto('/post-buying-request');
});