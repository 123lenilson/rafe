# Stack Map

**Date**: 2026-05-13

## Overview
The codebase is a modern frontend web application built as a Single Page Application (SPA). It uses a feature-sliced architecture style.

## Languages
- **JavaScript (ES6+)**: Main programming language. Configured via `jsconfig.json`.
- **CSS**: Vanilla CSS augmented with Tailwind directives.
- **HTML5**: Entry point `index.html`.

## Runtime & Frameworks
- **Node.js**: Expected environment for package management and building.
- **React (`^18.3.1`)**: Core UI framework.
- **React DOM (`^18.3.1`)**: DOM bindings for React.

## Build Tools
- **Vite (`^5.4.10`)**: Fast build tool and dev server. Configured in `vite.config.js` with `@vitejs/plugin-react` and `@tailwindcss/vite`.

## Styling & UI Libraries
- **Tailwind CSS (`^4.3.0`)**: Utility-first CSS framework (Vite plugin version).
- **Shadcn/ui**: Component library configuration present in `components.json`. Uses `lucide-react` for icons, `clsx`, `tailwind-merge`, `class-variance-authority`, and `@radix-ui/react-slot` for styling utilities.
- **CSS Variables**: Theme variables configured in `src/index.css`.

## Core Dependencies
- **React Router DOM (`^7.15.0`)**: Application routing.
- **React Query (`@tanstack/react-query ^5.100.9`)**: Server state management and data fetching.
- **Axios (`^1.16.0`)**: HTTP client for API requests.
- **React Hook Form (`^7.75.0`)**: Form state management and validation.

## Configuration Files
- `package.json`: Dependency definitions and scripts (`dev`, `build`, `lint`, `preview`).
- `vite.config.js`: Vite configuration including path alias (`@` to `./src`).
- `jsconfig.json`: Compiler options and path aliases for IDEs.
- `eslint.config.js`: ESLint configuration.
- `components.json`: Shadcn UI CLI configuration file.
