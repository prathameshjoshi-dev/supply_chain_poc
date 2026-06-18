# Role-Based Access Control (RBAC) Walkthrough

## Overview
The platform has been fully secured with Role-Based Access Control (RBAC) on both the NestJS backend and the React frontend. Your users now have specific access boundaries based on their assigned role (`admin`, `manager`, `supervisor`, `viewer`).

## Backend Security
1. **JWT Strategy Re-enabled**: The `@UseGuards(AuthGuard('jwt'))` decorator is now globally active across the API. All requests *must* carry a valid Bearer token.
2. **Roles Guard**: Created a custom `RolesGuard` (`roles.guard.ts`) that intercepts the request, reads the decoded `role` from the JWT payload, and compares it against the required roles.
3. **Endpoint Protection**:
   - `UsersController`: `@Roles('admin')` - Only admins can read or mutate user data.
   - `WorkflowsController` & `ReportsController`: `@Roles('admin', 'manager')`
   - `ShipmentsController` & `InventoryController`: `@Roles('admin', 'manager', 'supervisor', 'viewer')` for reading (`GET`), but mutations (`POST`, `PATCH`) are restricted to `admin`, `manager`, and `supervisor`.
   - `DashboardController` & `AiController`: Open to all authenticated roles.

## Frontend Security
1. **Dynamic Private Routing**: The `<PrivateRoute>` wrapper in `App.tsx` now accepts an `allowedRoles` array.
   - If a `viewer` tries to manually navigate to `/users` via the URL bar, the router intercepts the request and instantly bounces them back to `/dashboard`.
2. **Adaptive Sidebar (Layout.tsx)**: The main navigation sidebar now dynamically adapts to the current user's role:
   - The **Users** link is entirely hidden unless `user.role === 'admin'`.
   - The **Workflows** and **Reporting** links are hidden from `supervisors` and `viewers`.

## Verification
You can easily verify this by logging in with different accounts.
- As an **Admin**, you will see the entire sidebar and have access to all routes.
- As a **Viewer** (e.g., if you log in via SSO), your sidebar will be much cleaner, showing only Dashboard, Inventory, Shipments, Notifications, and AI Assistant. Clicking protected routes will bounce you.
