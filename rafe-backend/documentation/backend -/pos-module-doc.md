
## 10. Módulo POS — Implementação Completa (Milestone 2)

> **Estado: ✅ Funcional e testado via Postman**
> Data de conclusão: Maio 2026

O módulo POS (Ponto de Venda) é o primeiro módulo do Rafe implementado de ponta a ponta com arquitectura hexagonal real, desde a API REST até à base de dados MySQL. Contém dois casos de uso completos: **GerirPedidoService** e **FinalizarVendaService**.

---

### 10.1 Visão Geral do Fluxo POS

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        FLUXO COMPLETO DO POS                           │
│                                                                        │
│  Postman/Browser                                                       │
│       │                                                                │
│       ▼                                                                │
│  ┌─────────┐    ┌──────────────┐    ┌──────────────┐    ┌───────────┐ │
│  │ Routes  │───▶│ Controllers  │───▶│  Services    │───▶│  Domain   │ │
│  │ api.php │    │ (Driving     │    │ (Orquestr.)  │    │ (Regras)  │ │
│  │         │    │  Adapters)   │    │              │    │           │ │
│  └─────────┘    └──────────────┘    └──────┬───────┘    └───────────┘ │
│                                            │                           │
│                                            ▼                           │
│                                   ┌──────────────┐                    │
│                                   │ MySQL Adapt. │                    │
│                                   │ (Driven      │                    │
│                                   │  Adapters)   │                    │
│                                   └──────┬───────┘                    │
│                                          │                             │
│                                          ▼                             │
│                                   ┌──────────────┐                    │
│                                   │   MySQL BD   │                    │
│                                   │  (wenkamba)  │                    │
│                                   └──────────────┘                    │
└─────────────────────────────────────────────────────────────────────────┘
```

O sistema tem **4 endpoints** REST:

| # | Método | Endpoint | Controller | Service |
|---|--------|----------|------------|---------|
| 1 | POST | `/api/pos/pedido/iniciar` | GerirPedidoController::iniciar | GerirPedidoService::iniciarPedido |
| 2 | POST | `/api/pos/pedido/{id}/itens` | GerirPedidoController::adicionarItem | GerirPedidoService::adicionarItem |
| 3 | DELETE | `/api/pos/pedido/{id}/itens/{idProduto}` | GerirPedidoController::removerItem | GerirPedidoService::removerItem |
| 4 | POST | `/api/pos/venda/finalizar` | FinalizarVendaController::finalizar | FinalizarVendaService::finalizar |

---

### 10.2 Estrutura de Pastas do POS

```
app/Modules/POS/
├── Domain/                                    ← NÚCLEO PURO (sem dependências externas)
│   ├── Pedido.php                             ← Entidade: carrinho de compras
│   ├── ItemPedido.php                         ← Value Object: linha do carrinho
│   ├── DocumentoFiscal.php                    ← Entidade: documento emitido (Fatura, FR)
│   ├── LinhaVenda.php                         ← Value Object: linha do documento fiscal
│   └── Ports/
│       └── Saida/
│           ├── PedidoRepositorioPort.php      ← Interface: persistência do Pedido
│           ├── DocumentoFiscalRepositorioPort.php ← Interface: persistência do Documento
│           └── TransacaoPort.php              ← Interface: atomicidade (DB::transaction)
│
├── Services/                                  ← ORQUESTRADORES (coordenam o fluxo)
│   ├── GerirPedidoService.php                 ← Caso de uso: gerir carrinho
│   └── FinalizarVendaService.php              ← Caso de uso: fechar venda
│
└── Adapters/
    ├── Entrada/                               ← DRIVING ADAPTERS (recebem HTTP)
    │   └── Http/
    │       ├── Controllers/
    │       │   ├── GerirPedidoController.php
    │       │   └── FinalizarVendaController.php
    │       └── Requests/
    │           ├── AdicionarItemPedidoRequest.php  ← Validação Laravel
    │           └── FinalizarVendaRequest.php       ← Validação Laravel
    │
    └── Saida/                                 ← DRIVEN ADAPTERS (escrevem na BD)
        ├── MySQLPedidoRepositorio.php
        ├── MySQLDocumentoFiscalRepositorio.php
        └── MySQLTransacao.php
```

**Módulos de suporte** (cada um na sua pasta, comunicam via Ports):

```
app/Modules/Stock/
├── Domain/
│   ├── DadosProduto.php                       ← Value Object transportado via Port
│   └── Ports/Saida/
│       ├── BuscadorDeProdutoPort.php          ← Buscar dados do produto
│       ├── VerificadorDeStockPort.php         ← Verificar disponibilidade
│       ├── SubtrairStockPort.php              ← Abater stock
│       └── StockRepositorioPort.php           ← Agrega as 3 interfaces acima
└── Adapters/Saida/
    └── MySQLStockRepositorio.php              ← Implementa TODAS as interfaces

app/Modules/Clientes/
├── Domain/Ports/Saida/
│   └── ClienteRepositorioPort.php
└── Adapters/Saida/
    └── MySQLClienteRepositorio.php

app/Modules/Pagamentos/
├── Domain/Ports/Saida/
│   └── PagamentoRepositorioPort.php
└── Adapters/Saida/
    └── MySQLPagamentoRepositorio.php
```

---

### 10.3 Caso de Uso 1 — GerirPedidoService (Gerir o Carrinho)

Este caso de uso permite ao operador do POS **iniciar um pedido**, **adicionar itens** e **remover itens** do carrinho antes de finalizar a venda.

#### 10.3.1 Fluxo "Iniciar Pedido"

```
POST /api/pos/pedido/iniciar
│
▼
routes/api.php
  Route::post('/pedido/iniciar', [GerirPedidoController::class, 'iniciar'])
│
▼
GerirPedidoController::iniciar()
  → Não recebe body (pedido vazio)
  → Chama $this->service->iniciarPedido()
  → Devolve JSON: { success: true, data: { pedido_id: 42 } }
│
▼
GerirPedidoService::iniciarPedido()
  → Consulta $this->pedidoRepo->proximoNumeroPedido()
  → Devolve o próximo ID disponível (MAX(n_pedido) + 1)
│
▼
MySQLPedidoRepositorio::proximoNumeroPedido()
  → SELECT MAX(n_pedido) FROM pedido
  → Retorna max + 1 (ou 1 se tabela vazia)
```

> **Nota:** O pedido ainda não existe na BD neste ponto. Só é persistido quando o primeiro item é adicionado. O `pedido_id` é reservado para uso nos próximos passos.

#### 10.3.2 Fluxo "Adicionar Item"

```
POST /api/pos/pedido/42/itens
Body: { "produto_id": 4, "quantidade": 2, "desconto_percentagem": 0 }
│
▼
routes/api.php
  Route::post('/pedido/{idPedido}/itens', [GerirPedidoController::class, 'adicionarItem'])
│
▼
AdicionarItemPedidoRequest (Form Request — VALIDAÇÃO)
  → produto_id: required|integer
  → quantidade: required|integer|min:1
  → desconto_percentagem: nullable|numeric|min:0|max:100
  → Se falhar → Laravel devolve 422 automaticamente com erros
│
▼
GerirPedidoController::adicionarItem($idPedido, $request)
  → Extrai produto_id e quantidade do request validado
  → Chama $this->service->adicionarItem(42, 4, 2)
│
▼
GerirPedidoService::adicionarItem(42, 4, 2)
  │
  ├─ FASE 1: RECOLHA
  │   → $produto = $this->buscadorProduto->buscarPorId(4)
  │     → MySQLStockRepositorio consulta tabela `produto` com JOIN em `imposto`
  │     → Devolve DadosProduto(id:4, nome:"Ensaio Sobre a Cegueira", preco:1490, tipo:"P", taxa:7.0)
  │   → Se produto null → throw DomainException('Produto não encontrado')
  │
  │   → $this->verificadorStock->temStockDisponivel(4, 2)
  │     → MySQLStockRepositorio verifica: produto.qtd >= 2
  │     → Se serviço → sempre true (serviços não têm stock físico)
  │   → Se false → throw DomainException('Stock insuficiente')
  │
  ├─ FASE 2: DOMAIN
  │   → Cria ItemPedido(idProduto:4, descricao:"Ensaio...", qtd:2, preco:1490, desc:0, imp:7.0)
  │     → ItemPedido valida: quantidade > 0 ✓, preço >= 0 ✓, desconto 0-100 ✓
  │   → Busca pedido existente: $this->pedidoRepo->buscarPorId(42)
  │     → Se null → Cria novo Pedido([$item], 42)
  │     → Se existe → $pedido->adicionarItem($item)
  │       → Se produto já existe no carrinho → substitui (actualiza quantidade)
  │       → Se produto novo → adiciona ao array
  │
  └─ FASE 3: PERSISTÊNCIA
      → $this->pedidoRepo->salvar($pedido)
        → MySQLPedidoRepositorio:
          → DELETE FROM pedido WHERE n_pedido = 42 (limpa linhas anteriores)
          → INSERT INTO pedido para cada ItemPedido (recria todas as linhas)
```

#### 10.3.3 Fluxo "Remover Item"

```
DELETE /api/pos/pedido/42/itens/4
│
▼
GerirPedidoService::removerItem(42, 4)
  → Busca pedido: $this->pedidoRepo->buscarPorId(42)
  → Se null → throw DomainException('Pedido não encontrado')
  → $pedido->removerItem(4)  — Domain remove do array
  → Se carrinho ficou vazio → $this->pedidoRepo->eliminar(42)
  → Se ainda tem itens → $this->pedidoRepo->salvar($pedido)
```

---

### 10.4 Caso de Uso 2 — FinalizarVendaService (Fechar a Venda)

Este é o caso de uso mais crítico — converte o **Pedido** (carrinho) num **DocumentoFiscal** (fatura), abate stock, regista pagamento e elimina o pedido. Tudo dentro de uma **transacção atómica**.

#### 10.4.1 Fluxo Completo "Finalizar Venda"

```
POST /api/pos/venda/finalizar
Body: {
    "pedido_id": 42,
    "valor_entregue": 50000.0,
    "metodo_pagamento": "numerario",
    "tipo_documento": "Fatura-Recibo"
}
│
▼
FinalizarVendaRequest (Form Request — VALIDAÇÃO)
  → pedido_id: required|integer
  → valor_entregue: required|numeric|min:0
  → metodo_pagamento: required|string
  → tipo_documento: required|string|in:Fatura,Fatura-Recibo
│
▼
FinalizarVendaController::finalizar($request)
  → Chama $this->service->finalizar(42, 'Fatura-Recibo', 'numerario', 50000.0)
│
▼
FinalizarVendaService::finalizar(42, 'Fatura-Recibo', 'numerario', 50000.0)
│
├─ FASE 1: RECOLHA
│   → $pedido = $this->pedidoRepo->buscarPorId(42)
│     → MySQLPedidoRepositorio: SELECT * FROM pedido WHERE n_pedido = 42
│     → Reconstrói Pedido com ItemPedido[] a partir das linhas da BD
│   → Se null → throw DomainException('Pedido não pode estar vazio')
│
├─ FASE 2: DOMAIN — Conversão Pedido → DocumentoFiscal
│   → Para cada ItemPedido do Pedido, cria uma LinhaVenda:
│     LinhaVenda(idProduto, descricao, quantidade, preco, desconto, imposto)
│   → Cria DocumentoFiscal('Fatura-Recibo', $linhasVenda)
│     → DocumentoFiscal valida tipo ∈ ['Fatura','Fatura-Recibo','Factura-Proforma','Orçamento']
│     → Valida que tem pelo menos 1 linha
│
└─ FASE 3: EFEITOS (TRANSACÇÃO ATÓMICA)
    → $this->transacao->executar(function() { ... })
      → MySQLTransacao usa DB::transaction() do Laravel
      → Se qualquer passo falhar → ROLLBACK automático
    │
    ├─ 3a) ABATER STOCK
    │   → Para cada item do pedido:
    │     → $this->stockRepo->subtrair(idProduto, quantidade)
    │       → MySQLStockRepositorio:
    │         → Se serviço → ignora (serviços não têm stock)
    │         → Se produto → UPDATE produto SET qtd = qtd - 2 WHERE IDPRODUTO = 4
    │         → Se stock < quantidade → throw DomainException
    │   → Catch rethrow: 'Stock insuficiente no momento do checkout'
    │
    ├─ 3b) GUARDAR DOCUMENTO FISCAL
    │   → $this->documentoRepo->salvar($documento)
    │     → MySQLDocumentoFiscalRepositorio:
    │       → Calcula próximo número: MAX(idVenda) + 1
    │       → Gera código: "FR 2026/1014"
    │       → Para cada LinhaVenda → INSERT INTO venda com:
    │         Produto_idProduto, Qtd, preconormal, iva, datavenda, hora,
    │         N_fat, codigo_doc, desconto, cliente (ID=36 → "Consumidor Final"),
    │         Tipo_docum, iva_valor, caixa, condicao, Nome, Descricao,
    │         empresa, Usuario
    │       → Retorna idVenda da primeira inserção
    │
    ├─ 3c) REGISTAR PAGAMENTO
    │   → $this->pagamentoRepo->registar($idDocumento, 50000.0, 'numerario')
    │     → MySQLPagamentoRepositorio:
    │       → Busca N_fat do documento via Venda::find($id)
    │       → INSERT INTO forma_pago (forma, valor, N_FACTURA, dataa, empresa, usuario)
    │
    └─ 3d) ELIMINAR PEDIDO
        → $this->pedidoRepo->eliminar(42)
          → DELETE FROM pedido WHERE n_pedido = 42
          → Carrinho limpo — venda concluída!
│
▼
Controller devolve:
{ "success": true, "data": { "documento_id": 1014 }, "message": "Venda finalizada com sucesso." }
```

---

### 10.5 As Entidades do Domain POS

#### ItemPedido — Linha do carrinho (antes da venda)

```php
// app/Modules/POS/Domain/ItemPedido.php
new ItemPedido(
    idProduto: 4,
    descricao: 'Ensaio Sobre a Cegueira',
    quantidade: 2,
    preco: 1490.0,
    desconto: 0.0,    // percentagem
    imposto: 7.0       // percentagem IVA
)
```

| Método | Fórmula | Exemplo |
|--------|---------|---------|
| `subtotal()` | qty × preço | 2 × 1490 = 2980 |
| `subtotalComDesconto()` | subtotal - (subtotal × desc/100) | 2980 - 0 = 2980 |
| `valorImposto()` | subtotalComDesc × imp/100 | 2980 × 0.07 = 208.6 |
| `totalLinha()` | subtotalComDesc + valorImposto | 2980 + 208.6 = 3188.6 |
| `temRetencao()` | imposto === 6.5 | false (7% ≠ 6.5%) |

#### Pedido — O carrinho agregado

```php
// app/Modules/POS/Domain/Pedido.php
$pedido = new Pedido([$item1, $item2], idPedido: 42);
$pedido->totalIliquido();  // soma de subtotalComDesconto de todos os itens
$pedido->totalIva();       // soma do IVA (exclui itens com retenção 6.5%)
$pedido->valorAPagar();    // totalIliquido + totalIva
```

#### LinhaVenda — Linha do documento emitido (após a venda)

Mesma estrutura do `ItemPedido`, mas **imutável** — representa os valores congelados no momento da emissão.

#### DocumentoFiscal — O documento emitido

```php
// app/Modules/POS/Domain/DocumentoFiscal.php
$doc = new DocumentoFiscal('Fatura-Recibo', $linhasVenda);
// Tipos válidos: 'Fatura', 'Fatura-Recibo', 'Factura-Proforma', 'Orçamento'
```

---

### 10.6 Ports e Adapters — O Contrato entre Camadas

#### Ports de Saída (Interfaces no Domain)

| Port | Módulo | Métodos |
|------|--------|---------|
| `PedidoRepositorioPort` | POS | salvar, buscarPorId, proximoNumeroPedido, eliminar |
| `DocumentoFiscalRepositorioPort` | POS | salvar, buscarPorId, proximoNumeroDocumento |
| `TransacaoPort` | POS | executar(callable) — garante atomicidade |
| `BuscadorDeProdutoPort` | Stock | buscarPorId → DadosProduto |
| `VerificadorDeStockPort` | Stock | temStockDisponivel(id, qty) → bool |
| `SubtrairStockPort` | Stock | subtrair(id, qty) |
| `StockRepositorioPort` | Stock | Agrega os 3 Ports acima |
| `ClienteRepositorioPort` | Clientes | buscarPorId → array |
| `PagamentoRepositorioPort` | Pagamentos | registar(id, valor, metodo) |

#### Adapters MySQL (Implementações reais)

| Adapter | Implementa | Tabelas MySQL |
|---------|-----------|---------------|
| `MySQLPedidoRepositorio` | PedidoRepositorioPort | `pedido` |
| `MySQLDocumentoFiscalRepositorio` | DocumentoFiscalRepositorioPort | `venda` |
| `MySQLTransacao` | TransacaoPort | (usa DB::transaction) |
| `MySQLStockRepositorio` | 4 Ports de Stock | `produto`, `imposto` |
| `MySQLClienteRepositorio` | ClienteRepositorioPort | `cliente` |
| `MySQLPagamentoRepositorio` | PagamentoRepositorioPort | `forma_pago`, `venda` |

---

### 10.7 Injecção de Dependência — AppServiceProvider

O Laravel resolve automaticamente as dependências via `AppServiceProvider.php`. Quando o Controller precisa do Service, e o Service precisa dos Ports, o Laravel sabe qual Adapter MySQL injectar:

```php
// app/Providers/AppServiceProvider.php
public function register(): void
{
    // Transação
    $this->app->bind(TransacaoPort::class, MySQLTransacao::class);

    // Stock (uma classe implementa 4 interfaces)
    $this->app->bind(BuscadorDeProdutoPort::class, MySQLStockRepositorio::class);
    $this->app->bind(VerificadorDeStockPort::class, MySQLStockRepositorio::class);
    $this->app->bind(SubtrairStockPort::class, MySQLStockRepositorio::class);
    $this->app->bind(StockRepositorioPort::class, MySQLStockRepositorio::class);

    // Clientes
    $this->app->bind(ClienteRepositorioPort::class, MySQLClienteRepositorio::class);

    // POS
    $this->app->bind(PedidoRepositorioPort::class, MySQLPedidoRepositorio::class);
    $this->app->bind(DocumentoFiscalRepositorioPort::class, MySQLDocumentoFiscalRepositorio::class);

    // Pagamentos
    $this->app->bind(PagamentoRepositorioPort::class, MySQLPagamentoRepositorio::class);
}
```

**Cadeia de resolução automática:**

```
Request HTTP chega
    → Laravel resolve GerirPedidoController
        → Controller precisa de GerirPedidoService no construtor
            → Service precisa de ClienteRepositorioPort → Laravel injeta MySQLClienteRepositorio
            → Service precisa de BuscadorDeProdutoPort → Laravel injeta MySQLStockRepositorio
            → Service precisa de VerificadorDeStockPort → Laravel injeta MySQLStockRepositorio
            → Service precisa de PedidoRepositorioPort → Laravel injeta MySQLPedidoRepositorio
```

---

### 10.8 Tratamento Global de Erros

Qualquer `DomainException` lançada em qualquer camada é capturada pelo handler global em `bootstrap/app.php`:

```php
->withExceptions(function (Exceptions $exceptions): void {
    $exceptions->render(function (\DomainException $e, \Illuminate\Http\Request $request) {
        if ($request->is('api/*')) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    });
})
```

**Exemplos de respostas de erro:**

```json
// Produto não encontrado
{ "success": false, "message": "Produto não encontrado" }

// Stock insuficiente
{ "success": false, "message": "Stock insuficiente" }

// Pedido vazio
{ "success": false, "message": "Pedido não pode estar vazio" }

// Tipo de documento inválido (capturado pelo Form Request → 422)
{ "message": "The tipo documento field is not valid.", "errors": { ... } }
```

---

### 10.9 Eloquent Models (Mapeamento BD)

Os Models Eloquent servem apenas como ponte entre os Adapters e as tabelas MySQL. Não contêm lógica de negócio.

| Model | Tabela | Campos principais |
|-------|--------|-------------------|
| `Produto` | `produto` | IDPRODUTO, descricao, venda, qtd, ps, imposto |
| `Venda` | `venda` | idVenda, Produto_idProduto, Qtd, preconormal, iva, N_fat, codigo_doc, cliente, Tipo_docum |
| `PedidoTabela` | `pedido` | n_pedido, id_produto, descricao, qtd, preco, desconto, imposto |
| `Cliente` | `cliente` | idcliente, nome, nif, email, telefone |
| `Imposto` | `imposto` | idimposto, percentagem |
| `FormaPago` | `forma_pago` | forma, valor, N_FACTURA, dataa |

---

### 10.10 Rotas API

```php
// routes/api.php
Route::prefix('pos')->group(function () {
    // Gerir Pedido (carrinho)
    Route::post('/pedido/iniciar', [GerirPedidoController::class, 'iniciar']);
    Route::post('/pedido/{idPedido}/itens', [GerirPedidoController::class, 'adicionarItem']);
    Route::delete('/pedido/{idPedido}/itens/{idProduto}', [GerirPedidoController::class, 'removerItem']);

    // Finalizar Venda
    Route::post('/venda/finalizar', [FinalizarVendaController::class, 'finalizar']);
});
```

Todos os endpoints estão sob o prefixo `/api/pos/` (o Laravel adiciona `/api` automaticamente).

---

### 10.11 Postman Collection

O ficheiro `Rafe-POS.postman_collection.json` na raiz do projecto contém os 4 endpoints configurados para teste imediato:

1. **Iniciar Pedido** → `POST {{base_url}}/api/pos/pedido/iniciar`
2. **Adicionar Item** → `POST {{base_url}}/api/pos/pedido/{{pedido_id}}/itens`
3. **Remover Item** → `DELETE {{base_url}}/api/pos/pedido/{{pedido_id}}/itens/1`
4. **Finalizar Venda** → `POST {{base_url}}/api/pos/venda/finalizar`

Variáveis: `base_url = http://localhost/rafe/public`, `pedido_id = 1`

---

### 10.12 Diagrama de Dependências entre Módulos

```
                    ┌──────────────────┐
                    │   Módulo POS     │
                    │                  │
                    │  GerirPedido     │
                    │  FinalizarVenda  │
                    └─────┬──┬──┬──────┘
                          │  │  │
              via Ports   │  │  │   via Ports
           ┌──────────────┘  │  └──────────────┐
           ▼                 ▼                  ▼
    ┌─────────────┐  ┌─────────────┐   ┌──────────────┐
    │   Stock     │  │  Clientes   │   │  Pagamentos  │
    │             │  │             │   │              │
    │ Buscar      │  │ Buscar      │   │ Registar     │
    │ Verificar   │  │ cliente     │   │ pagamento    │
    │ Subtrair    │  │             │   │              │
    └─────────────┘  └─────────────┘   └──────────────┘
```

> **Regra respeitada:** O módulo POS nunca importa código directamente dos outros módulos. Toda a comunicação é feita via **Ports** (interfaces). Os módulos de Stock, Clientes e Pagamentos nem sabem que o POS existe.

---

*Secção documentada durante a implementação do Milestone 2 — Integração MySQL e API REST.*
*Todos os endpoints foram testados e validados via Postman em Maio 2026.*
