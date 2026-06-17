# Change Password Implementation Plan

This document outlines the plan to build the "Change Password" feature based on the provided Stitch HTML design.

## Proposed Changes

### Backend (NestJS)

We will integrate this into the existing `AuthModule` (or create a dedicated `SecurityModule` if preferred, but `AuthModule` is the standard location for password management).

#### [NEW] `src/modules/auth/dto/change-password.dto.ts`
- Create `ChangePasswordDto` with:
  - `currentPassword` (string)
  - `newPassword` (string)

#### [MODIFY] `src/modules/auth/controllers/auth.controller.ts`
- Add `POST /api/v1/auth/change-password` route.
- It will accept the `ChangePasswordDto` and the currently authenticated user's ID.

#### [MODIFY] `src/modules/auth/services/auth.service.ts`
- Implement `changePassword(userId, currentPassword, newPassword)`.
- **Logic**: Find user, verify `currentPassword` matches the hash in DB. If yes, hash `newPassword`, update the user document, and return success. 

> [!NOTE]
> Since we use a seeded mock user (`Admin@123`), we will ensure the password update successfully modifies the `User` document in MongoDB.

---

### Frontend (React + Vite)

#### [NEW] `src/features/auth/api/authApi.ts` (if it doesn't exist, or extend existing)
- Add `changePassword` mutation to the RTK Query endpoints.

#### [NEW] `src/features/auth/components/ChangePasswordModal.tsx`
- Implement the form overlay (modal) exactly matching the Stitch design.
- Capture: Current Password, New Password, Confirm New Password.
- Include password visibility toggles (`visibility` / `visibility_off`).
- Implement basic client-side validation for the security requirements (8+ chars, 1 uppercase, 1 number, matching confirm password).

#### [MODIFY] `src/components/layout/Layout.tsx`
- Add a new "Change Password" button in the bottom left menu, directly above the "Logout" button.
- Add state `isChangePasswordModalOpen`.
- Render `<ChangePasswordModal />` overlay when active.

## Verification Plan

### Automated Tests
- Add a test case to `auth.e2e-spec.ts` for the `POST /api/v1/auth/change-password` endpoint.

### Manual Verification
- Click "Change Password" in the sidebar.
- Test the visibility toggles.
- Try entering a password that doesn't meet the requirements (verify UI feedback).
- Submit the form with the correct current password (`Admin@123`) and a valid new password.
- Logout and attempt to log back in with the *new* password to ensure the database successfully updated.
