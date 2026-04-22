# STATE.md — Rafe POS

## Posição Actual

- **Fase:** Não iniciada — Ports de Suporte (Fase 1)
- **Plano:** —
- **Estado:** Pronto para planear a Fase 1
- **Última actividade:** 2026-04-22 — Projecto inicializado com GSD

## Referência do Projecto

Ver: `.planning/PROJECT.md` (actualizado 2026-04-22)

**Valor Central:** Domain isolado de qualquer infraestrutura — testável sem BD, sem HTTP, sem framework.
**Foco actual:** Fase 1 — Ports de Suporte (Stock, Clientes, Pagamentos)

## Contexto Acumulado

### O que está feito

Domain POS completo e testado com BDD + unitários + mutação:
- `app/Modules/POS/Domain/ItemPedido.php` ✅
- `app/Modules/POS/Domain/Pedido.php` ✅
- `app/Modules/POS/Domain/LinhaVenda.php` ✅
- `app/Modules/POS/Domain/DocumentoFiscal.php` ✅

### O que está por fazer

**Fase 1 (próxima):**
- Criar 5 interfaces PHP puras (Ports de saída) para Stock, Clientes e Pagamentos
- Sem implementação — apenas contratos

**Fase 2:**
- 3 Fake Adapters em memória
- BDD → Unit → Mutation para `GerirPedidoService`

**Fase 3:**
- BDD → Unit → Mutation para `FinalizarVendaService`

### Decisões importantes

- PHP puro no Hexágono — sem Laravel, sem PDO, sem `$_SERVER`
- Comunicação entre módulos apenas via Ports (interfaces)
- Metodologia obrigatória: BDD (Behat) → PHPUnit → Infection
- Adapters Laravel só no Milestone 2

### Ambiente de desenvolvimento

- Windows + WAMP (XAMPP)
- PHP 8.3 + Laravel 13 (scaffold)
- PHPUnit 12 + Mockery + Infection
- MySQL

## TODOs Pendentes

*(nenhum por agora)*

## Bloqueadores

*(nenhum por agora)*

---
*Criado: 2026-04-22 após inicialização do projecto*
