# Implement Permissions Management Feature

This plan outlines the architecture and tasks required to build the Permissions Management module into the Nexus Logistics web application.

## User Review Required

> [!IMPORTANT]
> Please review the data model for the Permissions module below. We will introduce a new `roles` collection in the MongoDB database to map each role (Admin, Manager, Supervisor, Viewer) to a list of specific permission IDs (e.g., `auth.mfa_enforce`, `user.create`).

## Open Questions

> [!WARNING]
> 1. Should we seed the initial roles (Admin, Manager, Supervisor, Viewer) via a database migration, or should the backend generate them automatically if they are missing?
> 2. Should we handle the "Review & Deploy" action in a specific way, or is it okay if we immediately apply changes when it is clicked?

## Proposed Changes

---

### Backend (NestJS)

We will introduce a new `RolesModule` to manage Role-Based Access Control (RBAC) configurations.

#### [NEW] `backend/src/modules/roles/schemas/role.schema.ts`
- Defines the `Role` schema for Mongoose:
  - `name`: string (e.g., "admin", "manager")
  - `displayName`: string (e.g., "Admin", "Manager")
  - `permissions`: string[] (array of permission identifiers like `auth.mfa_enforce`)

#### [NEW] `backend/src/modules/roles/roles.module.ts`
- Registers the `Role` schema.
- Exports `RolesService` and `RolesController`.

#### [NEW] `backend/src/modules/roles/controllers/roles.controller.ts`
- **GET /api/v1/roles**: Fetch all roles with their assigned permissions.
- **PATCH /api/v1/roles/:id**: Update permissions for a specific role.

#### [NEW] `backend/src/modules/roles/services/roles.service.ts`
- Implements the business logic.
- Has an `onModuleInit` hook to seed the default roles and all available permissions if they don't exist in the DB.

#### [MODIFY] `backend/src/app.module.ts`
- Imports the `RolesModule`.

---

### Frontend (React/Vite)

We will integrate the Permissions tab into the existing `UsersPage` and build the UI matching the provided Stitch HTML.

#### [NEW] `frontend/src/features/users/api/rolesApi.ts`
- Set up an RTK Query slice (`rolesApi`) for fetching and updating roles:
  - `getRoles` (GET `/api/v1/roles`)
  - `updateRole` (PATCH `/api/v1/roles/:id`)

#### [NEW] `frontend/src/features/users/components/PermissionsManager.tsx`
- The main component for the Permissions UI.
- Displays the Configuration Context (Total Roles, Active Users, Permissions, Policy Sync).
- Contains the "Select Role" side widget.
- Renders the "Detailed Permissions Matrix" grouped by module (Auth & Security, User Management, Workflow, Reporting & AI).
- Includes "Review & Deploy" logic.

#### [MODIFY] `frontend/src/features/users/pages/UsersPage.tsx`
- Replace the `onClick: () => alert('Permissions tab')` with actual tab state switching.
- Conditionally render either `UserTable` (+ filters) OR the new `PermissionsManager` depending on the active tab.

---

### Integration Notes

- The permissions list will be predefined statically in the frontend and seeded in the backend to ensure consistency. Example permissions:
  - `auth.mfa_enforce`, `auth.api_keys`, `user.create`, `user.modify_rbac`, etc.
- Changes made in the UI will send a `PATCH` request with the selected role's updated permission array.

---

## Verification Plan

### Automated Tests
- Create `backend/test/roles.e2e-spec.ts` to test role fetching and patching via the API.
- Create tests for the `RolesService` verifying initialization of default roles.

### Manual Verification
- Start the server, navigate to the Dashboard > Users > Permissions tab.
- Verify the UI accurately matches the Stitch MCP layout (glassmorphic cards, specific fonts, custom toggles).
- Select a role (e.g., Manager), toggle a few permissions, and hit "Review & Deploy".
- Refresh the page and confirm the toggled permissions persisted.
