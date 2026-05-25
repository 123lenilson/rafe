# Phase 1: Implement Dashboard Sidebar - Context

**Gathered:** 2026-05-25
**Status:** Ready for planning

<domain>
## Phase Boundary

Implement the main dashboard navigation Sidebar in `rafe-frontend` using the official `shadcn/ui Sidebar` component. The sidebar must map specific navigation items and submenus, support active path detection using React Router v6/v7 NavLink, use a minimalist light black-and-white theme, and integrate seamlessly with `SidebarProvider` wrapping the dashboard layout.
No new routes or pages are to be created in this phase ("Não criar rotas nem páginas").

</domain>

<decisions>
## Implementation Decisions

### Estética Visual (Visual Aesthetics)
- **D-01 (Minimalist Light):** Standard minimalist light styling consisting of a pure white background, thin black/gray border lines, and black text/icons.
- **D-02 (Styling Token Constraints):** Exclusively use shadcn CSS custom variables for color tokens (border, background, primary-foreground, etc.) to guarantee design compatibility and avoid color drift.

### Responsividade & Colapso (Collapse & Responsiveness)
- **D-03 (Default Desktop State):** Sidebar is visible and fully expanded by default on desktop, and collapsible via the `SidebarTrigger`.
- **D-04 (Default Mobile State):** Sidebar is completely hidden by default on mobile devices and renders as an interactive overlay when triggered.

### Interação com Submenus (Submenus Interaction)
- **D-05 (Accordion Style):** Implement accordion-style dropdown submenus. Expanding one submenu automatically collapses any other open submenu to maintain clean visual space.
- **D-06 (Active Path Detection):** Integrate `NavLink` from `react-router-dom`. Use the default `isActive` callback to conditionally apply clean black/gray active status styles.
- **D-07 (Navigation Map):** Build exact links matching these paths and hierarchies:
  - Dashboard (`/dashboard`)
  - Faturação (submenus: Orçamento, Facturas, Proforma, Recibo)
  - POS (`/pos`)
  - Produtos (submenus: Listar Produto, Entrada/Saída)
  - Clientes (`/clients`)
  - Finanças (submenus: Fluxo de Caixa, Contas/Bancos, Despesas)
  - Utilizadores (`/users`)
  - Definições (submenu: Métodos de Pagamento)

### Layout Integration
- **D-08 (Provider Wrapper):** `SidebarProvider` must wrap the `DashboardLayout.jsx` wrapper component to supply global sidebar state.
- **D-09 (Trigger Location):** Place the `SidebarTrigger` component inside the `TopBar` layout element.

### the agent's Discretion
- Selection of individual Lucide React icons for each navigation and submenu item.
- Exact transition duration and curves for submenu animations and sidebar sliding.
- Hover-state border and background highlighting styles within the black-and-white constraint.

</decisions>

<canonical_refs>
## Canonical References

No external specs — requirements are fully captured in decisions above.

</canonical_refs>

<specifics>
## Specific Ideas

- The sidebar should feel extremely premium and modern, drawing design inspiration from sleek SaaS apps like Linear or Resend: clean typography, thin border borders, and plenty of breathing room.
- Active item indicator should use a subtle bold text or a fine left border rather than massive solid color block.

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `lucide-react` icons (v1.16.0) for navigational visual markers.
- Tailwind CSS custom HSL variables configured in `src/index.css`.

### Integration Points
- `src/shared/components/layout/Sidebar/Sidebar.jsx` (New file) - Core component layout.
- `src/context/SidebarContext.jsx` (New file) - React context to share specific navigation or UI triggers.
- `src/shared/components/layout/DashboardLayout/` (Wrapper) - Integrates the SidebarProvider.
- `src/shared/components/layout/TopBar/` (Trigger location) - Integrates the SidebarTrigger button.

</code_context>

<deferred>
## Deferred Ideas

- **Page Views & Routing** — Creating routes, matching components, or actual page views for `/dashboard`, `/pos`, `/clients`, etc. is strictly deferred to future phases.

</deferred>

---

*Phase: 01-implement-dashboard-sidebar*
*Context gathered: 2026-05-25*
