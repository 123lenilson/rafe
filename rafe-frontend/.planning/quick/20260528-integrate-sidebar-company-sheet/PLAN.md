---
slug: integrate-sidebar-company-sheet
description: Integrate Sheet component with CompanySelector button in SidebarHeader to display company information
status: in-progress
date: 2026-05-28
---

# Plan: Integrate Sheet with CompanySelector in Sidebar Header

Whenever the user clicks the CompanySelector button, a beautiful Sheet component slides in from the left displaying company information and subscription details.

## Proposed Changes

### `src/shared/components/layout/Sidebar/Sidebar.jsx`
- Import `Sheet`, `SheetContent`, `SheetHeader`, `SheetTitle`, `SheetDescription` from `@/shared/components/ui/sheet`.
- Define an `isSheetOpen` state inside the `AppSidebar` component.
- Wrap the `<CompanySelector />` component with a `<Sheet>` controlled by `isSheetOpen`.
- Implement `<SheetContent side="left">` containing premium details about Rafe Ecosystem (legal name, NIF, headquarters, subscription tier, license users count, and active POS metrics).

## Verification
- Run `npm run lint` and `npm run build` to verify zero errors.
