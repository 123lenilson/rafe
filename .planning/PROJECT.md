# Rafe — Sistema de Facturação POS

## O que é isto

Sistema de Facturação SaaS para pequenas e médias empresas angolanas (PMEs). O módulo POS (ponto de venda) permite emitir documentos fiscais conformes com a legislação angolana (SAFT-AO, AGT), gerir pedidos de venda e controlar stock em tempo real. Desenvolvido com Arquitectura Hexagonal (Ports & Adapters) — Domain e Services em PHP puro, Adapters via Laravel.

## Valor Central

O Domain de negócio tem de ser completamente isolado de qualquer infraestrutura — testável sem base de dados, sem HTTP, sem framework — para garantir que as regras fiscais angolanas são correctamente implementadas e verificáveis.

## Requisitos

### Validados

<!-- Entregues e confirmados como valiosos. -->

- ✓ **POS-DOM-01** — `ItemPedido` com regras de negócio (quantidade, preço, desconto) — Domain Phase 1
- ✓ **POS-DOM-02** — `Pedido` como agregado de `ItemPedido` com validações de estado — Domain Phase 1
- ✓ **POS-DOM-03** — `LinhaVenda` com cálculo de subtotal, imposto e retenção — Domain Phase 1
- ✓ **POS-DOM-04** — `DocumentoFiscal` com cálculo de totais (ilíquido, IVA, retenção, a pagar) — Domain Phase 1
- ✓ **POS-TEST-01** — Cobertura completa BDD + unitários + mutação (Infection) para todo o Domain POS — Domain Phase 1

### Activos

<!-- Âmbito actual. Em construção. -->

- [ ] **STOCK-PORT-01** — Port de saída `BuscarProdutoPorId` (nome, preço, tipo P/S, imposto)
- [ ] **STOCK-PORT-02** — Port de saída `VerificarStockDisponivel` (produtoId, quantidade) → bool
- [ ] **STOCK-PORT-03** — Port de saída `SubtrairStock` (produtoId, quantidade) → void
- [ ] **CLI-PORT-01** — Port de saída `BuscarClientePorId` (id) → dados do cliente
- [ ] **PAG-PORT-01** — Port de saída `RegistarPagamento` (documentoFiscalId, valor, método) → void
- [ ] **POS-SRV-01** — `GerirPedidoService` — orquestrador do ciclo de vida do Pedido (abrir, adicionar item, remover item, fechar)
- [ ] **POS-SRV-02** — `FinalizarVendaService` — orquestrador da emissão do DocumentoFiscal (recolha → Domain → efeitos em transacção)
- [ ] **POS-TEST-02** — Fake Adapters para todos os Ports de suporte (para testes dos Services sem BD)
- [ ] **POS-TEST-03** — Cobertura completa BDD + unitários + mutação para `GerirPedidoService` e `FinalizarVendaService`

### Fora do Âmbito

<!-- Limites explícitos com justificação. -->

- Adapters Laravel (Eloquent, Controllers, Routes, Middleware) — implementados numa fase posterior após os Services estarem validados
- Frontend React — foco posterior ao backend estar completo
- Integração AGT (comunicação real) — fase posterior (após Services e Adapters estarem estáveis)
- Exportação SAFT-AO — fase posterior
- Módulos Financeiro, Compras, Relatórios — fases posteriores
- Autenticação e multi-tenancy — fora do âmbito do Milestone 1

## Contexto

**Arquitectura:** Hexagonal (Ports & Adapters)
- Hexágono (Domain + Services + Ports): PHP puro, sem framework
- Adapters de Entrada: Laravel (Controllers, Routes, Middleware) — fase posterior
- Adapters de Saída: Laravel (Eloquent ORM), AGT, Email — fase posterior
- Comunicação entre módulos: exclusivamente por Ports (interfaces PHP puras)

**Metodologia de desenvolvimento:**
1. Escrever feature em BDD (Behat) — accordar cenários
2. Escrever testes unitários (vermelho)
3. Criar a classe (verde)
4. Correr testes de mutação com Infection (sobreviver a mutantes)
5. Só então avançar para a próxima classe

**Stack:**
- PHP 8.3 + Laravel 13 (scaffold)
- PHPUnit 12 + Mockery + Infection (mutation testing)
- MySQL (base de dados)
- React + Vite (frontend — fase posterior)
- XAMPP/WAMP no Windows (servidor local)

**Estado actual do código:**
- `app/Modules/POS/Domain/` — 4 entidades completas e testadas
- `app/Http/`, `app/Models/`, `app/Providers/` — scaffold Laravel
- Sem Controllers, Services, Adapters, nem Ports criados ainda

**Conformidade legal:**
- Sistema destinado ao mercado angolano
- Deve cumprir SAFT-AO (ficheiro XML fiscal mensal)
- Comunicação com a AGT (Autoridade Geral Tributária)
- Validação de NIF angolano
- Moeda: AOA (Kwanza angolano)

## Restrições

- **Arquitectura**: Domain e Services em PHP puro — nunca tocar em PDO, Eloquent, `$_SERVER` ou qualquer artefacto de framework dentro do Hexágono
- **Módulos**: Cada módulo é uma ilha — sem imports directos entre módulos (sempre via Port)
- **Testes**: Nenhuma classe avança sem cobertura BDD + unitária + mutação
- **Plataforma**: Windows (XAMPP/WAMP) — comandos de shell devem ser compatíveis
- **Base de dados**: MySQL (não SQLite, não PostgreSQL)

## Decisões-Chave

| Decisão | Justificação | Estado |
|---------|-------------|--------|
| PHP puro para o Hexágono (sem Laravel no Domain) | Isola regras fiscais de qualquer framework; testabilidade máxima | ✓ Validado |
| Laravel apenas nos Adapters | Permite trocar o framework sem tocar nas regras de negócio | ✓ Validado |
| BDD → Unit → Mutation como metodologia obrigatória | Garante que cada classe tem comportamento especificado, implementado e resistente a mutantes | ✓ Validado |
| Ports de suporte antes dos Services | Services dependem de dados externos; Ports desbloqueiam o desenvolvimento sem esperar pelos Adapters | — Pendente |
| Fake Adapters para testes dos Services | Permite testar Services sem BD real; alinha com a arquitectura Hexagonal | — Pendente |
| Módulo POS (não "Facturação") | Nome reflecte o ponto de entrada comercial do sistema | ✓ Validado |

## Evolução

Este documento evolui nas transições de fase e nas fronteiras de milestone.

**Após cada transição de fase** (via `/gsd-transition`):
1. Requisitos invalidados? → Mover para Fora do Âmbito com motivo
2. Requisitos validados? → Mover para Validados com referência à fase
3. Novos requisitos? → Adicionar a Activos
4. Decisões a registar? → Adicionar a Decisões-Chave
5. "O que é isto" ainda é preciso? → Actualizar se houver desvio

**Após cada milestone** (via `/gsd-complete-milestone`):
1. Revisão completa de todas as secções
2. Valor Central — ainda é a prioridade certa?
3. Auditoria de Fora do Âmbito — os motivos ainda são válidos?
4. Actualizar Contexto com o estado actual

---
*Última actualização: 2026-04-22 — após inicialização do projecto*
