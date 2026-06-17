# Workflows Module Implementation Plan

This document outlines the end-to-end plan to integrate the new "Operational Workflows" module based on the provided Stitch HTML design.

## User Review Required

> [!IMPORTANT]
> Please review the `WorkflowTask` schema and the proposed APIs. Does this cover the necessary workflow capabilities (Escalation, Pause, Complete, and Notes) for Nexus Logistics?

## Proposed Changes

### Backend (NestJS)

We will introduce a `WorkflowsModule` to manage task orchestrations.

#### [NEW] `src/modules/workflows/schemas/workflow-task.schema.ts`
Create a `WorkflowTask` schema with fields:
- `taskId`: String (Unique)
- `priority`: Enum ('Critical Priority', 'High Priority', 'Standard')
- `title`: String
- `dueAt`: Date
- `category`: String (e.g., 'Replenishment', 'Approval', 'Optimization')
- `assignees`: Array of Strings (Names)
- `status`: Enum ('Open', 'In-Progress', 'Resolved', 'Escalated')
- `summary`: String
- `progress`: Number (0-100)
- `auditTrail`: Array of objects (`{ timestamp: Date, user: String, message: String, isCritical: Boolean }`)
- `notes`: String

#### [NEW] `src/modules/workflows/workflows.module.ts`
Register the models, controllers, and services.

#### [NEW] `src/modules/workflows/controllers/workflows.controller.ts`
- `GET /api/v1/workflows`: Fetch workflows, filterable by `status`.
- `POST /api/v1/workflows/:taskId/escalate`: Updates status to 'Escalated'.
- `POST /api/v1/workflows/:taskId/pause`: Updates status to 'In-Progress' (or paused state).
- `POST /api/v1/workflows/:taskId/complete`: Updates status to 'Resolved'.
- `PATCH /api/v1/workflows/:taskId/notes`: Updates the operator notes.

#### [NEW] `src/modules/workflows/services/workflows.service.ts`
Implement business logic and include a seeder method to mock data (like `NX-9042`, `NX-8831`, `NX-7215`) exactly matching the Stitch design.

---

### Frontend (React + Vite)

#### [NEW] `src/features/workflows/api/workflowsApi.ts`
RTK Query endpoints (`getWorkflows`, `escalateWorkflow`, `completeWorkflow`, `pauseWorkflow`, `updateNotes`).

#### [NEW] `src/features/workflows/pages/WorkflowsPage.tsx`
- Implement the dashboard with status tabs (Open, In-Progress, Resolved, Escalated).
- Render task cards dynamically based on the active tab filter.
- Implement the detailed sidebar when a task is selected, featuring the Incident Summary, Progress Bar, Audit Trail timeline, and Operator Notes input.
- Wire up the action buttons (Escalate to Supervisor, Pause, Complete) to mutate the backend and automatically update the UI.

#### [MODIFY] `src/App.tsx`
- Update the `/workflows` route from the placeholder to `<WorkflowsPage />`.

#### [MODIFY] `src/components/layout/Layout.tsx`
- Ensure the "Workflows" tab actively routes to `/workflows` and applies the active state styling.

## Verification Plan

### Automated Tests
- Create `test/workflows.e2e-spec.ts` to assert GET routing and POST mutations (like completing a task).

### Manual Verification
- Navigate to the "Workflows" section.
- Click a task card to open the sidebar.
- Type in the "Operator Notes" section and verify it persists (or mock-persists).
- Click "Complete" and verify the task moves to the "Resolved" tab.
