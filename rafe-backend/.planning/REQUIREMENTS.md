# Requisitos: Rafe — Módulo POS (Milestone 2)

**Definidos:** 2026-05-01
**Valor Central:** Ligar a Arquitetura Hexagonal pura (construída na v1.0) à infraestrutura real (MySQL existente no WAMP e rede HTTP via Laravel) mantendo os contratos estritos.

---

## Requisitos v2 — Milestone 2: Adapters de Infraestrutura

### Adapters de Saída (Eloquent / MySQL)

- [ ] **ADP-01**: Criar Modelos Eloquent mapeados para as tabelas legadas existentes no WAMP (`tabela_pedido`, `tabela_venda`, etc.).
- [ ] **ADP-02**: Criar `MySQLStockRepositorio` que implementa os Ports de Stock consumindo o Eloquent.
- [ ] **ADP-03**: Criar `MySQLClienteRepositorio` que implementa o Port de Clientes.
- [ ] **ADP-04**: Criar `MySQLPedidoRepositorio` e `MySQLDocumentoFiscalRepositorio` para os Ports do POS.
- [ ] **ADP-05**: Criar `MySQLPagamentoRepositorio` para o Port de Pagamentos.
- [ ] **ADP-06**: Criar `MySQLTransacao` implementando `TransacaoPort` via `DB::transaction()`.

### Adapters de Entrada (HTTP API / Laravel)

- [ ] **ENT-01**: Configurar rotas da API (`routes/api.php`) para o módulo POS.
- [ ] **ENT-02**: Criar `GerirPedidoController` expondo os endpoints para abrir pedido e adicionar/remover itens.
- [ ] **ENT-03**: Criar `FinalizarVendaController` expondo o endpoint para checkout atómico.
- [ ] **ENT-04**: Implementar FormRequests para validação da estrutura JSON (inputs HTTP).
- [ ] **ENT-05**: As respostas da API devem ser JSON claro, preparado para consumo e testes manuais no Postman.

### Segurança e Qualidade

- [ ] **SEC-01**: Rotas abertas sem autenticação temporariamente para facilitar a UAT via Postman (segurança adiada).
- [ ] **TEST-01**: Testes de Integração para os Repositórios Eloquent (garantir comunicação com BD).
- [ ] **TEST-02**: Testes de Feature (HTTP) para os Controllers garantindo código de status correcto (200, 201, 400, 422).

---

## Fora do Âmbito

| Funcionalidade | Motivo |
|----------------|--------|
| Migrations da BD do zero | A Base de Dados já existe e roda no WAMP do cliente. |
| Autenticação (Sanctum/JWT) | Adiado para facilitar testes no Postman nesta fase inicial. |
| Frontend React | Em espera até as APIs estarem robustas. |
| Exportação XML SAFT-AO | Adiado para Milestone 3. |

---

## Rastreabilidade

| Requisito | Fase | Estado |
|-----------|------|--------|
| ADP-01 a ADP-06 | Fase 1 | Pendente |
| TEST-01         | Fase 1 | Pendente |
| ENT-01 a ENT-05 | Fase 2 | Pendente |
| TEST-02         | Fase 2 | Pendente |
| SEC-01          | Fase 2 | Pendente |
