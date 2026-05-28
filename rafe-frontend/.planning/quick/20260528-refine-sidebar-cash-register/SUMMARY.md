---
slug: refine-sidebar-cash-register
status: complete
date: 2026-05-28
---

# Summary: Refined Cash Register Icon to CLOSED Badge

Refined the `cash-register` icon button in the `SidebarFooter` (Block 1) into an interactive status badge showing the closed ("Fechado") status.

## Changes Made
- Modified `src/shared/components/layout/Sidebar/Sidebar.jsx` (lines 484-489).
- Turned the raw icon button into a badge containing both the cash-register icon and the "Fechado" label side-by-side at the same font size.
- Styled the badge with a light red background (`bg-red-50`), rich red text/icon color (`text-red-600`), borders (`border border-red-100/80`), padding (`px-2.5 py-1`), and border radius (`rounded-md`).
- Added active transition transitions (`transition-all duration-300 ease-in-out hover:bg-red-100/50`).

## Verification Results
- Ran `npm run lint` successfully with 0 errors.
- Ran `npm run build` successfully with 0 errors.
