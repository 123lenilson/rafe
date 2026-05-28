---
slug: refine-sidebar-cash-register
description: Refine cash-register icon in Sidebar footer to display "Fechado" with custom red background and text tones
status: in-progress
date: 2026-05-28
---

# Plan: Refine Cash-Register in Sidebar Footer

Modify the cash-register icon in the SidebarFooter (Block 1) to indicate that the register is closed ("Fechado").

## Proposed Changes

### `src/shared/components/layout/Sidebar/Sidebar.jsx`
- Replace the simple cash-register icon button with an active indicator button:
  - Add text "Fechado" next to the icon.
  - Set text and icon color to a readable tone of red (e.g., `text-red-600` or `text-red-700`).
  - Add a light red background (`bg-red-50` or `bg-red-100/50`).
  - Add border and border-radius (`border border-red-100`, `rounded-md`).
  - Apply small padding (`px-2 py-1` or `px-2.5 py-1`).

## Verification
- Visual inspection on the dashboard layout.
- Run `npm run lint` and `npm run build` to verify zero errors.
