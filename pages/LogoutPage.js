const { expect } = require('@playwright/test');

class LogoutPage {
  constructor(page) {
    this.page = page;
    this.collapseSetupGuideButton = page.getByRole('button', { name: 'Collapse easy setup guide' });
    this.myAccountButton = page.getByRole('button', { name: 'My account' });
    this.signOutButton = page.getByRole('button', { name: 'Sign Out' });
    this.loginHeading = page.getByRole('heading', { name: 'Login to your account' });
  }

  async logout() {
    await this.page.goto('/app/sourcing-rfq');

    if (await this.collapseSetupGuideButton.isVisible().catch(() => false)) {
      await this.collapseSetupGuideButton.click();
    }

    await expect(this.myAccountButton).toBeVisible();
    await this.myAccountButton.click();
    await expect(this.signOutButton).toBeVisible();
    await this.signOutButton.click();
    await expect(this.page).toHaveURL(/\/authenticate(?:\?|$)/);
    await expect(this.loginHeading).toBeVisible();
  }
}

module.exports = { LogoutPage };
