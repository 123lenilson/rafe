# Coding Conventions

**Analysis Date:** 2026-05-25

## Naming Patterns

**Files:**
- PascalCase for React components and pages (`LoginPage.jsx`, `DashboardLayout.jsx`, `ClientsPage.jsx`).
- kebab-case for directories, hooks, utilities, config files (`eslint.config.js`, `tailwind.config.js`, `use-mobile.js`).
- `.gitkeep` inside empty directories to ensure they are tracked.

**Functions:**
- camelCase for all function names (`fetchData`, `handleCheckout`).
- `useHookName` for custom React hooks (`useCart`, `useAuth`).
- `handleEventName` for UI event handler callbacks (`handleClick`, `handleSubmit`).

**Variables:**
- camelCase for standard variables and React state.
- UPPER_SNAKE_CASE for constants or static parameters (`API_BASE_URL`, `OKLCH_PRIMARY_THEME`).

**Types (TypeScript Ready):**
- PascalCase for interfaces and type definitions (`User`, `ProductItem`).
- No `I` prefix for interfaces (`Client`, not `IClient`).

## Code Style

**Formatting:**
- Vite + ES6 standard rules.
- 2-space indentation.
- Single or double quotes (standardized using ESLint rules).
- Semicolons are omitted or optional (React 19 standard style).

**Linting:**
- ESLint v10 configured via `eslint.config.js` in root.
- Extends standard React hooks and refresh recommendation plugins.
- Command: `npm run lint`.

## Import Organization

**Order:**
1. React core libraries (`react`, `react-dom`, React hooks).
2. Third-party packages (`react-router-dom`, `lucide-react`, `@tanstack/react-query`).
3. Core features and contexts (`src/context/`, `src/features/`).
4. Reusable shared UI/components (`src/shared/components/ui/`, `src/shared/components/layout/`).
5. Styling assets and helper utilities (`src/index.css`, `src/lib/utils`).

**Grouping:**
- Keep clear blank line separation between third-party imports and local component imports.
- Alphabetical ordering within each grouping is highly recommended.

## Error Handling

**Patterns:**
- Use declarative query state management (`isError`, `error` object returned from React Query) rather than complex manual try/catch for rendering API states.
- For transactional requests (mutations, login), wrap Axios async calls inside `try/catch` block within custom hooks or handlers.
- Axios automatic interceptors trap `401 Unauthorized` errors and automatically route requests back to the login page.

**UI Notifications:**
- User-facing error messages must be human-readable, specific, and clear.
- Validation errors are presented inline below form input fields via `react-hook-form`.

## JSDoc & Comments

**JSDoc:**
- Recommended for core shared hooks and utilities in `src/lib/` or `src/shared/hooks/`.
- Provide parameters (`@param`) and return types (`@returns`).

**When to Comment:**
- Focus on documenting **why** code was written in a specific way rather than **what** the line does.
- Obvious code blocks (e.g. `const [open, setOpen] = useState(false)`) should NOT have comments.

---

*Convention analysis: 2026-05-25*
*Update when patterns change*
