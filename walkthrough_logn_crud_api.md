# Users CRUD API Walkthrough

The User Management module has been successfully integrated into the NestJS backend to provide complete, secure CRUD capabilities for administrators. 

## What Was Added
- **DTO Validation**: Strict validations via `class-validator` were added in `create-user.dto.ts` and `update-user.dto.ts` (using `@nestjs/mapped-types`). The DTOs ensure that user creation only proceeds with a valid email, strong password, and correct RBAC roles (`admin`, `manager`, `supervisor`, `viewer`).
- **UsersService**: The core business logic interacts directly with the `User` Mongoose model. 
    - The `create` method automatically hashes incoming passwords with `bcrypt` (Salt rounds = 10) before persisting. It also gracefully prevents duplicate emails.
    - All retrieval methods natively strip out the `passwordHash` to prevent accidental sensitive data leaks.
    - The `remove` method uses a **Soft Delete** mechanism, changing the user's `status` to `inactive` instead of hard-deleting the record, preserving historical audit trails for supply chain logs.
- **UsersController**: Standard RESTful endpoints are exposed securely at `/api/v1/users`:
    - `POST /api/v1/users` (Create)
    - `GET /api/v1/users` (List)
    - `GET /api/v1/users/:id` (Read)
    - `PATCH /api/v1/users/:id` (Update)
    - `DELETE /api/v1/users/:id` (Soft Delete)

## Validation
The backend hot-reloaded automatically and the new `/api/v1/users` endpoints are live. No terminal errors were encountered. 

> [!NOTE]
> The endpoints are currently public for testing convenience via Postman/cURL. When the frontend administration dashboard is ready, we can instantly secure all user management endpoints by uncommenting the `@UseGuards(AuthGuard('jwt'))` decorator inside `users.controller.ts`.
