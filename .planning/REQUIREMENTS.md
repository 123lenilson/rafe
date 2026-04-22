# Requisitos: Rafe — Módulo POS

**Definidos:** 2026-04-22
**Valor Central:** O Domain de negócio tem de ser completamente isolado de qualquer infraestrutura — testável sem base de dados, sem HTTP, sem framework — para garantir que as regras fiscais angolanas são correctamente implementadas e verificáveis.

---

## Requisitos v1 — Milestone 1: Services POS + Ports de Suporte

### Domain POS (já validado)

- [x] **DOM-01**: O sistema valida que um `ItemPedido` tem quantidade maior que zero e preço não negativo
- [x] **DOM-02**: O sistema valida que um `Pedido` não pode ser criado sem itens
- [x] **DOM-03**: O sistema calcula correctamente o subtotal de uma `LinhaVenda` com desconto e imposto
- [x] **DOM-04**: O sistema distingue IVA de Retenção na Fonte numa `LinhaVenda`
- [x] **DOM-05**: O sistema calcula `totalIlíquido`, `totalIVA`, `totalRetenção` e `valorAPagar` num `DocumentoFiscal`
- [x] **DOM-06**: O sistema valida que um `DocumentoFiscal` tem apenas tipos fiscais válidos (Fatura, Fatura-Recibo, etc.)
- [x] **DOM-07**: Toda a lógica Domain tem cobertura BDD + testes unitários + mutação (Infection)

### Ports de Suporte — Módulo Stock

- [ ] **STOCK-01**: O sistema define o contrato `BuscarProdutoPorId` que devolve nome, preço, tipo (Produto/Serviço) e taxa de imposto
- [ ] **STOCK-02**: O sistema define o contrato `VerificarStockDisponivel` que aceita ID do produto e quantidade e devolve booleano
- [ ] **STOCK-03**: O sistema define o contrato `SubtrairStock` que aceita ID do produto e quantidade e executa a baixa (void)

### Ports de Suporte — Módulo Clientes

- [ ] **CLI-01**: O sistema define o contrato `BuscarClientePorId` que devolve os dados do cliente (nome, NIF, etc.)

### Ports de Suporte — Módulo Pagamentos

- [ ] **PAG-01**: O sistema define o contrato `RegistarPagamento` que aceita ID do documento fiscal, valor e método de pagamento (void)

### Fake Adapters (Para Testes)

- [ ] **FAKE-01**: Existe um `FakeProdutoRepositorio` que implementa os Ports de Stock em memória
- [ ] **FAKE-02**: Existe um `FakeClienteRepositorio` que implementa o Port de Clientes em memória
- [ ] **FAKE-03**: Existe um `FakePagamentoRepositorio` que implementa o Port de Pagamentos em memória

### Service: GerirPedido

- [ ] **SRV-01**: O Service consegue abrir um novo `Pedido` através do Port de Clientes (valida que o cliente existe)
- [ ] **SRV-02**: O Service consegue adicionar um `ItemPedido` ao `Pedido` através do Port de Stock (valida produto e stock)
- [ ] **SRV-03**: O Service consegue remover um `ItemPedido` do `Pedido`
- [ ] **SRV-04**: O Service rejeita adicionar item quando o stock é insuficiente (lança DomainException)
- [ ] **SRV-05**: O Service rejeita operações num `Pedido` já fechado

### Service: FinalizarVenda

- [ ] **SRV-06**: O Service solicita ao Domain a criação do `DocumentoFiscal` a partir do `Pedido` fechado
- [ ] **SRV-07**: O Service regista o pagamento via Port de Pagamentos após emissão do documento
- [ ] **SRV-08**: O Service subtrai stock via Port de Stock após emissão do documento
- [ ] **SRV-09**: O Service garante que se qualquer efeito falhar (pagamento, stock), o `DocumentoFiscal` não é persistido (atomicidade)
- [ ] **SRV-10**: O Service rejeita finalizar um `Pedido` sem itens

### Qualidade — Services

- [ ] **TEST-01**: `GerirPedidoService` tem cobertura BDD completa (cenários Behat definidos e aprovados)
- [ ] **TEST-02**: `GerirPedidoService` tem testes unitários (vermelho → verde)
- [ ] **TEST-03**: `GerirPedidoService` sobrevive aos testes de mutação com Infection
- [ ] **TEST-04**: `FinalizarVendaService` tem cobertura BDD completa (cenários Behat definidos e aprovados)
- [ ] **TEST-05**: `FinalizarVendaService` tem testes unitários (vermelho → verde)
- [ ] **TEST-06**: `FinalizarVendaService` sobrevive aos testes de mutação com Infection

---

## Requisitos v2 — Fases Futuras

### Adapters Laravel (Saída)

- **ADP-01**: `MySQLProdutoRepo` implementa os Ports de Stock via Eloquent
- **ADP-02**: `MySQLClienteRepo` implementa o Port de Clientes via Eloquent
- **ADP-03**: `MySQLPagamentoRepo` implementa o Port de Pagamentos via Eloquent

### Adapters Laravel (Entrada)

- **ENT-01**: `PedidoController` (Laravel) expõe `GerirPedidoService` via HTTP
- **ENT-02**: `VendaController` (Laravel) expõe `FinalizarVendaService` via HTTP
- **ENT-03**: Rotas Laravel definidas para os endpoints de POS
- **ENT-04**: Middleware de autenticação aplicado às rotas de POS

### Conformidade Legal

- **LEGAL-01**: `DocumentoFiscal` gera XML compatível com SAFT-AO
- **LEGAL-02**: Comunicação com a AGT após emissão de documento fiscal
- **LEGAL-03**: Validação de NIF angolano no módulo Clientes

---

## Fora do Âmbito

| Funcionalidade | Motivo |
|----------------|--------|
| Frontend React | Foco posterior — backend primeiro |
| Autenticação e multi-tenancy | Fora do Milestone 1 |
| Módulo Financeiro (Caixa, Reconciliação) | Fase posterior |
| Módulo Compras (Encomendas, Recepção) | Fase posterior |
| Módulo Relatórios (SAFT-AO, Mapas IVA) | Fase posterior |
| Integração AGT em tempo real | Fase posterior (Milestone 2) |
| Multi-armazém e gestão de lotes | Fora do âmbito do POS básico |

---

## Rastreabilidade

| Requisito | Fase | Estado |
|-----------|------|--------|
| DOM-01 a DOM-07 | — | ✓ Completo |
| STOCK-01 | Fase 1 | Pendente |
| STOCK-02 | Fase 1 | Pendente |
| STOCK-03 | Fase 1 | Pendente |
| CLI-01 | Fase 1 | Pendente |
| PAG-01 | Fase 1 | Pendente |
| FAKE-01 | Fase 1 | Pendente |
| FAKE-02 | Fase 1 | Pendente |
| FAKE-03 | Fase 1 | Pendente |
| SRV-01 | Fase 2 | Pendente |
| SRV-02 | Fase 2 | Pendente |
| SRV-03 | Fase 2 | Pendente |
| SRV-04 | Fase 2 | Pendente |
| SRV-05 | Fase 2 | Pendente |
| TEST-01 | Fase 2 | Pendente |
| TEST-02 | Fase 2 | Pendente |
| TEST-03 | Fase 2 | Pendente |
| SRV-06 | Fase 3 | Pendente |
| SRV-07 | Fase 3 | Pendente |
| SRV-08 | Fase 3 | Pendente |
| SRV-09 | Fase 3 | Pendente |
| SRV-10 | Fase 3 | Pendente |
| TEST-04 | Fase 3 | Pendente |
| TEST-05 | Fase 3 | Pendente |
| TEST-06 | Fase 3 | Pendente |

**Cobertura:**
- Requisitos v1: 25 total (7 já completos + 18 activos)
- Mapeados para fases: 18
- Por mapear: 0 ✓

---
*Requisitos definidos: 2026-04-22*
*Última actualização: 2026-04-22 após inicialização do projecto*
