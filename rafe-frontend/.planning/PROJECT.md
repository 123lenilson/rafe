# Project: Rafe Frontend

## What This Is

Rafe Frontend is the web-based client interface for the Rafe business ecosystem, built using React + Vite + TypeScript. It provides business operators with modern, intuitive, and high-performance screens to handle point-of-sale transactions, client relationship management, financial logs, product inventory, and overall operations dashboard.

## Core Value

Provide a visually stunning, responsive, and seamless user experience for business operators to manage their day-to-day transactions and business metrics in a minimalist, accessible interface.

## Requirements

### Validated

- ✓ Technology stack initialized (Vite, Tailwind, React 19) — Phase 0

### Active

- [ ] **NAV-01**: Implement a minimalist black-and-white Sidebar using shadcn/ui Sidebar primitives in `src/shared/components/layout/Sidebar/Sidebar.jsx`.
- [ ] **NAV-02**: Establish Sidebar context state in `src/context/SidebarContext.jsx`.
- [ ] **NAV-03**: Integrate React Router NavLink navigation with active route detection (`isActive` classes).
- [ ] **NAV-04**: Map out all requested main navigation paths and submenus (Dashboard, Faturação, POS, Produtos, Clientes, Finanças, Utilizadores, Definições).
- [ ] **NAV-05**: Integrate SidebarProvider around `DashboardLayout.jsx` and render the SidebarTrigger inside the `TopBar`.

### Out of Scope

- **Create actual routes or page views** — Out of scope for this phase because the user explicitly specified: *"Não criar rotas nem páginas."*
- **Adding non-standard third-party UI widgets** — Defer to native shadcn/ui elements.

## Context

- The codebase is currently bootstrapped with React 19, Vite, Tailwind CSS, and TypeScript ready.
- All primary modular features under `src/features/` contain placeholder `.gitkeep` files waiting for operational views.
- Custom fonts like `@fontsource-variable/geist` are imported to achieve state-of-the-art premium typography.

## Constraints

- **Styling**: Minimalist black and white styling using strictly shadcn CSS variables (no raw Tailwind styling colors).
- **Libraries**: Must use native `shadcn/ui Sidebar` component (`npx shadcn@latest add sidebar`).
- **Dependencies**: React Router v6/v7 NavLink for active paths.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| React Router NavLink integration | Seamless SPA navigation matching component specifications | — Pending |
| Minimalist B&W styling | Visual requirement matching brand instructions | — Pending |

---
*Last updated: 2026-05-25 after initialization*
