# Pepagora QA Automation

End-to-end UI test automation framework for Pepagora, built with [Playwright](https://playwright.dev/) and JavaScript using the Page Object Model (POM) design pattern.

## Project Structure

```
pepagora-qa-automation/
│
├── tests/                          # Test specs
│   ├── registration.spec.js
│   ├── login.spec.js
│   ├── buying-request-basic.spec.js
│   └── buying-request-enrichment.spec.js
│
├── pages/                          # Page Object Model classes
│   ├── RegistrationPage.js
│   ├── LoginPage.js
│   ├── BuyingRequestBasicPage.js
│   └── BuyingRequestEnrichmentPage.js
│
├── test-data/                      # JSON test data fixtures
│   ├── users.json
│   └── buying-request.json
│
├── utils/
│   └── testData.js                 # Test data loader
│
├── playwright.config.js
├── package.json
├── README.md
└── defects/
    └── defect-report.xlsx          # Defect tracking sheet
```

## Setup

```bash
npm install
npx playwright install
```

## Running Tests

```bash
npm test                 # Run all tests
npm run test:ui          # Run tests in UI mode
npm run test:headed      # Run tests in headed browser mode
npm run report           # View the last HTML test report
```

## Configuration

Update `baseURL` in [playwright.config.js](playwright.config.js) to point to the target environment, and update credentials/data in the `test-data/` JSON files as needed.

## Defects

Track and report defects found during test execution in [defects/defect-report.xlsx](defects/defect-report.xlsx).
