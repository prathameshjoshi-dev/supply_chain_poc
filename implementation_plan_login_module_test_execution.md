# Test Execution and Reporting Plan (Updated)

Based on your feedback, we will split the execution of the test cases to accurately cover both the **Frontend** and the **Backend** using Jest, as defined in `auth_test_cases.md`.

## Proposed Changes

### 1. Backend Testing Setup (API & Security)
We will execute all API and Security test cases (Login, Refresh, Logout, Google SSO) against the NestJS backend.
- **Location:** `Supply_chain/backend/test/auth.e2e-spec.ts`
- **Dependencies:** Built-in NestJS Jest & Supertest.
- **Implementation:** We will use `@nestjs/testing` to spin up an isolated Auth Module instance. We will mock the MongoDB `userModel` to simulate successful logins, inactive accounts, and invalid credentials without polluting the real database. We will execute test cases TC-AUTH-001 to 005, 008 to 013, 015 to 019, 022, and 023.

### 2. Frontend Testing Setup (UI Workflows)
We will execute all UI workflow test cases (Form validation, Login redirects, Error rendering, Logout state) on the React application.
- **Dependencies:** Install `jest`, `ts-jest`, `jest-environment-jsdom`, `@testing-library/react`, and `@testing-library/jest-dom` in the frontend.
- **Configuration:** Create `jest.config.js` and `jest.setup.ts` to configure Jest for a Vite/React/TypeScript environment.
- **Location:** `Supply_chain/frontend/src/features/auth/__tests__/LoginPage.test.tsx`
- **Implementation:** We will mount the `LoginPage` component wrapped in a mocked Redux Provider and Router. We will simulate user clicks and form typing to execute test cases TC-AUTH-006, 007, 014, 020, and 021.

### 3. Execution & Reporting
- Run `yarn test:e2e` in the backend.
- Run `yarn test` in the frontend.
- Note: Performance test `TC-AUTH-024` (Load Testing 1000 req/sec) requires tools like JMeter; it will be marked as "Failed/Not Executed" or simulated in the Jest report since Jest is not a load-testing tool.
- Consolidate all pass/fail results into a single **Test Execution Report** artifact following the `test_case_execution_template.md` format exactly.

## User Review Required
> [!IMPORTANT]
> The plan is now updated to install Jest and React Testing Library on the frontend to execute authentic UI tests, alongside the backend API tests.
> 
> Are you ready to approve this plan so I can begin installing the dependencies and writing the test files?
