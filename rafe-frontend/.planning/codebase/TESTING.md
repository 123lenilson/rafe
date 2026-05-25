# Testing Patterns

**Analysis Date:** 2026-05-25

## Test Framework

**Current Status:**
- Testing is **not yet configured** in the project's dependencies or scripts.
- No testing runners, libraries, or assertions are active in the initial bootstrap package.

**Target Framework (Planned):**
- **Runner:** Vitest (modern, fast test runner configured natively with Vite).
- **Component Testing:** React Testing Library (`@testing-library/react` and `@testing-library/jest-dom`) for behavioral component testing.
- **E2E Testing:** Playwright (for complete client-to-server transaction flows).

## Test File Organization (Planned)

**Location:**
- Collocated `[filename].test.jsx` or `[filename].test.tsx` files directly alongside the source files they verify under `src/features/` or `src/shared/`.

**Structure:**
```
src/
  features/
    auth/
      hooks/
        useLogin.js
        useLogin.test.js      # Custom hook unit test
      components/
        LoginForm.jsx
        LoginForm.test.jsx    # UI component unit/integration test
```

## Naming Conventions (Planned)

- `*.test.js` / `*.test.jsx` - Standard unit and integration tests.
- `*.spec.js` - Integration specs.

## What and How to Mock

- **External APIs:** Mock Axios server requests or use `msw` (Mock Service Worker) to capture REST requests at the network layer.
- **React Router:** Use `<MemoryRouter>` inside test wrappers to mock navigation and active routes.
- **Global Contexts:** Mock AuthContext or provide a customized `<AuthProvider>` wrapper to test authenticated vs unauthenticated UI states.

---

*Testing analysis: 2026-05-25*
*Update when test frameworks are configured*
