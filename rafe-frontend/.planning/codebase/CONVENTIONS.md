# Conventions Map

**Date**: 2026-05-13

## Code Style
- Maintained via **ESLint**, configured in `eslint.config.js`. Uses standard React, React-Hooks, and React-Refresh plugins.
- **Tailwind CSS** utility classes are heavily favored for styling, managed with Shadcn/ui conventions. The `cn` utility (`clsx` + `tailwind-merge`) from `src/lib/utils.js` is the standard for conditional and merged class names.

## Naming Conventions
- **Components**: `PascalCase.jsx` (e.g., `Button.jsx`, `DashboardLayout.jsx`).
- **Files/Utilities**: `camelCase.js` (e.g., `utils.js`).
- **CSS**: Uses standard Tailwind utility naming, global styles in `index.css`.

## Common Patterns
- **Components**: Functional components using React Hooks.
- **Data Fetching**: Expected to use custom hooks built on top of `@tanstack/react-query` to manage loading, error, and success states systematically.
- **Form Handling**: Expected to use `react-hook-form`.

## Error Handling
- Expected to use robust error handling via React Error Boundaries for UI failures, and `axios` interceptors / `react-query` error states for API failures. Currently in a nascent state.
