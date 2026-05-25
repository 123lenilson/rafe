# Technology Stack

**Analysis Date:** 2026-05-25

## Languages

**Primary:**
- JavaScript (ES6+) - Used for application code, components (`App.jsx`, `main.jsx`), router definition, contexts, and features.
- TypeScript (v6.0.3 compiler ready) - The codebase includes a `tsconfig.json` configuration, making it fully prepared for TypeScript integration.

**Secondary:**
- HTML5 - Application skeleton (`index.html`).
- CSS3 (Vanilla + Tailwind directives) - Style definitions (`src/index.css`).

## Runtime

**Environment:**
- Node.js (v20.x or higher recommended) - Standard runtime environment for development tools.
- Modern Web Browsers - Chrome, Firefox, Safari, Edge (Target environments).

**Package Manager:**
- npm v10.x (or compatible yarn/pnpm)
- Lockfile: `package-lock.json` present.

## Frameworks

**Core:**
- React v19.2.5 - Component model, state management, and virtual DOM.
- React Router DOM v7.15.1 - Routing and client-side page transitions.

**Styling:**
- Tailwind CSS v3.4.19 - Utility-first styling framework.
- Tailwind CSS Animate v1.0.7 & tw-animate-css v1.4.0 - Custom animations and transitions.

**State/Data Fetching:**
- TanStack React Query v5.100.14 - Declarative, asynchronous server state management.
- Axios v1.16.1 - Promise-based HTTP client for API requests.

**Forms:**
- React Hook Form v7.76.1 - Performant, flexible, and extensible forms with easy validation.

**UI Components:**
- Radix UI v1.4.3 & @radix-ui/react-slot v1.2.4 - Unstyled, accessible primitives for components.
- Shadcn UI - Design system integration structure.

**Build/Dev:**
- Vite v8.0.10 - Next-generation front-end build tool and dev server.
- ESLint v10.2.1 - Code linting and quality assurance.
- PostCSS v8.5.15 & Autoprefixer v10.5.0 - CSS pre-processing.

## Key Dependencies

**Critical:**
- `react` (v19.2.5) & `react-dom` (v19.2.5) - Core library.
- `react-router-dom` (v7.15.1) - Navigation engine.
- `@tanstack/react-query` (v5.100.14) - Server synchronization and caching.
- `axios` (v1.16.1) - Server communication client.
- `react-hook-form` (v7.76.1) - Form state management.
- `lucide-react` (v1.16.0) - Premium icon set.

**Infrastructure/Styles:**
- `tailwindcss` (v3.4.19) - CSS utility framework.
- `clsx` (v2.1.1) & `tailwind-merge` (v3.6.0) - Utility to conditionally join CSS class names and resolve conflicts.
- `class-variance-authority` (v0.7.1) - CSS-in-TS tool for creating variant-driven components.

## Configuration

**Environment:**
- Handled by Vite using `.env` files (e.g., `VITE_API_URL` for backend endpoint). Currently no env file is present in root.

**Build:**
- `vite.config.js` - Configuration for plugins, path aliases, and bundler behaviors.
- `tsconfig.json` - Compiler configurations for TypeScript.
- `eslint.config.js` - Code style and syntax rules.
- `postcss.config.js` - PostCSS runner configuration.
- `tailwind.config.js` - Design system parameters, theme colors (using OKLCH), custom fonts, and spacing.
- `components.json` - Shadcn UI project styling parameters.

## Platform Requirements

**Development:**
- Windows/macOS/Linux with Node.js and npm installed.
- No local database or containerization required for frontend development itself.

**Production:**
- Built application is a static bundle (`dist/` directory, output of `npm run build`).
- Can be hosted on Vercel, Netlify, AWS S3, or any static file web server (e.g., WampServer/Apache as per path prefix `C:\wamp64\www\rafe\`).

---

*Stack analysis: 2026-05-25*
*Update after major dependency changes*
