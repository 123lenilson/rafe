# Rafe

Plataforma SaaS de facturação para PMEs angolanas. Permite vender no ponto de venda (POS), emitir documentos fiscais e gerir o caixa, com uma interface pensada para a rapidez de quem está ao balcão.

> **Estado do projecto:** em desenvolvimento activo. Veja a secção [Estado actual](#estado-actual) para saber o que já funciona.

![Ecrã de Faturação](docs/faturacao.png) 

## Porquê o Rafe

Muitas PMEs angolanas precisam de emitir facturas e controlar vendas, stock e caixa, mas encontram sistemas caros, pesados ou pouco adaptados à realidade local. O Rafe nasceu como um POS simples em PHP e JavaScript e foi reconstruído de raiz como um produto SaaS, com uma arquitectura que permite evoluir para conformidade fiscal com a AGT e, mais tarde, para uma versão desktop que funcione offline.

## Tecnologias

| Camada | Tecnologias |
|---|---|
| Domínio | PHP puro (sem dependências de framework) |
| Backend | Laravel (API REST): controladores, repositórios e adaptadores |
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Estado | TanStack Query (dados do servidor) e Zustand (estado do cliente) |
| Testes | Behat (BDD), PHPUnit, Infection (testes de mutação) |
| Design | Figma, com sistema de design próprio |

## Arquitectura

O projecto segue uma **arquitectura hexagonal**: as regras de negócio vivem num domínio em PHP puro, isolado do framework, e o Laravel entra apenas como adaptador (HTTP, persistência).

```
Interface (React)  ──►  API REST (Laravel)  ──►  Aplicação  ──►  Domínio (PHP puro)
                              │                                        ▲
                              └────────── Repositórios / Adaptadores ──┘
```

Princípios que guiam o código:

- **O frontend mostra, o backend decide.** O frontend valida para dar resposta imediata ao utilizador, mas o backend recalcula e valida tudo contra a base de dados antes de gravar uma venda.
- **Regras de negócio em funções puras**, fora dos componentes, para serem fáceis de testar e de reutilizar numa futura versão offline.
- **Frontend organizado por funcionalidade**, não por tipo de ficheiro.

## Qualidade e testes

O desenvolvimento do domínio segue um fluxo **BDD → testes unitários → testes de mutação**:

1. Descreve-se o comportamento em cenários Behat.
2. Implementa-se com testes unitários em PHPUnit.
3. Valida-se a força dos testes com Infection, com meta de 100% de MSI (Mutation Score Indicator).

Classes de domínio já cobertas: `ItemPedido`, `Pedido`, `LinhaVenda` e `DocumentoFiscal`.

## Estado actual

| Área | Estado |
|---|---|
| Domínio (pedido, linha de venda, documento fiscal) | Implementado e testado |
| Emissão de Factura-Recibo (backend) | Implementada de ponta a ponta, validada via Postman |
| Ecrã de Faturação (POS) | Componentes construídos; a ligar o carrinho, os produtos e o pagamento |
| Ligação do frontend à API | Em curso |
| Conformidade fiscal AGT (assinatura digital RSA, encadeamento de hash, numeração sequencial) | Planeada |
| Versão desktop offline | Planeada |

## Interface

O desenho parte de referências de aplicações reais, estudando componentes e fluxos de interacção, e é feito no Figma antes de ser implementado. O sistema de design usa uma paleta neutra (preto, branco e cinzentos), a tipografia Inter e escalas fechadas de espaçamento em `rem`.

## Desenvolvimento assistido por IA

Parte do código é escrita com agentes de IA, sempre sob regras definidas por mim. O repositório inclui:

- `AGENTS.md`: instruções gerais para qualquer agente que trabalhe no projecto.
- `.agents/skills/arquitetura/`: regras de arquitectura (organização por funcionalidade, estado, componentes).
- `.agents/skills/identidade-visual/`: regras do sistema de design.

Eu decido a arquitectura e o âmbito de cada tarefa; os agentes implementam dentro desses limites.

## Como correr o projecto

Pré-requisitos: PHP, Composer, Node.js e npm. Ajuste os nomes das pastas à estrutura do repositório.

```bash
# Backend
cd rafe-backend
composer install
cp .env.example .env
php artisan key:generate
php artisan serve

# Frontend
cd rafe-frontend
npm install
npm run dev
```

Testes do domínio:

```bash
vendor/bin/behat
vendor/bin/phpunit
vendor/bin/infection
```

## Autor

**Lenilson Rafael Pascoal**, Luanda, Angola.
Contacto: lenilsonrafaelpascoal@gmail.com
