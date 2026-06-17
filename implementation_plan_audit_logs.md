# Implement Audit Logs Feature

This plan outlines the architecture and tasks required to build the **Audit Logs** module into the Nexus Logistics web application, based on the provided Stitch design.

## User Review Required

> [!IMPORTANT]
> Please review the proposed data model and integration points. We will create a new `audit-logs` collection in the MongoDB database to store immutable system events.

## Open Questions

> [!WARNING]
> 1. Should the "Live Event Stream" actually receive real-time updates via WebSockets, or is a standard polling/refresh mechanism sufficient for this initial implementation?
> 2. Do we want to auto-generate mock audit logs on backend startup so we can see the UI populated immediately?

## Proposed Changes

---

### Backend (NestJS)

We will introduce a new `AuditLogsModule` to manage and serve system events.

#### [NEW] `backend/src/modules/audit-logs/schemas/audit-log.schema.ts`
- Defines the `AuditLog` schema:
  - `timestamp`: Date
  - `user`: object (id, initials, name)
  - `action`: string (CREATE, UPDATE, DELETE, AUTH)
  - `entity`: string (e.g., Shipment, Inventory, User Access)
  - `entityId`: string (e.g., #SH-9921-X)
  - `sourceIp`: string
  - `severity`: string (info, warning, critical, success)

#### [NEW] `backend/src/modules/audit-logs/audit-logs.module.ts`
- Registers the schema and exports the service.

#### [NEW] `backend/src/modules/audit-logs/controllers/audit-logs.controller.ts`
- **GET /api/v1/audit-logs**: Fetch paginated logs, accepting query parameters for filtering (date range, user, action type, entity) and returning data along with KPI stats (Total Events, Critical Actions, Auth Failures).

#### [NEW] `backend/src/modules/audit-logs/services/audit-logs.service.ts`
- Implements the business logic for fetching and optionally seeding mock logs for demonstration.

#### [MODIFY] `backend/src/app.module.ts`
- Import the `AuditLogsModule`.

---

### Frontend (React/Vite)

We will integrate the Audit Logs tab into the existing `UsersPage` and build the UI matching the Stitch HTML.

#### [NEW] `frontend/src/features/users/api/auditLogsApi.ts`
- Set up an RTK Query slice (`auditLogsApi`) for fetching logs and KPI stats:
  - `getAuditLogs` (GET `/api/v1/audit-logs`)

#### [NEW] `frontend/src/features/users/components/AuditLogsManager.tsx`
- The main component for the Audit Logs UI.
- **Filters Section**: Date Range, User, Action Type, Entity Affected.
- **KPI Stats**: Total Events, Critical Actions, Auth Failures, System Uptime.
- **Logs Table**: Renders the "Live Event Stream" with specific styling for actions (e.g., green for CREATE, red for DELETE).

#### [MODIFY] `frontend/src/features/users/pages/UsersPage.tsx`
- Enable the `Activity Log` tab (rename to `Audit Logs` if appropriate) to render the `AuditLogsManager` component.

#### [MODIFY] `frontend/src/store/index.ts`
- Register `auditLogsApi` in the Redux store.

---

## Verification Plan

### Automated Tests
- Create `backend/test/audit-logs.e2e-spec.ts` to test fetching and filtering of logs.

### Manual Verification
- Start the server, navigate to the Dashboard > Users > Activity Log tab.
- Verify the UI matches the Stitch design exactly, including glassmorphism and the table layout.
- Test the filtering logic and pagination.
