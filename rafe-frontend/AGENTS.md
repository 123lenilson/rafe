# Regras de Layout — Rafe Frontend

Estas regras são obrigatórias para qualquer tarefa que envolva criar ou modificar componentes visuais (UI).

## Unidades

- Nunca usar `vw`, `vh`, `%` ou valores fracionários (`fr`) em elementos estruturais: sidebars, drawers, painéis, modais, colunas de grid, containers principais.
- Usar sempre `px` para larguras, alturas e espaçamentos estruturais.
- Usar `rem` apenas para tipografia.

## Contenção

- Todo elemento que possa crescer (drawer, painel, área de conteúdo) deve ter `max-width` definido explicitamente em `px`.
- Nunca usar `w-full` isolado em painéis ou containers — apenas dentro de um elemento que já tenha `max-width`.

## Valores já definidos no projecto (reutilizar, não inventar novos)

- Sidebar: `230px` (definido em `--sidebar-width`)
- Drawer (Sheet): `780px`
- Conteúdo principal (dentro do `<main>` do DashboardLayout): `max-w-[1200px]`
- Coluna esquerda do CashRegisterDrawer (teclado numérico): `300px`

## Antes de qualquer alteração visual

- Indicar quais valores fixos em `px` serão usados e porquê.
- Reutilizar valores já existentes na tabela acima sempre que aplicável.
- Não reformatar código existente fora do âmbito da tarefa pedida.

## Containers de painel (Sheet/Drawer/Modal) — O container externo do painel deve ter width proporcional à tela usando vw, com min-width e max-width definidos em px para evitar que fique demasiado pequeno ou demasiado grande (exemplo: sm:!w-[45vw] sm:!min-w-[780px] sm:!max-w-[960px]). O conteúdo interno do painel (grids, colunas, textos, elementos) deve ter max-width fixo em px e usar mx-auto quando necessário, para nunca esticar mesmo que o container externo cresça. Colunas internas de largura fixa, como teclados numéricos ou listas estreitas, mantêm sempre o seu px fixo independentemente do tamanho do container externo. Esta regra aplica-se a todos os Sheets, Drawers e Modals do projecto, actuais e futuros.