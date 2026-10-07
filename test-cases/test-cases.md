# Test Cases and Assignment Coverage

This document captures the test-case structure for the Pepagora QA automation assignment and maps the automated coverage to the current implementation status.

## Coverage Summary

- Registration: partially implemented
- Login: implemented
- Basic buying request: implemented
- Enrichment flow: partially implemented
- End-to-end happy path: implemented and passing
- Negative and boundary validations: needs expansion
- Defect evidence: documented separately in [defects/defects.md](../defects/defects.md)

## Test Case Matrix

### 1. Registration

- REG-01: User can register with valid details
- REG-02: Required first name field is enforced
- REG-03: Required last name field is enforced
- REG-04: Email format validation is enforced
- REG-05: Password minimum strength validation is enforced
- REG-06: Duplicate email registration is rejected
- REG-07: Successful registration redirects to expected confirmation state
- REG-08: Registration page loads correctly without an authenticated session

Status: partially automated in [tests/registration.spec.js](../tests/registration.spec.js)

### 2. Login

- LOG-01: User can log in with valid credentials
- LOG-02: User cannot log in with invalid password
- LOG-03: User cannot log in with invalid email/phone number
- LOG-04: Required email or password fields are enforced
- LOG-05: Successful login redirects away from the login page
- LOG-06: Logged-out state is restored when storage state is cleared

Status: automated in [tests/login.spec.js](../tests/login.spec.js)

### 3. Basic Buying Request

- BR-01: User can open the buying request form
- BR-02: Product name is accepted with valid input
- BR-03: Quantity field accepts valid numeric values
- BR-04: Quantity field rejects invalid or empty values
- BR-05: Unit selection can be changed and saved
- BR-06: Product name suggestions overlay does not block form actions
- BR-07: Buyer can continue when required fields are filled
- BR-08: Buyer can submit a valid basic request
- BR-09: Validation message is shown when a required field is missing
- BR-10: Basic request appears in the correct post or sourcing area after submission

Status: partially automated in [tests/buying-request-basic.spec.js](../tests/buying-request-basic.spec.js) and the e2e flow in [tests/e2e-basic-flow.spec.js](../tests/e2e-basic-flow.spec.js)

### 4. Enrichment Flow

- ENR-01: User can open the enriched post flow
- ENR-02: Smart Questions section loads for the new request
- ENR-03: User can answer the first available question option
- ENR-04: User can answer all question groups without blocking UI interactions
- ENR-05: Flexible logistics option can be selected
- ENR-06: One-time order setting can be selected
- ENR-07: Negotiable destination option can be selected
- ENR-08: Budget and payment choice can be captured
- ENR-09: Publish as a Hot Lead completes the flow
- ENR-10: The published request becomes visible in the sourcing RFQ list
- ENR-11: Cookie or UI overlay does not block action buttons

Status: covered in the end-to-end flow but should be expanded into dedicated test cases for clarity and regression tracking

### 5. End-to-End Journey

- E2E-01: Logged-in buyer can post a basic request, enrich it, publish it, and verify it appears in the sourcing RFQ list
- E2E-02: Session persists correctly across related steps in the buyer flow
- E2E-03: Headed execution runs successfully without blocking surprises from UI overlays

Status: fully implemented and passing in [tests/e2e-basic-flow.spec.js](../tests/e2e-basic-flow.spec.js)

## Assignment Readiness

Current project status:

- Automation foundation: complete
- GitHub repo: complete
- Page objects: complete
- Test data: complete
- End-to-end happy path: complete
- Full negative/boundary matrix: in progress
- Defect evidence: documented in a separate defects file
- Execution summary and report: ready to be expanded with final run outputs

## Recommended Next Actions

1. Add a dedicated negative-validation suite for registration, login, and request creation.
2. Split the end-to-end flow into smaller scenario-based specs for easier readability and reporting.
3. Record pass/fail counts for each test case in the final README summary.
4. Attach final Playwright HTML report and screenshots for evidence.
5. Keep this document as the traceability source for all automated scenarios.
