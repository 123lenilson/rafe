<?php

namespace Tests\Unit\POS\Domain;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use App\Modules\POS\Domain\ItemPedido;

/**
 * Testes do ItemPedido — estilo BDD
 *
 * Localização: tests/Unit/POS/Domain/ItemPedidoTest.php
 *
 * Correr:
 *   php artisan test --filter ItemPedidoTest
 */
class ItemPedidoTest extends TestCase
{
    // ═════════════════════════════════════════════════════════════════════════
    // Feature: Adicionar item ao carrinho (Pedido)
    // ═════════════════════════════════════════════════════════════════════════

    // ─────────────────────────────────────────────────────────────────────────
    // Scenario: Operador adiciona um produto com IVA ao carrinho
    // ─────────────────────────────────────────────────────────────────────────

    #[Test]
    public function dado_produto_com_iva_quando_adicionado_ao_carrinho_entao_dados_ficam_correctos(): void
    {
        // Given
        $item = new ItemPedido(10, 'Caneta BIC', 2, 150.0, 0.0, 14.0);

        // Then
        $this->assertSame(10, $item->idProduto());
        $this->assertSame('Caneta BIC', $item->descricao());
        $this->assertSame(2, $item->quantidade());
        $this->assertSame(150.0, $item->preco());
        $this->assertSame(0.0, $item->desconto());
        $this->assertSame(14.0, $item->imposto());
    }

    #[Test]
    public function dado_produto_com_iva_quando_adicionado_entao_subtotal_e_300(): void
    {
        // Given
        $item = new ItemPedido(10, 'Caneta BIC', 2, 150.0, 0.0, 14.0);

        // Then — subtotal = 2 × 150 = 300
        $this->assertEqualsWithDelta(300.0, $item->subtotal(), 0.01);
    }

    #[Test]
    public function dado_produto_com_iva_quando_adicionado_entao_valor_iva_e_42(): void
    {
        // Given
        $item = new ItemPedido(10, 'Caneta BIC', 2, 150.0, 0.0, 14.0);

        // Then — IVA = 300 × 14% = 42
        $this->assertEqualsWithDelta(42.0, $item->valorImposto(), 0.01);
    }

    #[Test]
    public function dado_produto_com_iva_quando_adicionado_entao_total_linha_e_342(): void
    {
        // Given
        $item = new ItemPedido(10, 'Caneta BIC', 2, 150.0, 0.0, 14.0);

        // Then — total = 300 + 42 = 342
        $this->assertEqualsWithDelta(342.0, $item->totalLinha(), 0.01);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Scenario: Operador adiciona um produto com desconto
    // ─────────────────────────────────────────────────────────────────────────

    #[Test]
    public function dado_produto_com_desconto_quando_adicionado_entao_subtotal_e_1000(): void
    {
        // Given
        $item = new ItemPedido(5, 'Caderno A4', 2, 500.0, 10.0, 0.0);

        // Then — subtotal = 2 × 500 = 1000
        $this->assertEqualsWithDelta(1000.0, $item->subtotal(), 0.01);
    }

    #[Test]
    public function dado_produto_com_desconto_10_quando_adicionado_entao_subtotal_com_desconto_e_900(): void
    {
        // Given
        $item = new ItemPedido(5, 'Caderno A4', 2, 500.0, 10.0, 0.0);

        // Then — 1000 - (1000 × 10%) = 900
        $this->assertEqualsWithDelta(900.0, $item->subtotalComDesconto(), 0.01);
    }

    #[Test]
    public function dado_produto_com_desconto_e_sem_iva_quando_adicionado_entao_total_linha_e_900(): void
    {
        // Given
        $item = new ItemPedido(5, 'Caderno A4', 2, 500.0, 10.0, 0.0);

        // Then
        $this->assertEqualsWithDelta(900.0, $item->totalLinha(), 0.01);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Scenario: Operador adiciona um serviço com retenção
    // ─────────────────────────────────────────────────────────────────────────

    #[Test]
    public function dado_servico_com_retencao_quando_adicionado_entao_item_identificado_como_retencao(): void
    {
        // Given
        $item = new ItemPedido(99, 'Instalação de AC', 1, 1000000.0, 0.0, 6.5);

        // Then
        $this->assertTrue($item->temRetencao());
    }

    #[Test]
    public function dado_servico_com_retencao_quando_adicionado_entao_valor_retencao_e_65000(): void
    {
        // Given
        $item = new ItemPedido(99, 'Instalação de AC', 1, 1000000.0, 0.0, 6.5);

        // Then — 1000000 × 6.5% = 65000
        $this->assertEqualsWithDelta(65000.0, $item->valorImposto(), 0.01);
    }

    #[Test]
    public function dado_servico_com_retencao_quando_adicionado_entao_retencao_nao_soma_ao_total_linha(): void
    {
        // Given
        $item = new ItemPedido(99, 'Instalação de AC', 1, 1000000.0, 0.0, 6.5);

        // Then — retenção é informativa, não soma
        $this->assertEqualsWithDelta(1000000.0, $item->totalLinha(), 0.01);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Scenario: Operador adiciona um produto isento de imposto
    // ─────────────────────────────────────────────────────────────────────────

    #[Test]
    public function dado_produto_isento_quando_adicionado_entao_valor_iva_e_zero(): void
    {
        // Given
        $item = new ItemPedido(3, 'Produto Isento', 1, 200.0, 0.0, 0.0);

        // Then
        $this->assertEqualsWithDelta(0.0, $item->valorImposto(), 0.01);
    }

    #[Test]
    public function dado_produto_isento_quando_adicionado_entao_total_linha_e_200(): void
    {
        // Given
        $item = new ItemPedido(3, 'Produto Isento', 1, 200.0, 0.0, 0.0);

        // Then
        $this->assertEqualsWithDelta(200.0, $item->totalLinha(), 0.01);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Scenario: Operador adiciona um brinde gratuito
    // ─────────────────────────────────────────────────────────────────────────

    #[Test]
    public function dado_produto_com_preco_zero_quando_adicionado_entao_item_criado_com_sucesso(): void
    {
        // Given
        $item = new ItemPedido(1, 'Brinde', 1, 0.0, 0.0, 0.0);

        // Then
        $this->assertSame('Brinde', $item->descricao());
        $this->assertEqualsWithDelta(0.0, $item->totalLinha(), 0.01);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Scenario: Operador tenta adicionar produto com quantidade zero
    // ─────────────────────────────────────────────────────────────────────────

    #[Test]
    public function dado_quantidade_zero_quando_adicionado_entao_sistema_rejeita(): void
    {
        // Then
        $this->expectException(\DomainException::class);
        $this->expectExceptionMessage('Quantidade tem de ser maior que zero');

        // When
        new ItemPedido(1, 'Produto X', 0, 100.0, 0.0, 14.0);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Scenario: Operador tenta adicionar produto com quantidade negativa
    // ─────────────────────────────────────────────────────────────────────────

    #[Test]
    public function dado_quantidade_negativa_quando_adicionado_entao_sistema_rejeita(): void
    {
        // Then
        $this->expectException(\DomainException::class);
        $this->expectExceptionMessage('Quantidade tem de ser maior que zero');

        // When
        new ItemPedido(1, 'Produto X', -1, 100.0, 0.0, 14.0);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Scenario: Operador tenta adicionar produto com preço negativo
    // ─────────────────────────────────────────────────────────────────────────

    #[Test]
    public function dado_preco_negativo_quando_adicionado_entao_sistema_rejeita(): void
    {
        // Then
        $this->expectException(\DomainException::class);
        $this->expectExceptionMessage('Preço não pode ser negativo');

        // When
        new ItemPedido(1, 'Produto X', 1, -50.0, 0.0, 14.0);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Scenario: Operador tenta aplicar desconto negativo
    // ─────────────────────────────────────────────────────────────────────────

    #[Test]
    public function dado_desconto_negativo_quando_adicionado_entao_sistema_rejeita(): void
    {
        // Then
        $this->expectException(\DomainException::class);
        $this->expectExceptionMessage('Desconto não pode ser negativo');

        // When
        new ItemPedido(1, 'Produto X', 1, 100.0, -5.0, 14.0);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Scenario: Operador tenta aplicar desconto acima de 100%
    // ─────────────────────────────────────────────────────────────────────────

    #[Test]
    public function dado_desconto_acima_de_100_quando_adicionado_entao_sistema_rejeita(): void
    {
        // Then
        $this->expectException(\DomainException::class);
        $this->expectExceptionMessage('Desconto não pode ser superior a 100%');

        // When
        new ItemPedido(1, 'Produto X', 1, 100.0, 101.0, 14.0);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Scenario: Operador aplica desconto de exactamente 100%
    // ─────────────────────────────────────────────────────────────────────────

    #[Test]
    public function dado_desconto_de_100_quando_adicionado_entao_subtotal_com_desconto_e_zero(): void
    {
        // Given
        $item = new ItemPedido(1, 'Produto X', 1, 100.0, 100.0, 0.0);

        // Then
        $this->assertEqualsWithDelta(0.0, $item->subtotalComDesconto(), 0.01);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Scenario: Item com IVA não é identificado como retenção
    // ─────────────────────────────────────────────────────────────────────────

    #[Test]
    public function dado_produto_com_iva_entao_tem_retencao_retorna_false(): void
    {
        // Given
        $item = new ItemPedido(1, 'Produto', 1, 100.0, 0.0, 14.0);

        // Then
        $this->assertFalse($item->temRetencao());
    }

    #[Test]
    public function dado_produto_isento_entao_tem_retencao_retorna_false(): void
    {
        // Given
        $item = new ItemPedido(1, 'Produto', 1, 100.0, 0.0, 0.0);

        // Then
        $this->assertFalse($item->temRetencao());
    }


    // ═════════════════════════════════════════════════════════════════════════
    // Testes de Fronteira
    //
    // Testam os valores exactamente no limite de cada regra de validação.
    // Garantem que as condições do código (>, <, ===) estão correctas
    // e que os testes de mutação não deixam mutantes sobreviver.
    // ═════════════════════════════════════════════════════════════════════════

    // ─────────────────────────────────────────────────────────────────────────
    // Fronteira: Quantidade mínima válida
    //
    // Regra no código:  if ($this->quantidade <= 0) → rejeita
    // Fronteira exacta: 0 rejeita, 1 aceita
    // ─────────────────────────────────────────────────────────────────────────

    #[Test]
    public function dado_quantidade_1_quando_adicionado_entao_item_aceite_e_subtotal_correcto(): void
    {
        // Given — quantidade mínima válida (um passo acima do limite)
        $item = new ItemPedido(1, 'Produto X', 1, 100.0, 0.0, 0.0);

        // Then — subtotal = 1 × 100 = 100
        $this->assertSame(1, $item->quantidade());
        $this->assertEqualsWithDelta(100.0, $item->subtotal(), 0.01);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Fronteira: Desconto mínimo válido
    //
    // Regra no código:  if ($this->desconto < 0) → rejeita
    // Fronteira exacta: -0.01 rejeita, 0.0 aceita
    // ─────────────────────────────────────────────────────────────────────────

    #[Test]
    public function dado_desconto_zero_quando_adicionado_entao_subtotal_com_desconto_igual_ao_subtotal(): void
    {
        // Given — desconto mínimo válido (exactamente no limite)
        $item = new ItemPedido(1, 'Produto X', 2, 100.0, 0.0, 0.0);

        // Then — desconto = 0% → subtotalComDesconto = subtotal sem alteração
        $this->assertEqualsWithDelta(200.0, $item->subtotal(), 0.01);
        $this->assertEqualsWithDelta(200.0, $item->subtotalComDesconto(), 0.01);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Fronteira: Desconto máximo válido
    //
    // Regra no código:  if ($this->desconto > 100) → rejeita
    // Fronteira exacta: 100.0 aceita, 100.01 rejeita
    // ─────────────────────────────────────────────────────────────────────────

    #[Test]
    public function dado_desconto_100_virgula_01_quando_adicionado_entao_sistema_rejeita(): void
    {
        // Then — um passo além do limite máximo
        $this->expectException(\DomainException::class);
        $this->expectExceptionMessage('Desconto não pode ser superior a 100%');

        // When
        new ItemPedido(1, 'Produto X', 1, 100.0, 100.01, 0.0);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Fronteira: Preço mínimo válido
    //
    // Regra no código:  if ($this->preco < 0) → rejeita
    // Fronteira exacta: -0.01 rejeita, 0.0 aceita
    // ─────────────────────────────────────────────────────────────────────────

    #[Test]
    public function dado_preco_zero_quando_adicionado_entao_item_aceite_com_total_zero(): void
    {
        // Given — preço exactamente no limite mínimo válido
        $item = new ItemPedido(1, 'Brinde Gratuito', 3, 0.0, 0.0, 14.0);

        // Then — subtotal = 3 × 0 = 0, IVA = 0, total = 0
        $this->assertEqualsWithDelta(0.0, $item->subtotal(), 0.01);
        $this->assertEqualsWithDelta(0.0, $item->valorImposto(), 0.01);
        $this->assertEqualsWithDelta(0.0, $item->totalLinha(), 0.01);
    }

    #[Test]
    public function dado_preco_negativo_minimo_quando_adicionado_entao_sistema_rejeita(): void
    {
        // Then — um passo abaixo do limite mínimo
        $this->expectException(\DomainException::class);
        $this->expectExceptionMessage('Preço não pode ser negativo');

        // When
        new ItemPedido(1, 'Produto X', 1, -0.01, 0.0, 0.0);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Fronteira: Identificação de retenção (imposto === 6.5)
    //
    // Regra no código:  return $this->imposto === 6.5
    // Fronteira exacta: 6.4 não é retenção, 6.5 é retenção, 6.6 não é retenção
    //
    // Este é o teste de fronteira mais crítico do ItemPedido.
    // A comparação exacta (===) significa que qualquer valor adjacente a 6.5
    // deve retornar false — não true.
    // ─────────────────────────────────────────────────────────────────────────

    #[Test]
    public function dado_imposto_6_virgula_4_quando_adicionado_entao_nao_e_retencao(): void
    {
        // Given — um passo abaixo da taxa de retenção
        $item = new ItemPedido(1, 'Serviço Y', 1, 100.0, 0.0, 6.4);

        // Then — 6.4 NÃO é a taxa de retenção
        $this->assertFalse($item->temRetencao());
    }

    #[Test]
    public function dado_imposto_6_virgula_6_quando_adicionado_entao_nao_e_retencao(): void
    {
        // Given — um passo acima da taxa de retenção
        $item = new ItemPedido(1, 'Serviço Y', 1, 100.0, 0.0, 6.6);

        // Then — 6.6 NÃO é a taxa de retenção
        $this->assertFalse($item->temRetencao());
    }

    #[Test]
    public function dado_imposto_6_virgula_5_quando_adicionado_entao_e_exactamente_retencao(): void
    {
        // Given — exactamente a taxa de retenção
        $item = new ItemPedido(1, 'Serviço Y', 1, 100.0, 0.0, 6.5);

        // Then — 6.5 É a taxa de retenção
        $this->assertTrue($item->temRetencao());
    }

    #[Test]
    public function dado_imposto_6_virgula_5_entao_retencao_nao_soma_ao_total_e_iva_6_virgula_6_soma(): void
    {
        // Given — dois itens com taxas adjacentes: uma retenção, outra IVA
        $itemRetencao = new ItemPedido(1, 'Serviço Retenção', 1, 1000.0, 0.0, 6.5);
        $itemIva = new ItemPedido(2, 'Serviço IVA', 1, 1000.0, 0.0, 6.6);

        // Then — retenção não soma ao total, IVA soma
        $this->assertEqualsWithDelta(1000.0, $itemRetencao->totalLinha(), 0.01); // 1000 + 0
        $this->assertEqualsWithDelta(1066.0, $itemIva->totalLinha(), 0.01); // 1000 + 66
    }
}