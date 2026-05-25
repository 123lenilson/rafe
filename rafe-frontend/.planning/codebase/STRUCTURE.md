# Codebase Structure

**Analysis Date:** 2026-05-25

## Directory Layout

```
rafe-frontend/
├── dist/                   # Built production bundle (static files)
├── public/                 # Static assets copied directly to build output
├── src/                    # Application source root
│   ├── assets/             # Images, icons, static assets
│   ├── context/            # Global React Contexts (auth, sidebar)
│   ├── features/           # Domain feature folders (Auth, Dashboard, POS, etc.)
│   │   ├── auth/           # Login, JWT handler
│   │   ├── clients/        # Client registration, lists
│   │   ├── dashboard/      # System statistics, graphs
│   │   ├── finances/       # Revenue reports, logs
│   │   ├── invoicing/      # Bill creation, print layouts
│   │   ├── pos/            # Point of sale checkout, cart
│   │   ├── products/       # Inventory, items
│   │   ├── settings/       # System customization
│   │   └── users/          # Employee profiles
│   ├── lib/                # Third-party styling or API utilities (axios, tailwind)
│   ├── router/             # Page routing and navigation shells
│   ├── shared/             # Reusable shared components
│   │   ├── components/     # UI presentation elements and layouts
│   │   └── hooks/          # Global reusable hooks
│   ├── App.css             # Main stylesheet (empty in bootstrap)
│   ├── App.jsx             # Main router provider and app framework
│   ├── index.css           # Tailwind base, components, and oklch theme color variables
│   └── main.jsx            # DOM renderer and runtime entry point
├── components.json         # Shadcn UI initialization configuration
├── eslint.config.js        # Linter rules
├── package.json            # Dependencies and npm script runner
├── postcss.config.js       # PostCSS processor rules
├── tailwind.config.js      # Custom theme colors and screens for Tailwind
├── tsconfig.json           # Compiler preferences for TypeScript compilation
└── vite.config.js          # Vite build config and plugins
```

## Directory Purposes

**src/assets/**
- Purpose: Image and media assets.
- Contains: Icons, background pictures, SVGs.
- Key files: `src/assets/hero.png`.

**src/context/**
- Purpose: Global state stores accessed by multiple features.
- Contains: Authentication context, global UI handlers.
- Key files: `src/context/.gitkeep`.

**src/features/**
- Purpose: Feature-scoped logic containing pages, components, and hooks.
- Contains: Distinct feature modules (`auth`, `pos`, `products`, etc.).
- Subdirectories: Each feature contains subfolders like `pages/`, `components/`, `hooks/`.

**src/lib/**
- Purpose: Wrapper functions and configurations for external libraries.
- Contains: Tailwind-merge helpers (`utils.ts`), Axios base client configurations.
- Key files: `src/lib/utils.ts`.

**src/router/**
- Purpose: Central routes cataloging and access control logic.
- Contains: Static path lists and Layout wrappers.
- Key files: `src/router/.gitkeep`.

**src/shared/**
- Purpose: Reusable elements that are not bound to a specific feature.
- Contains: Presentation UI atoms (`button.jsx`, `dialog.jsx`), Layout wrappers (`DashboardLayout/`).

## Key File Locations

**Entry Points:**
- `src/main.jsx` - Root React render script.
- `index.html` - App launch skeleton.

**Configuration:**
- `package.json` - Dependency declarations.
- `vite.config.js` - Vite execution parameters.
- `tailwind.config.js` - Color schemes and fonts.
- `tsconfig.json` - TypeScript rules.
- `eslint.config.js` - ESLint linter parameters.
- `components.json` - Shadcn configurations.

**Core Styles:**
- `src/index.css` - Global design tokens.

## Naming Conventions

**Files:**
- `PascalCase.jsx` / `PascalCase.tsx` - Used for React components (`DashboardLayout.jsx`, `LoginPage.jsx`).
- `kebab-case.js` / `kebab-case.ts` - Used for modules, hooks, utilities, and config files (`tailwind.config.js`, `use-mobile.js`).
- `lowerCamelCase.js` - Sometimes used for helper classes or singletons.

**Directories:**
- `kebab-case` - For feature and shared directories (`dashboard-layout`, `ui`, `auth`).
- `plural` - Plural collections like `features`, `components`, `hooks`, `assets`.

## Where to Add New Code

**New Feature (e.g., "reports"):**
- Create folder: `src/features/reports/`
- Add folders: `pages/`, `components/`, `hooks/` as needed.
- Add route definition to `src/router/index.jsx`.

**New Shared Component:**
- UI Atom: `src/shared/components/ui/[Component].jsx`
- Layout: `src/shared/components/layout/[Layout]/[Layout].jsx`

**New Global Hook:**
- Hook: `src/shared/hooks/[hook-name].js`

## Special Directories

**dist/**
- Purpose: Compiled product bundles.
- Source: Auto-generated on `npm run build`.
- Committed: No (in `.gitignore`).

---

*Structure analysis: 2026-05-25*
*Update when directory structure changes*
