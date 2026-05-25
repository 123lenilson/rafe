# Requirements: Rafe Frontend

**Defined:** 2026-05-25
**Core Value:** Provide a visually stunning, responsive, and seamless user experience for business operators to manage their day-to-day transactions and business metrics.

## v1 Requirements

### Navigation

- [ ] **NAV-01**: User can view a minimalist black-and-white Sidebar on the dashboard.
- [ ] **NAV-02**: Sidebar uses shadcn/ui components (`SidebarProvider`, `Sidebar`, `SidebarHeader`, `SidebarContent`, `SidebarMenu`, `SidebarMenuItem`, `SidebarMenuButton`, `SidebarMenuSub`, `SidebarMenuSubItem`, `SidebarFooter`, `SidebarTrigger`).
- [ ] **NAV-03**: Sidebar integrates NavLink from `react-router-dom` with active route detection (`isActive` styling).
- [ ] **NAV-04**: Sidebar includes navigation items:
  - Dashboard (`/dashboard`)
  - Faturação (submenus: Orçamento, Facturas, Proforma, Recibo)
  - POS (`/pos`)
  - Produtos (submenus: Listar Produto, Entrada/Saída)
  - Clientes (`/clients`)
  - Finanças (submenus: Fluxo de Caixa, Contas/Bancos, Despesas)
  - Utilizadores (`/users`)
  - Definições (submenu: Métodos de Pagamento)
- [ ] **NAV-05**: SidebarProvider wraps `DashboardLayout.jsx` and SidebarTrigger is placed in `TopBar`.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Creating routes or pages | Expressly excluded in this phase: *"Não criar rotas nem páginas"* |
| Adding non-minimalist styling colors | Limited to minimalist black and white using only shadcn CSS variables |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| NAV-01 | Phase 1 | Pending |
| NAV-02 | Phase 1 | Pending |
| NAV-03 | Phase 1 | Pending |
| NAV-04 | Phase 1 | Pending |
| NAV-05 | Phase 1 | Pending |

**Coverage:**
- v1 requirements: 5 total
- Mapped to phases: 5
- Unmapped: 0 ✓

---
*Requirements defined: 2026-05-25*
*Last updated: 2026-05-25 after initial definition*
