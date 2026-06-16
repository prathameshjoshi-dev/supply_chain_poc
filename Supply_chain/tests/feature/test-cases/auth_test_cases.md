# Auth Module Test Cases: Nexus Logistics Intelligence

## 1. Standard Email/Password Login
| Test ID | Feature | Scenario | Expected Outcome | Status (Pass/Fail) |
|----------|----------|----------|------------------|-------------------|
| TC-AUTH-001 | Login API | Valid email and password | Returns 200 OK with valid `accessToken` and `refreshToken` | [ ] |
| TC-AUTH-002 | Login API | Invalid password | Returns 401 Unauthorized ("Invalid credentials") | [ ] |
| TC-AUTH-003 | Login API | Non-existent email | Returns 401 Unauthorized ("Invalid credentials") | [ ] |
| TC-AUTH-004 | Login API | Missing email or password in payload | Returns 400 Bad Request (Validation Error) | [ ] |
| TC-AUTH-005 | Login API | SQL/NoSQL Injection in email field | Returns 401 Unauthorized or 400 Bad Request, no data compromised | [ ] |
| TC-AUTH-006 | Login UI | Successful login redirects to Dashboard | User is redirected, token is saved in state/storage | [ ] |
| TC-AUTH-007 | Login UI | Failed login shows error message | UI displays "Login failed. Please check your credentials." | [ ] |
| TC-AUTH-008 | Login API | Login with an 'inactive' user account | Returns 401 Unauthorized ("User account is inactive") | [ ] |

## 2. Refresh Token
| Test ID | Feature | Scenario | Expected Outcome | Status (Pass/Fail) |
|----------|----------|----------|------------------|-------------------|
| TC-AUTH-009 | Refresh API | Valid refresh token | Returns 200 OK with a new `accessToken` | [ ] |
| TC-AUTH-010 | Refresh API | Expired refresh token | Returns 401 Unauthorized ("Invalid refresh token") | [ ] |
| TC-AUTH-011 | Refresh API | Malformed or tampered refresh token | Returns 401 Unauthorized ("Invalid refresh token") | [ ] |
| TC-AUTH-012 | Refresh API | Missing refresh token in payload | Returns 400 Bad Request | [ ] |

## 3. Logout
| Test ID | Feature | Scenario | Expected Outcome | Status (Pass/Fail) |
|----------|----------|----------|------------------|-------------------|
| TC-AUTH-013 | Logout API | Valid logout request | Returns 200 OK ("Session terminated"), token is invalidated | [ ] |
| TC-AUTH-014 | Logout UI | Click logout button | Client clears tokens, redirects to Login page | [ ] |

## 4. Google SSO Login
| Test ID | Feature | Scenario | Expected Outcome | Status (Pass/Fail) |
|----------|----------|----------|------------------|-------------------|
| TC-AUTH-015 | SSO API | Valid Google access_token (existing user) | Returns 200 OK with valid JWT `accessToken` and `refreshToken` | [ ] |
| TC-AUTH-016 | SSO API | Valid Google access_token (new user) | User is created in DB (role: viewer), returns 200 OK with JWTs | [ ] |
| TC-AUTH-017 | SSO API | Invalid or expired Google access_token | Returns 401 Unauthorized ("Invalid Google access token") | [ ] |
| TC-AUTH-018 | SSO API | Unsupported provider (e.g. 'github') | Returns 400 Bad Request ("Unsupported SSO provider") | [ ] |
| TC-AUTH-019 | SSO API | Valid Google token but user status is 'inactive' | Returns 401 Unauthorized ("User account is inactive") | [ ] |
| TC-AUTH-020 | SSO UI | Successful Google OAuth Popup | Popup closes, triggers backend callback, redirects to Dashboard | [ ] |
| TC-AUTH-021 | SSO UI | User closes Google OAuth Popup | Gracefully handles closure, no crash, remains on Login screen | [ ] |

## 5. Security & Performance Edge Cases
| Test ID | Feature | Scenario | Expected Outcome | Status (Pass/Fail) |
|----------|----------|----------|------------------|-------------------|
| TC-AUTH-022 | Security | Brute force login protection | After N failed attempts, account/IP is temporarily locked (Rate Limit) | [ ] |
| TC-AUTH-023 | Security | JWT Signature verification | Attempting to use an `accessToken` signed with a different secret is rejected | [ ] |
| TC-AUTH-024 | Performance| Load testing login endpoint (1000 req/sec) | Average response time < 200ms, no 500 Internal Server Errors | [ ] |
