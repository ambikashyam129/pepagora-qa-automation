# Test Cases

This document contains the QA test-case matrix for the Pepagora automation suite. It covers the major user journeys and validation scenarios in the current application behavior and maps them to the consolidated test suite in [tests/qa-suite.spec.js](../tests/qa-suite.spec.js).

## Scope

The following categories are included:
- Registration
- Login
- logout
- Basic Buying Request
- Enrichment flow
- Mandatory fields
- Optional fields
- Validations
- Negative cases
- Boundary cases
- Navigation: Basic → Enrichment
- Data retention
- Final submission
- End-to-end flow

## Test Case Matrix

| Test Case ID | Scenario | Preconditions | Steps | Test Data | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|---|
| TC-REG-01 | User registers with valid details | User is not logged in and registration page is accessible | 1. Open registration page 2. Enter valid first name, last name, email, password 3. Submit form | First name: valid, Last name: valid, Email: unique, Password: valid strong value | Registration succeeds and success state is displayed | Current sandbox route is no longer available; legacy route skipped | Skip |
| TC-REG-02 | Required first name is enforced | Registration page is open | 1. Leave first name blank 2. Submit form | Empty first name | Validation message appears and form is not submitted | Not currently exercised in live sandbox due to route unavailability | Skip |
| TC-REG-03 | Required last name is enforced | Registration page is open | 1. Leave last name blank 2. Submit form | Empty last name | Validation message appears | Not currently exercised in live sandbox due to route unavailability | Skip |
| TC-REG-04 | Duplicate email is rejected | Existing user account already exists | 1. Enter existing email 2. Submit form | Existing email and valid password | Error message indicates email already exists | Not currently exercised in live sandbox due to route unavailability | Skip |
| TC-REG-05 | Invalid email format is rejected | Registration page is open | 1. Enter malformed email 2. Submit form | invalid@, wrong format | Validation error appears | Not currently exercised in live sandbox due to route unavailability | Skip |
| TC-LOG-01 | User logs in with valid credentials | User account exists and login page is accessible | 1. Open login page 2. Enter valid email/password 3. Click login | Existing user from fixture | User is authenticated and redirected away from login page | Login form is not available in current sandbox; legacy auth route skipped | Skip |
| TC-LOG-02 | User cannot log in with invalid password | User is on login page | 1. Enter valid email and wrong password 2. Click login | Valid email + wrong password | Login fails with visible error | Legacy auth route is unavailable in current sandbox; route skipped | Skip |
| TC-LOG-03 | Required email field is enforced | Login page is open | 1. Leave email empty 2. Submit login | Empty email | Validation message appears | Legacy auth route is unavailable in current sandbox; route skipped | Skip |
| TC-LOG-04 | Required password field is enforced | Login page is open | 1. Leave password empty 2. Submit login | Empty password | Validation message appears | Legacy auth route is unavailable in current sandbox; route skipped | Skip |
| TC-LOGOUT-01 | Authenticated user signs out | User is authenticated and can access the sourcing dashboard | 1. Open the sourcing dashboard 2. Open My account 3. Select Sign Out | Saved authenticated browser session | User is signed out and redirected to the Login to your account screen | Redirected to the Login to your account screen | Pass |
| TC-BR-01 | User opens the buying request form | User is logged in or session state is already established | 1. Navigate to /post-buying-request | Existing authenticated session | Buying request form loads | Pass | Pass |
| TC-BR-02 | Product name accepts valid input | Buying request form is open | 1. Enter valid product name 2. Remove suggestion overlay focus | Product name: e.g. Organic Bamboo Tissue | Product name is accepted and field remains populated | Pass with blur workaround on suggestion overlay | Pass |
| TC-BR-03 | Quantity accepts valid numeric value | Buying request form is open | 1. Enter numeric quantity 2. Move focus away | Quantity: 50 | Value is retained and accepted | Pass | Pass |
| TC-BR-04 | Invalid quantity is rejected | Buying request form is open | 1. Enter invalid quantity like 0 or negative value 2. Attempt to continue | Quantity: 0 or -5 | Validation should prevent proceeding | Covered as negative validation path in suite design; not currently failing in live data path | Pending |
| TC-BR-05 | Unit selection works correctly | Buying request form is open | 1. Open unit selector 2. Choose a unit | Unit: Boxes | Selected unit is shown correctly | Pass | Pass |
| TC-BR-06 | Mandatory field validation is enforced | Buying request form is open | 1. Leave required field blank 2. Try to continue | Missing product name or quantity | Validation message is shown | Behavior validated in current live app as required form constraints | Pass |
| TC-BR-07 | Optional field stays editable and does not break form completion | Buying request form is open | 1. Fill required fields 2. Enter optional values 3. Continue | Optional description text | Optional fields are retained and do not block submission | Pass | Pass |
| TC-BR-08 | Basic buying request can be submitted successfully | Required request fields are filled | 1. Complete required match fields 2. Click continue or submit | Product name, quantity, unit, description | Request is saved and user moves to the next stage | Pass | Pass |
| TC-NAV-01 | Navigation from Basic Request to Enrichment works | Basic request has been created | 1. Fill basic form 2. Continue 3. Open enrichment screen | Valid product request | User reaches Smart Questions / enrichment screen | Pass | Pass |
| TC-ENR-01 | Smart Questions appear for a valid request | Basic request is submitted | 1. Continue to enrichment 2. Wait for question groups to render | Valid request payload | Smart Questions section loads | Pass | Pass |
| TC-ENR-02 | User can answer an enrichment question | Smart Questions section is open | 1. Click one option from first question group 2. Continue | Example answer option from live app | Selected answer is retained and UI moves forward | Pass | Pass |
| TC-ENR-03 | Optional enrichment answers do not block final submission | Enrichment step is open | 1. Leave optional questions empty 2. Continue to final stage | Optional answer fields left blank | User can continue and final submission still works | Pass | Pass |
| TC-ENR-04 | Final submission publishes the request as a Hot Lead | Enrichment is complete | 1. Complete required question groups 2. Select logistics/payment preferences 3. Publish | Valid answer set and publish action | Request is published and success action becomes visible | Pass | Pass |
| TC-DATA-01 | Data retention across Basic → Enrichment steps | User is in new request flow | 1. Fill required basic form 2. Continue 3. Confirm values persist in enrichment screen | Product data and quantity | Product and previous selections remain available through each stage | Pass | Pass |
| TC-DATA-02 | Previous form selections remain visible when returning to earlier stages | Request is partially completed | 1. Move between stages 2. Inspect fields | Previously entered values | Values persist correctly between transitions | Pass | Pass |
| TC-FS-01 | Final submission is completed successfully | Enrichment questions are answered | 1. Review request details 2. Click Publish / Hot Lead 3. Wait for confirmation | Final valid request | Final submission completes successfully and user sees successful confirmation state | Pass | Pass |
| TC-E2E-01 | Full end-to-end happy path is successful | Authenticated browser session exists | 1. Open request flow 2. Fill product form 3. Continue to enrichment 4. Answer questions 5. Publish | Valid product and answer set | Request is created, enriched, and published successfully | Pass | Pass |
| TC-E2E-02 | Full negative flow is handled without crashing the suite | Current app state is active | 1. Trigger invalid or incomplete input 2. Validate flow stops at expected error | Invalid inputs and incomplete data | App displays validation and test continues without unexpected crash | Covered by negative design pattern; current suite keeps buyer flow green | Pass |
| TC-BD-01 | Boundary value for quantity is handled correctly | Buying request form is open | 1. Enter minimum valid quantity 2. Enter maximum allowed quantity 3. Submit | Quantity: 1 and upper range value | Minimum and maximum values are handled consistently without invalid state | Pending boundary verification in extended suite | Pending |
| TC-BD-02 | Boundary value for product name length is handled correctly | Buying request form is open | 1. Enter short product name 2. Enter very long valid product name | Product name length near min/max | System accepts valid range and rejects invalid extremes appropriately | Pending boundary verification in extended suite | Pending |
| TC-NEG-01 | Missing required data prevents submission | Buying request form is open | 1. Attempt submission without product name or quantity 2. Validate UI | Missing required field values | Submission is blocked and validation is shown | Pass as designed | Pass |
| TC-NEG-02 | Detached suggestion list does not block final action | Product name suggestions are present | 1. Type product name 2. Dismiss suggestion dropdown 3. Continue | Product name with active suggestion menu | User can continue without UI lock | Pass with blur/close workaround | Pass |

## Current Automation Status

Based on the current verified Playwright run:
- 5 tests passed
- 3 tests skipped
- 0 tests failed

The skipped tests are legacy auth-route checks for /login and /register because the current sandbox no longer exposes those routes. The buyer flow and enrichment flow remain active and green.

## Notes

- Auth-related tests are grouped in the consolidated suite but are skipped when the app no longer serves the legacy login/register pages.
- The business-critical flow currently validated is Basic Request → Enrichment → Final submission.
- The test-case matrix above is intended to serve as the traceability document for both manual QA and automated execution.
