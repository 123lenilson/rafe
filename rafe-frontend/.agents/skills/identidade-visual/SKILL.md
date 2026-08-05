---
name: identidade-visual
description: Identidade visual do Rafe Frontend — paleta de cores neutra, tipografia (Inter), border-radius, espaçamento, layout estrutural (px/vw), sombras, ícones, botões, inputs, tabelas, estados vazios/carregamento, animações. Usar sempre que a tarefa envolver componentes visuais, cores, Sheet/Drawer/Modal, botões, tabelas, ou qualquer alteração de UI.
---

# Skill: Identidade Visual — Rafe Frontend

Esta skill define **tudo o que é sistema visual**: cores, tipografia, espaçamento, border-radius, estrutura de layout, e comportamento de interacção/animação. Não trata de arquitectura de código, estado ou organização de módulos — isso pertence à `skill-arquitetura.md`.

Um agente (Claude, Codex, Gemini, Kilo) carrega esta skill sempre que a tarefa envolver: criação ou alteração de componentes visuais, cores, espaçamento, animações, ou estrutura de Sheet/Drawer/Modal.

Todas as regras aqui são **mandatórias**. Nenhum valor de cor, tamanho, espaçamento ou radius pode ser inventado fora do que está definido neste documento. Se for necessário um valor novo, isso é uma decisão deliberada tomada uma vez neste ficheiro — nunca um valor ad-hoc criado durante uma tarefa.

Inspiração de origem (referência, não é para copiar interfaces inteiras): estrutura e neutros do **Acctual**, combinações de cor e interacções de menu do **Square**, animações e comportamento de componentes da **Mercury**. Todas as referências foram observadas nas versões demo públicas destas aplicações.

---

## 1. Paleta de Cores

Paleta 100% neutra — sem azul, sem laranja. Preto como única cor de acção.

| Token | Valor | Papel |
|---|---|---|
| `--foreground` / `--primary` | `#101010` | Texto principal, botões primários, ícones activos |
| `--primary-hover` | `#212126` | Hover em botões pretos |
| `--primary-active` | `#000000` | Estado pressed/activo |
| `--background` | `#FFFFFF` | Fundo principal |
| `--muted` | `#F6F6F6` | Superfícies secundárias (sidebar clara, secções alternadas) |
| `--border` | `#EDEDED` | Bordas de cards, inputs, divisores |
| `--secondary-foreground` | `#575757` | Texto secundário, labels, texto de apoio |
| `--muted-foreground` | `#A3A3A3` | Texto terciário, placeholders, disabled |

Semânticas (funcionais, fora da identidade):
- Erro: `#EF4444`
- Sucesso: `#22C543`

**Regra mandatória:** é proibido usar classes de cor soltas do Tailwind (`gray-500`, `slate-400`, `zinc-300`, etc.) directamente em componentes. Usar sempre o token semântico definido acima (ex: `bg-background`, `text-muted-foreground`, `border-border`). Se faltar um tom, adiciona-se um token novo aqui, uma vez — nunca se usa um valor da paleta genérica do Tailwind directamente.

**Foco/acessibilidade:** como não há cor de destaque viva, o estado de foco usa contorno preto — `outline: 2px solid #101010` com `outline-offset: 2px` — nunca anel colorido.

**Limite de cores no ecrã:** nenhum ecrã deve introduzir mais do que os tokens definidos acima mais uma cor semântica (erro ou sucesso) ao mesmo tempo. Nunca misturar erro e sucesso decorativamente no mesmo componente sem função clara.

## 2. Tipografia

Fonte: **Inter**, com fallback `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`.

| Papel | `rem` (valor a usar) | Peso | Line-height (`rem`) | Uso |
|---|---|---|---|---|
| Display / H1 | `1.5rem` | `600` | `2rem` | Títulos de página |
| H2 | `1.0625rem` | `700` | `1.5rem` | Títulos de secção, cabeçalhos de card |
| H3 / Botão | `0.875rem` | `500` | `1.25rem` | Texto de botão, labels de formulário |
| Corpo | `0.8125rem` | `400` | `1.125rem` | Texto corrente, parágrafos |
| Corpo (ênfase) | `0.8125rem` | `500` | `1.125rem` | Texto corrente destacado |
| Legenda / Caption | `0.75rem` | `400` | `1rem` | Texto de apoio, timestamps, metadados |

**Regra mandatória:** tipografia é sempre em `rem`, nunca `px`. Proibido `text-[13px]` ou qualquer valor de fonte entre colchetes fora desta tabela.

## 3. Border-Radius

Em `rem`, não `px` — escala com as preferências de tamanho de letra/zoom do utilizador (acessibilidade), tal como a tipografia.

| Nome | Valor | Uso |
|---|---|---|
| `sm` | `0.25rem` | Badges pequenos, checkboxes |
| `md` | `0.375rem` | Inputs, cards, containers |
| `lg` | `0.5rem` | Painéis maiores, imagens |
| `full` | `9999px` (pill) | Botões, avatares — excepção: pill não precisa de escalar, é sempre "totalmente arredondado" independentemente do tamanho |

Regra transversal de identidade: **nada no sistema fica com esquinas 100% rectas.** Todo elemento visível — botão, card, input, ícone com fundo, avatar — usa um dos valores acima. É proibido `rounded-none` em componentes de UI, salvo excepção justificada e documentada aqui.

## 4. Espaçamento

Em `rem`, não `px` — escala fechada, e a razão de ser `rem` (e não `px`) é acessibilidade: um utilizador que aumenta o tamanho de letra no navegador por baixa visão precisa que o espaçamento à volta do texto cresça junto, senão o layout fica apertado e ilegível. O valor tem de vir daqui, nunca um número solto entre colchetes. A escolha entre valores próximos (ex: `xs` vs `sm`) é do agente conforme o contexto da tarefa, mas nunca fora da escala.

| Nome | Valor (`rem`) | Equivalente visual a 16px base | Quando usar |
|---|---|---|---|
| `xs` | `0.25rem` | `4px` | Entre ícone e texto, elementos deliberadamente colados (ex: label + valor no mesmo grupo) |
| `sm` | `0.5rem` | `8px` | Entre elementos relacionados dentro do mesmo componente (botões de um grupo, lista compacta) |
| `md` | `1rem` | `16px` | Espaçamento padrão entre componentes distintos |
| `lg` | `1.5rem` | `24px` | Padding interno de cards/painéis, separação de blocos numa secção |
| `xl` | `2rem` | `32px` | Separação entre secções distintas de uma página |
| `2xl` | `3rem` | `48px` | Separação major — topo/fundo de página, blocos que precisam de respirar bastante |

Se for necessário um espaço fora desta escala, adiciona-se um novo degrau aqui deliberadamente — nunca se inventa ad-hoc numa tarefa.

**Nota importante — o que continua em `px` e porquê:** as dimensões do "shell" estrutural da aplicação (largura da sidebar `230px`, drawer `780px`, `max-width` do conteúdo principal `1200px`) mantêm-se em `px`, definidas na secção 5. Isto é deliberado, não um esquecimento: são dimensões de layout que já causaram bugs reais de inconsistência entre monitores quando eram fluidas, e o padrão de sidebar/drawer com largura fixa em `px` é o mesmo que se vê no Acctual, Square e Mercury — as tuas três referências. Espaçamento interno e radius escalam com acessibilidade; a moldura da aplicação, não.

## 5. Estrutura e Layout (herdado do AGENTS.md)

### Unidades
- Nunca usar `vw`, `vh`, `%` ou valores fraccionários (`fr`) em elementos estruturais: sidebars, drawers, painéis, modais, colunas de grid, containers principais.
- Usar sempre `px` para larguras, alturas e espaçamentos estruturais.
- `rem` é exclusivo de tipografia (ver secção 2).

### Contenção
- Todo elemento que possa crescer (drawer, painel, área de conteúdo) tem `max-width` definido explicitamente em `px`.
- Nunca usar `w-full` isolado em painéis ou containers — apenas dentro de um elemento que já tenha `max-width`.

### Valores já definidos no projecto (reutilizar, não inventar novos)
- Sidebar: `230px` (`--sidebar-width`)
- Drawer (Sheet): `780px`
- Conteúdo principal (dentro do `<main>` do DashboardLayout): `max-w-[1200px]`
- Coluna esquerda do CashRegisterDrawer (teclado numérico): `300px`

### Containers de painel (Sheet/Drawer/Modal)
O container externo do painel usa width proporcional ao ecrã em `vw`, com `min-width` e `max-width` em `px` (ex: `sm:!w-[45vw] sm:!min-w-[780px] sm:!max-w-[960px]`). O conteúdo interno do painel (grids, colunas, textos) tem `max-width` fixo em `px` e usa `mx-auto` quando necessário, para nunca esticar mesmo que o container externo cresça. Colunas internas de largura fixa (teclados numéricos, listas estreitas) mantêm sempre o seu `px` fixo, independentemente do container externo. Aplica-se a todos os Sheets, Drawers e Modals, actuais e futuros.

### Divisão estrutural da aplicação (inspirado no Acctual)
- Sidebar fixa à esquerda com navegação por módulos, sempre visível em desktop.
- Área de conteúdo principal ocupa o resto do ecrã, com `max-width` definido, nunca colada às margens do ecrã em resoluções largas.
- Painéis de detalhe (Sheet/Drawer) entram como sobreposição lateral, nunca substituem o conteúdo principal.

## 6. Interacção e Menus (inspirado no Square)

- Estados de botão seguem sempre a progressão: default → hover → active → disabled, cada um com mudança visual clara (não só opacidade).
- Links de navegação activos marcam-se por peso de fonte mais forte (`500`/`700`) combinado com o token `--primary`, nunca só por cor isolada — reforça acessibilidade (não depender só de cor para indicar estado).
- Menus e dropdowns usam fundo `--background`, borda `--border`, e sombra subtil — nunca sombra pesada nem múltiplas sombras empilhadas.
- Todo elemento interactivo tem estado de foco visível (ver regra de foco na secção 1) — nunca remover o outline por defeito sem substituir por outro indicador visível.

## 7. Animação e Comportamento de Componentes (inspirado na Mercury)

- Transições de entrada/saída de painéis (Sheet, Drawer, colunas que colapsam) são sempre sequenciadas, nunca instantâneas nem todas simultâneas — um elemento sai/entra, depois o próximo, como já implementado no `CashHistoryPanel`.
- Duração de transição padrão: entre `150ms` e `300ms`. Abaixo disso sente-se abrupto, acima disso sente-se lento para uma ferramenta de gestão diária.
- Animações servem sempre para comunicar uma mudança de estado (algo apareceu, desapareceu, ou trocou de lugar) — nunca são puramente decorativas.
- Nunca animar mais do que uma dimensão ao mesmo tempo de forma não sequenciada (ex: largura e opacidade ao mesmo tempo sem coordenação) — isto já causou bugs reais no projecto (gap de dois renders no `CashHistoryPanel`).

## 8. Nunca Fazer (regras gerais de dashboard)

- Nunca usar mais do que os tokens de cor definidos na secção 1 num único ecrã.
- Nunca adicionar decoração sem função (sombras extra, gradientes, ícones supérfluos, animações sem propósito). Cada elemento visual tem de ajudar a compreensão, não impressionar.
- Nunca deixar dois elementos visualmente com o mesmo peso quando um deles é mais importante — usar contraste ou tamanho para hierarquizar.
- Nunca sobrecarregar um único ecrã com tipos de informação muito diferentes ao mesmo tempo — preferir dividir em secções ou painéis.
- Nunca ignorar responsividade mobile, mesmo sendo uma ferramenta de gestão interna — o Rafe já corre em ecrãs variados.
- Nunca copiar um padrão visual de um componente para outro por "tentativa e erro" — reutilizar o componente base existente (ver `skill-arquitetura.md`, secção 2).

## 9. Elevação e Sombras

Escala fechada — nunca inventar sombra fora daqui, e nunca empilhar mais do que uma sombra no mesmo elemento.

| Nome | Valor | Uso |
|---|---|---|
| `none` | sem sombra, só `border` | Cards em repouso dentro de listas, elementos ao nível do fundo |
| `sm` | `0 1px 2px rgba(16,16,16,0.06)` | Cards clicáveis, linhas de tabela em hover |
| `md` | `0 4px 12px rgba(16,16,16,0.08)` | Dropdowns, menus de contexto, popovers |
| `lg` | `0 8px 24px rgba(16,16,16,0.12)` | Sheet/Drawer/Modal — o painel que se sobrepõe ao conteúdo principal |

**Regra mandatória:** sombra é sempre preta com opacidade baixa (`rgba(16,16,16,...)`), nunca cinza-azulada nem colorida. Mantém a paleta 100% neutra mesmo na profundidade.

## 10. Ícones

- Biblioteca: `lucide-react` (já disponível no stack do projecto).
- Espessura de traço (`stroke-width`): `1.75` para ícones normais, `2` para ícones dentro de botões pequenos (onde precisam de mais presença visual em tamanho reduzido).
- Tamanhos permitidos (`rem`): `1rem` (~16px, inline com texto pequeno/legenda), `1.125rem` (~18px, padrão em botões e itens de menu), `1.25rem` (~20px, destaque em cabeçalhos de secção). Nenhum outro tamanho.
- Cor do ícone segue sempre o texto que o acompanha (`currentColor`) — nunca uma cor fixa independente do contexto, salvo ícones de estado semântico (erro/sucesso), que usam a cor semântica correspondente.
- Ícone sozinho sem texto (ex: botão de ícone) precisa sempre de área de toque mínima de `2rem` × `2rem` (~32px), mesmo que o ícone visualmente seja menor — para acessibilidade em ecrãs tácteis.

## 11. Botões — Tamanhos e Variantes

Altura e padding em `rem`, para que o botão cresça junto com o texto lá dentro quando o utilizador aumenta o zoom/tamanho de letra — um botão em `px` fixo com texto em `rem` a crescer acaba por cortar o texto.

| Tamanho | Altura (`rem`) | Padding horizontal (`rem`) | Uso |
|---|---|---|---|
| `sm` | `1.75rem` (~28px) | `0.75rem` (~12px) | Acções secundárias dentro de tabelas, toolbars densas |
| `md` | `2.25rem` (~36px) | `1rem` (~16px) | Padrão — a maioria dos botões da aplicação |
| `lg` | `2.75rem` (~44px) | `1.5rem` (~24px) | Acções principais de página (ex: "Criar venda", "Fechar caixa") |

Variantes (todas dentro da paleta neutra da secção 1):
- **Primário:** fundo `--primary` (`#101010`), texto branco. Uma única acção primária por ecrã/secção — nunca dois botões primários lado a lado a competir por atenção.
- **Secundário:** fundo `--muted`, texto `--foreground`, sem borda.
- **Outline:** fundo transparente, borda `--border`, texto `--foreground`. Para acções de baixo compromisso (ex: "Cancelar").
- **Destrutivo:** fundo `--background`, texto e borda na cor semântica de erro (`#EF4444`) — só a cor semântica quebra a regra da paleta neutra, e só nesta variante.
- **Ghost:** sem fundo nem borda, só texto — para acções terciárias dentro de listas ou toolbars.

Todos os botões seguem o border-radius `full` (pill) definido na secção 3, e o comportamento de estados da secção 6.

## 12. Inputs e Formulários

- Altura padrão: `2.25rem` (~36px, alinhada com o botão `md`, para nunca desalinhar visualmente numa mesma linha de formulário).
- Border-radius: `md` (`0.375rem`) — inputs não seguem o `full` dos botões, mantêm-se mais contidos visualmente.
- Borda em repouso: `--border`. Borda em foco: `--primary`, com o outline da secção 1 por cima.
- Label sempre acima do input (nunca só placeholder a fazer de label — placeholder é sempre um exemplo de valor, nunca a única identificação do campo).
- Mensagem de erro aparece abaixo do input, cor semântica de erro, tamanho `Legenda` (secção 2) — nunca só a borda a mudar de cor sem texto explicativo.
- Espaçamento entre label, input e mensagem de erro/ajuda: `xs` (secção 4).
- Espaçamento entre campos distintos do mesmo formulário: `md` (secção 4).

## 13. Tabelas

Componente central do Rafe (histórico de caixa, POS, facturação) — merece regras próprias.

- Cabeçalho (`thead`): fundo `--muted`, texto `Legenda` (secção 2) em maiúsculas, peso `500`, cor `--secondary-foreground`.
- Linhas (`tbody`): altura mínima `2.75rem` (~44px, para acompanhar o texto se o utilizador aumentar o zoom), borda inferior `--border` (`1px` — ajuste cirúrgico, fica em `px` propositadamente), sem borda entre colunas.
- Hover de linha: fundo `--muted`, sombra `sm` opcional só se a linha for clicável (indicando affordance de interacção).
- Linha seleccionada/activa: fundo `--muted`, borda esquerda de `2px` na cor `--primary` (borda fina — `px` propositado) — nunca preencher a linha toda a preto, isso quebra a legibilidade do texto.
- Alinhamento: texto à esquerda por defeito, valores numéricos/monetários à direita.
- Paginação ou "carregar mais" fica sempre fora da tabela, nunca como última linha dentro do `tbody`.
- Nunca truncar dados monetários ou datas com reticências — se o espaço for insuficiente, a coluna cresce ou o layout adapta-se, mas o valor mantém-se sempre legível por inteiro.

## 14. Estados Vazios e de Carregamento

- **Carregamento:** usar skeleton (forma aproximada do conteúdo final, fundo `--muted` com leve pulsação) em vez de spinner isolado, sempre que o conteúdo tiver estrutura previsível (tabelas, cards, listas). Spinner isolado só para acções pontuais (ex: botão em submissão).
- **Estado vazio:** nunca um ecrã em branco. Combina sempre um texto curto a explicar a ausência de dados com uma acção clara quando aplicável (ex: "Ainda não há vendas registadas hoje" + botão "Criar venda").
- **Erro de carregamento:** mensagem clara do que falhou, nunca um erro técnico cru (stack trace, código HTTP) exposto ao utilizador final, com opção de tentar novamente quando aplicável.

---

## Nota de origem

Os valores desta skill vêm de análise das versões demo públicas do Acctual, Square e Mercury, filtrados e adaptados às decisões tomadas para o Rafe (paleta 100% neutra, sem cor de destaque viva). Não é para copiar essas interfaces inteiras — é para seguir a lógica de estrutura, combinação de cor, e comportamento de interacção que elas demonstram bem.
