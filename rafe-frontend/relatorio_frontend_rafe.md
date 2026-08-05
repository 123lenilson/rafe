# Relatório Completo — Frontend RAFE

> **Data:** 02 de Agosto de 2026 | **Projecto:** `rafe-frontend` | **Versão:** 0.0.0

---

## 1. Visão Geral

O **RAFE Frontend** é uma aplicação de gestão empresarial (ERP/POS) construída com **React + Vite**, desenhada para suportar operações de facturação, ponto de venda, gestão de produtos, clientes, finanças e definições. O sistema está numa fase de **desenvolvimento activo/estrutural** — a maior parte das páginas ainda são mocks, com apenas o módulo de **POS / Caixa** com implementação funcional real.

---

## 2. Stack Tecnológica

| Categoria | Tecnologia | Versão |
|---|---|---|
| **Runtime UI** | React | ^19.2.5 |
| **Build Tool** | Vite | ^8.0.10 |
| **Linguagem** | JavaScript (JSX) + TypeScript (TSX) | TS ^6.0.3 |
| **Styling** | Tailwind CSS | ^3.4.19 |
| **UI Components** | shadcn/ui (via Radix UI) | ^4.8.0 |
| **Routing** | React Router DOM | ^7.15.1 |
| **State/Server** | TanStack React Query | ^5.100.14 |
| **HTTP Client** | Axios | ^1.16.1 |
| **Formulários** | React Hook Form | ^7.76.1 |
| **Ícones** | Lucide React + FontAwesome | ^1.16.0 / ^7.2.0 |
| **Notificações** | Sonner | ^2.0.7 |
| **Fontes** | Inter (Google Fonts) + Geist Variable | — |
| **Animações** | tailwindcss-animate + tw-animate-css | — |
| **Tema** | next-themes (dark mode ready) | ^0.4.6 |

---

## 3. Arquitectura da Aplicação

```
rafe-frontend/
├── index.html                    # Entry HTML
├── src/
│   ├── main.jsx                  # Bootstrap: createRoot → App
│   ├── App.jsx                   # Root: RouterProvider + TooltipProvider + Toaster
│   ├── index.css                 # Estilos globais (tokens CSS, Tailwind, fontes, animações)
│   ├── router/
│   │   └── router.tsx            # Definição de todas as rotas (React Router v7)
│   ├── context/
│   │   └── SidebarContext.jsx    # Re-export do SidebarProvider
│   ├── hooks/
│   │   └── use-mobile.ts         # Hook de detecção mobile (< 768px)
│   ├── lib/
│   │   └── utils.ts              # cn - classnames utility
│   ├── shared/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── DashboardLayout/  → DashboardLayout.jsx
│   │   │   │   ├── Sidebar/          → Sidebar.jsx (AppSidebar + CompanySelector)
│   │   │   │   └── TopBar/           → TopBar.jsx
│   │   │   ├── ui/                   → Todos os primitivos shadcn/ui (18 ficheiros)
│   │   │   ├── dev/
│   │   │   │   └── MockPage.tsx      → Placeholder para páginas em construção
│   │   │   ├── ClickSpark.jsx        → Animação canvas de faíscas ao clicar
│   │   │   ├── MonetaryDisplay.tsx   → Display monetário com auto-sizing de fonte
│   │   │   └── NumericKeypad.tsx     → Teclado numérico virtual (grid 4 colunas)
│   │   └── hooks/                    → (vazio, reservado)
│   └── features/
│       ├── auth/          → (vazio — stub)
│       ├── clients/       → (vazio — stub)
│       ├── dashboard/     → /pages vazio (mock)
│       ├── finances/      → (vazio — stub)
│       ├── invoicing/     → (vazio — stub)
│       ├── products/      → (vazio — stub)
│       ├── settings/
│       │   └── components/
│       │       └── CompanySettingsDrawer.tsx   → Sheet de definições (stub)
│       ├── users/         → (vazio — stub)
│       └── pos/
│           ├── POSLayout.tsx
│           ├── components/
│           │   ├── BottomMenu/BottomMenu.tsx
│           │   └── CashRegisterDrawer/
│           │       ├── index.tsx               → Sheet principal
│           │       ├── OpenCashPanel.tsx        → Abertura/Fecho de caixa
│           │       ├── CashHistoryPanel.tsx     → Histórico de sessões
│           │       ├── EntryDetailPanel.tsx     → Detalhe de entrada
│           │       ├── HistoryFilterMenu.tsx    → Filtros do histórico
│           │       └── CollapsibleValueCell.tsx
│           ├── hooks/
│           │   ├── useCashRegister.ts
│           │   └── useCashHistoryFilters.ts
│           └── types/
│               └── cash.types.ts
```

---

## 4. Sistema de Routing

Definido em [router.tsx](file:///C:/wamp64/www/rafe/rafe-frontend/src/router/router.tsx) com `createBrowserRouter` (React Router v7).

### Mapa de Rotas

| Path | Componente | Estado |
|---|---|---|
| `/` | redirect `/dashboard` | Funcional |
| `/dashboard` | MockPage (DashboardLayout) | Placeholder |
| `/faturacao/orcamento` | MockPage | Placeholder |
| `/faturacao/facturas` | MockPage | Placeholder |
| `/faturacao/proforma` | MockPage | Placeholder |
| `/faturacao/recibo` | MockPage | Placeholder |
| `/produtos/listar` | MockPage | Placeholder |
| `/produtos/entrada-saida` | MockPage | Placeholder |
| `/clients` | MockPage | Placeholder |
| `/financas/fluxo-caixa` | MockPage | Placeholder |
| `/financas/contas-bancos` | MockPage | Placeholder |
| `/financas/despesas` | MockPage | Placeholder |
| `/users` | MockPage | Placeholder |
| `/definicoes/metodos-pagamento` | MockPage | Placeholder |
| `/pos` | POSLayout (rota autónoma) | Estruturado |
| `*` | redirect `/dashboard` | Funcional |

> [!NOTE]
> O `/pos` é uma rota raiz que **não partilha** o `DashboardLayout`. Tem o seu próprio layout fullscreen independente.

---

## 5. Layouts

### DashboardLayout
**Ficheiro:** [DashboardLayout.jsx](file:///C:/wamp64/www/rafe/rafe-frontend/src/shared/components/layout/DashboardLayout/DashboardLayout.jsx)

Layout principal de toda a área de gestão:
- Envolve tudo com `ClickSpark` para o efeito visual de faíscas ao clicar
- Usa `SidebarProvider` do shadcn/ui com largura `--sidebar-width: 230px`
- Fundo externo (sidebar): `#F5F5F5` (cinzento suave)
- Área de conteúdo: caixa branca `rounded-t-[16px]` com shadow, `my-3 mr-3 ml-1`
- `TopBar` fixa no topo, área scrollável com `max-w-[1200px] mx-auto`
- `Outlet` renderiza o componente da rota activa

### POSLayout
**Ficheiro:** [POSLayout.tsx](file:///C:/wamp64/www/rafe/rafe-frontend/src/features/pos/POSLayout.tsx)

Layout de 3 painéis para o ponto de venda:
- **Painel Esquerdo** (~200–300px): reservado para teclado numérico e métodos de pagamento
- **Painel Central** (~450–675px): reservado para listagem de produtos  
- **Painel Direito** (~350–525px): reservado para carrinho e totais
- `BottomMenu` fixo no rodapé
- Os 3 painéis são **stubs** — conteúdo por implementar

---

## 6. Componentes de Layout

### 6.1 Sidebar (AppSidebar)
**Ficheiro:** [Sidebar.jsx](file:///C:/wamp64/www/rafe/rafe-frontend/src/shared/components/layout/Sidebar/Sidebar.jsx) — 717 linhas

O componente mais completo e funcional do projecto. Estrutura:

**Header:**
- `CompanySelector`: logo da empresa (ícone Briefcase), nome "Rafe", plano "Ecosystem". Clique abre `CompanySettingsDrawer`
- Barra de pesquisa adaptativa: full-width expandido / ícone circular colapsado → abre `CommandDialog`

**Navegação com 8 entradas:**
- Home (`/dashboard`) — link directo
- POS (`/pos`) — link directo
- Facturação — submenu (Orçamento, Facturas, Proforma, Recibo)
- Produtos — submenu (Listar Produto, Entrada/Saída)
- Finanças — submenu (Fluxo de Caixa, Contas/Bancos, Despesas)
- Clientes (`/clients`) — link directo
- Utilizadores (`/users`) — link directo
- Definições — submenu (Métodos de Pagamento)

**Submenus:** Animados com CSS Grid `grid-rows-[0fr/1fr]` + `opacity-0/100`. Expandem automaticamente com base no path activo via `useEffect`.

**Footer:**
- Barra de ícones: Notificações, Mensagens, **Botão de Caixa** (verde se aberta / vermelho se fechada, com cronómetro em tempo real `HH:MM:SS`)
- Avatar do utilizador com `DropdownMenu`: perfil, definições, subscrição, suporte, terminar sessão

**CommandDialog (pesquisa global):** Lista todas as rotas do sistema organizadas por grupo.

**Estado interno:**
```
openMenu       → submenu actualmente expandido
isSheetOpen    → CompanySettingsDrawer aberta
isSearchOpen   → CommandDialog aberta
isCashDrawerOpen → CashRegisterDrawer aberta
elapsedTime    → tempo decorrido desde abertura da caixa (HH:MM:SS)
```

### 6.2 TopBar
**Ficheiro:** [TopBar.jsx](file:///C:/wamp64/www/rafe/rafe-frontend/src/shared/components/layout/TopBar/TopBar.jsx)

Barra de 60px com `SidebarTrigger` à esquerda e botões visuais (Pesquisa, Notificações) à direita. Sem lógica implementada nos botões direitos.

---

## 7. Módulo POS / Caixa — O Único Módulo Funcional

### 7.1 CashRegisterDrawer
**Ficheiro:** [index.tsx](file:///C:/wamp64/www/rafe/rafe-frontend/src/features/pos/components/CashRegisterDrawer/index.tsx)

Sheet lateral direita: `60vw`, mínimo `980px`, máximo `1180px`. Grid de 2 colunas:
- Coluna esquerda fixada (300px): `OpenCashPanel`
- Coluna direita (flex): `CashHistoryPanel`

### 7.2 OpenCashPanel
**Ficheiro:** [OpenCashPanel.tsx](file:///C:/wamp64/www/rafe/rafe-frontend/src/features/pos/components/CashRegisterDrawer/OpenCashPanel.tsx)

Painel de abertura/fecho de caixa:
- `MonetaryDisplay`: valor em tempo real com auto-scaling de fonte
- `NumericKeypad`: teclado virtual 4 colunas
- Suporte a **teclado físico** (0–9, `.`, `,`, `Backspace`, `Delete/Escape/C`)
- Textarea de observações com botão Send → animação Check quando enviado
- Botão "Abrir Caixa" / "Fechar Caixa" com toast de confirmação (Sonner)

### 7.3 Hook useCashRegister
**Ficheiro:** [useCashRegister.ts](file:///C:/wamp64/www/rafe/rafe-frontend/src/features/pos/hooks/useCashRegister.ts)

State machine da caixa com 5 entradas históricas mock pré-carregadas:

| Função | Descrição |
|---|---|
| `isCashRegisterOpened` | Estado booleano da caixa |
| `cashRegisterHistory` | Array de CashRegisterEntry[] |
| `handleOpenCashRegister(val, obs)` | Adiciona nova sessão aberta |
| `handleCloseCashRegister(val, obs)` | Fecha sessão activa |
| `formatCurrency(val)` | Formata em `pt-AO` — **Kwanza (Kz)** |
| `formatDisplayValue(val)` | Formata para display do teclado |

> [!IMPORTANT]
> A moeda utilizada é o **Kwanza (Kz)** com locale `pt-AO` — confirma que o sistema é para **Angola**.

### 7.4 Hook useCashHistoryFilters
**Ficheiro:** [useCashHistoryFilters.ts](file:///C:/wamp64/www/rafe/rafe-frontend/src/features/pos/hooks/useCashHistoryFilters.ts)

Filtros completos para o histórico:
- Por **utilizador** (multi-select toggle)
- Por **observações** (pesquisa de texto)
- Por **valor** (Valor Inicial / Valor Final / Diferença)
- Por **data**: Último mês, Este mês, Trimestres, Este Ano, 30/90 dias, Data personalizada
- `handleClearAll()` — limpa todos os filtros

### 7.5 Tipo CashRegisterEntry

```typescript
interface CashRegisterEntry {
  id: number
  operatorName: string
  operatorInitials: string
  openingDate: string        // "DD/MM/YYYY"
  openingTime: string        // "HH:MM"
  closingDate: string
  closingTime: string
  initialValue: number
  finalValue: number
  difference: number         // finalValue - initialValue
  observation: string
  openingObservation?: string
  closingObservation?: string
  isClosed: boolean
}
```

---

## 8. Componentes Partilhados (Shared)

### MonetaryDisplay
[MonetaryDisplay.tsx](file:///C:/wamp64/www/rafe/rafe-frontend/src/shared/components/MonetaryDisplay.tsx) — Auto-scaling de fonte via `useLayoutEffect` (48px → 14px mínimo). Alinhado à direita.

### NumericKeypad
[NumericKeypad.tsx](file:///C:/wamp64/www/rafe/rafe-frontend/src/shared/components/NumericKeypad.tsx) — Grid 4×4 com `RippleButton`. Tecla `⌫` ocupa 4 linhas de altura.

### ClickSpark
[ClickSpark.jsx](file:///C:/wamp64/www/rafe/rafe-frontend/src/shared/components/ClickSpark.jsx) — Animação canvas: 8 faíscas por clique, raio 15px, 400ms, z-index 99999. `pointer-events: none`. Captura global com `{ capture: true, passive: true }`.

### CompanySettingsDrawer
[CompanySettingsDrawer.tsx](file:///C:/wamp64/www/rafe/rafe-frontend/src/features/settings/components/CompanySettingsDrawer.tsx) — Sheet 320–350px. Apenas shell/placeholder.

### MockPage (Dev)
[MockPage.tsx](file:///C:/wamp64/www/rafe/rafe-frontend/src/shared/components/dev/MockPage.tsx) — Placeholder para páginas não implementadas. Mostra título, path, e metadados da sidebar.

---

## 9. Biblioteca shadcn/ui

18 componentes em [src/shared/components/ui/](file:///C:/wamp64/www/rafe/rafe-frontend/src/shared/components/ui/):

| Componente | Uso Principal |
|---|---|
| alert-dialog | Confirmações críticas |
| avatar | Avatar do utilizador na sidebar |
| button | Botão base com variants |
| command | Paleta de comandos (pesquisa global) |
| dialog | Modais genéricos |
| dropdown-menu | Menu do utilizador no footer da sidebar |
| input-group | Input agrupado com ícones |
| input | Input base |
| ripple-button | Botão com efeito ripple canvas |
| select | Dropdown de selecção |
| separator | Linha divisória |
| sheet | Drawers laterais (CashRegisterDrawer, CompanySettings) |
| sidebar | Sistema completo shadcn (21KB) |
| skeleton | Loading placeholders |
| sonner | Toasts/notificações |
| textarea | Área de texto |
| tooltip | Tooltips |

---

## 10. Sistema de Design

### Paleta de Cores (CSS Custom Properties — OKLCH)

**Light Mode:**
- Background: `oklch(1 0 0)` — branco puro
- Foreground: `oklch(0.145 0 0)` — quase preto
- Border: `oklch(0.922 0 0)` — cinzento suave
- Destructive: `oklch(0.577 0.245 27.325)` — vermelho

**Dark Mode (configurado, não activado na UI):**
- Background: `oklch(0.145 0 0)` — quase preto
- Sidebar Primary: `oklch(0.488 0.243 264.376)` — azul-índigo

**Cores hardcoded frequentes:**
- `#F5F5F5` — fundo sidebar e painéis
- `#E2E2E2` — bordas e separadores
- `#e4e4e7/60` — hover states
- `green-50/text-green-600` — caixa aberta
- `red-50/text-red-600` — caixa fechada

### Tipografia
- **Principal:** Inter (Google Fonts, opsz 14..32, wght 100..900)
- **Alternativa instalada:** Geist Variable
- Border radius: `--radius: 0.625rem` (10px)

### Animações
- `rippling` — efeito ripple nos botões (scale 0→2, opacity 1→0)
- `ripple-hover` — hover effect (scale 0→1, 250ms)
- `accordion-down/up` — collapse/expand (0.2s ease-out)
- ClickSpark — loop RAF no canvas (400ms, ease-out)
- Submenus — CSS Grid `grid-rows-[0fr/1fr]` + opacity transition

---

## 11. Estado Actual do Desenvolvimento

### Implementado e Funcional
- Estrutura base do projecto (Vite + React 19 + TS + Tailwind)
- Sistema de routing completo (React Router v7, 15 rotas)
- DashboardLayout com sidebar colapsável, topbar e área de conteúdo
- Sidebar completa: navegação, submenus animados, pesquisa global, dropdown utilizador
- POSLayout (estrutura de 3 painéis + BottomMenu)
- Módulo Caixa Registadora completo (abertura, fecho, histórico, filtros, teclado, cronómetro)
- 18 componentes shadcn/ui
- ClickSpark (efeito premium global)

### Em Construção / Placeholders
- Todas as páginas do Dashboard (14 rotas com MockPage)
- Painéis do POS (produtos, carrinho, pagamento)
- CompanySettingsDrawer (apenas shell)
- Autenticação e guards de rota
- Todos os outros feature modules (auth, clients, finances, invoicing, products, users)

### Observações Técnicas

> [!WARNING]
> O `useCashRegister()` é instanciado em `AppSidebar` e pode criar uma segunda instância local em `CashRegisterDrawer` se a prop não for passada correctamente. Risco de **dessincronização de estado**.

> [!NOTE]
> Mistura de `.jsx` e `.tsx`: componentes de layout são JSX (sem types explícitos), enquanto o módulo POS usa TSX. Inconsistência a normalizar.

1. **Sem persistência de dados** — tudo em `useState` com dados mock
2. **TanStack React Query + Axios** instalados mas sem uso — integração API por iniciar
3. **Dark mode** configurado no CSS/Tailwind mas sem toggle na UI
4. **Sem testes** — nenhuma configuração de testing

---

## 12. Fluxo de Dados

```
App.jsx
  └── RouterProvider
        ├── DashboardLayout (rota parent)
        │     ├── SidebarProvider (contexto shadcn)
        │     │     ├── AppSidebar
        │     │     │     ├── useCashRegister()   ← estado local
        │     │     │     └── CashRegisterDrawer (recebe cashRegister como prop)
        │     │     └── TopBar
        │     └── Outlet → MockPage (14 rotas actuais)
        │
        └── POSLayout (rota autónoma, sem DashboardLayout)
              ├── Painel Esquerdo (stub)
              ├── Painel Central (stub)
              ├── Painel Direito (stub)
              └── BottomMenu
```

---

## 13. Resumo Executivo

| Aspecto | Avaliação |
|---|---|
| **Arquitectura** | Boa — feature-based, bem organizada |
| **Stack tecnológica** | Moderna e robusta (React 19, Vite 8, TS 6) |
| **Design System** | Coerente — paleta B&W premium, Inter, shadcn/ui |
| **Routing** | Completo estruturalmente (15 rotas definidas) |
| **Módulo POS/Caixa** | Implementação sólida e funcional |
| **Restantes features** | Apenas stubs/mocks |
| **Integração API** | Não iniciada (Axios/React Query instalados, sem uso) |
| **Autenticação** | Não implementada |
| **Estado global** | Apenas local (useState) — sem Zustand ou Context global |
| **Testes** | Não existem |
| **Persistência de dados** | Tudo em memória com dados mock |

**Contexto confirmado:** Angola — moeda **Kwanza (Kz)**, locale `pt-AO`.
