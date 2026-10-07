# Pepagora QA Automation

This repository contains a Playwright-based end-to-end test suite for the Pepagora web application. The framework is built using JavaScript, the Playwright Test runner, and a page-object structure for reuse and maintainability.

## Overview

The project automates critical buyer flows such as:
- user registration
- login and authentication flows
- posting a buying request
- enriching a buying request
- publishing a Hot Lead and verifying the item appears in the sourcing RFQ list

The suite is designed to run against the Pepagora sandbox environment and uses a saved authenticated session to avoid repeating the login flow for tests that require an already-logged-in user.

## Tech Stack

- Playwright Test
- JavaScript / CommonJS
- Page Object Model (POM)
- JSON-based fixture data
- Browser automation for Chromium

## Project Structure

```text
pepagora-qa-automation/
├── .github/
│   ├── agents/
│   ├── copilot-instructions.md
│   └── workflows/
├── .vscode/
│   └── mcp.json
├── defects/
│   └── defect-report.xlsx
├── pages/
│   ├── BuyingRequestBasicPage.js
│   ├── BuyingRequestEnrichmentPage.js
│   ├── LoginPage.js
│   └── RegistrationPage.js
├── playwright/
│   └── .auth/
│       └── user.json
├── scripts/
│   └── save-login.js
├── specs/
│   └── README.md
├── test-data/
│   ├── buying-request.json
│   └── users.json
├── tests/
│   ├── buying-request-basic.spec.js
│   ├── buying-request-enrichment.spec.js
│   ├── e2e-basic-flow.spec.js
│   ├── login.spec.js
│   ├── registration.spec.js
│   └── seed.spec.js
├── utils/
│   └── testData.js
├── .gitignore
├── package-lock.json
├── package.json
├── playwright.config.js
├── README.md
└── ...
```

## Key Files and Their Purpose

### Configuration
- `playwright.config.js`
  - Global Playwright configuration
  - Sets test directory, timeouts, retries, and reporter options
  - Uses the sandbox base URL: `https://www.sandbox.pepagora.org`
  - Reuses a saved authentication state from `playwright/.auth/user.json`
  - Launches Chromium in a maximized headed window when used in headed mode

### Package Scripts
- `package.json`
  - `npm test` -> runs all tests
  - `npm run test:ui` -> opens Playwright UI mode
  - `npm run test:headed` -> runs tests in headed mode
  - `npm run report` -> opens the HTML report

### Authentication Helper
- `scripts/save-login.js`
  - Opens the app in a browser
  - Prompts the user to log in manually
  - Saves the browser storage state to `playwright/.auth/user.json`
  - Enables faster reuse across tests that rely on an authenticated state

### Test Data
- `test-data/users.json`
  - user accounts and credentials used by login/registration tests
- `test-data/buying-request.json`
  - sample product/buying request metadata
- `utils/testData.js`
  - loads shared JSON fixtures for the test suite

### Page Objects
- `pages/LoginPage.js`
  - encapsulates login interactions and selectors
- `pages/RegistrationPage.js`
  - encapsulates registration interactions
- `pages/BuyingRequestBasicPage.js`
  - encapsulates the basic buying request form
- `pages/BuyingRequestEnrichmentPage.js`
  - encapsulates the enrichment step interactions

### Test Specs
- `tests/login.spec.js`
  - valid login scenario
  - invalid login scenario
- `tests/registration.spec.js`
  - new user registration flow
- `tests/buying-request-basic.spec.js`
  - posting a basic buying request
- `tests/buying-request-enrichment.spec.js`
  - enrichment-specific flow checks
- `tests/e2e-basic-flow.spec.js`
  - full buyer journey end-to-end from posting a basic request to enrichment, publish, validation, and signout
- `tests/seed.spec.js`
  - test seed/setup utility coverage

### Additional Project Docs
- `specs/README.md`
  - project/specification notes for the test strategy
- `defects/defect-report.xlsx`
  - defect tracking workbook for known issues and QA findings
- `.github/copilot-instructions.md`
  - repo-local AI guidance for automation work

## Setup

Install dependencies:

```bash
npm install
npx playwright install
```

If the authenticated state has not been created yet, generate it:

```bash
node scripts/save-login.js
```

This opens a browser and asks the user to log in to Pepagora. After login, the session is saved to `playwright/.auth/user.json` for reuse in subsequent runs.

## Running Tests

Run the full suite:

```bash
npx playwright test
```

Run all tests via the project scripts:

```bash
npm test
```

Run tests in UI mode:

```bash
npm run test:ui
```

Run tests headed in a browser window:

```bash
npm run test:headed
```

Open the HTML Playwright report:

```bash
npm run report
```

Run a single spec file:

```bash
npx playwright test tests/login.spec.js
npx playwright test tests/e2e-basic-flow.spec.js
```

## Configuration Notes

The suite targets the sandbox environment and currently uses:

```js
baseURL: 'https://www.sandbox.pepagora.org'
```

Important behavior in the config:
- tests run with a single worker (`workers: 1`)
- retries are disabled (`retries: 0`)
- screenshots are captured only on failure
- videos and traces are retained on failure
- the default auth state is reused for logged-in flows

## Authentication and Session Handling

This project intentionally reuses a saved storage state:

- `playwright/.auth/user.json`
- used for tests that should begin from a logged-in user session
- login/registration tests override the storage state to start effectively logged out by using empty cookies and origins

This reduces repeated login steps and keeps the suite faster while still allowing unauthenticated tests to validate start-state conditions.

## Test Strategy

The suite currently emphasizes end-to-end validation of major user journeys rather than a pure unit-test level approach. Tests validate real browser behavior, including:
- navigation
- form completion
- validation flows
- cookie/banner handling
- dynamic UI states
- publish and verification actions
- sign-out behavior

## Defect Tracking

Known quality issues and defect notes are tracked in:

- `defects/defect-report.xlsx`

This file should be updated when a reproduced issue needs to be documented, triaged, or shared with the team.

## Important Considerations

- The e2e flow includes resilient handling for UI overlays and dynamic content that can intermittently obscure controls.
- Some flows rely on the seeded sandbox account; do not delete or mutate account data unexpectedly while running tests.
- Because the environment is sandbox-based, credentials and data should be reviewed before running critical flows.

## Typical Workflow

```bash
npm install
npx playwright install
node scripts/save-login.js
npx playwright test tests/e2e-basic-flow.spec.js --headed
```

This gives you a working setup for running the core end-to-end QA flow in the browser with a saved authenticated session.

## Contributing

When adding new tests:
- keep selectors in the page objects when possible
- reuse JSON fixtures wherever practical
- avoid hard-coding unstable values when the product uses dynamic content
- document any known issue in the defect tracking sheet
- verify the affected test flow with Playwright before merging
