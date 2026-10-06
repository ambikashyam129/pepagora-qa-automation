const { chromium } = require('@playwright/test');
const fs = require('fs');
const readline = require('readline');

const AUTH_FILE = 'playwright/.auth/user.json';

function waitForEnter(message) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(message, () => { rl.close(); resolve(); }));
}

(async () => {
  fs.mkdirSync('playwright/.auth', { recursive: true });

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://www.sandbox.pepagora.org/');

  console.log('1. In the browser, click Login and enter your phone number and WhatsApp OTP.');
  console.log('2. Wait until you are fully logged in (you can see your account).');
  console.log('3. Do NOT close the browser window.');
  await waitForEnter('4. Come back here and press Enter to save the login... ');

  await context.storageState({ path: AUTH_FILE });

  const saved = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf-8'));
  const localItems = saved.origins.reduce((n, o) => n + o.localStorage.length, 0);
  console.log('Cookies saved: ' + saved.cookies.length);
  console.log('localStorage items saved: ' + localItems);
  console.log('Login saved to ' + AUTH_FILE);

  await browser.close();
})();