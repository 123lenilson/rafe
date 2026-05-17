---
description: "Implementar Estrutura de Rotas, Contextos e Layout Base (Sidebar e TopBar)"
labels: ["frontend", "layout", "routing"]
wave: 1
depends_on: []
files_modified:
  - "src/context/SidebarContext.jsx"
  - "src/context/AuthContext.jsx"
  - "src/features/auth/pages/LoginPage.jsx"
  - "src/features/dashboard/pages/DashboardPage.jsx"
  - "src/features/invoicing/pages/InvoicingPage.jsx"
  - "src/features/pos/pages/PosPage.jsx"
  - "src/features/products/pages/ProductsPage.jsx"
  - "src/features/clients/pages/ClientsPage.jsx"
  - "src/features/finances/pages/FinancesPage.jsx"
  - "src/features/users/pages/UsersPage.jsx"
  - "src/features/settings/pages/SettingsPage.jsx"
  - "src/shared/components/layout/TopBar/TopBar.jsx"
  - "src/shared/components/layout/DashboardLayout/DashboardLayout.jsx"
  - "src/router/index.jsx"
  - "src/main.jsx"
  - "src/App.jsx"
autonomous: false
requirements:
  - CORE-01
  - CORE-02
  - NAV-01
  - NAV-02
  - TOP-01
---

# Plan: Dashboard Layout e Estrutura Base

## Objective
Estabelecer a fundação da interface da SPA, integrando contextos de estado (Auth e Sidebar com LocalStorage), o router v6 (Data API), o layout principal e o componente Sidebar oficial do Shadcn/ui adaptado ao design system (Square-style, minimalista preto/branco).

## Tasks

<task>
<id>1</id>
<title>Instalar Componente Sidebar do Shadcn/ui</title>
<read_first>
- `package.json`
- `components.json` (se existir)
</read_first>
<action>
Instala manualmente as dependências via npm:
`npm install @radix-ui/react-dialog @radix-ui/react-navigation-menu`

Cria o componente sidebar manualmente em `src/shared/components/ui/sidebar.jsx`.
</action>
<acceptance_criteria>
- O ficheiro do componente sidebar (`src/shared/components/ui/sidebar.jsx`) existe no projeto.
</acceptance_criteria>
</task>

<task>
<id>2</id>
<title>Implementar Contextos de Estado (Auth e Sidebar)</title>
<read_first>
- `.planning/phases/01-dashboard-layout-e-estrutura-base/01-CONTEXT.md`
</read_first>
<action>
1. Cria `src/context/AuthContext.jsx`.
   - Implementa `AuthContext` com um estado `{ user: null, isAuthenticated: false }`.
   - Exporta `AuthProvider` e `useAuth`.
2. Cria `src/context/SidebarContext.jsx`.
   - Implementa `SidebarContext` para gerir o estado de collapse (expandido vs colapsado).
   - Usa `localStorage.getItem('rafe_sidebar_collapsed')` para o estado inicial.
   - Quando o estado muda, guarda a preferência no `localStorage`.
   - Exporta `SidebarProvider` e `useSidebar`.
</action>
<acceptance_criteria>
- `src/context/AuthContext.jsx` exporta `useAuth` e `AuthProvider`.
- `src/context/SidebarContext.jsx` exporta `useSidebar` e `SidebarProvider`.
- `src/context/SidebarContext.jsx` contém chamadas a `localStorage.setItem` e `localStorage.getItem`.
</acceptance_criteria>
</task>

<task>
<id>3</id>
<title>Criar Placeholder Pages</title>
<read_first>
- `src/App.jsx`
</read_first>
<action>
Cria ficheiros `.jsx` com componentes funcionais simples exportados por defeito (texto `<h1>[Nome da Página]</h1>`) para servir de placeholder nas rotas:
- `src/features/auth/pages/LoginPage.jsx` (com um formulário simples mockado)
- `src/features/dashboard/pages/DashboardPage.jsx`
- `src/features/invoicing/pages/InvoicingPage.jsx`
- `src/features/pos/pages/PosPage.jsx`
- `src/features/products/pages/ProductsPage.jsx`
- `src/features/clients/pages/ClientsPage.jsx`
- `src/features/finances/pages/FinancesPage.jsx`
- `src/features/users/pages/UsersPage.jsx`
- `src/features/settings/pages/SettingsPage.jsx`
</action>
<acceptance_criteria>
- Todos os 9 ficheiros existem e exportam componentes funcionais (default export).
</acceptance_criteria>
</task>

<task>
<id>4</id>
<title>Implementar Componente TopBar</title>
<read_first>
- `src/context/AuthContext.jsx`
</read_first>
<action>
Cria `src/shared/components/layout/TopBar/TopBar.jsx`.
- Lê a rota atual (`useLocation`) para mostrar o breadcrumb (ex: `Rafe / Dashboard`).
- Lê o utilizador do `useAuth`.
- Apresenta um fundo branco (`bg-white`), borda inferior (`border-b`).
- Apresenta um Avatar simples com iniciais à direita, com um dropdown nativo simples ou onClick que mostra o botão de logout.
</action>
<acceptance_criteria>
- `src/shared/components/layout/TopBar/TopBar.jsx` existe.
- Contém a class `bg-white`.
- Usa o hook `useLocation`.
- Usa o hook `useAuth`.
</acceptance_criteria>
</task>

<task>
<id>5</id>
<title>Personalizar Sidebar e Criar DashboardLayout</title>
<read_first>
- `src/shared/components/ui/sidebar.jsx`
- `src/context/SidebarContext.jsx`
</read_first>
<action>
1. Cria `src/shared/components/layout/DashboardLayout/DashboardLayout.jsx`.
   - Utiliza a estrutura base para encaixar a Sidebar à esquerda e a TopBar no topo do conteúdo.
   - O contêiner principal deve usar `flex h-screen overflow-hidden`.
   - A área principal deve usar `<main className="flex-1 overflow-y-auto bg-zinc-50 p-6">` e conter o `<Outlet />` do react-router.
2. Na Sidebar instanciada (usando os blocos do componente gerado pelo shadcn):
   - Configura as cores para o modo "Square" (fundo preto `bg-black`, texto branco).
   - Integra o estado de collapsed local ou através do `SidebarProvider` original do shadcn em ponte com o nosso `SidebarContext` (ou usa diretamente a prop `collapsible="icon"` da sidebar do shadcn).
   - Define a lista de navegação: Dashboard, Vendas (POS, Facturas), Produtos, Clientes, Finanças, Utilizadores, Configurações.
</action>
<acceptance_criteria>
- `src/shared/components/layout/DashboardLayout/DashboardLayout.jsx` existe e tem `Outlet`.
- DashboardLayout importa `TopBar` e os componentes/providers de `Sidebar`.
</acceptance_criteria>
</task>

<task>
<id>6</id>
<title>Configurar React Router e Entry Point</title>
<read_first>
- `src/main.jsx`
- `src/App.jsx`
</read_first>
<action>
1. Cria `src/router/index.jsx`.
   - Usa `createBrowserRouter`.
   - Define a rota base `/` redirecionando para `/dashboard`.
   - Define a rota `/login` apontando para `LoginPage`.
   - Define o wrapper `<DashboardLayout />` e injeta as child routes (`/dashboard`, `/pos`, etc.) apontando para as páginas criadas na Task 3.
2. Limpa o `src/App.jsx` (deixa apenas retornar `null` ou elimina a sua utilização se injetares o router direto no `main.jsx`).
3. Atualiza `src/main.jsx`:
   - Envolve o `<RouterProvider router={router} />` com o `<AuthProvider>` e `<SidebarProvider>`.
</action>
<acceptance_criteria>
- `src/router/index.jsx` usa `createBrowserRouter`.
- `src/main.jsx` usa `<RouterProvider>` e os contextos `AuthProvider` e `SidebarProvider`.
</acceptance_criteria>
</task>

## Verification
- Comando `npm run dev` não apresenta erros de sintaxe ou de importação.
- O ecrã no `/dashboard` apresenta a Sidebar à esquerda com fundo preto, a TopBar no topo com fundo branco e o conteúdo principal no centro.
- Clicar noutra secção do menu navega corretamente sem recarregar a página e atualiza o breadcrumb na TopBar.

## Must Haves
- Estrutura base SPA completa (Sidebar, TopBar e Content Area via Outlet).
- Contextos em funcionamento (Estado guardado e consumido).
- Rotas definidas através do `createBrowserRouter`.
