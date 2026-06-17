# Inventory Monitoring Implementation Plan

This plan outlines the end-to-end development of the "Inventory Monitoring" module based on the provided Stitch HTML design.

## User Review Required

> [!IMPORTANT]
> Please review the data model and API endpoints. Does the `InventoryItem` schema capture all necessary fields for your specific supply chain needs?

## Proposed Changes

### Backend (NestJS)

We will introduce a new `InventoryModule` to manage inventory stock, forecasting, and KPIs.

#### [NEW] `src/modules/inventory/schemas/inventory-item.schema.ts`
- Create an `InventoryItem` schema with the following fields:
  - `sku` (String, unique)
  - `description` (String)
  - `warehouse` (String)
  - `currentQty` (Number)
  - `safetyStock` (Number)
  - `status` (Enum: 'In Stock', 'Low Stock', 'Stockout')
  - `leadTime` (Number)
  - `reorderPoint` (Number)
  - `demandForecast` (Array of Numbers, representing the 30-day forecast sparkline)

#### [NEW] `src/modules/inventory/inventory.module.ts`
- Register Mongoose models and controllers.

#### [NEW] `src/modules/inventory/controllers/inventory.controller.ts`
- `GET /api/v1/inventory`: Fetches paginated inventory with optional `search` filtering by SKU or description.
- `GET /api/v1/inventory/kpis`: Returns summary statistics (Total SKUs, Low Stock Items, Excess Stock Items).
- `POST /api/v1/inventory/:sku/restock`: Mock endpoint to handle the "Initiate Emergency Restock" action.

#### [NEW] `src/modules/inventory/services/inventory.service.ts`
- Core business logic.
- Include a `generateSeedData` method to populate the database with mock entries (e.g., NX-9021, NX-4402) matching the Stitch UI.

---

### Frontend (React + Vite)

#### [NEW] `src/features/inventory/api/inventoryApi.ts`
- Setup RTK Query endpoints (`getInventory`, `getInventoryKpis`, `initiateRestock`).

#### [NEW] `src/features/inventory/pages/InventoryPage.tsx`
- Translate the provided `stitch_inventory_monitoring.html` to a React component.
- Implement state to handle the Right Sidebar "SKU Details" toggling.
- Implement RTK Query hooks to fetch the main table data and KPI summary cards dynamically.
- Implement the "Initiate Emergency Restock" button click with a success toast.

#### [MODIFY] `src/App.tsx`
- Add routing for `<Route path="/inventory" element={<InventoryPage />} />`.

#### [MODIFY] `src/components/layout/Layout.tsx`
- Update the sidebar navigation to ensure the "Inventory" menu item routes to `/inventory` and highlights correctly.

## Verification Plan

### Automated Tests
- Run `yarn test:e2e` after adding a new `inventory.e2e-spec.ts` to assert that:
  - KPI counts aggregate correctly.
  - Pagination and SKU search work on `/inventory`.
  - The restock POST endpoint returns `200 OK`.

### Manual Verification
- Navigate to the Inventory page in the running app.
- Check if KPIs load correctly on the initial render.
- Verify clicking a table row opens the sliding right-hand drawer with SKU details.
- Validate that the layout matches the provided Stitch HTML dark-mode aesthetic seamlessly.
