# User Management Module Implementation Plan

We will build the **User Management Module (core-business-service)** according to the fetched Stitch project screens (OmniTrack Logistics Intelligence). This module integrates perfectly with our existing Mongoose schema and provides the UI for your newly established Nexus Control interface!

## Proposed Changes

### 1. Backend Modifications (NestJS)

#### [MODIFY] `src/database/schemas/user.schema.ts`
- Add `avatar` (string) for profile pictures.
- Add `lastActivity` (Date) to track when the user last logged in.
- Add `warehouseScope` (string) to directly map to the UI dropdowns (e.g., Global, Regional, Hub 42-X).

#### [MODIFY] `src/modules/users/dto/*`
- Update `CreateUserDto` and `UpdateUserDto` to include the new fields.
- [NEW] Create `BulkUpdateUsersDto` for bulk actions (Edit, Suspend, Delete).

#### [MODIFY] `src/modules/users/controllers/users.controller.ts` & `users.service.ts`
- **GET `/api/v1/users`**: Implement search queries, role filtering, scope filtering, and pagination.
- **POST `/api/v1/users/bulk-action`**: New endpoint handling array-based deletion or suspension (Status -> 'inactive').
- **GET `/api/v1/users/insights`**: New aggregation endpoint returning the metrics for the Bento Grid (Total Capacity, Admin Count, Active Percentage).

### 2. Frontend Modifications (React/Vite)

#### [NEW] Global Layout Shell
- Extract the beautiful Sidebar and Top Header Bar from the HTML into a reusable `Layout.tsx` component that wraps all authenticated pages (like Dashboard, Users, etc.).

#### [NEW] User Management Feature (`src/features/users/*`)
- **`api/usersApi.ts`**: RTK Query endpoints for fetching paginated users, insights, and executing bulk actions.
- **`components/UserFilters.tsx`**: Top bar with dropdowns and search inputs.
- **`components/UserTable.tsx`**: The main data table featuring the micro-interaction hover effects, custom scrollbars, and checkbox selection.
- **`components/UserInsights.tsx`**: The bottom Bento Grid displaying the total user capacity and security pulse.
- **`pages/UsersPage.tsx`**: Orchestrator component tying the pieces together.

#### [MODIFY] `src/App.tsx`
- Setup routing so that `/users` renders the `UsersPage` within the global `Layout`.

### 3. Testing
- [NEW] `backend/test/users.e2e-spec.ts`: E2E tests for pagination, filtering, and bulk operations using Jest/Supertest.
- [NEW] `frontend/src/features/users/__tests__/UsersPage.test.tsx`: Jest UI tests to ensure table rendering and bulk action dispatches work.

---

## Open Questions & User Review Required

> [!IMPORTANT]
> 1. **Avatar Storage:** Should we store avatar URLs as simple mock strings for now, or do you have a plan for AWS S3 / Cloudinary uploads later? (I will use mock URLs by default).
> 2. **Authentication Flow:** Should I wire up the new Global Layout to read the `accessToken` from Redux to display the logged-in user's profile picture in the Top Header?

If this implementation plan looks good, approve it and I will begin executing the backend and frontend code!
