# KPI DOCUMENT

**Project Name:** Supply Chain Visibility & Logistics Platform
**Version:** 1.0
**Date:** 2026-06-16
**Author:** Senior Product Manager

---

## STEP 1 – KPI GENERATION

---

### Module 1: Auth Module (`auth-service`)

| KPI Number | KPI Name | Description | Criteria |
| --- | --- | --- | --- |
| AUTH-01 | Login Success Rate | Percentage of valid credential login attempts that result in a successful JWT issuance | ≥ 99.5% success rate in production |
| AUTH-02 | Login Response Latency | Time from `POST /api/v1/auth/login` request receipt to JWT response delivery | p95 ≤ 300ms under normal load |
| AUTH-03 | Token Refresh Success Rate | Percentage of valid refresh token requests that succeed without forcing re-login | ≥ 99.8% success rate |
| AUTH-04 | SSO Callback Success Rate | Percentage of SSO provider callbacks that result in a valid platform session | ≥ 99% for each configured SSO provider |
| AUTH-05 | Unauthorized Access Block Rate | Percentage of requests with invalid/expired tokens correctly rejected with 401 | 100% — zero unauthorized access allowed |
| AUTH-06 | Session Termination Accuracy | Percentage of logout calls that correctly invalidate the refresh token and terminate the session | 100% — no ghost sessions |
| AUTH-07 | Auth Event Audit Coverage | Percentage of login, logout, token refresh, and SSO events captured in the audit log | 100% — all auth events must be logged |
| AUTH-08 | Brute-Force Detection Rate | Percentage of accounts with ≥ 5 failed logins within 10 minutes that trigger a lockout or CAPTCHA | 100% of qualifying accounts locked/challenged |
| AUTH-09 | Multi-Factor Authentication (MFA) Adoption | Percentage of admin and manager accounts with MFA enabled (future gate) | Target ≥ 80% at v1.1 rollout |

---

### Module 2: User Management Module (`core-business-service`)

| KPI Number | KPI Name | Description | Criteria |
| --- | --- | --- | --- |
| USR-01 | User Creation Success Rate | Percentage of `POST /api/v1/users` calls with valid payloads that result in a newly created user | ≥ 99.9% success for valid requests |
| USR-02 | Duplicate Email Rejection Rate | Percentage of duplicate-email registration attempts correctly rejected with 409 Conflict | 100% — no duplicate accounts created |
| USR-03 | Role Assignment Accuracy | Percentage of `PUT /api/v1/users/:id/role` calls that correctly persist the new role and permissions | 100% — zero role misassignment |
| USR-04 | User Deactivation Integrity | Percentage of `DELETE /api/v1/users/:id` operations that disable access without deleting audit history | 100% — soft delete enforced |
| USR-05 | Welcome Notification Dispatch Rate | Percentage of newly created users who receive a welcome notification within 60 seconds of account creation | ≥ 99% dispatch rate |
| USR-06 | User Listing Response Latency | Time for `GET /api/v1/users` to return a paginated user list | p95 ≤ 400ms for datasets up to 10,000 users |
| USR-07 | RBAC Enforcement Rate | Percentage of role-restricted API calls that are correctly permitted or denied based on the caller's role | 100% — zero RBAC bypass |
| USR-08 | Organizational Hierarchy Accuracy | Percentage of users whose warehouse assignments and reporting lines are correctly stored and retrievable | 100% data integrity |

---

### Module 3: Dashboard Module (`core-business-service`)

| KPI Number | KPI Name | Description | Criteria |
| --- | --- | --- | --- |
| DASH-01 | Dashboard KPI Load Time | Time for `GET /api/v1/dashboard/kpis` to return a fully aggregated KPI payload | p95 ≤ 2,000ms for up to 100K shipment records |
| DASH-02 | Data Freshness | Maximum age of data displayed on the Dashboard KPI tiles | ≤ 5 minutes from source event to display |
| DASH-03 | Inventory Endpoint Latency | Time for `GET /api/v1/inventory` to return filtered results | p95 ≤ 500ms |
| DASH-04 | Shipment Feed Latency | Time for `GET /api/v1/shipments` to return filtered shipment records | p95 ≤ 500ms |
| DASH-05 | Widget Filter Accuracy | Percentage of filter combinations (warehouse, region, date range) that return correctly scoped results | 100% — zero data bleed across filters |
| DASH-06 | Stale Data Warning Accuracy | Percentage of cases where the carrier feed is interrupted that correctly surface `staleDataWarning: true` in the response | 100% — no silent stale data |
| DASH-07 | Concurrent User Dashboard Stability | Dashboard remains responsive with correct data under concurrent access by ≥ 50 simultaneous users | Zero degradation in correctness; p95 latency ≤ 3,000ms |
| DASH-08 | Safety Stock Alert Accuracy | Percentage of SKU-warehouse combinations below safety stock threshold that are correctly flagged in the inventory endpoint | 100% — zero missed stockout flags |

---

### Module 4: Workflow Management Module (`core-business-service`)

| KPI Number | KPI Name | Description | Criteria |
| --- | --- | --- | --- |
| WF-01 | Workflow Creation Success Rate | Percentage of valid `POST /api/v1/workflows` calls that result in a workflow created with status `open` | ≥ 99.9% |
| WF-02 | Workflow Assignment Notification Rate | Percentage of newly created workflows where the assignee receives an in-app notification within 60 seconds | ≥ 99% |
| WF-03 | Status Transition Accuracy | Percentage of `PATCH /api/v1/workflows/:id/status` calls that correctly persist the new status | 100% |
| WF-04 | Escalation Trigger Rate | Percentage of workflows marked `escalated` that result in a supervisor notification within 60 seconds | ≥ 99% |
| WF-05 | Optimistic Lock Conflict Rate | Percentage of concurrent update conflicts correctly returned as `409 VERSION_MISMATCH` without data corruption | 100% — no silent overwrites |
| WF-06 | Auto-Workflow Creation on Stockout | Percentage of safety-stock breach events that auto-generate a `replenishment` workflow within 60 seconds | 100% |
| WF-07 | Workflow Audit Log Coverage | Percentage of workflow CREATE, UPDATE (status change), and ESCALATE actions captured in the audit log | 100% |
| WF-08 | Workflow List Latency | Time for `GET /api/v1/workflows` (filtered) to return results | p95 ≤ 400ms |
| WF-09 | Priority Assignment Accuracy | Percentage of workflows where the `priority` field is correctly stored, filtered, and displayed | 100% |

---

### Module 5: Notification Module (`notification-service`)

| KPI Number | KPI Name | Description | Criteria |
| --- | --- | --- | --- |
| NOTIF-01 | Notification Delivery Rate | Percentage of triggered notifications successfully delivered across all configured channels (email, SMS, in-app) | ≥ 99% end-to-end delivery |
| NOTIF-02 | Notification Delivery Latency | Time from triggering event to notification receipt on the user's channel | ≤ 60 seconds for CRITICAL; ≤ 5 minutes for standard |
| NOTIF-03 | In-App Notification Read Accuracy | Percentage of `PATCH /api/v1/notifications/:id/read` calls that correctly mark notifications as read | 100% |
| NOTIF-04 | Preference Persistence Accuracy | Percentage of `PUT /api/v1/notifications/preferences` calls that correctly persist channel and threshold settings | 100% |
| NOTIF-05 | Channel Failover Rate | Percentage of failed primary-channel deliveries (e.g., email 5xx) that are retried with exponential backoff and logged to dead-letter queue after exhaustion | 100% of failures handled without silent drop |
| NOTIF-06 | Retry Exhaustion Alert Rate | Percentage of notifications that exhaust all 3 retries and trigger a platform admin alert | 100% — no silent dead-letter entries |
| NOTIF-07 | Duplicate Notification Prevention | Percentage of idempotent events that result in exactly one notification (no duplicate dispatch) | 100% — zero duplicates |
| NOTIF-08 | Notification Volume Scalability | System sustains notification throughput under peak load (e.g., mass stockout event) | ≥ 500 notifications/minute without queue backup > 30 seconds |

---

### Module 6: Reporting & Audit Module (`reporting-service`)

| KPI Number | KPI Name | Description | Criteria |
| --- | --- | --- | --- |
| RPT-01 | Standard Report Generation SLA | Time to generate and return a download URL for reports covering ≤ 90-day date ranges | ≤ 30 seconds for 95% of requests |
| RPT-02 | Large Report Async Delivery SLA | Time from request to email delivery for reports exceeding the 30-second sync threshold | ≤ 5 minutes for 95% of large reports |
| RPT-03 | Report Accuracy | Percentage of generated reports whose aggregated figures match source-of-truth data within accepted tolerance | 100% — zero data discrepancy |
| RPT-04 | Report Format Integrity | Percentage of CSV and PDF exports that are correctly formatted, parseable, and complete | 100% |
| RPT-05 | Scheduled Report Execution Rate | Percentage of scheduled reports that execute at the correct scheduled time and are delivered to all listed recipients | ≥ 99.5% on-time execution |
| RPT-06 | Audit Log Completeness | Percentage of CREATE, UPDATE, DELETE, and AUTH events that have a corresponding immutable audit log entry | 100% — zero audit gaps |
| RPT-07 | Audit Log Immutability | Percentage of audit log entries that are confirmed write-once (no UPDATE/DELETE permitted on the log table) | 100% — enforced at DB constraint level |
| RPT-08 | Audit Log Query Latency | Time for `GET /api/v1/audit-logs` (filtered, ≤ 90 days) to return results | p95 ≤ 500ms |
| RPT-09 | Report Download URL Validity | Percentage of generated report download URLs that are accessible and non-expired within the stated `expiresAt` window | 100% |
| RPT-10 | Concurrent Report Generation Stability | System handles ≥ 10 simultaneous standard report requests without timeout or data corruption | Zero failures; all reports complete within SLA |

---

### Module 7: AI Assistant Module (`ai-service`)

| KPI Number | KPI Name | Description | Criteria |
| --- | --- | --- | --- |
| AI-01 | Query Response Latency | Time from `POST /api/v1/ai/query` submission to structured answer delivery | p90 ≤ 3,000ms |
| AI-02 | Invalid Query Rejection Rate | Percentage of blank or structurally invalid queries correctly returned as `QUERY_INVALID` with a helpful suggestion | 100% |
| AI-03 | Anomaly Detection Precision | Percentage of AI-flagged anomalies that are confirmed as genuine operational issues upon manual review (QA validation set) | ≥ 80% precision on labelled test set |
| AI-04 | Anomaly Detection Recall | Percentage of known anomalies in the QA validation set that are successfully detected by the AI | ≥ 75% recall on labelled test set |
| AI-05 | Demand Forecast Accuracy | Mean Absolute Percentage Error (MAPE) of AI-generated demand forecasts compared to actual demand over a 30-day horizon | MAPE ≤ 20% on historical back-test |
| AI-06 | Confidence Score Provision Rate | Percentage of AI query responses that include a `confidence` score in the response payload | 100% |
| AI-07 | Context-Aware Response Accuracy | Percentage of queries submitted with a `warehouseId` and `dateRange` context that return results scoped correctly to that context | ≥ 95% context fidelity |
| AI-08 | AI Service Availability | Uptime of `ai-service` during business hours | ≥ 99.5% |
| AI-09 | Unsupported Query Graceful Degradation | Percentage of out-of-scope queries that return a meaningful fallback message rather than a 500 error | 100% |

---

## STEP 2 – IMPLEMENTATION ROADMAP

### Development Timeline

| Sprint | Focus Area | Deliverables |
| --- | --- | --- |
| Sprint 1 (Weeks 1–2) | Foundation & Auth | `auth-service` login, logout, JWT issuance/validation, SSO callback; `api-gateway` token enforcement; RBAC middleware skeleton; Auth audit logging |
| Sprint 2 (Weeks 3–4) | User Management | User CRUD endpoints (`GET`, `POST`, `PUT`, `DELETE`); role/permission assignment; welcome notification trigger; duplicate email validation; soft-delete logic |
| Sprint 3 (Weeks 5–6) | Core Data & Dashboard | Inventory, shipment, and warehouse data models; `GET /api/v1/dashboard/kpis`; `GET /api/v1/inventory`; `GET /api/v1/shipments`; stale-data flag logic; safety-stock threshold evaluation |
| Sprint 4 (Weeks 7–8) | Workflow Management | Workflow CRUD; status transition engine; optimistic locking; auto-workflow creation on stockout; escalation trigger; workflow audit logging |
| Sprint 5 (Weeks 9–10) | Notifications | `notification-service` event listener; in-app, email, SMS dispatch adapters; retry with exponential backoff; dead-letter queue; notification preferences API |
| Sprint 6 (Weeks 11–12) | Reporting & Audit | `reporting-service` report generation (sync + async); CSV/PDF export; scheduled report engine; `GET /api/v1/audit-logs`; immutable audit log enforcement |
| Sprint 7 (Weeks 13–14) | AI Assistant | `ai-service` NLP query pipeline; anomaly detection model integration; demand forecasting endpoint; confidence scoring; graceful degradation for invalid/OOS queries |
| Sprint 8 (Weeks 15–16) | Integration, QA & Hardening | End-to-end integration testing; load testing against KPI targets; security penetration testing; RBAC boundary validation; UAT environment preparation |
| Sprint 9 (Weeks 17–18) | UAT & Go-Live Prep | UAT execution with client stakeholders; defect triage and resolution; production environment setup; runbook and go-live checklist sign-off |

---

### Success Criteria

| Category | Success Metric | Target |
| --- | --- | --- |
| **Security** | Unauthorized access block rate (invalid/expired tokens) | 100% — zero bypass |
| **Security** | RBAC enforcement across all protected endpoints | 100% |
| **Security** | Auth events captured in immutable audit log | 100% |
| **Performance** | Dashboard KPI load time (p95, 100K records) | ≤ 2,000ms |
| **Performance** | API GET endpoint latency (p95, all modules) | ≤ 500ms |
| **Performance** | AI query response time (p90) | ≤ 3,000ms |
| **Reliability** | Platform uptime (api-gateway, auth, core-business) | ≥ 99.9% |
| **Reliability** | Notification delivery rate (all channels) | ≥ 99% |
| **Reliability** | Scheduled report on-time execution | ≥ 99.5% |
| **Data Integrity** | Audit log completeness (all CRUD + AUTH events) | 100% |
| **Data Integrity** | Report data accuracy vs. source of truth | 100% — zero discrepancy |
| **Data Integrity** | Workflow optimistic lock — no silent overwrite | 100% |
| **Operational** | Stockout-to-replenishment workflow auto-creation latency | ≤ 60 seconds |
| **Operational** | Standard report generation SLA | ≤ 30 seconds (≤ 90-day range) |
| **Operational** | Large report async delivery SLA | ≤ 5 minutes |
| **AI Quality** | Anomaly detection precision | ≥ 80% on QA validation set |
| **AI Quality** | Demand forecast MAPE (30-day horizon) | ≤ 20% on back-test |
| **Compliance** | Duplicate notification prevention (idempotency) | 100% — zero duplicates |
| **Compliance** | Audit log immutability (write-once enforced) | 100% — DB constraint level |
| **Scalability** | Concurrent dashboard users without degradation | ≥ 50 users; p95 ≤ 3,000ms |
