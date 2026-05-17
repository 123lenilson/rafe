# Phase 1: Dashboard Layout e Estrutura Base - Context

## Canonical refs
- `.planning/PROJECT.md`
- `.planning/REQUIREMENTS.md`

## Decisions
- **Gestão de Estado da Sidebar**: Utilizar LocalStorage juntamente com React Context para persistir e partilhar o estado (expandida/colapsada) de forma global sem saltos na interface ao recarregar a página.
- **Comportamento Responsivo**: Foco total em Desktop nesta fase. Comportamento mobile e complexidade de layouts responsivos (como drawers) estão fora de scope e ficam adiados para uma fase futura.
- **Arquitectura do React Router**: Utilizar `createBrowserRouter` (Data APIs introduzidas no React Router v6.4+).
- **Extensibilidade do TopBar**: Apenas Breadcrumbs automáticos e o Perfil do utilizador. Pesquisa global e notificações não entram nesta fase.

## Specifics
- O design da Sidebar deve manter a filosofia minimalista "Square-style" em preto e branco conforme o PROJECT.md.
- A Sidebar será baseada no componente oficial do Shadcn/ui, devendo ser instalada com `npx shadcn@latest add sidebar` e em seguida customizada para o estilo Square pretendido.

## Deferred
- Comportamento responsivo para telemóveis (Drawer).
- Funcionalidades avançadas da TopBar (Pesquisa Global, Notificações).
