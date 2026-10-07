# Defect Log

This file records issues identified during QA automation validation work for the Pepagora assignment. Defects should be added here only when evidence is clear and reproducible.

## Defect Summary

- Total defects identified: 1
- Severity distribution: medium
- Priority distribution: medium

## Defect Details

### DEF-01: AI suggestion overlay can intercept clicks on controls below it

- Title: Product name suggestion list can remain open and block controls after typing
- Severity: Medium
- Priority: Medium
- Status: Observed during e2e flow validation
- Evidence: Reproduced during the end-to-end buying request flow in [tests/e2e-basic-flow.spec.js](../tests/e2e-basic-flow.spec.js)
- Steps to reproduce:
  1. Open the buying request form as a logged-in user.
  2. Type a product name that triggers suggestions.
  3. Press Escape or click outside the field.
  4. Observe that the suggestion overlay may remain in the UI state and block downstream buttons.
- Expected result:
  - The listbox closes immediately and no UI overlay blocks the next control.
- Actual result:
  - The suggestion list can remain active and block the unit dropdown and continue-to-enrich control.
- Notes:
  - The test flow includes a workaround that blurs the input and waits for the listbox to hide before continuing.

## Defect Tracking Notes

- Defects should be updated as real issues are confirmed through test execution.
- If a scenario is successful and stable, it should not be recorded as a defect.
- Screenshots and trace evidence should be attached to the relevant failing run whenever available.

## Recommended Follow-Up

- Improve form interaction handling so the overlay is dismissed deterministically.
- Add a dedicated regression test for the suggestion overlay transition.
- Keep this file aligned with the final HTML report and screenshot evidence from Playwright runs.
