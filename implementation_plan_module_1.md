# Develop Auth Module (auth-service) & Login Screen

This implementation plan outlines the setup of the base frontend and backend repositories inside the `Supply_chain` directory, and the development of the Auth Module as per the PRD, KPIs, Scope, and Node.js/React Personas.

## User Review Required

> [!IMPORTANT]
> - Are you okay with using `vite` to bootstrap the React 19 frontend (`npx create-vite@latest frontend --template react-ts`)?
> - Are you okay with using `@nestjs/cli` to bootstrap the NestJS backend (`npx @nestjs/cli new backend`)?
> - Both projects will be created inside `/Users/apple/Documents/supply_chain_vibe_coding/Supply_chain/`. Please confirm.
> - Will you be providing the MongoDB and Redis URIs via a `.env` file, or should I mock these connections for now?

## Proposed Changes

### Backend (`Supply_chain/backend`)
The backend will be built with NestJS, following the clean architecture defined in `node_js_persona.md`.
- **Initialization:** `npx @nestjs/cli new backend --package-manager npm`
- **Auth Module (`src/modules/auth`):**
  - **Controllers:** `AuthController` (`/api/v1/auth/login`, `/refresh`, `/logout`, `/sso/callback`).
  - **Services:** `AuthService` handling JWT generation and validation, password comparison.
  - **Guards:** `JwtAuthGuard`, `RolesGuard`.
  - **Strategies:** `JwtStrategy`, `LocalStrategy`.
  - **Audit Logging:** Implement middleware/interceptor to log authentication events.

### Frontend (`Supply_chain/frontend`)
The frontend will be built with React 19 + TypeScript + Tailwind CSS, following the `react_js_persona.md`.
- **Initialization:** `npx create-vite@latest frontend --template react-ts`
- **Configuration:** Setup Tailwind CSS, Redux Toolkit, and RTK Query.
- **Auth Feature (`src/features/auth`):**
  - **UI Component:** `LoginPage.tsx` integrating the `Nexus Logistics` HTML and CSS (tailwind config, animations).
  - **API Layer:** RTK Query for `/api/v1/auth/login` and `/api/v1/auth/refresh`.
  - **State:** Redux slice to store `accessToken` and user role.
  - **Routing:** Public and Private route wrappers to enforce authentication.

### Integration Notes
- `api-gateway` behavior will be simulated in the frontend/backend using interceptors and guards.
- The `Login - Nexus Logistics` screen will be translated to functional React components, utilizing `react-hook-form` and `yup` for validation as required by the persona.
- Environment variables will be configured for API base URLs.

## Verification Plan

### Automated Tests
- Backend: Unit tests for `AuthService` (JWT generation, password hashing) and integration tests for `AuthController` (Jest + Supertest).
- Frontend: Unit tests for the Redux Auth slice and component tests using React Testing Library to verify form validation and API calls.

### Manual Verification
- Start the backend server and ensure Swagger docs are accessible.
- Start the frontend server, verify the Nexus Logistics login UI renders correctly with animations.
- Perform a manual login flow to verify JWT token generation, persistence, and invalid credential handling (401 response).
