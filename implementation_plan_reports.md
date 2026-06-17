# Reporting Module Implementation Plan

This document details the plan to build the "Reports & Analytics" module based on the provided Stitch HTML design.

## User Review Required

> [!IMPORTANT]
> The design includes several mock features such as KPI cards, a form to generate reports, a scheduled reports table, and a recent downloads list. Should we implement these with static mock data for the MVP to match the UI perfectly, or should we attempt to connect them to live data from other modules (Shipments, Inventory, Workflows, Audit Logs)? I will use mock data for the MVP to ensure immediate matching with the design, unless you prefer otherwise.

## Proposed Changes

### Backend (NestJS)

We will introduce a `ReportsModule` to manage reports, scheduled reports, and downloads.

#### [NEW] `src/modules/reports/schemas/report.schema.ts`
Create schemas for `ScheduledReport` and `ReportDownload`.
- `ScheduledReport`: name, frequency, nextRun, recipients, status.
- `ReportDownload`: name, type, generatedAt, size.

#### [NEW] `src/modules/reports/reports.module.ts`
Register the module, controller, and service.

#### [NEW] `src/modules/reports/controllers/reports.controller.ts`
- `GET /api/v1/reports/scheduled`: Fetch scheduled reports.
- `GET /api/v1/reports/downloads`: Fetch recent downloads.
- `POST /api/v1/reports/generate`: Simulate generating a report based on the form inputs.

#### [NEW] `src/modules/reports/services/reports.service.ts`
Implement business logic and include a seeder method to mock data (Scheduled reports: 'Weekly Logistics Performance', 'Inventory Low-Stock Alert', etc. Downloads: 'Q3_North_America_Logistics.pdf', etc.) exactly matching the Stitch design.

---

### Frontend (React + Vite)

#### [NEW] `src/features/reports/api/reportsApi.ts`
RTK Query endpoints (`getScheduledReports`, `getRecentDownloads`, `generateReport`).

#### [NEW] `src/features/reports/pages/ReportsPage.tsx`
- Implement the dashboard layout.
- Create KPI Cards (Shipment Performance, Inventory Snapshot, Workflow Summary, Audit Log).
- Implement the "Generate Report" form (Date Range, Warehouse multiselect, Export Format).
- Render the "Scheduled Reports" table using data from the API.
- Render the "Recent Downloads" section using data from the API.

#### [MODIFY] `src/App.tsx`
- Add routing for `<Route path="/reports" element={<ReportsPage />} />`.

#### [MODIFY] `src/components/layout/Layout.tsx`
- Ensure the "Reporting" navigation link points to `/reports` and uses active state styling.

## Verification Plan

### Automated Tests
- Create `test/reports.e2e-spec.ts` to assert GET routing for scheduled reports and downloads.

### Manual Verification
- Navigate to the "Reporting" section.
- Review the layout, verifying that KPI cards match the design.
- Interact with the "Generate Report" form and verify that clicking the submit button triggers the simulation animation and logs success.
- Ensure the Scheduled Reports table and Recent Downloads list render the mock data successfully from the backend.
