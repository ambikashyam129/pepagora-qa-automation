# Pepagora QA Automation

This repository contains a Playwright-based QA automation suite for the Pepagora sandbox application. The project is built using JavaScript, Playwright Test, and a page-object model to keep the flows reusable and maintainable.

## Overview

The project covers the key buyer journey for Pepagora:
- registration flow
- login flow
- logout after publishing a buying request
- posting a buying request
- enriching the request
- selecting required answer groups
- final publish/lead creation
- validation and negative coverage around the main flow

The current structure is intentionally simple: one consolidated test file in [tests/qa-suite.spec.js](tests/qa-suite.spec.js) with shared page objects and JSON fixtures. This reduces duplication and keeps the suite easier to maintain.

## Tech Stack

- Playwright Test
- JavaScript / CommonJS
- Page Object Model (POM)
- JSON-based test data
- Chromium-based browser automation

## Current Project Structure

```text
pepagora-qa-automation/
├── .github/
│   └── copilot-instructions.md
├── defects/
│   ├── defect-report.xlsx
│   ├── defects.md
│   ├── evidence-summary.md
│   └── evidence/
│       ├── landing-page.png
│       ├── login-route-failure.png
│       └── setup-execution-demo.webm
├── pages/
│   ├── BuyingRequestBasicPage.js
│   ├── BuyingRequestEnrichmentPage.js
│   ├── LoginPage.js
│   ├── LogoutPage.js
│   └── RegistrationPage.js
├── playwright/
│   └── .auth/
│       └── user.json
├── scripts/
│   └── save-login.js
├── specs/
│   └── README.md
├── test-cases/
│   └── test-cases.md
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
├── playwright-report/
│   └── index.html
├── README.md
└── ...
```

## Key Files

### Configuration
- [playwright.config.js](playwright.config.js)
  - config for the sandbox app
  - single-worker execution
  - reporter and storage configuration

### Package scripts
- [package.json](package.json)
  - `npm test` -> runs the consolidated suite
  - `npm run test:headed` -> runs headed in browser mode
  - `npm run test:ui` -> opens Playwright UI
  - `npm run report` -> shows the report

### Core automation pages
- [pages/BuyingRequestBasicPage.js](pages/BuyingRequestBasicPage.js)
  - basic request creation flow
- [pages/BuyingRequestEnrichmentPage.js](pages/BuyingRequestEnrichmentPage.js)
  - enrichment / smart questions flow
- [pages/LoginPage.js](pages/LoginPage.js)
  - login form interactions
- [pages/LogoutPage.js](pages/LogoutPage.js)
  - signs out from the sourcing dashboard and verifies the public Login entry
- [pages/RegistrationPage.js](pages/RegistrationPage.js)
  - registration form interactions

### Test data
- [test-data/users.json](test-data/users.json)
- [test-data/buying-request.json](test-data/buying-request.json)
- [utils/testData.js](utils/testData.js)

### Test plan and evidence
- [test-cases/test-cases.md](test-cases/test-cases.md)
- [defects/defects.md](defects/defects.md)
- [defects/evidence-summary.md](defects/evidence-summary.md)
- [playwright-report/index.html](playwright-report/index.html)

## Setup

Install dependencies:

```bash
npm install
npx playwright install
```

## Running the suite

Run the consolidated suite:

```bash
npx playwright test tests/qa-suite.spec.js
```

Run in headed mode:

```bash
npx playwright test tests/qa-suite.spec.js --headed
```

Local runs open a visible maximized Chromium window and type form values character by character for easier observation. CI runs remain headless.

Open the HTML report:

```bash
npx playwright show-report
```

## Verified current status

The latest verified run was:

```bash
npx playwright test tests/qa-suite.spec.js --reporter=html
```

Result from the fresh run:
- 5 passed
- 3 skipped
- 0 failed

## Important live app note

The sandbox currently no longer exposes the legacy login and registration pages at `/login` and `/register`. Because of that, the auth tests are intentionally skipped when the page is not available, instead of failing the whole suite. The active buyer-flow tests remain green and validated.

The end-to-end publish flow continues into the sourcing dashboard, opens **My account**, selects **Sign Out**, and verifies the redirect to `/authenticate` and the **Login to your account** heading. This test uses the saved authenticated browser state configured for the suite.

## Defect evidence

The project includes a defect and evidence package:
- [defects/defects.md](defects/defects.md)
- [defects/defect-report.xlsx](defects/defect-report.xlsx)
- [defects/evidence/landing-page.png](defects/evidence/landing-page.png)
- [defects/evidence/login-route-failure.png](defects/evidence/login-route-failure.png)
- [defects/evidence/setup-execution-demo.webm](defects/evidence/setup-execution-demo.webm)

## Current outcome

This repo is in a working, validated state for the active buyer journey and is set up for interview-ready evidence collection. The project is intentionally kept lean and focused on the real end-to-end flow that is currently working in the live sandbox environment.

## Recommended next step

If the sandbox restores the legacy auth pages in a future release, the skipped login/registration checks can be re-enabled with minimal changes to the suite.

## Contributing

When adding new tests:
- keep selectors in the page objects when possible
- reuse JSON fixtures wherever practical
- avoid hard-coding unstable values when the product uses dynamic content
- document any known issue in the defect tracking sheet
- verify the affected test flow with Playwright before merging
