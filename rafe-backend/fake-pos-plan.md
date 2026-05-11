## Tarefa — Criar Fake Adapters do módulo POS

### Contexto
O módulo POS tem dois Ports de saída próprios que precisam de Fakes
para permitir testar os Services (GerirPedidoService e FinalizarVendaService)
sem base de dados.

### Ficheiros a criar

#### 1. app/Modules/POS/Adapters/Saida/Fakes/FakePOSSeeder.php
Classe final com métodos estáticos que simulam as tabelas em memória.

Método tabela_pedido(): array
Campos: idpedido, n_pedido, id_produto, descricao, qtd, preco, desconto,
        imposto, dataa, hora, conta, mesa, empresa, usuario
Mínimo 10 registos realistas. empresa=1, usuario=1 em todos.
Simula um pedido em aberto com vários produtos diferentes.

Método tabela_venda(): array
Campos: idVenda, Produto_idProduto, Qtd, preconormal, iva, datavenda, hora,
        N_fat, desconto, cliente, Usuario, Tipo_docum, iva_valor, caixa,
        condicao, Justificacao, codigo_doc, Nome, assinatura, Hash,
        referncia, n_cliente, Motivo, Descricao, Referencia_a, empresa
Mínimo 10 registos realistas. Tipo_docum com variação entre
'Fatura', 'Fatura-Proforma', 'Recibo'. empresa=1, Usuario=1 em todos.

#### 2. app/Modules/POS/Adapters/Saida/Fakes/FakePedidoRepositorio.php
Implementa PedidoRepositorioPort.
Carrega FakePOSSeeder::tabela_pedido() no construtor
para private array $tabela_pedido = [].
Métodos auxiliares de teste (fora do Port):
- definirPedido(array $linha): void
- pedidoActual(int $idpedido): ?array

#### 3. app/Modules/POS/Adapters/Saida/Fakes/FakeDocumentoFiscalRepositorio.php
Implementa DocumentoFiscalRepositorioPort.
Carrega FakePOSSeeder::tabela_venda() no construtor
para private array $tabela_venda = [].
Métodos auxiliares de teste (fora do Port):
- vendaActual(int $idVenda): ?array
- totalDocumentos(): int

### Regras obrigatórias
- Namespace: App\Modules\POS\Adapters\Saida\Fakes
- Os Fakes ficam em app/Modules/POS/Adapters/Saida/Fakes/ — NÃO em tests/
- Um Seeder separado dos Repositórios
- Cada Repositório carrega o Seeder no construtor
- Verificar sintaxe com php -l após criar cada ficheiro

### Não fazer
- Não criar Adapters Laravel (Eloquent) — só Fakes em memória
- Não mover ficheiros para tests/
