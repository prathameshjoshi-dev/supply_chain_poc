# Change Password Walkthrough

## Overview
The Change Password functionality has been fully integrated into Nexus Logistics. Users can securely update their credentials from anywhere in the app using the new modal layout derived from the Stitch design.

## Accomplishments

### Backend
1. Created `ChangePasswordDto` for strict data validation (checking current password against hash, and asserting valid constraints for new passwords).
2. Added `changePassword` logic to `AuthService`, which leverages bcrypt to verify the old password and hash the new one before saving it to the `User` MongoDB model.
3. Hooked it up via a `POST /api/v1/auth/change-password` endpoint.
4. Added an integration test suite for this endpoint in `auth.e2e-spec.ts`.

### Frontend
1. Created the RTK Query mutation `useChangePasswordMutation` inside `authApi.ts`.
2. Recreated the Stitch HTML as a fully functional `ChangePasswordModal.tsx` React component with:
   - Dynamic real-time validation checks for security requirements.
   - Password visibility toggles.
   - RTK Query error handling and success state feedback.
3. Inserted a new "Change Password" button in `Layout.tsx` directly above the Logout button in the sidebar to toggle this modal.

## Verification
- ✅ **Open Modal**: Click "Change Password" right above Logout on the sidebar.
- ✅ **Validation**: Enter passwords that don't match or miss requirements and watch the requirements checklist update in real-time.
- ✅ **Submit Action**: Enter your current password (`Admin@123`) and a valid new password. Click "Update Password" and see the success message.
- ✅ **Persistence**: Logout, and login with your newly created password.
