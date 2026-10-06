const { test, expect } = require('@playwright/test');

test.describe('Post Buying Request - Basic to Enrichment E2E', () => {
  test('Post basic request, enrich it and publish', async ({ page }) => {
    const productName = `Organic Bamboo Tissue ${Date.now()}`;

    // Open the form (already logged in from the saved session)
    await page.goto('/post-buying-request');
    const cookies = page.getByRole('button', { name: 'Accept cookies' });
    if (await cookies.isVisible()) await cookies.click();

    // Basic form
    const productNameInput = page.getByRole('combobox', { name: 'e.g. Brazilian Virgin Hair,' });
    await productNameInput.fill(productName);
    await productNameInput.press('Escape');
    // DEFECT: the AI-suggestions overlay can remain open (aria-expanded=true)
    // even after Escape / clicking away, intercepting clicks on controls
    // rendered below it (Unit dropdown, Continue to Enrich). Force-blur the
    // field and explicitly wait for the listbox to be removed/hidden.
    await page.mouse.click(10, 10);
    await productNameInput.evaluate((el) => el.blur());
    await page.getByRole('listbox').waitFor({ state: 'hidden' }).catch(() => {});
    await page.getByRole('textbox', { name: '1' }).fill('100');

    // Set the quantity unit to "Boxes" via keyboard to avoid a leftover
    // suggestions overlay intercepting pointer clicks on the dropdown option
    await page.getByRole('button', { name: 'Unit' }).click();
    await page.getByRole('option', { name: 'Boxes' }).waitFor({ state: 'visible' });
    await page.keyboard.type('Boxes');
    await page.keyboard.press('Enter');

    // The cookie banner can reappear/overlap controls further down the page
    if (await cookies.isVisible().catch(() => false)) await cookies.click();

    // Choose the "Enriched post" plan card before continuing to enrichment
    await page.getByRole('button', { name: /^Enriched post/ }).click();

    const continueToEnrich = page.getByRole('button', { name: 'Continue to Enrich' });
    await continueToEnrich.scrollIntoViewIfNeeded();
    await expect(page.getByRole('listbox')).toBeHidden().catch(() => {});
    // DEFECT: the "Continue to Enrich" click occasionally doesn't register on
    // the first attempt (no navigation/no error), requiring a retry.
    const smartQuestionsHeading = page.getByRole('heading', { name: 'Smart Questions' });
    await expect(async () => {
      if (await smartQuestionsHeading.isVisible().catch(() => false)) return;
      await continueToEnrich.click();
      await expect(smartQuestionsHeading).toBeVisible({ timeout: 5000 });
    }).toPass({ timeout: 30000 });

    // Enrichment - the AI-generated "Smart Questions" options vary per product,
    // so pick the first available option button in each required question group
    // instead of hardcoding dynamic labels.
    const questionGroups = page.locator('text=/\\*\\s*$/').locator('xpath=following-sibling::*[1]');
    const groupCount = await questionGroups.count();
    for (let i = 0; i < groupCount; i++) {
      const firstOption = questionGroups.nth(i).getByRole('button').first();
      if (await firstOption.isVisible().catch(() => false)) {
        await firstOption.click();
      }
    }

    // Logistics & Destination
    await page.getByRole('button', { name: 'Flexible' }).click();
    await page.getByRole('button', { name: 'One-time' }).click();
    await page.getByRole('button', { name: 'Any / Negotiable' }).click();

    // Budget & Payment
    await page.getByRole('button', { name: "No, I'll evaluate quotes" }).click();
    await page.getByRole('button', { name: 'Cash on delivery', exact: true }).click();

    const dismiss = page.getByRole('button', { name: 'Dismiss' });
    if (await dismiss.isVisible().catch(() => false)) await dismiss.click();
    await page.getByRole('button', { name: 'Publish as a Hot Lead' }).click();

    // Success / submitted screen
    await expect(page.getByRole('button', { name: 'View in Platform' })).toBeVisible();
    await page.getByRole('button', { name: 'View in Platform' }).click();
    const closeCookieBanner = page.getByRole('button', { name: 'Close cookie consent' });
    if (await closeCookieBanner.isVisible()) await closeCookieBanner.click();

    // Check the request in My account. The AI enrichment step rewrites the
    // product title (e.g. "100 boxes of organic bamboo tissue for ...."),
    // so we verify by searching for the original product name and confirming
    // exactly one matching RFQ row is returned, rather than matching the
    // (now-rewritten) visible title text.
    await page.goto('/app/sourcing-rfq');
    const guide = page.getByRole('button', { name: 'Collapse easy setup guide' });
    if (await guide.isVisible()) await guide.click();
    await page.getByRole('searchbox', { name: 'Search Product' }).fill(productName);
    await expect(page.getByRole('row').filter({ hasNotText: 'Product Name' })).toHaveCount(1);

    // Sign out (does not delete the account — the seeded account is reused across runs)
    await page.getByRole('button', { name: 'My account' }).click();
    await page.getByRole('button', { name: 'Sign Out' }).click();
  });
});