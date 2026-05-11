---
phase: "02-fake-adapters-gerirpedidoservice"
plan: "02-01"
type: "feature"
wave: 1
depends_on: []
files_modified:
  - app/Modules/POS/Domain/Ports/Saida/PedidoRepositorioPort.php
  - app/Modules/POS/Domain/Ports/Saida/DocumentoFiscalRepositorioPort.php
  - app/Modules/POS/Adapters/Saida/Fakes/FakePOSSeeder.php
  - app/Modules/POS/Adapters/Saida/Fakes/FakePedidoRepositorio.php
  - app/Modules/POS/Adapters/Saida/Fakes/FakeDocumentoFiscalRepositorio.php
autonomous: true
must_haves:
  truths: []
  artifacts: []
---

# PLAN 02-01: Fake Adapters do Módulo POS

## Objectivo
Criar os Ports e os respectivos Fake Adapters em memória para o módulo POS, permitindo testar os Services (GerirPedidoService e FinalizarVendaService) sem base de dados.

## Tarefas

### 1. Criar Ports de Saída do POS
- Criar `app/Modules/POS/Domain/Ports/Saida/PedidoRepositorioPort.php` (interface).
- Criar `app/Modules/POS/Domain/Ports/Saida/DocumentoFiscalRepositorioPort.php` (interface).

### 2. Criar FakePOSSeeder
- Criar `app/Modules/POS/Adapters/Saida/Fakes/FakePOSSeeder.php` (classe final).
- Implementar `tabela_pedido()` retornando no mínimo 10 registos simulando pedidos (empresa=1, usuario=1).
- Implementar `tabela_venda()` retornando no mínimo 10 registos simulando documentos fiscais (Fatura, Fatura-Proforma, Recibo).

### 3. Criar FakePedidoRepositorio
- Criar `app/Modules/POS/Adapters/Saida/Fakes/FakePedidoRepositorio.php` implementando `PedidoRepositorioPort`.
- Carregar `FakePOSSeeder::tabela_pedido()` no construtor.
- Implementar métodos auxiliares `definirPedido(array $linha)` e `pedidoActual(int $idpedido)`.

### 4. Criar FakeDocumentoFiscalRepositorio
- Criar `app/Modules/POS/Adapters/Saida/Fakes/FakeDocumentoFiscalRepositorio.php` implementando `DocumentoFiscalRepositorioPort`.
- Carregar `FakePOSSeeder::tabela_venda()` no construtor.
- Implementar métodos auxiliares `vendaActual(int $idVenda)` e `totalDocumentos()`.

## Regras
- Namespace: `App\Modules\POS\Adapters\Saida\Fakes`.
- Não mover para a directoria de testes.
- Não usar Eloquent.
- Executar verificação sintáctica (`php -l`) em todos os ficheiros.
