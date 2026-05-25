<!-- GSD:project-start source:PROJECT.md -->
## Project

### Rafe Frontend

Rafe Frontend is the web-based client interface for the Rafe business ecosystem, built using React + Vite + TypeScript. It provides business operators with modern, intuitive, and high-performance screens to handle point-of-sale transactions, client relationship management, financial logs, product inventory, and overall operations dashboard.

**Core Value:** Provide a visually stunning, responsive, and seamless user experience for business operators to manage their day-to-day transactions and business metrics in a minimalist, accessible interface.

**Active Requirements:**
- Implement a minimalist black-and-white Sidebar using shadcn/ui Sidebar primitives in `src/shared/components/layout/Sidebar/Sidebar.jsx`.
- Establish Sidebar context state in `src/context/SidebarContext.jsx`.
- Integrate React Router NavLink navigation with active route detection (`isActive` classes).
- Map out all requested main navigation paths and submenus.
- Integrate SidebarProvider around `DashboardLayout.jsx` and render the SidebarTrigger inside the `TopBar`.

**Out of Scope:**
- Create actual routes or page views (Expressly out of scope: *"Não criar rotas nem páginas"*).
<!-- GSD:project-end -->

<!-- GSD:stack-start source:STACK.md -->
## Technology Stack

**Primary:**
- JavaScript (ES6+) - Application code, React components.
- TypeScript (v6.0.3 compiler ready) - Configuration exists in `tsconfig.json`.

**Frameworks:**
- React v19.2.5 & React Router DOM v7.15.1
- Tailwind CSS v3.4.19 (Minimalist OKLCH variables matching shadcn UI theme)
- TanStack React Query v5.100.14 & Axios v1.16.1

**Build:**
- Vite v8.0.10
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

**Naming:**
- PascalCase for React components and pages (`LoginPage.jsx`, `Sidebar.jsx`).
- kebab-case for directories, hooks, configurations (`use-mobile.js`, `eslint.config.js`).

**Style:**
- 2-space indentation.
- Semicolons are optional/omitted.
- Settle form validation inline via `react-hook-form`.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

**Modular Layers:**
- **Router Layer:** central navigations catalog (`src/router/`).
- **Feature Pages:** domain controller pages under `src/features/[feature]/pages/`.
- **Feature Components/Hooks:** localized states and API requests.
- **Shared Layer:** generic layouts (`DashboardLayout.jsx`), atomic UI primitives (`button.jsx`), and contexts (`AuthContext.jsx`).
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No custom project skills configured yet.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
<!-- GSD:profile-end -->
