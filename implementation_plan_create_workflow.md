# Workflows - Create Task Implementation Plan

This document outlines the plan to integrate the new "Create Task" modal into the Workflows module based on the provided Stitch HTML design.

## User Review Required

> [!IMPORTANT]
> The original schema only has three priority levels (`Critical Priority`, `High Priority`, `Standard`). The new design includes four (`Low`, `Medium`, `High`, `Critical`). I propose mapping these as follows to avoid breaking the existing schema:
> - `Critical` -> `Critical Priority`
> - `High` -> `High Priority`
> - `Medium` / `Low` -> `Standard`
>
> I will also auto-generate the `taskId` (e.g., `NX-[random]`) and the `title` (`[Task Type] - [Related Entity ID]`) since there is no explicit title field in the modal. Are these mappings acceptable?

## Proposed Changes

### Backend (NestJS)

#### [NEW] `src/modules/workflows/dto/create-workflow.dto.ts`
- Create `CreateWorkflowDto` with fields:
  - `category` (Task Type)
  - `priority` (Mapped to the schema enum)
  - `assignee` (String)
  - `relatedEntityId` (String)
  - `dueAt` (Date string)
  - `notes` (String)

#### [MODIFY] `src/modules/workflows/schemas/workflow-task.schema.ts`
- Add an optional `relatedEntityId: string` field.

#### [MODIFY] `src/modules/workflows/controllers/workflows.controller.ts`
- Add `POST /api/v1/workflows` to accept the DTO and create a new task.

#### [MODIFY] `src/modules/workflows/services/workflows.service.ts`
- Implement `createWorkflow` method that generates a unique `taskId` (e.g. `NX-[random4digits]`), constructs the `title`, maps the inputs, and saves it to MongoDB with status `Open`.

---

### Frontend (React + Vite)

#### [NEW] `src/features/workflows/components/CreateTaskModal.tsx`
- Implement the form overlay (modal) capturing:
  - Task Type (Select dropdown)
  - Priority Level (4 pill buttons for Low, Medium, High, Critical)
  - Assignee (Text input)
  - Related Entity ID (Text input)
  - Due Date (Date picker)
  - Notes & Special Instructions (Textarea)
- Wire the UI to trigger the new mutation on "Create Task".

#### [MODIFY] `src/features/workflows/api/workflowsApi.ts`
- Add `createWorkflow` mutation to the RTK Query endpoints.
- Auto-invalidate the `['Workflows']` tag on success so the list updates instantly.

#### [MODIFY] `src/features/workflows/pages/WorkflowsPage.tsx`
- Add state `isCreateModalOpen`.
- Wire the "Create New Task" button to open the modal.
- Render the `<CreateTaskModal />` overlay when active.

## Verification Plan

### Automated Tests
- Update `test/workflows.e2e-spec.ts` to assert the new `POST /api/v1/workflows` route successfully creates a new task and validates fields.

### Manual Verification
- Click "Create New Task" on the Workflows page.
- Fill out the form, select "High" priority, and set a due date.
- Submit the form and verify the modal closes.
- Confirm the new task immediately appears under the "Open" tab with the correct auto-generated Title and Task ID.
