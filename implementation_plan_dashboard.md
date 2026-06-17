# Dashboard Module Implementation Plan

## Goal Description
Develop the "Dashboard" module for Nexus Logistics. This will serve as the primary landing page after login, providing a high-level, real-time overview of key supply chain metrics. The module will adhere to the premium Nexus Logistics design standards (dark mode, glassmorphism, micro-animations) and will be optimized for performance per the KPI requirements (DASH-01 through DASH-08).

## User Review Required
> [!IMPORTANT]
> Since the direct Stitch API access token/URL isn't currently available to download the exact `6d17ccd6f4674f6b893964a19eff0cc9` HTML payload, I will build the dashboard interface based on the established premium Nexus Logistics design system. Please confirm if you are okay with this, or provide the exact `curl` link for the Stitch HTML file if you have it.

## Open Questions
- **Charts:** Are you comfortable with me installing a charting library like `recharts` for the frontend to visualize trends (e.g., shipments over time), or would you prefer I build custom CSS-based visualizations? (I will plan to use `recharts` for rich, interactive data visualization unless you specify otherwise).

## Proposed Changes

### Backend Implementation
#### [NEW] `src/modules/dashboard/dashboard.module.ts`
- Creates the dedicated module for dashboard aggregations.
#### [NEW] `src/modules/dashboard/services/dashboard.service.ts`
- Implements `getKpis()`.
- Aggregates data across Shipments, Inventory, Workflows, and Reports to calculate high-level metrics.
- Implements the `staleDataWarning` check.
#### [NEW] `src/modules/dashboard/controllers/dashboard.controller.ts`
- Exposes `GET /api/v1/dashboard/kpis`.
#### [MODIFY] `src/app.module.ts`
- Register `DashboardModule`.

### Frontend Implementation
#### [NEW] `src/features/dashboard/api/dashboardApi.ts`
- RTK Query definitions for the `getKpis` query.
#### [NEW] `src/features/dashboard/pages/DashboardPage.tsx`
- A premium overview page.
- Top row: KPI cards (e.g., Active Shipments, Pending Workflows, Low Stock Alerts).
- Middle row: Interactive charts (e.g., Shipment trends) and map visualizations (mocked or integrated).
- Bottom row: Recent activity feed.
- Stale data warning banner (if `staleDataWarning` is true).
#### [MODIFY] `src/store/index.ts`
- Register the `dashboardApi` reducer.
#### [MODIFY] `src/components/layout/Layout.tsx`
- Add the "Dashboard" navigation link (using `dashboard` icon) to the top of the left sidebar menu.
#### [MODIFY] `src/App.tsx`
- Add routing for `/dashboard`.
- Update the default route `/` to redirect to `/dashboard` instead of `/users`.

## Verification Plan
### Automated Tests
- E2E Test ensuring `GET /api/v1/dashboard/kpis` returns aggregated data within the 2,000ms SLA (DASH-01).
### Manual Verification
- Navigate to the Dashboard.
- Verify all KPI cards render correctly with glassmorphic styles.
- Ensure the layout is responsive and interactive.
