---
name: arquitetura
description: Regras de arquitectura de código do Rafe Frontend — organização por feature, componentes (SRP, reutilização), gestão de estado (TanStack Query para servidor, Zustand para cliente), padronização técnica. Usar sempre que a tarefa envolver criação/alteração de componentes, estrutura de pastas, estado, ou fetching de dados. Não usar para tarefas puramente visuais (cores, tipografia, espaçamento) — ver skill identidade-visual.
---

# Skill: Arquitectura — Rafe Frontend

Esta skill define **apenas** regras de arquitectura e organização de código.
Não trata de identidade visual, cores, tipografia ou espaçamento — isso pertence a uma skill separada (`skill-identidade-visual.md`).

Um agente (Claude, Codex, Gemini, Kilo) só deve carregar esta skill quando a tarefa envolver: criação de componentes, estrutura de pastas, gestão de estado, ou fetching de dados. Para tarefas puramente visuais, esta skill pode ser ignorada.

Todas as regras aqui são **mandatórias**, não sugestões. Se uma tarefa pedida entrar em conflito directo com uma regra, o agente deve parar e reportar o conflito em vez de decidir sozinho qual prevalece.

---

## 1. Organização por Feature

- O projecto é dividido por módulos de negócio: `pos`, `invoicing`, `shared`, etc.
- Cada módulo é autossuficiente: tem os seus próprios hooks, componentes, tipos e serviços.
- Apenas componentes de UI genéricos (design system) e utilitários de baixo nível sem lógica de negócio podem viver em `shared`.
- Cada módulo expõe uma única porta de entrada pública (`index.tsx` ou equivalente). Nada fora do módulo importa directamente de ficheiros internos dele.

## 2. Componentes

- Um componente tem uma única razão para mudar (SRP). Se um ficheiro de componente ultrapassar ~300 linhas ou misturar mais do que uma responsabilidade clara (ex: navegação + pesquisa + estado de caixa no mesmo ficheiro), **deve** ser fragmentado antes de continuar a adicionar funcionalidade — não depois.
- Componentes de página (roots/rotas) não implementam lógica de negócio. Servem só para orquestrar dados e renderizar componentes de UI.
- Antes de criar um componente novo, o agente **tem de** verificar no índice do projecto se já existe um componente equivalente na pasta base de UI. Nunca criar um componente do zero se já existir um que sirva com props diferentes.
- Nunca fundir dois componentes distintos e desacoplados no mesmo ficheiro para "resolver rápido" um bug (ex: nunca juntar `Sidebar` com `Sheet` num único ficheiro — isto já aconteceu e é proibido repetir).
- Variações de comportamento ou estilo de um componente existente resolvem-se com props, não com um componente novo.

## 3. Estado e Dados

- **Estado do servidor** (dados vindos da API): sempre via **TanStack Query**. Nunca guardar resposta de API em `useState` local persistente.
- **Estado do cliente partilhado** (ex: caixa aberta/fechada, filtros activos entre componentes): sempre via **Zustand**. Esta é a única ferramenta de estado global do projecto — não usar Redux nem Context API para este fim.
- `useState` local continua permitido apenas para estado que não sai do próprio componente (ex: um input de formulário isolado).
- Nunca duplicar a mesma fonte de verdade em dois `useState` separados em componentes diferentes. Se dois componentes precisam do mesmo dado, ele sobe para Zustand ou vem do TanStack Query.
- Formatadores e mappers (ex: moeda em Kwanza, datas) são sempre funções puras, isoladas em ficheiros próprios (ex: `cashHistoryFormatters.ts`), nunca misturadas na camada de UI.

## 4. Padronização Técnica

- Todo o código novo em TypeScript (`.tsx`/`.ts`). Proibido criar novo ficheiro `.jsx`.
- Nenhuma operação assíncrona (fetch, mutation) fica sem feedback visual: usar skeleton, spinner ou estado de loading do TanStack Query. Proibido deixar o ecrã em branco durante carregamento.
- Regras de layout estrutural (unidades de medida, dimensões de Sheet/Drawer, etc.) não pertencem a esta skill — ver `skill-identidade-visual.md`.

## 5. Antes de Codificar

- Nenhuma funcionalidade nova é escrita sem primeiro identificar: que dados entram, que dados saem, e onde esse componente se encaixa na estrutura de módulos existente.
- Se a tarefa pedida implicar quebrar alguma regra acima (ex: pedido explícito para "só criar rápido sem preocupar com estrutura"), o agente reporta isso ao utilizador antes de executar, não decide sozinho ignorar a regra.

---

## Nota sobre testes

O backend Laravel já segue disciplina de BDD/PHPUnit/Infection. O frontend **ainda não tem** essa cobertura padronizada — por isso, por agora, não é regra mandatória exigir testes em cada mudança estrutural do frontend. Isto fica marcado como dívida técnica a decidir mais tarde, não como regra a fingir que já existe.
