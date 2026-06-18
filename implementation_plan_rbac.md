# Implement Role-Based Access Control (RBAC)

This plan outlines the steps to introduce RBAC across the Nexus Logistics platform, securing backend endpoints and adapting the frontend UI based on the authenticated user's role.

## User Review Required

> [!IMPORTANT]
> The backend endpoints currently have authentication temporarily bypassed (`@UseGuards(AuthGuard('jwt'))` is commented out). This plan will re-enable JWT authentication and enforce strict role checking. You will need to pass the JWT token in all API requests.
>
> Please review the **Role Matrix** below and confirm if the access levels align with your expectations.

## Role Access Matrix

The system currently supports four roles: `admin`, `manager`, `supervisor`, `viewer`.

| Module | Admin | Manager | Supervisor | Viewer |
| :--- | :---: | :---: | :---: | :---: |
| **Dashboard** | Full | Full | Full | Read-Only |
| **Users** | Full | None | None | None |
| **Shipments** | Full | Full | Full | Read-Only |
| **Inventory** | Full | Full | Full | Read-Only |
| **Workflows** | Full | Full | None | None |
| **Reports** | Full | Full | None | None |
| **AI Assistant**| Full | Full | Full | Full |

## Proposed Changes

### Backend Framework (Guards & Decorators)

- **`src/modules/auth/strategies/jwt.strategy.ts`**: Ensure the JWT strategy correctly extracts the user `role` and attaches it to `req.user`.
- **`src/common/decorators/roles.decorator.ts`**: Create a `@Roles(...roles)` decorator to attach allowed roles to route metadata.
- **`src/common/guards/roles.guard.ts`**: Create a `RolesGuard` that reads the required roles via `Reflector` and verifies if `req.user.role` intersects with them.

### Backend Endpoints

We will apply `@UseGuards(JwtAuthGuard, RolesGuard)` and the `@Roles()` decorator to the following controllers:
- `users.controller.ts`: Restrict all to `admin`.
- `shipments.controller.ts`: Restrict mutations to `admin`, `manager`, `supervisor`.
- `inventory.controller.ts`: Restrict mutations to `admin`, `manager`, `supervisor`.
- `workflows.controller.ts`: Restrict to `admin`, `manager`.
- `reports.controller.ts`: Restrict to `admin`, `manager`.
- `dashboard.controller.ts`: Open to all authenticated users.
- `ai.controller.ts`: Open to all authenticated users.

### Frontend UI & Routing

- **`App.tsx`**: Update the `<PrivateRoute>` component to accept an optional `allowedRoles` array. If the user's role is not in the array, redirect them to an unauthorized page or dashboard.
- **`Layout.tsx`**: Conditionally hide sidebar navigation links if the user does not have the required role (e.g., hide the "Users" link from non-admins, hide "Workflows" from Supervisors/Viewers).
- **Component Level**: Conditionally hide or disable mutation buttons (like "Create Shipment", "Add Item", etc.) for users with the `viewer` role.

## Verification Plan

### Automated/Manual Tests
- Log in as an `admin` to verify access to all tabs.
- Log in as a `viewer` to verify that the "Users" tab is hidden and they cannot access `/users`.
- Attempt to call a protected backend endpoint without a token or with a lower-privileged token to verify a `403 Forbidden` response.
