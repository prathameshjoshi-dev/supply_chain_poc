# Create New Shipment Implementation Plan

This plan outlines the architecture and steps required to build the "Create New Shipment" feature, integrating it into the existing `shipments` module on both the frontend and backend.

## User Review Required

> [!IMPORTANT]
> The new UI includes fields like Priority, Shipment Type, Weight, Dimensions, etc. that were not in the original `Shipment` schema. 
> I plan to add these fields to the backend schema as optional fields to ensure backwards compatibility with our existing mock data. Please let me know if any of these should be strictly required.

## Proposed Changes

---

### Backend Components

#### [MODIFY] `Supply_chain/backend/src/modules/shipments/schemas/shipment.schema.ts`
- Add new fields: `priority`, `type`, `serviceLevel`, `weight`, `quantity`, `packagingType`, `dimensions` (object with l, w, h), and `description`.

#### [NEW] `Supply_chain/backend/src/modules/shipments/dto/create-shipment.dto.ts`
- DTO for `POST /api/v1/shipments`.
- Includes validation for all the new fields.

#### [MODIFY] `Supply_chain/backend/src/modules/shipments/services/shipments.service.ts`
- Add `createShipment(dto: CreateShipmentDto)` method.
- Generate a random `shipmentId` (e.g. `NEX-XXXX-XXXX`).
- Set default `status` to "In-Transit" or "Pending".
- Calculate `eta` based on `serviceLevel` (e.g. Next Day = +1 day).

#### [MODIFY] `Supply_chain/backend/src/modules/shipments/controllers/shipments.controller.ts`
- Add `@Post()` endpoint for creating a shipment.

---

### Frontend Components

#### [MODIFY] `Supply_chain/frontend/src/features/shipments/api/shipmentsApi.ts`
- Add `createShipment` mutation endpoint to RTK Query slice.
- Invalidate the `['Shipment']` tag upon successful creation to auto-refresh the list.

#### [NEW] `Supply_chain/frontend/src/features/shipments/pages/CreateShipmentPage.tsx`
- Build the "Create New Shipment" wizard UI based on the Stitch HTML.
- Hook up form state using React `useState`.
- Connect the `Create Shipment` button to the `createShipment` RTK Query mutation.
- Implement the success toast notification.
- Connect the `Cancel` button to navigate back to `/shipments`.

#### [MODIFY] `Supply_chain/frontend/src/features/shipments/pages/ShipmentsPage.tsx`
- Update the "New Shipment" button to use `react-router-dom`'s `useNavigate` hook, redirecting to `/shipments/new`.

#### [MODIFY] `Supply_chain/frontend/src/App.tsx`
- Add route `<Route path="/shipments/new" element={<CreateShipmentPage />} />`.

---

### Tests & Integration

#### [MODIFY] `Supply_chain/backend/test/shipments.e2e-spec.ts`
- Add tests for `POST /api/v1/shipments` (success and validation failure).

## Verification Plan

### Automated Tests
- Run `yarn run test:e2e` to verify the creation endpoint works and validates correctly.

### Manual Verification
1. Navigate to "Shipments".
2. Click "New Shipment".
3. Fill out the form fields (Priority, Type, Origin, Destination, Carrier, Weight, Dimensions).
4. Click "Create Shipment".
5. Observe the success toast and automatic redirection to the shipments feed.
6. Verify the newly created shipment appears at the top of the feed.
