# Google Login Integration Plan

This plan outlines the steps required to make Google Single Sign-On (SSO) fully functional across the frontend React application and the backend NestJS service.

## Proposed Changes

### 1. Frontend Integration (`Supply_chain/frontend`)
We will use `@react-oauth/google` to provide a seamless popup/redirect experience for the user.

- **Dependencies:** Install `@react-oauth/google`.
- **Configuration:** Wrap the application (or Login page) in `<GoogleOAuthProvider clientId="...">`.
- **Login Page Updates:** Replace the static Google button in `LoginPage.tsx` with the `useGoogleLogin` hook. When the user successfully authenticates with Google, the frontend will receive an ID Token (credential) or Auth Code and send it to the backend's `/api/v1/auth/sso/callback` endpoint.

### 2. Backend Integration (`Supply_chain/backend`)
We will verify the Google token securely on the server side before issuing our own application JWT.

- **Dependencies:** Install `google-auth-library` to verify the incoming Google tokens.
- **Service Updates:** Update `auth.service.ts` `ssoLogin(provider, token)` method to:
  1. Verify the `token` using Google's `OAuth2Client`.
  2. Extract the user's `email`, `name`, and Google `sub` ID.
  3. Query the `users` collection for an existing user with that email.
  4. If the user doesn't exist, create a new user with a default role (e.g., `viewer`) and `status: 'active'`.
  5. Generate and return the platform's standard `accessToken` and `refreshToken`.

### 3. Environment Variables
Both frontend and backend will require Google Client credentials.
- Backend `.env`: Add `GOOGLE_CLIENT_ID`
- Frontend `.env`: Add `VITE_GOOGLE_CLIENT_ID`

## User Review Required

> [!IMPORTANT]
> **Action Required:** We need a **Google OAuth Client ID** to make this work. 
> Have you already created a project in the Google Cloud Console and generated an OAuth 2.0 Client ID for Web Applications?
> 
> - If **Yes**, please paste your `Client ID` in the chat so I can configure the `.env` files.
> - If **No**, I can guide you on how to generate one, or I can implement the code first and you can plug the ID in later. How would you prefer to proceed?

## Verification Plan
1. Ensure the Google sign-in popup opens on the frontend when the Google button is clicked.
2. Verify that selecting a Google account successfully transmits the token to the backend.
3. Check the MongoDB `users` collection to confirm that a new user record is created (or an existing one matched) and that a valid platform JWT is returned to the frontend.
