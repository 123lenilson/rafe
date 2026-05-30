---
slug: integrate-sidebar-avatar-dropdown
description: Integrate DropdownMenu component into Sidebar footer's Avatar button for user navigation and settings options with clean Lucide icons.
status: in-progress
date: 2026-05-30
---

# Plan: Integrate Sidebar Avatar Dropdown Menu

Integrate the recently added `DropdownMenu` shadcn component into the dashboard sidebar footer. When the operator clicks the avatar button, a styled dropdown menu should appear containing navigation options and settings with clean Lucide icons.

## Proposed Changes

### `src/shared/components/ui/dropdown-menu.tsx`
- Replace `data-open` with `data-[state=open]` and `data-closed` with `data-[state=closed]` inside `DropdownMenuContent` and `DropdownMenuSubContent` to ensure compatibility with Tailwind CSS v3 state animations.
- Ensure proper classes and transitions for a premium minimalist appearance.

### `src/shared/components/layout/Sidebar/Sidebar.jsx`
- Import `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuSeparator`, `DropdownMenuLabel` from `@/shared/components/ui/dropdown-menu`.
- Import necessary Lucide icons: `User`, `LogOut`, `CreditCard`, `Shield`, `HelpCircle`, `Sparkles`.
- Wrap the Avatar/User Info element in `SidebarFooter` with `DropdownMenu` and `DropdownMenuTrigger` (using `asChild`).
- Add the `DropdownMenuContent` aligned correctly with the sidebar state (e.g., side `right` or `top` with proper offset).
- Create dropdown items with icons:
  - "O meu perfil" (My Profile) with `User` icon
  - "Definições" (Settings) with `Settings` icon
  - "Subscrição & Faturamento" (Subscription & Billing) with `CreditCard` icon
  - "Suporte & Ajuda" (Support & Help) with `HelpCircle` icon
  - Separator
  - "Terminar Sessão" (Log Out) with `LogOut` icon (destructive variant)

## Verification
- Run `npm run lint` and `npm run build` to verify zero errors.
