<?php

/**
 * Teste: ItemPedido
 *
 * Como correr:
 *   php ItemPedidoTest.php
 *
 * Espera-se que TODOS os testes falhem (vermelho) enquanto
 * a classe ItemPedido ainda não existir.
 * Depois de criares a classe, todos devem passar (verde).
 */

// ─── Carrega a classe (vai falhar até a classe existir) ───────────────────────
$classePath = __DIR__ . '/ItemPedido.php';
if (file_exists($classePath)) {
    require_once $classePath;
}

// ─── Infraestrutura mínima de testes (sem PHPUnit) ───────────────────────────
$passed = 0;
$failed = 0;
$results = [];

function it(string $descricao, callable $teste): void
{
    global $passed, $failed, $results;
    try {
        $teste();
        $passed++;
        $results[] = "  ✅  {$descricao}";
    } catch (Throwable $e) {
        $failed++;
        $results[] = "  ❌  {$descricao}\n       → " . $e->getMessage();
    }
}

function assertEqual(mixed $esperado, mixed $actual, string $msg = ''): void
{
    if ($esperado !== $actual) {
        throw new Exception(
            ($msg ? $msg . ' — ' : '') .
            "esperado " . var_export($esperado, true) .
            ", obtido " . var_export($actual, true)
        );
    }
}

function assertThrows(string $excecaoEsperada, callable $bloco, string $msg = ''): void
{
    try {
        $bloco();
        throw new Exception(
            ($msg ? $msg . ' — ' : '') .
            "esperava lançar {$excecaoEsperada} mas não lançou nenhuma excepção"
        );
    } catch (Throwable $e) {
        if (!($e instanceof $excecaoEsperada)) {
            throw new Exception(
                ($msg ? $msg . ' — ' : '') .
                "esperava {$excecaoEsperada}, lançou " . get_class($e) .
                ': ' . $e->getMessage()
            );
        }
        // excepção correcta — teste passa
    }
}

// ═════════════════════════════════════════════════════════════════════════════
// GRUPO 1 — Criação válida
// O imposto chega já resolvido da tabela pedido (JOIN com imposto).
// O POS não valida a taxa — só usa o número que chegou.
// ═════════════════════════════════════════════════════════════════════════════

it('cria um item válido com IVA de 14%', function () {
    $item = new ItemPedido(
        idProduto: 10,
        descricao: 'Caneta BIC',
        quantidade: 2,
        preco: 150.0,
        desconto: 0.0,
        imposto: 14.0
    );

    assertEqual(10, $item->idProduto());
    assertEqual('Caneta BIC', $item->descricao());
    assertEqual(2, $item->quantidade());
    assertEqual(150.0, $item->preco());
    assertEqual(0.0, $item->desconto());
    assertEqual(14.0, $item->imposto());
});

it('cria um item com desconto de 10%', function () {
    $item = new ItemPedido(
        idProduto: 5,
        descricao: 'Caderno A4',
        quantidade: 1,
        preco: 500.0,
        desconto: 10.0,
        imposto: 0.0
    );
    assertEqual(10.0, $item->desconto());
});

it('cria um item com retenção de 6.5% (serviço)', function () {
    $item = new ItemPedido(
        idProduto: 99,
        descricao: 'Instalação de AC',
        quantidade: 1,
        preco: 1000000.0,
        desconto: 0.0,
        imposto: 6.5
    );
    assertEqual(6.5, $item->imposto());
});

it('cria um item com imposto 0% (isento)', function () {
    $item = new ItemPedido(
        idProduto: 3,
        descricao: 'Produto Isento',
        quantidade: 1,
        preco: 200.0,
        desconto: 0.0,
        imposto: 0.0
    );
    assertEqual(0.0, $item->imposto());
});

it('aceita qualquer imposto >= 0 — a taxa é responsabilidade do módulo Stock', function () {
    $item = new ItemPedido(1, 'Produto', 1, 100.0, 0.0, 7.0);
    assertEqual(7.0, $item->imposto());
});

// ═════════════════════════════════════════════════════════════════════════════
// GRUPO 2 — Regras de quantidade
// ═════════════════════════════════════════════════════════════════════════════

it('lança DomainException quando quantidade é zero', function () {
    assertThrows(DomainException::class, function () {
        new ItemPedido(1, 'Produto X', 0, 100.0, 0.0, 14.0);
    });
});

it('lança DomainException quando quantidade é negativa', function () {
    assertThrows(DomainException::class, function () {
        new ItemPedido(1, 'Produto X', -1, 100.0, 0.0, 14.0);
    });
});

// ═════════════════════════════════════════════════════════════════════════════
// GRUPO 3 — Regras de preço
// ═════════════════════════════════════════════════════════════════════════════

it('lança DomainException quando preço é negativo', function () {
    assertThrows(DomainException::class, function () {
        new ItemPedido(1, 'Produto X', 1, -50.0, 0.0, 14.0);
    });
});

it('aceita preço zero (produto gratuito)', function () {
    $item = new ItemPedido(1, 'Brinde', 1, 0.0, 0.0, 0.0);
    assertEqual(0.0, $item->preco());
});

// ═════════════════════════════════════════════════════════════════════════════
// GRUPO 4 — Regras de desconto
// ═════════════════════════════════════════════════════════════════════════════

it('lança DomainException quando desconto é negativo', function () {
    assertThrows(DomainException::class, function () {
        new ItemPedido(1, 'Produto X', 1, 100.0, -5.0, 14.0);
    });
});

it('lança DomainException quando desconto é maior que 100%', function () {
    assertThrows(DomainException::class, function () {
        new ItemPedido(1, 'Produto X', 1, 100.0, 101.0, 14.0);
    });
});

it('aceita desconto de exactamente 100%', function () {
    $item = new ItemPedido(1, 'Produto X', 1, 100.0, 100.0, 0.0);
    assertEqual(100.0, $item->desconto());
});

// ═════════════════════════════════════════════════════════════════════════════
// GRUPO 5 — Cálculos do item
// Fórmulas (extraídas do VendaModel.php):
//   subtotal            = qtd × preco
//   valor_desconto      = subtotal × (desconto / 100)
//   subtotalComDesconto = subtotal - valor_desconto
//   valorImposto        = subtotalComDesconto × (imposto / 100)
//   totalLinha          = subtotalComDesconto + valorImposto  [excepto retenção]
//   retenção (6.5%)     → valorImposto calculado mas NÃO soma ao totalLinha
// ═════════════════════════════════════════════════════════════════════════════

it('calcula subtotal correcto (qtd × preco)', function () {
    $item = new ItemPedido(1, 'Produto', 3, 150.0, 0.0, 0.0);
    // 3 × 150 = 450
    assertEqual(450.0, $item->subtotal());
});

it('calcula subtotalComDesconto correctamente', function () {
    $item = new ItemPedido(1, 'Produto', 2, 500.0, 10.0, 0.0);
    // base = 2 × 500 = 1000 | desconto = 100 | resultado = 900
    assertEqual(900.0, $item->subtotalComDesconto());
});

it('subtotalComDesconto igual ao subtotal quando desconto é zero', function () {
    $item = new ItemPedido(1, 'Produto', 2, 500.0, 0.0, 0.0);
    assertEqual(1000.0, $item->subtotalComDesconto());
});

it('calcula valorImposto (IVA aplicado sobre subtotalComDesconto)', function () {
    $item = new ItemPedido(1, 'Produto', 2, 500.0, 10.0, 14.0);
    // subtotalComDesconto = 900 | IVA = 900 × 14% = 126
    assertEqual(126.0, $item->valorImposto());
});

it('valorImposto é zero quando imposto é 0%', function () {
    $item = new ItemPedido(1, 'Produto', 2, 500.0, 0.0, 0.0);
    assertEqual(0.0, $item->valorImposto());
});

it('totalLinha inclui IVA (subtotalComDesconto + IVA)', function () {
    $item = new ItemPedido(1, 'Produto', 2, 500.0, 10.0, 14.0);
    // subtotalComDesconto = 900 | IVA = 126 | total = 1026
    assertEqual(1026.0, $item->totalLinha());
});

it('totalLinha NÃO inclui retenção — retenção é informativa', function () {
    $item = new ItemPedido(1, 'Serviço AC', 1, 1000000.0, 0.0, 6.5);
    // retenção = 65000 — não soma | totalLinha = 1000000
    assertEqual(1000000.0, $item->totalLinha());
});

it('calcula valorImposto da retenção correctamente', function () {
    $item = new ItemPedido(1, 'Serviço AC', 1, 1000000.0, 0.0, 6.5);
    // 1000000 × 6.5% = 65000
    assertEqual(65000.0, $item->valorImposto());
});

it('temRetencao() é true quando imposto é 6.5%', function () {
    $item = new ItemPedido(1, 'Serviço', 1, 100.0, 0.0, 6.5);
    assertEqual(true, $item->temRetencao());
});

it('temRetencao() é false quando imposto é IVA', function () {
    $item = new ItemPedido(1, 'Produto', 1, 100.0, 0.0, 14.0);
    assertEqual(false, $item->temRetencao());
});

it('temRetencao() é false quando imposto é zero', function () {
    $item = new ItemPedido(1, 'Produto', 1, 100.0, 0.0, 0.0);
    assertEqual(false, $item->temRetencao());
});

// ─── Resultado final ──────────────────────────────────────────────────────────
echo "\n";
echo "══════════════════════════════════════════\n";
echo "  ItemPedido — Resultados dos Testes\n";
echo "══════════════════════════════════════════\n";
foreach ($results as $linha) {
    echo $linha . "\n";
}
echo "──────────────────────────────────────────\n";
echo "  Total    : " . ($passed + $failed) . "\n";
echo "  Verde    : {$passed}\n";
echo "  Vermelho : {$failed}\n";
echo "══════════════════════════════════════════\n\n";

if ($failed > 0) {
    exit(1);
}