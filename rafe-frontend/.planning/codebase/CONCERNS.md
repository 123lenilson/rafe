# Concerns Map

**Date**: 2026-05-13

## Technical Debt
- **Testing**: No testing infrastructure is present. This could lead to regression bugs as the application grows. Should be addressed early if TDD/BDD is desired.
- **State Management Architecture**: While `react-query` is present for server state, the strategy for complex client-side state (if Context becomes insufficient) is not yet defined (e.g., Zustand, Redux).

## Known Issues
- The application is a fresh scaffolding; no known runtime issues exist.
- The default Vite/React starter template code (`App.jsx` with the counter) is still present and needs to be cleaned up and replaced with the actual application routing and layout.

## Fragile Areas
- None identified yet as core features are not yet implemented.
- **Integration Risk**: Strict typing or contract testing with the backend API is not currently enforced (TypeScript is not used, pure JS is used). This makes API integration slightly more prone to runtime errors if backend contracts change.

## Security
- Authentication mechanisms and token storage strategies (e.g., HTTP-only cookies vs localStorage) need to be carefully designed and implemented.
- Route protection (`src/shared/components/guards/`) must be rigorously implemented.
