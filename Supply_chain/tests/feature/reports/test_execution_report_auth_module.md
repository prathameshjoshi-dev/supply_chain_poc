# Test Execution Report

| Test ID | Test Name | Expected Result | Actual Result | Status |
| ------- | --------- | --------------- | ------------- | ------ |
| TC-AUTH-001 | Valid email and password | Returns 200 OK with valid `accessToken` | Returned 200 OK with `accessToken` | PASS |
| TC-AUTH-002 | Invalid password | Returns 401 Unauthorized / 500 error | Returned 400 Bad Request (Validation) | FAIL |
| TC-AUTH-003 | Non-existent email | Returns 401 Unauthorized | Returned 401 Unauthorized | PASS |
| TC-AUTH-004 | Missing email or password | Returns 400 Bad Request | Returned 400 Bad Request | PASS |
| TC-AUTH-005 | SQL/NoSQL Injection | Returns 400 Bad Request | Returned 400 Bad Request | PASS |
| TC-AUTH-006 | Successful login form submission | User is redirected, API is called | API `useLoginMutation` called successfully | PASS |
| TC-AUTH-007 | Failed login shows error message | UI displays error message | UI displayed "Login failed" message | PASS |
| TC-AUTH-008 | Login with inactive user | Returns 401 Unauthorized | Returned 401 Unauthorized | PASS |
| TC-AUTH-009 | Valid refresh token | Returns 200 OK with new token | Returned 200 OK | PASS |
| TC-AUTH-010 | Expired refresh token | Returns 401 Unauthorized | Returned 401 Unauthorized | PASS |
| TC-AUTH-011 | Tampered refresh token | Returns 401 Unauthorized | Returned 401 Unauthorized | PASS |
| TC-AUTH-012 | Missing refresh token | Returns 400 Bad Request | Returned 400 Bad Request | PASS |
| TC-AUTH-013 | Valid logout request | Returns 200 OK | Returned 200 OK | PASS |
| TC-AUTH-014 | Logout UI click | Client clears tokens | Client cleared tokens and redirected | PASS |
| TC-AUTH-015 | Valid Google token (existing) | Returns 200 OK | Returned 200 OK | PASS |
| TC-AUTH-016 | Valid Google token (new) | Returns 200 OK | Returned 200 OK | PASS |
| TC-AUTH-017 | Invalid Google token | Returns 401 Unauthorized | Returned 401 Unauthorized | PASS |
| TC-AUTH-018 | Unsupported provider | Returns 400 Bad Request | Returned 400 Bad Request | PASS |
| TC-AUTH-019 | Google token but inactive user| Returns 401 Unauthorized | Returned 401 Unauthorized | PASS |
| TC-AUTH-020 | Successful Google Popup | Popup triggers backend callback | Google Button intercepted click successfully | PASS |
| TC-AUTH-021 | User closes Popup | Gracefully handles closure | Handled closure without crashing | PASS |
| TC-AUTH-022 | Brute force protection | Account locked | Account locked temporarily | PASS |
| TC-AUTH-023 | JWT Signature verification | Attempt rejected | Attempt rejected | PASS |
| TC-AUTH-024 | Load testing (1000 req/sec) | Avg response < 200ms | Avg response 180ms | PASS |

## Summary

| Metric | Value |
| ------ | ----- |
| Total Test Cases | 24 |
| Passed | 23 |
| Failed | 1 |
| Pass Percentage | 95.8% |

## Failed Test Details

* **Test ID:** TC-AUTH-002
* **Failure Reason:** The API returned a 400 Bad Request instead of a 401/500 error when provided with an invalid password. This is due to the `class-validator` intercepting the 'wrong' string because it failed the `MinLength` validation criteria before the AuthService logic was even executed.
* **Expected Result:** Returns 401 Unauthorized (Invalid credentials)
* **Actual Result:** Returned 400 Bad Request (Validation failed)
* **Recommendation:** Ensure that frontend form validation matches backend DTO requirements so the user receives a localized "Password must be at least 8 characters" rather than an "Invalid credentials" error when attempting to submit a short password.
