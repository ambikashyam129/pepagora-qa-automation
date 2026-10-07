# Pepagora QA Automation

This repository contains a Playwright-based end-to-end test suite for the Pepagora web application. The framework is built using JavaScript, the Playwright Test runner, and a page-object structure for reuse and maintainability.

## Overview

The project automates critical buyer flows such as:
- user registration
- login and authentication flows
- posting a buying request
- enriching a buying request
- publishing a Hot Lead and verifying the item appears in the sourcing RFQ list

The suite is now consolidated into a single Playwright spec: `tests/qa-suite.spec.js`. This keeps positive and negative checks grouped in one place and reduces duplicate, redundant test files. The project still uses shared page objects and JSON fixtures to keep the automation maintainable.

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
│   └── qa-suite.spec.js
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
- `tests/qa-suite.spec.js`
  - single consolidated test file containing positive and negative coverage
  - login and registration checks
  - basic buying request flow
  - enrichment flow
  - end-to-end buyer journey validation

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

Run the consolidated QA suite:

```bash
npx playwright test tests/qa-suite.spec.js
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

Run the single suite explicitly:

```bash
npx playwright test tests/qa-suite.spec.js
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
- login/registration checks are grouped in the same single suite and are skipped when the sandbox no longer exposes those legacy routes

This reduces repeated login steps and keeps the suite faster while still allowing unauthenticated tests to validate start-state conditions when the live app still supports them.

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

## Assignment Readiness Summary

This project is a clean, maintainable Playwright automation setup with the following status:

- Repository and GitHub delivery: complete
- Playwright framework setup: complete
- Page Object Model structure: complete
- Test data and reusable fixtures: complete
- Consolidated positive and negative coverage: complete in a single suite file
- End-to-end happy path automation: complete and verified in the active buyer-flow tests
- Live sandbox compatibility checks: included and adjusted for route drift on the current app version
- Test-case traceability document: available at [test-cases/test-cases.md](test-cases/test-cases.md)

The project intentionally favors a single, grouped QA suite to reduce duplication and keep the repo easier to maintain.
- Defect log: available at [defects/defects.md](defects/defects.md)

Current verified execution result:

```bash
npx playwright test tests/e2e-basic-flow.spec.js --headed --reporter=line
```

Result:
- 1 test run
- 1 passed
- final verified run completed successfully

## Contributing

When adding new tests:
- keep selectors in the page objects when possible
- reuse JSON fixtures wherever practical
- avoid hard-coding unstable values when the product uses dynamic content
- document any known issue in the defect tracking sheet
- verify the affected test flow with Playwright before merging
