# Shipment Tracking Module Implementation Plan

This plan outlines the architecture and steps required to build the Shipment Tracking module, ensuring compliance with the provided PRD, KPIs (DASH-04), and Stitch design.

## User Review Required

> [!IMPORTANT]
> Please review the data model and API endpoints. Does the `Shipment` schema require additional fields beyond the UI display requirements?

## Open Questions

> [!NOTE]
> Are there any specific access control (RBAC) restrictions for viewing the shipments feed, or can any authenticated user view the global shipments? (We will default to allowing authenticated users).

## Proposed Changes

---

### Backend Components

#### [NEW] `Supply_chain/backend/src/modules/shipments/schemas/shipment.schema.ts`
- Defines the Mongoose schema for `Shipment`.
- Fields: `shipmentId`, `status`, `eta`, `origin`, `destination`, `carrier`, `lastUpdate`.

#### [NEW] `Supply_chain/backend/src/modules/shipments/dto/get-shipments.dto.ts`
- DTO for GET `/api/v1/shipments` query parameters.
- Filters: `search`, `status`, `carrier`, `startDate`, `endDate`, `page`, `limit`.

#### [NEW] `Supply_chain/backend/src/modules/shipments/services/shipments.service.ts`
- Service for querying shipments and handling pagination/filtering.
- Handles mock data seeding if the collection is empty upon startup.

#### [NEW] `Supply_chain/backend/src/modules/shipments/controllers/shipments.controller.ts`
- Defines `GET /` endpoint mapped to `api/v1/shipments`.
- Requires JWT authentication.

#### [NEW] `Supply_chain/backend/src/modules/shipments/shipments.module.ts`
- Module configuration registering the schema, controller, and service.

#### [MODIFY] `Supply_chain/backend/src/app.module.ts`
- Imports and registers the `ShipmentsModule`.

---

### Frontend Components

#### [NEW] `Supply_chain/frontend/src/features/shipments/api/shipmentsApi.ts`
- RTK Query slice defining `useGetShipmentsQuery`.
- Configures endpoints based on backend DTO.

#### [NEW] `Supply_chain/frontend/src/features/shipments/pages/ShipmentsPage.tsx`
- Implementation of the Stitch `Shipment Tracking` UI.
- Implements the filter bar (Search, Status, Carrier, Date Range).
- Renders the shipment data table with the exact columns and styling from the design.
- Handles loading skeleton states and empty states.

#### [MODIFY] `Supply_chain/frontend/src/store/index.ts`
- Registers `shipmentsApi` reducer and middleware.

#### [MODIFY] `Supply_chain/frontend/src/App.tsx`
- Adds route for `/shipments` mapped to `ShipmentsPage`.

#### [MODIFY] `Supply_chain/frontend/src/components/layout/Layout.tsx`
- Wires up the "Shipments" sidebar navigation link to `/shipments`.

---

### Tests & Integration

#### [NEW] `Supply_chain/backend/test/shipments.e2e-spec.ts`
- E2E tests for the `GET /api/v1/shipments` endpoint.
- Verifies filtering, pagination, and KPI DASH-04 latency compliance (p95 <= 500ms).

## Verification Plan

### Automated Tests
- Run `yarn run test:e2e` in the backend directory to ensure the `shipments` endpoints respond correctly and efficiently.

### Manual Verification
1. Log in to the application.
2. Click on "Shipments" in the sidebar.
3. Verify that the table populates with shipments.
4. Test filtering by Status, Carrier, and Search.
5. Verify the UI styling matches the Stitch design exactly (glassmorphism, skeleton loading states, empty state).
