---
slug: integrate-command-search
description: Fix cursor pointer on search button, resolve Dialog compatibility for animation/Glassmorphism, and integrate CommandDialog search palette.
status: in-progress
date: 2026-05-28
---

# Plan: Integrate Command Search Palette

Fix the cursor on the search button to `cursor-pointer`. Resolve Tailwind v3 Dialog animation compatibility, and integrate the `cmdk` based `CommandDialog` search palette in the sidebar.

## Proposed Changes

### `src/shared/components/ui/dialog.tsx`
- Replace `data-open` with `data-[state=open]` and `data-closed` with `data-[state=closed]` inside `DialogOverlay` and `DialogContent` for Tailwind v3 compatibility.
- Set overlay style to a frosted Glassmorphism backdrop blur `bg-black/30 backdrop-blur-[6px] transition-all duration-200`.

### `src/shared/components/layout/Sidebar/Sidebar.jsx`
- Replace `cursor-default` with `cursor-pointer` on search buttons in both expanded and collapsed modes.
- Import `useNavigate` from `react-router-dom`.
- Import `CommandDialog`, `CommandInput`, `CommandList`, `CommandEmpty`, `CommandGroup`, `CommandItem` from `@/shared/components/ui/command`.
- Initialize `isSearchOpen` state in `AppSidebar` and bind `onClick` on search buttons.
- Render the `<CommandDialog>` with search items for Home, POS, Invoices, and Products, utilizing `navigate` for real mock navigation.

## Verification
- Run `npm run lint` and `npm run build` to verify zero errors.
