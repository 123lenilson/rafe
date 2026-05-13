# Architecture Map

**Date**: 2026-05-13

## Architectural Pattern
- **Single Page Application (SPA)**: Built with React and Vite.
- **Feature-Sliced Design (FSD) Inspired**: The codebase separates concerns by domains/features rather than exclusively by technical roles. This is evident from the `src/features/` directory containing domains like `auth`, `pos`, `invoicing`, etc.

## Core Layers
- **Features (`src/features/`)**: Contains domain-specific business logic, components, and views. Examples: `auth`, `dashboard`, `invoicing`, `pos`, `products`, `clients`, `finances`, `users`, `settings`.
- **Shared/UI Components (`src/shared/components/ui/`)**: Reusable, domain-agnostic UI elements, heavily utilizing Shadcn/ui conventions.
- **Layouts (`src/shared/components/layout/`)**: Structural components like `Sidebar`, `TopBar`, and `DashboardLayout`.
- **Routing (`src/router/`)**: Application navigation logic, intended to be implemented with `react-router-dom`.
- **State Management / Data Fetching**: Utilizes `@tanstack/react-query` for server state and general data fetching, alongside Context API (`src/context/`) for global client state.
- **Guards (`src/shared/components/guards/`)**: Route protection and authorization components.

## Data Flow
- User interacts with components in `src/features/*`.
- Components dispatch queries/mutations via `react-query` hooks.
- Hooks use `axios` instances (likely defined in `src/lib/`) to communicate with the Rafe backend API.
- Global app state (like theme or auth status) is managed via contexts in `src/context/`.

## Entry Points
- `index.html`: Main HTML template.
- `src/main.jsx`: React root rendering point, wrapping `App.jsx`.
- `src/App.jsx`: Root application component, likely setting up providers and routers.
