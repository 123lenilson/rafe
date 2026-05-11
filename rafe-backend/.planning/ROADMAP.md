# Roadmap: Rafe — Módulo POS (v2.0)

Este documento define as fases de execução do **Milestone 2**.

## Milestone 2: Infraestrutura Laravel e API (Activo)

A transição do núcleo isolado (v1.0) para a aplicação Laravel em funcionamento real.

### Fase 1: Adapters Eloquent & Transação Real
**Foco:** Ligar as interfaces (Ports) à base de dados MySQL legada usando Modelos Eloquent.
- **Plano:** Mapeamento de modelos legados (tabela_pedido, tabela_venda).
- **Plano:** Implementar `MySQLTransacao` (DB::transaction).
- **Plano:** Implementar `MySQLStockRepositorio` e restantes repositórios de leitura/escrita.
- **Plano:** Testes de Integração (Database).

### Fase 2: Controladores HTTP & Rotas API
**Foco:** Expor os Use Cases (`GerirPedidoService` e `FinalizarVendaService`) à web.
- **Plano:** Configuração de Rotas e Requests de validação (Laravel FormRequests).
- **Plano:** Implementação dos Controllers de POS (Postman ready).
- **Plano:** Testes HTTP (Feature Tests).

### Fase 3: Homologação End-to-End (UAT via Postman)
**Foco:** Testar o ciclo de vida completo do Request ao Banco de Dados.
- **Plano:** Preparar uma Collection de Postman na pasta do projecto.
- **Plano:** Executar o fluxo da Fase 2 e 3 na BD real (WAMPServer).

---
*(O histórico de Milestones passados está registado na pasta `.planning/milestones`)*
