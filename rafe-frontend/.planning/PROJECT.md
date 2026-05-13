# Rafe Frontend

## What This Is

O frontend de um sistema de faturação angolano chamado Rafe. O backend já existe em `../rafe-backend` e expõe uma API REST. O frontend é uma SPA construída com React + Vite 5.

## Core Value

Fornecer uma interface de facturação rápida, moderna e fidedigna para utilizadores angolanos, com um design minimalista e estruturado.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Implementar estrutura base de rotas com React Router v6
- [ ] Construir o DashboardLayout completo
- [ ] Implementar Sidebar estilo Square (minimalista, preto e branco, submenu deslizante)
- [ ] Implementar TopBar

### Out of Scope

- Implementação do backend (já existe e será consumido via API REST)

## Context

- Stack pré-configurada e intocável para os ficheiros base: Vite, Tailwind, Shadcn/ui (cores Zinc), jsconfig.js.
- Arquitectura orientada a features com pastas já definidas (`auth`, `dashboard`, `invoicing`, `pos`, etc.).
- Foco inicial de design: minimalista, preto e branco, interações dinâmicas (smooth gradients, micro-animations).

## Constraints

- **Tecnologia**: React + Vite 5 + TailwindCSS + Shadcn/ui.
- **Estrutura**: Respeitar a estrutura de pastas pré-criada em `src/`.
- **Estilo**: As variáveis CSS do Shadcn já estão definidas e o alias `@` já está mapeado para `src/`.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Design Base | Estilo Square (minimalista, preto/branco) para aspecto premium e foco no conteúdo | — Pending |

---
*Last updated: 2026-05-13 after initialization*
