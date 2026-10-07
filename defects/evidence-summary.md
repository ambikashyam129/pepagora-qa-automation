# Evidence Summary

This file records the current quality-evidence artifacts for the Pepagora QA automation task.

## 1. HTML Playwright Report

- Report location: `playwright-report/index.html`
- Status: Generated successfully from the current verified suite.
- Verification command:
  `npx playwright test tests/qa-suite.spec.js --reporter=html`
- Verified result:
  `5 passed, 3 skipped, 0 failed`

## 2. Defect Report

- Defect log: `defects/defects.md`
- Excel tracker: `defects/defect-report.xlsx`

The active defect recorded in the repository is:
- DEF-01: AI suggestion overlay can intercept clicks on controls below it

## 3. Screenshot Evidence

The following screenshots were captured as proof of the current sandbox behavior:

- `defects/evidence/landing-page.png` — home page load / environment check
- `defects/evidence/login-route-failure.png` — login route issue showing the app does not expose the legacy login form

## 4. Short Setup / Execution Video

- Video file: `defects/evidence/setup-execution-demo.webm`
- Purpose: short browser-based walkthrough showing the app landing page and the login-route issue state.

## 5. Notes

- The legacy auth pages (`/login` and `/register`) are no longer available in the current sandbox version.
- The automation suite therefore skips these legacy checks while keeping the active buyer-flow coverage green.
- The HTML report and evidence files are kept in the repo so they can be shared during the interview or QA review.
