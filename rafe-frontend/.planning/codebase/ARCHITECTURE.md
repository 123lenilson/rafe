# Architecture

**Analysis Date:** 2026-05-25

## Pattern Overview

**Overall:** Feature-based React Single Page Application (SPA)

**Key Characteristics:**
- **Feature-Based Co-location:** Code is organized by business feature domains (`src/features/auth`, `src/features/pos`, etc.) rather than technical role, keeping routes, components, hooks, and pages close to each other.
- **Component-Driven UI:** UI is decomposed into small, reusable, presentation-only components (`src/shared/components/ui/`) and compound layout blocks.
- **Declarative Server Sync:** Axios client combined with React Query manages caching, mutations, refetching, and error synchronization with the backend API.
- **Centralized Router:** Application navigation structure is defined statically in `src/router/` to enforce route configurations and layout shells.

## Layers

**Router Layer:**
- Purpose: Application entry routing and path parsing.
- Location: `src/router/`
- Contains: Static route mapping (`src/router/index.jsx`), route guards (e.g., auth check), and layout wrappers.
- Depends on: Feature pages and layouts.
- Used by: App root (`src/App.jsx`).

**Feature / Domain Pages Layer:**
- Purpose: Orchestrate feature states and map URLs to specific visual interfaces.
- Location: `src/features/[feature_name]/pages/`
- Contains: Feature entry pages (e.g., `LoginPage.jsx`, `DashboardPage.jsx`, `PosPage.jsx`).
- Depends on: Shared layouts, feature-specific components, custom hooks, and shared UI primitives.
- Used by: Router Layer.

**Feature Components & Hooks Layer:**
- Purpose: Implement the business logic and user actions for a specific domain.
- Location: `src/features/[feature_name]/components/` and `src/features/[feature_name]/hooks/`
- Contains: Contexts, custom forms, query hooks, and domain components.
- Depends on: Shared lib, shared hooks, and shared UI.
- Used by: Feature Pages.

**Shared Layer (Layout, UI, Hooks, Libs):**
- Purpose: Generic, context-free, reusable code across features.
- Location: `src/shared/`, `src/lib/`, `src/context/`
- Contains: Global contexts (`AuthContext.jsx`), standard layout wrappers (`DashboardLayout.jsx`), shared styling tools (`src/lib/utils.ts`), and atom-level UI components (`button.jsx`, `sheet.jsx`).
- Depends on: External libraries and Tailwind utility systems.
- Used by: Feature Layers and Router Layer.

## Data Flow

**Standard Asynchronous Data Flow (Querying & Displaying Data):**

1. A page (e.g., `src/features/products/pages/ProductsPage.jsx`) mounts.
2. The page invokes a domain-specific custom hook (e.g., `useGetProducts()` in `src/features/products/hooks/useGetProducts.js`).
3. The hook launches a React Query `useQuery` containing an Axios call to the backend API (`GET /api/products`).
4. While loading, the component displays a loading skeleton (e.g., from `src/shared/components/ui/skeleton.jsx`).
5. When the Axios call resolves, React Query caches the data and updates state.
6. The component re-renders with the retrieved data, sending it to child presentation components.

**Standard Transactional Action Flow (Submitting Forms / POS Purchase):**

1. User triggers an action (e.g., clicks "Checkout" in POS page).
2. The form validation triggers via `react-hook-form` using predefined rules.
3. If valid, the submission handler invokes a mutation hook (e.g., `useCreateOrder()` utilizing React Query's `useMutation`).
4. The mutation sends a `POST` request using the shared Axios instance (`src/lib/utils.ts` or `src/lib/api.ts`).
5. On success:
   - React Query invalidates related queries (e.g., product stock, financial summaries) triggering automatic refetching.
   - User receives a success toast/notification.
   - Navigation redirect may occur.
6. On error: error handler updates UI states, displays error toast, and preserves user input.

**State Management:**
- **Server State:** Handled globally by React Query (caches API data and prevents redundant network requests).
- **Global UI/Auth State:** Managed using native React Context (`src/context/`).
- **Local Component State:** Managed via `useState`, `useReducer`, or `react-hook-form` state.

## Key Abstractions

**Custom Hooks (Queries/Mutations):**
- Purpose: Encapsulate API communication and React Query settings away from presentation.
- Examples: `src/features/auth/hooks/useLogin.js`, `src/features/pos/hooks/useCart.js`.
- Pattern: Hook-wrapped mutations/queries.

**Layout Shells:**
- Purpose: Encapsulate persistent layout elements (header, sidebar, side panels) and route transitions.
- Examples: `src/shared/components/layout/DashboardLayout/DashboardLayout.jsx`.
- Pattern: Layout wrappers wrapping React Router `Outlet`.

**UI Primitives:**
- Purpose: Reusable, accessible, and style-locked UI components matching the design system.
- Examples: `src/shared/components/ui/button.jsx`, `src/shared/components/ui/dialog.jsx`.
- Pattern: Atomic presentation components (mostly shadcn-configured).

## Entry Points

**HTML Root:**
- Location: `index.html`
- Triggers: Initial browser visit.
- Responsibilities: Define page title, viewport parameters, and load the main application script.

**React Bootstrapper:**
- Location: `src/main.jsx`
- Triggers: Loaded by `index.html`.
- Responsibilities: Render the root React element under StrictMode and load index styles.

**App Root:**
- Location: `src/App.jsx`
- Triggers: Loaded by `src/main.jsx`.
- Responsibilities: Provide global providers (QueryClientProvider, AuthProvider) and declare the top-level Router component.

## Error Handling

**Strategy:** Fail gracefully at the UI layer while keeping the application responsive.

**Patterns:**
- **Axios Interceptors:** Automatic trapping of `401 Unauthorized` responses to clear auth tokens and redirect to `/login`.
- **Form Validation:** In-line feedback using `react-hook-form` before any server request.
- **Error Boundaries:** React Error Boundaries around major layouts (such as Dashboard or POS) to prevent complete page crashes.

## Cross-Cutting Concerns

**Authentication:**
- Custom React context `AuthContext` supplying current authenticated user details and active token state across pages.

**Styling:**
- Consistent design primitives using custom Tailwind CSS utility tokens based on modern oklch color palettes.

**Validation:**
- Pre-submission field validation via React Hook Form.

---

*Architecture analysis: 2026-05-25*
*Update when major patterns change*
