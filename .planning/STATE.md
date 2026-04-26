# STATE.md — Rafe POS

## Posição Actual

- **Fase:** 1 — Ports de Suporte (Fase 1)
- **Plano:** Completo
- **Estado:** Fase 1 concluída. Pronto para avançar para a Fase 2 (Fake Adapters)
- **Última actividade:** 2026-04-25 — Execução da Fase 1 concluída

## Referência do Projecto

Ver: `.planning/PROJECT.md` (actualizado 2026-04-22)

**Valor Central:** Domain isolado de qualquer infraestrutura — testável sem BD, sem HTTP, sem framework.
**Foco actual:** Concluída Fase 1 — Ports de Suporte. Próximo: Fase 2 (Fakes e GerirPedidoService)

## Contexto Acumulado

### O que está feito

Domain POS completo e testado com BDD + unitários + mutação:
- `app/Modules/POS/Domain/ItemPedido.php` ✅
- `app/Modules/POS/Domain/Pedido.php` ✅
- `app/Modules/POS/Domain/LinhaVenda.php` ✅
- `app/Modules/POS/Domain/DocumentoFiscal.php` ✅

### O que está por fazer

**Fase 1 (concluída):**
- Criadas 5 interfaces PHP puras (Ports de saída) e 2 Value Objects para Stock, Clientes e Pagamentos
- Sem implementação — apenas contratos
- ✅ BuscadorDeProdutoPort, VerificadorDeStockPort, StockRepositorioPort
- ✅ ClienteRepositorioPort
- ✅ PagamentoRepositorioPort

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

## Session Continuity

Last session: 2026-04-25T05:35:00+01:00
Stopped at: Concluída a execução da Fase 1, a aguardar decisão do utilizador

*Criado: 2026-04-22 após inicialização do projecto*
