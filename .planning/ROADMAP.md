# Roadmap — Rafe POS: Milestone 1

**Milestone:** v1.0 — Services POS + Ports de Suporte
**Âmbito:** Domain completo ✓ → Ports de suporte → Fake Adapters → GerirPedidoService → FinalizarVendaService
**Metodologia:** BDD (Behat) → Unitários (PHPUnit) → Mutação (Infection) por cada classe

---

## Resumo das Fases

| # | Fase | Objectivo | Requisitos | Critérios de Sucesso |
|---|------|-----------|------------|----------------------|
| 1 | Ports de Suporte | Definir os contratos dos módulos externos | STOCK-01..03, CLI-01, PAG-01 | 5 interfaces PHP puras criadas, testáveis |
| 2 | Fake Adapters + GerirPedidoService | Implementar os Fakes e o Service de gestão do Pedido | FAKE-01..03, SRV-01..05, TEST-01..03 | Service testado com BDD+Unit+Mutation, sem BD |
| 3 | FinalizarVendaService | Implementar o Service de emissão do DocumentoFiscal | SRV-06..10, TEST-04..06 | Service testado com BDD+Unit+Mutation, atomicidade garantida |

---

## Fase 1 — Ports de Suporte

**Objectivo:** Criar as interfaces PHP puras que definem o contrato entre o Hexágono POS e os módulos externos (Stock, Clientes, Pagamentos). Nesta fase não existe implementação — só contratos.

**Requisitos:** STOCK-01, STOCK-02, STOCK-03, CLI-01, PAG-01

**Critérios de sucesso:**
1. Existem 5 interfaces PHP puras em `app/Modules/*/Domain/Ports/Saida/`
2. Cada interface usa apenas tipos PHP primitivos ou entidades Domain (sem dependências externas)
3. Os Ports de Stock permitem ao Service verificar produto e stock antes de criar o item
4. O Port de Clientes permite ao Service garantir que o cliente existe antes de abrir o Pedido
5. O Port de Pagamentos permite ao Service registar o pagamento após emissão do documento

**Estrutura esperada:**
```
app/Modules/Stock/Domain/Ports/Saida/
├── ProdutoRepositorioPort.php      (buscarPorId, verificarStock)
└── StockRepositorioPort.php        (subtrairStock)

app/Modules/Clientes/Domain/Ports/Saida/
└── ClienteRepositorioPort.php      (buscarPorId)

app/Modules/Pagamentos/Domain/Ports/Saida/
└── PagamentoRepositorioPort.php    (registarPagamento)
```

**Depende de:** — (sem dependências)
**Desbloqueado por esta fase:** Fase 2 (os Services precisam dos Ports para compilar)

---

## Fase 2 — Fake Adapters + GerirPedidoService

**Objectivo:** Implementar os Fake Adapters em memória para todos os Ports de suporte, e depois desenvolver o `GerirPedidoService` seguindo a metodologia BDD→Unit→Mutation.

**Requisitos:** FAKE-01, FAKE-02, FAKE-03, SRV-01, SRV-02, SRV-03, SRV-04, SRV-05, TEST-01, TEST-02, TEST-03

**Critérios de sucesso:**
1. Existem 3 Fake Adapters em memória que implementam correctamente cada Port
2. Os Fakes são configuráveis nos testes (ex: produto sem stock, cliente inexistente)
3. Cenários BDD do `GerirPedidoService` definidos e aprovados antes da implementação
4. `GerirPedidoService` passa todos os testes unitários (verde)
5. `GerirPedidoService` sobrevive aos testes de mutação do Infection (score ≥ 80%)
6. O Service nunca importa directamente de outro módulo (apenas via Port)
7. O Service segue as 3 fases: Recolha → Domain → Efeitos

**Estrutura esperada:**
```
tests/Unit/POS/Fakes/
├── FakeProdutoRepositorio.php
├── FakeClienteRepositorio.php
└── FakePagamentoRepositorio.php

app/Modules/POS/Services/
└── GerirPedidoService.php

tests/Unit/POS/Services/
└── GerirPedidoServiceTest.php

tests/BDD/features/pos/
└── gerir-pedido.feature
```

**Depende de:** Fase 1 (Ports definidos)
**Desbloqueado por esta fase:** Fase 3

---

## Fase 3 — FinalizarVendaService

**Objectivo:** Implementar o `FinalizarVendaService` que orquestra a emissão do `DocumentoFiscal` — recolha de dados, Domain, e efeitos (pagamento + stock) com atomicidade garantida. Metodologia BDD→Unit→Mutation.

**Requisitos:** SRV-06, SRV-07, SRV-08, SRV-09, SRV-10, TEST-04, TEST-05, TEST-06

**Critérios de sucesso:**
1. Cenários BDD do `FinalizarVendaService` definidos e aprovados antes da implementação
2. `FinalizarVendaService` passa todos os testes unitários (verde)
3. `FinalizarVendaService` sobrevive aos testes de mutação do Infection (score ≥ 80%)
4. A atomicidade é testada: se o registo de pagamento falhar, o DocumentoFiscal não é persistido
5. O Service rejeita correctamente Pedidos sem itens
6. O Service segue as 3 fases: Recolha → Domain → Efeitos (dentro de abstracção de transacção)
7. Nenhuma dependência directa de Laravel, PDO ou qualquer infraestrutura no Service

**Estrutura esperada:**
```
app/Modules/POS/Services/
└── FinalizarVendaService.php

tests/Unit/POS/Services/
└── FinalizarVendaServiceTest.php

tests/BDD/features/pos/
└── finalizar-venda.feature
```

**Depende de:** Fase 2 (Fakes + GerirPedidoService)
**Desbloqueado por esta fase:** Milestone 1 completo → Adapters Laravel (Milestone 2)

---

## Estado

| Fase | Estado | Progresso |
|------|--------|-----------|
| 1 — Ports de Suporte | ✅ Completa | 100% |
| 2 — Fake Adapters + GerirPedidoService | 🔲 Por iniciar | 0% |
| 3 — FinalizarVendaService | 🔲 Bloqueada | — |

---

## Legenda

- 🔲 Por iniciar
- 🔄 Em progresso
- ✅ Completa
- 🚫 Bloqueada

---
*Roadmap criado: 2026-04-22*
*Última actualização: 2026-04-25 após conclusão da Fase 1*
