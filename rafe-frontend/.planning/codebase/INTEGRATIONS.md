# External Integrations

**Analysis Date:** 2026-05-25

## APIs & External Services

**Backend API:**
- Rafe Backend API - Primary data provider.
  - SDK/Client: Axios instance (`src/lib/axios.js` or `src/lib/api.js` pattern expected, though currently empty).
  - Auth: JWT (JSON Web Tokens) stored in state/cookies.
  - Endpoints used: Auth (`/auth/*`), Clients (`/clients/*`), Dashboard (`/dashboard/*`), Finances (`/finances/*`), Invoices (`/invoices/*`), Products (`/products/*`), POS (`/pos/*`).

**External APIs:**
- None configured yet.

## Data Storage

**Databases:**
- Relational Database (typically PostgreSQL or MySQL) accessed via the Rafe Backend API. No direct database connection from the frontend.

**File Storage:**
- Managed by backend service. Frontend handles uploads via Multipart Form Data requests to the backend.

**Caching:**
- React Query (TanStack Query) v5 - Client-side state synchronization, query caching, and automatic refetching.

## Authentication & Identity

**Auth Provider:**
- Custom JWT Authentication managed through the Rafe Backend.
  - Implementation: `src/context/AuthContext.jsx` (previously existing, currently to be reconstructed) which manages login, token storage, and session validation.
  - Token storage: LocalStorage or HTTP-only cookies.
  - Session management: Silent token refresh or logout on token expiration.

## Monitoring & Observability

**Error Tracking:**
- None currently configured in the bootstrap setup.

**Logs:**
- Browser console logging in development mode.

## CI/CD & Deployment

**Hosting:**
- Expected hosting: WampServer local environment (configured at `C:\wamp64\www\rafe\rafe-frontend`) for development/staging.
- Production hosting can be Vercel, Netlify, or self-hosted web server (Apache/Nginx) serving static assets.

**CI Pipeline:**
- None currently configured.

## Environment Configuration

**Development:**
- Required env vars:
  - `VITE_API_URL` - Endpoint for the Rafe backend server.
- Secrets location: `.env` or `.env.local` (gitignored).

**Production:**
- Secrets management: Environment variables injected at build time by the hosting platform or server configuration.

## Webhooks & Callbacks

**Incoming:**
- None directly in frontend (webhooks are received by the backend server).

**Outgoing:**
- None.

---

*Integration audit: 2026-05-25*
*Update when adding/removing external services*
