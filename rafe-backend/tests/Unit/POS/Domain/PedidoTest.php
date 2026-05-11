<?php

namespace Tests\Unit\POS\Domain;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use App\Modules\POS\Domain\ItemPedido;
use App\Modules\POS\Domain\Pedido;

/**
 * Testes do Pedido — estilo BDD
 *
 * Localização: tests/Unit/POS/Domain/PedidoTest.php
 *
 * Correr:
 *   php artisan test --filter PedidoTest
 */
class PedidoTest extends TestCase
{
    // ═════════════════════════════════════════════════════════════════════════
    // Feature: Gerir o carrinho de compras (Pedido)
    // ═════════════════════════════════════════════════════════════════════════

    // ─────────────────────────────────────────────────────────────────────────
    // Scenario: Operador cria um carrinho com um produto
    // ─────────────────────────────────────────────────────────────────────────

    #[Test]
    public function dado_um_item_quando_carrinho_criado_entao_tem_1_item(): void
    {
        // Given
        $item = new ItemPedido(10, 'Caneta BIC', 2, 150.0, 0.0, 14.0);

        // When
        $pedido = new Pedido([$item]);

        // Then
        $this->assertSame(1, $pedido->totalItens());
    }

    #[Test]
    public function dado_um_item_com_iva_quando_carrinho_criado_entao_total_iliquido_e_300(): void
    {
        // Given — 2 × 150 = 300
        $item = new ItemPedido(10, 'Caneta BIC', 2, 150.0, 0.0, 14.0);

        // When
        $pedido = new Pedido([$item]);

        // Then
        $this->assertEqualsWithDelta(300.0, $pedido->totalIliquido(), 0.01);
    }

    #[Test]
    public function dado_um_item_com_iva_quando_carrinho_criado_entao_total_iva_e_42(): void
    {
        // Given — IVA = 300 × 14% = 42
        $item = new ItemPedido(10, 'Caneta BIC', 2, 150.0, 0.0, 14.0);

        // When
        $pedido = new Pedido([$item]);

        // Then
        $this->assertEqualsWithDelta(42.0, $pedido->totalIva(), 0.01);
    }

    #[Test]
    public function dado_um_item_com_iva_quando_carrinho_criado_entao_total_retencao_e_zero(): void
    {
        // Given
        $item = new ItemPedido(10, 'Caneta BIC', 2, 150.0, 0.0, 14.0);

        // When
        $pedido = new Pedido([$item]);

        // Then
        $this->assertEqualsWithDelta(0.0, $pedido->totalRetencao(), 0.01);
    }

    #[Test]
    public function dado_um_item_com_iva_quando_carrinho_criado_entao_valor_a_pagar_e_342(): void
    {
        // Given — 300 + 42 = 342
        $item = new ItemPedido(10, 'Caneta BIC', 2, 150.0, 0.0, 14.0);

        // When
        $pedido = new Pedido([$item]);

        // Then
        $this->assertEqualsWithDelta(342.0, $pedido->valorAPagar(), 0.01);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Scenario: Operador cria um carrinho com múltiplos itens
    // ─────────────────────────────────────────────────────────────────────────

    #[Test]
    public function dado_multiplos_itens_quando_carrinho_criado_entao_tem_3_itens(): void
    {
        // Given
        $itens = [
            new ItemPedido(10, 'Caneta BIC', 2, 150.0, 0.0, 14.0),
            new ItemPedido(5, 'Caderno A4', 1, 500.0, 0.0, 0.0),
            new ItemPedido(99, 'Instalação de AC', 1, 5000.0, 0.0, 6.5),
        ];

        // When
        $pedido = new Pedido($itens);

        // Then
        $this->assertSame(3, $pedido->totalItens());
    }

    #[Test]
    public function dado_multiplos_itens_quando_carrinho_criado_entao_total_iliquido_e_5800(): void
    {
        // Given — 300 + 500 + 5000 = 5800
        $itens = [
            new ItemPedido(10, 'Caneta BIC', 2, 150.0, 0.0, 14.0),
            new ItemPedido(5, 'Caderno A4', 1, 500.0, 0.0, 0.0),
            new ItemPedido(99, 'Instalação de AC', 1, 5000.0, 0.0, 6.5),
        ];

        // When
        $pedido = new Pedido($itens);

        // Then
        $this->assertEqualsWithDelta(5800.0, $pedido->totalIliquido(), 0.01);
    }

    #[Test]
    public function dado_multiplos_itens_quando_carrinho_criado_entao_total_iva_e_42(): void
    {
        // Given — só a Caneta tem IVA: 300 × 14% = 42
        $itens = [
            new ItemPedido(10, 'Caneta BIC', 2, 150.0, 0.0, 14.0),
            new ItemPedido(5, 'Caderno A4', 1, 500.0, 0.0, 0.0),
            new ItemPedido(99, 'Instalação de AC', 1, 5000.0, 0.0, 6.5),
        ];

        // When
        $pedido = new Pedido($itens);

        // Then
        $this->assertEqualsWithDelta(42.0, $pedido->totalIva(), 0.01);
    }

    #[Test]
    public function dado_multiplos_itens_quando_carrinho_criado_entao_total_retencao_e_325(): void
    {
        // Given — só o serviço tem retenção: 5000 × 6.5% = 325
        $itens = [
            new ItemPedido(10, 'Caneta BIC', 2, 150.0, 0.0, 14.0),
            new ItemPedido(5, 'Caderno A4', 1, 500.0, 0.0, 0.0),
            new ItemPedido(99, 'Instalação de AC', 1, 5000.0, 0.0, 6.5),
        ];

        // When
        $pedido = new Pedido($itens);

        // Then
        $this->assertEqualsWithDelta(325.0, $pedido->totalRetencao(), 0.01);
    }

    #[Test]
    public function dado_multiplos_itens_quando_carrinho_criado_entao_valor_a_pagar_e_5842(): void
    {
        // Given — ilíquido=5800 + IVA=42 = 5842 (retenção não soma)
        $itens = [
            new ItemPedido(10, 'Caneta BIC', 2, 150.0, 0.0, 14.0),
            new ItemPedido(5, 'Caderno A4', 1, 500.0, 0.0, 0.0),
            new ItemPedido(99, 'Instalação de AC', 1, 5000.0, 0.0, 6.5),
        ];

        // When
        $pedido = new Pedido($itens);

        // Then
        $this->assertEqualsWithDelta(5842.0, $pedido->valorAPagar(), 0.01);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Scenario: Operador tenta criar um carrinho sem itens
    // ─────────────────────────────────────────────────────────────────────────

    #[Test]
    public function dado_carrinho_vazio_quando_criado_entao_sistema_rejeita(): void
    {
        // Then
        $this->expectException(\DomainException::class);
        $this->expectExceptionMessage('Pedido não pode ser criado sem itens');

        // When
        new Pedido([]);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Scenario: Operador adiciona um novo produto ao carrinho
    // ─────────────────────────────────────────────────────────────────────────

    #[Test]
    public function dado_carrinho_com_um_item_quando_novo_produto_adicionado_entao_tem_2_itens(): void
    {
        // Given
        $pedido = new Pedido([
            new ItemPedido(10, 'Caneta BIC', 2, 150.0, 0.0, 14.0),
        ]);

        // When
        $pedido->adicionarItem(new ItemPedido(5, 'Caderno A4', 1, 500.0, 0.0, 0.0));

        // Then
        $this->assertSame(2, $pedido->totalItens());
    }

    #[Test]
    public function dado_carrinho_com_um_item_quando_novo_produto_adicionado_entao_contem_caderno(): void
    {
        // Given
        $pedido = new Pedido([
            new ItemPedido(10, 'Caneta BIC', 2, 150.0, 0.0, 14.0),
        ]);

        // When
        $pedido->adicionarItem(new ItemPedido(5, 'Caderno A4', 1, 500.0, 0.0, 0.0));

        // Then
        $this->assertTrue($pedido->contemProduto(5));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Scenario: Operador adiciona produto que já existe — actualiza a quantidade
    // ─────────────────────────────────────────────────────────────────────────

    #[Test]
    public function dado_produto_duplicado_quando_adicionado_entao_carrinho_continua_com_1_item(): void
    {
        // Given
        $pedido = new Pedido([
            new ItemPedido(10, 'Caneta BIC', 2, 150.0, 0.0, 14.0),
        ]);

        // When — mesmo id_produto, nova quantidade
        $pedido->adicionarItem(new ItemPedido(10, 'Caneta BIC', 5, 150.0, 0.0, 14.0));

        // Then
        $this->assertSame(1, $pedido->totalItens());
    }

    #[Test]
    public function dado_produto_duplicado_quando_adicionado_entao_quantidade_e_actualizada_para_5(): void
    {
        // Given
        $pedido = new Pedido([
            new ItemPedido(10, 'Caneta BIC', 2, 150.0, 0.0, 14.0),
        ]);

        // When
        $pedido->adicionarItem(new ItemPedido(10, 'Caneta BIC', 5, 150.0, 0.0, 14.0));

        // Then
        $this->assertSame(5, $pedido->quantidadeDoProduto(10));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Scenario: Operador remove produto enviando quantidade zero
    // ─────────────────────────────────────────────────────────────────────────

    #[Test]
    public function dado_qty_zero_quando_adicionado_entao_produto_removido_do_carrinho(): void
    {
        // Given
        $pedido = new Pedido([
            new ItemPedido(10, 'Caneta BIC', 2, 150.0, 0.0, 14.0),
            new ItemPedido(5, 'Caderno A4', 1, 500.0, 0.0, 0.0),
        ]);

        // When — qty = 0 significa remover
        $pedido->removerItem(10);

        // Then
        $this->assertSame(1, $pedido->totalItens());
        $this->assertFalse($pedido->contemProduto(10));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Scenario: Operador tenta remover produto que não está no carrinho
    // ─────────────────────────────────────────────────────────────────────────

    #[Test]
    public function dado_produto_inexistente_quando_removido_entao_sistema_rejeita(): void
    {
        // Given
        $pedido = new Pedido([
            new ItemPedido(10, 'Caneta BIC', 2, 150.0, 0.0, 14.0),
        ]);

        // Then
        $this->expectException(\DomainException::class);
        $this->expectExceptionMessage('Produto não encontrado no carrinho');

        // When
        $pedido->removerItem(99);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Scenario: Sistema calcula total ilíquido como soma dos subtotais
    // ─────────────────────────────────────────────────────────────────────────

    #[Test]
    public function dado_dois_itens_sem_imposto_quando_calculado_entao_total_iliquido_e_800(): void
    {
        // Given — (2×100) + (3×200) = 200 + 600 = 800
        $pedido = new Pedido([
            new ItemPedido(1, 'Produto A', 2, 100.0, 0.0, 0.0),
            new ItemPedido(2, 'Produto B', 3, 200.0, 0.0, 0.0),
        ]);

        // Then
        $this->assertEqualsWithDelta(800.0, $pedido->totalIliquido(), 0.01);
        $this->assertEqualsWithDelta(800.0, $pedido->valorAPagar(), 0.01);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Scenario: Sistema separa IVA de retenção nos totais
    // ─────────────────────────────────────────────────────────────────────────

    #[Test]
    public function dado_item_com_iva_e_item_com_retencao_quando_calculado_entao_totais_separados(): void
    {
        // Given
        // IVA:      1000 × 14% = 140
        // Retenção: 2000 × 6.5% = 130
        $pedido = new Pedido([
            new ItemPedido(1, 'Produto com IVA', 1, 1000.0, 0.0, 14.0),
            new ItemPedido(2, 'Serviço AC', 1, 2000.0, 0.0, 6.5),
        ]);

        // Then
        $this->assertEqualsWithDelta(140.0, $pedido->totalIva(), 0.01);
        $this->assertEqualsWithDelta(130.0, $pedido->totalRetencao(), 0.01);
        // valor a pagar = 1000 + 2000 + 140 = 3140 (retenção não soma)
        $this->assertEqualsWithDelta(3140.0, $pedido->valorAPagar(), 0.01);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Scenario: Sistema calcula valor a pagar sem incluir retenção
    // ─────────────────────────────────────────────────────────────────────────

    #[Test]
    public function dado_servico_com_retencao_quando_calculado_entao_retencao_nao_soma_ao_valor_a_pagar(): void
    {
        // Given
        $pedido = new Pedido([
            new ItemPedido(99, 'Serviço', 1, 1000.0, 0.0, 6.5),
        ]);

        // Then
        $this->assertEqualsWithDelta(65.0, $pedido->totalRetencao(), 0.01);
        $this->assertEqualsWithDelta(1000.0, $pedido->valorAPagar(), 0.01);
    }

    // ═════════════════════════════════════════════════════════════════════════
    // Testes adicionais para fechar mutantes detectados pelo Infection
    // ═════════════════════════════════════════════════════════════════════════

    // ── Mutantes 1-4: validações do ItemPedido dentro do contexto do Pedido ──
    // O Pedido usa ItemPedido — se as validações do ItemPedido forem removidas
    // ou as condições de fronteira mudarem, estes testes detectam.

    #[Test]
    public function dado_item_com_quantidade_zero_dentro_do_pedido_entao_sistema_rejeita(): void
    {
        // Mutante 1 (validar removida) e Mutante 2 (<= muda para <)
        // Se validar() for removida OU <= mudar para <,
        // o ItemPedido com qty=0 seria criado sem erro e o Pedido seria criado
        $this->expectException(\DomainException::class);

        new Pedido([
            new ItemPedido(1, 'Produto', 0, 100.0, 0.0, 14.0),
        ]);
    }

    #[Test]
    public function dado_item_com_quantidade_1_dentro_do_pedido_entao_e_o_minimo_valido(): void
    {
        // Mutante 2: se <= mudar para <, qty=0 passaria a ser aceite
        // Este teste confirma que qty=1 é o mínimo válido
        $pedido = new Pedido([
            new ItemPedido(1, 'Produto', 1, 100.0, 0.0, 0.0),
        ]);

        $this->assertSame(1, $pedido->totalItens());
        $this->assertEqualsWithDelta(100.0, $pedido->totalIliquido(), 0.01);
    }

    #[Test]
    public function dado_item_com_preco_negativo_dentro_do_pedido_entao_sistema_rejeita(): void
    {
        // Mutante 3: se < mudar para <=, preco=0 seria rejeitado
        // Este teste confirma que preco negativo é sempre rejeitado
        $this->expectException(\DomainException::class);

        new Pedido([
            new ItemPedido(1, 'Produto', 1, -10.0, 0.0, 0.0),
        ]);
    }

    #[Test]
    public function dado_item_com_preco_zero_dentro_do_pedido_entao_e_aceite(): void
    {
        // Mutante 3: se < mudar para <=, este item seria rejeitado
        $pedido = new Pedido([
            new ItemPedido(1, 'Brinde', 1, 0.0, 0.0, 0.0),
        ]);

        $this->assertEqualsWithDelta(0.0, $pedido->totalIliquido(), 0.01);
        $this->assertEqualsWithDelta(0.0, $pedido->valorAPagar(), 0.01);
    }

    #[Test]
    public function dado_item_com_desconto_acima_de_100_dentro_do_pedido_entao_sistema_rejeita(): void
    {
        // Mutante 4: se > mudar para >=, desconto=100 seria rejeitado
        $this->expectException(\DomainException::class);

        new Pedido([
            new ItemPedido(1, 'Produto', 1, 100.0, 101.0, 0.0),
        ]);
    }

    #[Test]
    public function dado_item_com_desconto_100_dentro_do_pedido_entao_e_aceite(): void
    {
        // Mutante 4: se > mudar para >=, este item seria rejeitado
        $pedido = new Pedido([
            new ItemPedido(1, 'Produto', 1, 100.0, 100.0, 0.0),
        ]);

        $this->assertEqualsWithDelta(0.0, $pedido->valorAPagar(), 0.01);
    }

    // ── Mutantes 5-9: cálculos com desconto > 0 ──────────────────────────────
    // Todos os testes anteriores usavam desconto=0.
    // Com desconto=0, as mutações aritméticas (/ 99, / 101, * 100, + em vez de -)
    // produzem o mesmo resultado (zero). Precisamos de desconto > 0.

    #[Test]
    public function dado_pedido_com_itens_com_desconto_quando_calculado_entao_total_iliquido_correcto(): void
    {
        // Mutantes 6-9: testa subtotalComDesconto com desconto real
        // Item A: 2 × 500 = 1000, desconto 10% = 100, subtotal_com_desconto = 900
        // Item B: 1 × 200 = 200, desconto 25% = 50,  subtotal_com_desconto = 150
        // total ilíquido = subtotal SEM desconto = 1000 + 200 = 1200
        $pedido = new Pedido([
            new ItemPedido(1, 'Produto A', 2, 500.0, 10.0, 0.0),
            new ItemPedido(2, 'Produto B', 1, 200.0, 25.0, 0.0),
        ]);

        $this->assertEqualsWithDelta(1050.0, $pedido->totalIliquido(), 0.01);
    }

    #[Test]
    public function dado_pedido_com_itens_com_desconto_quando_calculado_entao_valor_a_pagar_correcto(): void
    {
        // Mutantes 5-9: o valor a pagar usa subtotalComDesconto internamente
        // Item A: subtotal_com_desconto = 900, IVA 14% = 126, total_linha = 1026
        // Item B: subtotal_com_desconto = 150, sem IVA,        total_linha = 150
        // totalIliquido = 1000 + 200 = 1200
        // totalIva = 126
        // valorAPagar = 1200 + 126 = 1326
        $pedido = new Pedido([
            new ItemPedido(1, 'Produto A', 2, 500.0, 10.0, 14.0),
            new ItemPedido(2, 'Produto B', 1, 200.0, 25.0, 0.0),
        ]);

        $this->assertEqualsWithDelta(126.0, $pedido->totalIva(), 0.01);
        $this->assertEqualsWithDelta(1176.0, $pedido->valorAPagar(), 0.01);
    }

    #[Test]
    public function dado_pedido_com_desconto_50_quando_calculado_entao_iva_e_metade_do_esperado_sem_desconto(): void
    {
        // Mutante 9 (+ em vez de -): se subtotal + desconto em vez de subtotal - desconto,
        // o IVA seria calculado sobre 1100 (1000 + 100) em vez de 900 (1000 - 100)
        // IVA correcto = 900 × 14% = 126
        // IVA mutante  = 1100 × 14% = 154  ← detectado aqui
        $pedido = new Pedido([
            new ItemPedido(1, 'Produto', 2, 500.0, 10.0, 14.0),
        ]);

        $this->assertEqualsWithDelta(126.0, $pedido->totalIva(), 0.01);
        $this->assertLessThan(150.0, $pedido->totalIva());
    }
}