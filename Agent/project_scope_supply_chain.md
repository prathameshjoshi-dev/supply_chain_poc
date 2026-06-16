# PROJECT SCOPE DOCUMENT

**Project Name:** Supply Chain Visibility & Logistics Platform
**Version:** 1.0
**Date:** 2026-06-16
**Author:** Senior Product Manager
**Reference Documents:** PRD v1.0, KPI Document v1.0

---

## 1. Goal & Problem Statement

* **The Problem:** Supply chain managers and logistics operators lack real-time, unified visibility into inventory, shipments, warehouses, and workflows, forcing reactive decision-making that causes stockouts, delivery failures, and SLA breaches.
* **The Solution:** A role-based, microservice-backed Supply Chain Visibility & Logistics Platform that consolidates inventory monitoring, shipment tracking, workflow orchestration, AI-assisted querying, and compliance-ready audit reporting into a single web application — enabling proactive, data-driven supply chain operations.

---

## 2. Tech Stack

* **Frontend:** React 19, TypeScript, Redux Toolkit, RTK Query, Tailwind CSS
* **Backend:** NestJS, TypeScript
* **Database:** MongoDB
* **Caching:** Redis
* **Notification:** Firebase FCM
* **AI:** Ollama
* **Security:** JWT, OAuth2, RBAC
* **Deployment:** Docker

---

## 3. Core Features & Acceptance Criteria

| Feature Number | Feature Name | Description | Acceptance Criteria |
| --- | --- | --- | --- |
| F-01 | User Login & JWT Auth | Users authenticate via email/password or SSO; `auth-service` issues JWT access + refresh tokens enforced by `api-gateway` on every downstream call | GIVEN valid credentials, WHEN login is submitted, THEN a JWT access token and refresh token are returned within 300ms (p95) and the event is written to the audit log |
| F-02 | Token Refresh & Session Management | Client silently refreshes expired access tokens using the refresh token without forcing re-login | GIVEN an expired access token, WHEN a protected API is called, THEN a 401 is returned; WHEN the client calls `/auth/refresh` with a valid refresh token, THEN a new access token is issued |
| F-03 | Role-Based Access Control (RBAC) | Every API endpoint enforces role-based permissions (admin, manager, supervisor, viewer); unauthorized callers receive 403 | GIVEN a `viewer` role user, WHEN a write or admin endpoint is called, THEN a 403 Forbidden is returned and no data is mutated |
| F-04 | User CRUD & Role Assignment | Admins can create, update, deactivate, and assign roles/warehouse scopes to users; soft-delete preserves audit history | GIVEN an `admin` user, WHEN a new user is created, THEN the user record is persisted, a welcome notification is dispatched within 60s, and duplicate email is rejected with 409 |
| F-05 | Real-Time Dashboard KPIs | Dashboard displays aggregated KPI tiles: total shipments, on-time rate, stockout count, pending workflows — filterable by warehouse, region, and date range | GIVEN an authenticated user, WHEN the dashboard loads, THEN KPI data renders within 2,000ms (p95) reflecting data ≤ 5 minutes old |
| F-06 | Inventory Visibility | Live inventory grid showing SKU-level quantities per warehouse with safety-stock threshold flags and below-stock highlighting | GIVEN inventory for a SKU drops below safety stock, WHEN the sync job runs, THEN the SKU is flagged in the response with `belowSafetyStock: true` and a replenishment workflow is auto-created within 60s |
| F-07 | Shipment Tracking | Filterable shipment list (status: in_transit, delivered, delayed) with carrier, origin, destination, and ETA; stale-data warning surfaced on feed interruption | GIVEN a carrier API outage, WHEN shipment data is requested, THEN the last-cached state is returned with `staleDataWarning: true` and an admin alert is dispatched |
| F-08 | Workflow Creation & Assignment | Managers create workflows (replenishment, shipment approval, discrepancy resolution) with priority and assignee; system persists them with status `open` | GIVEN a valid workflow payload, WHEN `POST /api/v1/workflows` is called, THEN the workflow is created, the assignee receives an in-app notification within 60s, and the action is audit-logged |
| F-09 | Workflow Status Transitions | Assignees update workflow status (open → in_progress → resolved); managers can escalate; optimistic locking prevents silent concurrent overwrites | GIVEN two users update the same workflow simultaneously, WHEN the second update is submitted, THEN a 409 VERSION_MISMATCH is returned with the current version number |
| F-10 | Workflow Escalation | Escalating a workflow elevates priority and dispatches a notification to the supervisor within 60 seconds | GIVEN a workflow in `open` status, WHEN status is set to `escalated`, THEN supervisor receives a notification within 60s and the priority field is updated |
| F-11 | In-App, Email & SMS Notifications | Event-driven notifications dispatched via Firebase FCM (in-app), email, and SMS for critical events (delays, stockouts, escalations) with user-level channel preferences | GIVEN a triggering event, WHEN the notification is dispatched, THEN delivery occurs within 60s (CRITICAL) or 5min (standard) across all enabled channels with ≥ 99% delivery rate |
| F-12 | Notification Preferences | Users configure per-channel (in-app, email, SMS) and per-event-type (stockout alert, shipment delay) notification preferences | GIVEN a user updates preferences, WHEN the next matching event fires, THEN only the configured channels receive the notification |
| F-13 | Parameterized Report Generation | Users generate shipment performance, inventory snapshot, workflow summary, and audit log reports with date range and filter parameters; output as CSV or PDF | GIVEN a ≤ 90-day date range, WHEN `POST /api/v1/reports/generate` is called, THEN the report is generated and a download URL returned within 30s |
| F-14 | Async Large Report Delivery | Reports exceeding the 30-second sync threshold are queued, generated asynchronously, and delivered to the user via email notification | GIVEN a report request exceeding sync capacity, WHEN submitted, THEN an immediate `queued` response with a `reportId` is returned and the report is delivered via email within 5 minutes |
| F-15 | Scheduled Report Delivery | Admins schedule recurring reports (daily, weekly, monthly) with recipient lists; system auto-generates and emails reports on schedule | GIVEN a configured schedule, WHEN the scheduled time arrives, THEN the report is generated and emailed to all recipients with ≥ 99.5% on-time execution |
| F-16 | Immutable Audit Log | All CREATE, UPDATE, DELETE, and AUTH events are captured as write-once audit log entries with userId, action, entity, and timestamp | GIVEN any CRUD or AUTH action, WHEN the action completes, THEN an immutable audit entry is written — 100% coverage, zero audit gaps, no UPDATE/DELETE permitted on log records |
| F-17 | AI Natural Language Query | Users submit natural language queries (e.g., "Which warehouses are below safety stock this week?"); `ai-service` (Ollama) interprets intent, retrieves data, and returns a structured answer with confidence score | GIVEN a valid NL query, WHEN submitted, THEN a structured answer with confidence score is returned within 3,000ms (p90); invalid queries return a `QUERY_INVALID` response with a helpful suggestion |
| F-18 | AI Anomaly Detection | `ai-service` continuously evaluates supply chain data for anomalies (unusual delays, inventory spikes, demand deviations) and surfaces them with severity levels | GIVEN a known anomaly pattern, WHEN evaluated by the AI service, THEN the anomaly is detected with ≥ 80% precision and ≥ 75% recall on the QA validation set |
| F-19 | AI Demand Forecasting | `ai-service` provides SKU-level demand forecasts over 7-day and 30-day horizons with recommended reorder quantities | GIVEN a SKU and warehouse context, WHEN `GET /api/v1/ai/forecast` is called, THEN forecasted demand and recommended reorder quantity are returned; MAPE ≤ 20% on 30-day back-test |
| F-20 | API Gateway Enforcement | `api-gateway` validates JWT, enforces RBAC, rate-limits requests, and routes to downstream microservices; single entry point for all client requests | GIVEN any request without a valid JWT, WHEN received at the gateway, THEN a 401 is returned before the request reaches any downstream service |

---

## 4. UI/UX Standards

* **Theme & Style:** Dark Mode primary theme with Glassmorphism card components; curated HSL color palette (deep navy base `hsl(222, 47%, 11%)`, accent teal `hsl(183, 74%, 44%)`); status indicators use semantic colors (critical red, warning amber, success green) — no plain browser defaults.
* **Layout:** Desktop-first responsive grid (12-column); sidebar navigation with collapsible module sections; Dashboard uses a widget-based card grid with configurable column spans; all data tables support column sorting, filtering, and pagination.
* **Typography:** Inter or Outfit (Google Fonts); heading scale: H1 28px / H2 22px / H3 18px / body 14px; monospace for IDs, SKUs, and code values.
* **Micro-Animations:** Smooth page transitions (200ms ease); skeleton loaders on all async data fetches; toast notifications slide in from top-right; KPI tiles animate count-up on load; workflow status badges pulse on `CRITICAL` priority.
* **Component Standards:** All interactive elements (buttons, inputs, selects) have unique `data-testid` attributes for QA automation; form validation errors display inline below the offending field; modal dialogs trap focus for accessibility.
* **Data Visualization:** RTK Query for server state; Recharts or Nivo for KPI charts, inventory heatmaps, and shipment maps; skeleton states shown during fetch; `staleDataWarning` surfaced as an amber banner above affected widgets.

---

## 5. Out of Scope

* ERP system direct write-back integration (e.g., SAP, Oracle ERP).
* Financial settlement, invoice processing, and payment reconciliation.
* Carrier rate negotiation engine and freight procurement workflows.
* Native mobile applications (iOS / Android).
* Multi-currency and multi-language localization beyond English (v1.0).
* Customer-facing shipment tracking portal (external, non-authenticated users).
* Warehouse Management System (WMS) physical operations (pick, pack, scan).
* EDI (Electronic Data Interchange) integration with suppliers or 3PLs.
* Custom report builder with drag-and-drop field selection (scheduled for v2.0).
* AI model fine-tuning interface or prompt engineering console for end-users.
