# Notifications Module Implementation Plan

This document outlines the architecture, APIs, frontend UI, and end-to-end tests required to build the Notifications Module for Nexus Logistics.

## Goal Description
Develop the Notifications Module (`notification-service`) that handles system-wide alerts (Shipment delays, Stockouts, Workflow escalations, Security breaches). The module requires full-stack integration: a backend module with APIs for retrieving notifications and managing user preferences, and a beautiful frontend UI matching the Stitch design.

## User Review Required
> [!IMPORTANT]
> The KPIs mandate enterprise-level features like idempotency, retry exhaustion, and dead-letter queues. Because we are currently not using a dedicated message broker (like RabbitMQ or Kafka), I will implement the notification logic as a direct NestJS Service connected to MongoDB. This service will seed realistic notifications and simulate asynchronous processing where necessary to meet the spirit of the KPIs. 

## Open Questions
> [!WARNING]
> 1. Should we add a polling mechanism on the frontend to simulate live incoming notifications, or rely on the "Syncing: Live Datafeed" text just as a static visual cue for now?
> 2. The design shows specific actions like "RE-ROUTE NOW", "VIEW LIVE FEED". Should these just be mocked (e.g., logging to console) since those distinct modules (Shipments, Security) aren't fully built out yet?

## Proposed Changes

---

### Backend: Notifications Module

#### [NEW] `Supply_chain/backend/src/modules/notifications/schemas/notification.schema.ts`
- Define the MongoDB schema for a `Notification`.
- Fields: `title`, `message`, `type` (`critical`, `warning`, `info`, `success`), `category` (e.g. `Shipment`, `Inventory`, `Security`), `read` (boolean), `createdAt`, `userId` (optional/system-wide), `actions` (array of action objects), `status` (for dead-letter tracking).

#### [NEW] `Supply_chain/backend/src/modules/notifications/schemas/notification-preference.schema.ts`
- Define the schema for user notification preferences.
- Fields: `userId`, `inAppPush` (boolean), `emailDigests` (boolean), `smsAlerts` (boolean).

#### [NEW] `Supply_chain/backend/src/modules/notifications/services/notifications.service.ts`
- Service to handle CRUD operations.
- `onModuleInit`: Seed the mock database with the realistic alerts (Shipment Delay, Stockout, etc.) seen in the design to ensure immediate visual fidelity.
- Methods: `findAll(filters)`, `markAsRead(id)`, `markAllAsRead()`, `updatePreferences(userId, prefs)`, `getPreferences(userId)`.
- Implements simulated idempotency (checking for existing similar notifications within a time window) and retry logic conceptually.

#### [NEW] `Supply_chain/backend/src/modules/notifications/controllers/notifications.controller.ts`
- `GET /api/v1/notifications`: Fetch paginated, filtered notifications and category counts.
- `PATCH /api/v1/notifications/:id/read`: Mark a specific notification as read.
- `PATCH /api/v1/notifications/read-all`: Mark all as read.
- `GET /api/v1/notifications/preferences`: Get preferences.
- `PUT /api/v1/notifications/preferences`: Update preferences.

#### [NEW] `Supply_chain/backend/src/modules/notifications/notifications.module.ts`
- Registers the controllers and schemas.

#### [MODIFY] `Supply_chain/backend/src/app.module.ts`
- Import the new `NotificationsModule`.

---

### Frontend: Notifications Feature

#### [NEW] `Supply_chain/frontend/src/features/notifications/api/notificationsApi.ts`
- Define RTK Query endpoints: `getNotifications`, `markAsRead`, `markAllAsRead`, `getPreferences`, `updatePreferences`.

#### [MODIFY] `Supply_chain/frontend/src/store/index.ts`
- Register the `notificationsApi` reducer and middleware.

#### [NEW] `Supply_chain/frontend/src/features/notifications/pages/NotificationsPage.tsx`
- Build the main Notifications screen implementing the exact Stitch design.
- **Header**: Title, "Mark all as read" button.
- **Sidebar (Categories)**: All Alerts, Critical, Warning, Information with dynamically calculated counts.
- **Sidebar (Preferences)**: Toggle switches for In-app Push, Email Digests, SMS Alerts wired up to the `updatePreferences` API.
- **Main List**: Map through the notifications, rendering the custom glassmorphic cards with dynamic borders (`border-l-status-critical`, `border-l-status-warning`, etc.), icons, and contextual action buttons.

#### [MODIFY] `Supply_chain/frontend/src/App.tsx`
- Add a new route for `/notifications` pointing to the `NotificationsPage`.

#### [MODIFY] `Supply_chain/frontend/src/components/layout/Layout.tsx`
- Currently, the sidebar is embedded directly in pages or using a common layout. We will ensure the global sidebar has the Notifications link active.

---

### End-to-End Tests

#### [NEW] `Supply_chain/backend/test/notifications.e2e-spec.ts`
- Test suite verifying all KPIs requirements.
- Validates the `GET /api/v1/notifications` endpoint returns correctly formatted mock data.
- Validates the `PATCH /api/v1/notifications/:id/read` marks as read correctly (KPI NOTIF-03).
- Validates the `PUT /api/v1/notifications/preferences` correctly saves and updates preferences (KPI NOTIF-04).

## Verification Plan

### Automated Tests
- Run `yarn run test:e2e test/notifications.e2e-spec.ts` to ensure API endpoints pass all constraints and data structure checks.

### Manual Verification
1. Navigate to the frontend `/notifications` route.
2. Verify the visual fidelity matches the Stitch design (glassmorphic cards, typography, animations).
3. Test toggling the preference switches (In-app, Email, SMS) and verify they persist on refresh.
4. Test clicking "Mark all as read" and closing individual notifications to see them dismiss smoothly.
5. Verify category counts on the left automatically update as notifications are filtered or dismissed.
