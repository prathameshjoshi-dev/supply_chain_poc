# Users CRUD API Implementation Plan

This plan outlines the steps to build a complete RESTful CRUD API for User Management in the backend, supporting the platform's RBAC and directory requirements.

## Proposed Changes

We will create a new `UsersModule` following the NestJS architecture.

### Backend (`Supply_chain/backend`)

#### [NEW] `src/modules/users/dto/create-user.dto.ts`
Define validation rules for user creation:
- `name` (string)
- `email` (valid email)
- `password` (string, min 6 chars)
- `role` (admin, manager, supervisor, viewer)
- `warehouseIds` (optional array of strings)

#### [NEW] `src/modules/users/dto/update-user.dto.ts`
Partial version of `CreateUserDto` using `@nestjs/mapped-types`.

#### [NEW] `src/modules/users/services/users.service.ts`
Business logic interacting with the Mongoose `User` model:
- `create(createUserDto)`: Hash password with bcrypt before saving.
- `findAll()`: Return list of users (excluding password hash).
- `findOne(id)`: Return single user by ID.
- `update(id, updateUserDto)`: Update user details (if password provided, hash it).
- `remove(id)`: Soft-delete by setting `status` to `inactive`, or hard delete.

#### [NEW] `src/modules/users/controllers/users.controller.ts`
Expose endpoints:
- `POST /api/v1/users`
- `GET /api/v1/users`
- `GET /api/v1/users/:id`
- `PATCH /api/v1/users/:id`
- `DELETE /api/v1/users/:id`

#### [NEW] `src/modules/users/users.module.ts`
Wire up the controller, service, and `MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])`. Export `UsersService` to be used by the `AuthModule` (we will refactor `AuthModule` to use `UsersService` for looking up users instead of direct DB access).

#### [MODIFY] `src/app.module.ts`
Import the new `UsersModule`.

## User Review Required

> [!IMPORTANT]
> - For the `DELETE /api/v1/users/:id` endpoint, do you prefer a **soft delete** (changing `status` to `inactive`) or a **hard delete** (completely removing the record from MongoDB)? I will implement soft delete by default to maintain audit trails.
> - Should these endpoints be protected by the `JwtAuthGuard` immediately, or left public for testing first? I will apply the guard by default as per security standards.

## Verification Plan
- Run `npm run start:dev` to ensure the server compiles without errors.
- Create tests for the `UsersController` endpoints.
- Optionally verify using cURL or Postman to create and list a user.
