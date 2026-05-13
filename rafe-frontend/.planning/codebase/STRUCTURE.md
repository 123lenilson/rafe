# Structure Map

**Date**: 2026-05-13

## Directory Layout

### Root Level
- `package.json` / `package-lock.json`: Dependency management.
- `vite.config.js`: Build tool configuration.
- `jsconfig.json`: Path aliases and JS configuration.
- `eslint.config.js`: Linting rules.
- `components.json`: Shadcn UI configuration.
- `index.html`: App entry point.

### `src/` (Application Source)
- `assets/`: Static assets (images, icons, etc.).
- `context/`: React Context providers for global state.
- `features/`: Domain-driven feature modules.
  - `auth/`: Authentication logic and views.
  - `clients/`: Client management.
  - `dashboard/`: Main dashboard views.
  - `finances/`: Financial tracking modules.
  - `invoicing/`: Invoice creation and management.
  - `pos/`: Point of Sale interface.
  - `products/`: Product catalog management.
  - `settings/`: Application settings.
  - `users/`: User management.
- `lib/`: Utility libraries and configurations (e.g., `utils.js` with `cn` function).
- `router/`: Routing definitions and configuration.
- `shared/`: Reusable, cross-feature code.
  - `components/guards/`: Route guards (auth, permissions).
  - `components/layout/`: Layout components (Sidebar, TopBar, DashboardLayout).
  - `components/ui/`: Base UI components (Shadcn).
  - `hooks/`: Reusable custom React hooks.
- `App.jsx`: Root component.
- `main.jsx`: Application bootstrap.
- `index.css`: Global styles and Tailwind/Shadcn variables.

## Naming Conventions
- React components use `PascalCase` (e.g., `App.jsx`, `Sidebar.jsx`).
- Utility files and hooks use `camelCase` (e.g., `utils.js`).
- CSS files use `kebab-case` or `PascalCase` depending on scope, but globally `index.css` is standard.
- Path aliases: `@/` resolves to `./src/`.
