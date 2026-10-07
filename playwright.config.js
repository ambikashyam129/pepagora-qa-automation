// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 120000,
  expect: { timeout: 10000 },
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: 'https://www.sandbox.pepagora.org',
    headless: true,
    launchOptions: {
      slowMo: 300,
    },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    // Reuse the one seeded test account's session for every test by default.
    // Run `node scripts/save-login.js` once to (re)create this file.
    // Tests that must start unauthenticated (login/registration) override
    // this with `test.use({ storageState: { cookies: [], origins: [] } })`.
    storageState: 'playwright/.auth/user.json',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: ['--start-maximized'],
        },
      },
    },
  ],
});