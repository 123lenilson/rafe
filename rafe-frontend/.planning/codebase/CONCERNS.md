# Codebase Concerns

**Analysis Date:** 2026-05-25

## Tech Debt

**Empty Feature Directories:**
- Issue: Features directories contain only placeholder `.gitkeep` files.
- Files: `src/features/auth/`, `src/features/clients/`, `src/features/dashboard/`, etc.
- Why: Initial bootstrap skeleton was prepared with folders but no page views or operational logic has been written.
- Impact: Attempting to navigate through feature routes results in unresolved page rendering or empty pages.
- Fix approach: Sequentially implement base pages and shared layouts under each feature domain.

**Minimal App Entry Point:**
- Issue: `App.jsx` simply returns a placeholder div instead of utilizing standard layout structure or routing engines.
- Files: `src/App.jsx`
- Why: Temporary structural baseline.
- Impact: Core navigation and standard features cannot be loaded.
- Fix approach: Reconstruct `App.jsx` to render the router configuration and wrap the application inside React Query and Context providers.

## Known Bugs

**Git Workspace Status Inconsistency:**
- Symptoms: A significant number of files (including previously initialized GSD documents) are marked as deleted from the working tree but remain tracked in the git history.
- Trigger: Discrepancy between committed workspace trees and current physical disk directories.
- Workaround: Fresh initialization of GSD files and rebuilding components sequentially.
- Root cause: Selective manual folder deletion in the workspace root.

## Security Considerations

**Unprotected Client Routing:**
- Risk: Route guarding and user session authentication validation have not been implemented.
- Files: `src/router/index.jsx` (currently empty).
- Current mitigation: None.
- Recommendations: Implement a `RouteGuard` component to intercept private routes (e.g. Dashboard, POS, Clients) and verify active authenticated sessions before rendering page contents.

## Performance Bottlenecks

- None active currently since the codebase has negligible running script overhead.

## Fragile Areas

**Routing Architecture Integrity:**
- Files: `src/router/`
- Why fragile: If routes are not mapped out features-first, structural layouts like Sidebars or Topbars might break when loading deep pages (e.g. print layout in invoicing or cart operations in POS).
- Safe modification: Ensure child routing arrays within the Main Layout configuration are explicitly declared.

## Dependencies at Risk

- None identified. Standard React 19 + Vite 8 packages are fully up-to-date.

## Missing Critical Features

**Centralized API Client Interceptor:**
- Problem: No configured base client for backend API communication (e.g., handling server headers, token injections, and auto-timeouts).
- Workaround: Standard raw Axios calls might require manual JWT header inclusion per query.
- Blocks: Unified token injection and session recovery policies.
- Implementation complexity: Low (Create `src/lib/api.js` or `src/lib/axios.js` configuring custom interceptors).

---

*Concerns audit: 2026-05-25*
*Update as issues are fixed or new ones discovered*
