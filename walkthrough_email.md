# Nodemailer Email Invitations Walkthrough

## What Was Achieved
The backend now automatically sends a styled welcome email to newly created users using Google's SMTP servers!

1. **Email Service Architecture**:
   - `EmailService` was created to encapsulate `nodemailer`.
   - It securely pulls `GOOGLE_MAIL_USER` and `GOOGLE_MAIL_APP_PASSWORD` from the `.env` file using NestJS `ConfigService`.
   - If the variables are missing, the service fails gracefully with a warning rather than crashing the app.

2. **User Invite Flow**:
   - When an admin creates a new user via the `UsersController` (or the frontend "Add User" modal), the `UsersService` catches the raw plaintext password before hashing it.
   - It fires off an asynchronous request to `EmailService.sendUserInvite()`.
   - The user receives an HTML-styled welcome email with their email address and temporary password clearly visible, prompting them to log in and change it.

## Testing It Out
1. Ensure your `.env` has the correct Google credentials.
2. Go to the **Users** tab in your Nexus Control frontend.
3. Click "Add User", fill out their details, and give them a password.
4. Check the user's inbox! You should see the welcome email arrive shortly.
