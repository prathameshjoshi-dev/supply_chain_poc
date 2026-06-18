# Implement Email Invitations with Nodemailer

This plan outlines the steps to integrate `nodemailer` into the backend so that when an admin creates a new user, an invitation email is automatically sent out with their login credentials.

## User Review Required

> [!IMPORTANT]
> Since we are using Gmail to send emails, you will need to generate a Google App Password. Once generated, please add the following two variables to your backend `.env` file (`Supply_chain/backend/.env`):
> ```env
> GOOGLE_MAIL_USER=your-email@gmail.com
> GOOGLE_MAIL_APP_PASSWORD=your_16_character_app_password
> ```

## Proposed Changes

### Backend Dependencies
- Install `nodemailer` and `@types/nodemailer`.

### Backend Implementation

#### [NEW] src/modules/email/email.service.ts
- Create a new `EmailService` that uses `nodemailer.createTransport` with Gmail configuration.
- It will pull credentials using NestJS's `ConfigService` (`GOOGLE_MAIL_USER` and `GOOGLE_MAIL_APP_PASSWORD`).
- Implement an async `sendUserInvite(email, password, name)` method.

#### [NEW] src/modules/email/email.module.ts
- Create a module to encapsulate and export the `EmailService`.

#### [MODIFY] src/app.module.ts
- Import and register the `EmailModule`.

#### [MODIFY] src/modules/users/users.module.ts
- Import `EmailModule` so `UsersService` has access to the email service.

#### [MODIFY] src/modules/users/services/users.service.ts
- Inject `EmailService`.
- In the `create` method, after saving the new user, invoke `this.emailService.sendUserInvite(...)` to send the credentials to the new user.

## Verification Plan

### Automated Verification
- Verify that the backend builds successfully without TypeScript errors.

### Manual Verification
- We will create a test user from the frontend UI or Swagger.
- Verify that an email successfully arrives in the inbox containing the auto-generated or manually provided password.
- Verify that if the email fails to send (e.g., bad credentials), the error is caught and logged, but doesn't crash the server.
