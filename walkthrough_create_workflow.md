# Create Workflow Task Walkthrough

## Overview

The "Create Task" overlay has been completely implemented and integrated with the Workflows module! Operators can now seamlessly dispatch new assignments natively through the dashboard.

## What Was Accomplished

### 1. Database & API Extensions
- **Updated Schema**: The `WorkflowTask` schema was modified to accept a `relatedEntityId` to track specific shipments or SKUs.
- **Data Transfer Object**: Introduced `CreateWorkflowDto` for strict data validation when submitting a new task.
- **Creation Logic**: 
  - The `POST /api/v1/workflows` route securely maps incoming requests. 
  - It auto-generates a `NX-XXXX` task ID.
  - Formats a dynamic title (e.g., `Replenishment - SKU-882`).
  - Seamlessly translates the 4-tier UI priority map (Low/Medium/High/Critical) into the backend's 3-tier system without losing data integrity.
  - Captures operator notes and automatically initializes the Audit Trail with a "Task manually created" system log.

### 2. Frontend Realization
- **Modal Component (`CreateTaskModal.tsx`)**: 
  - Fully responsive, glassmorphic overlay built directly from the Stitch reference.
  - Interactive pill buttons for priority selection with pulse animations for 'Critical' tasks.
  - Connected state hooks for all dropdowns, search inputs, dates, and textareas.
  - Fully wired to Redux using `useCreateWorkflowMutation`.
- **Real-Time UI Updates**: 
  - Integrated into `WorkflowsPage.tsx`. When the modal form is submitted successfully, the `workflowsApi` invalidates the local cache and triggers a silent refetch. 
  - The modal automatically dismisses itself, and the brand-new task organically pops into the top of the "Open" tab.

## Manual Verification

- ✅ Click "Create Task" in the top right of the Workflows dashboard.
- ✅ Fill in the details (e.g., set Priority to "High", Category to "Quality Audit", assign an entity ID like "SHP-004").
- ✅ Click the final "Create Task" button.
- ✅ Confirm the modal drops away and your new task appears dynamically rendered in the Open workflows queue, properly colored yellow for High Priority!
