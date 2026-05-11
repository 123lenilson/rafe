<?php

namespace Tests\Unit\POS\Domain;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use App\Modules\POS\Domain\LinhaVenda;

/**
 * Testes da LinhaVenda — estilo BDD
 *
 * Localização: tests/Unit/POS/Domain/LinhaVendaTest.php
 *
 * Correr:
 *   php artisan test --filter LinhaVendaTest
 */
class LinhaVendaTest extends TestCase
{
    // ═════════════════════════════════════════════════════════════════════════
    // Feature: Representar uma linha de um documento fiscal emitido (LinhaVenda)
    // ═════════════════════════════════════════════════════════════════════════

    // ─────────────────────────────────────────────────────────────────────────
    // Scenario: Operador emite linha com produto com IVA
    // ─────────────────────────────────────────────────────────────────────────

    #[Test]
    public function dado_produto_com_iva_quando_linha_criada_entao_quantidade_e_2(): void
    {
        // Given — Caneta BIC: 2 × 150 Kz, IVA 14%
        $linha = new LinhaVenda(10, 'Caneta BIC', 2, 150.0, 0.0, 14.0);

        // Then
        $this->assertSame(2, $linha->quantidade());
    }

    #[Test]
    public function dado_produto_com_iva_quando_linha_criada_entao_subtotal_e_300(): void
    {
        // Given — subtotal = 2 × 150 = 300
        $linha = new LinhaVenda(10, 'Caneta BIC', 2, 150.0, 0.0, 14.0);

        // Then
        $this->assertEqualsWithDelta(300.0, $linha->subtotal(), 0.01);
    }

    #[Test]
    public function dado_produto_com_iva_quando_linha_criada_entao_valor_iva_e_42(): void
    {
        // Given — IVA = 300 × 14% = 42
        $linha = new LinhaVenda(10, 'Caneta BIC', 2, 150.0, 0.0, 14.0);

        // Then
        $this->assertEqualsWithDelta(42.0, $linha->valorImposto(), 0.01);
    }

    #[Test]
    public function dado_produto_com_iva_quando_linha_criada_entao_total_linha_e_342(): void
    {
        // Given — total = 300 + 42 = 342
        $linha = new LinhaVenda(10, 'Caneta BIC', 2, 150.0, 0.0, 14.0);

        // Then
        $this->assertEqualsWithDelta(342.0, $linha->totalLinha(), 0.01);
    }

    #[Test]
    public function dado_produto_com_iva_quando_linha_criada_entao_nao_e_retencao(): void
    {
        // Given
        $linha = new LinhaVenda(10, 'Caneta BIC', 2, 150.0, 0.0, 14.0);

        // Then
        $this->assertFalse($linha->temRetencao());
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Scenario: Operador emite linha com serviço com retenção
    // ─────────────────────────────────────────────────────────────────────────

    #[Test]
    public function dado_servico_com_retencao_quando_linha_criada_entao_subtotal_e_5000(): void
    {
        // Given — Instalação de AC: 1 × 5000 Kz, retenção 6.5%
        $linha = new LinhaVenda(99, 'Instalação de AC', 1, 5000.0, 0.0, 6.5);

        // Then
        $this->assertEqualsWithDelta(5000.0, $linha->subtotal(), 0.01);
    }

    #[Test]
    public function dado_servico_com_retencao_quando_linha_criada_entao_valor_retencao_e_325(): void
    {
        // Given — retenção = 5000 × 6.5% = 325
        $linha = new LinhaVenda(99, 'Instalação de AC', 1, 5000.0, 0.0, 6.5);

        // Then
        $this->assertEqualsWithDelta(325.0, $linha->valorImposto(), 0.01);
    }

    #[Test]
    public function dado_servico_com_retencao_quando_linha_criada_entao_total_linha_e_5000(): void
    {
        // Given — retenção não soma ao total da linha
        $linha = new LinhaVenda(99, 'Instalação de AC', 1, 5000.0, 0.0, 6.5);

        // Then
        $this->assertEqualsWithDelta(5000.0, $linha->totalLinha(), 0.01);
    }

    #[Test]
    public function dado_servico_com_retencao_quando_linha_criada_entao_e_identificada_como_retencao(): void
    {
        // Given
        $linha = new LinhaVenda(99, 'Instalação de AC', 1, 5000.0, 0.0, 6.5);

        // Then
        $this->assertTrue($linha->temRetencao());
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Scenario: Operador emite linha com produto isento
    // ─────────────────────────────────────────────────────────────────────────

    #[Test]
    public function dado_produto_isento_quando_linha_criada_entao_subtotal_e_500(): void
    {
        // Given — Caderno A4: 1 × 500 Kz, isento
        $linha = new LinhaVenda(5, 'Caderno A4', 1, 500.0, 0.0, 0.0);

        // Then
        $this->assertEqualsWithDelta(500.0, $linha->subtotal(), 0.01);
    }

    #[Test]
    public function dado_produto_isento_quando_linha_criada_entao_valor_imposto_e_zero(): void
    {
        // Given
        $linha = new LinhaVenda(5, 'Caderno A4', 1, 500.0, 0.0, 0.0);

        // Then
        $this->assertEqualsWithDelta(0.0, $linha->valorImposto(), 0.01);
    }

    #[Test]
    public function dado_produto_isento_quando_linha_criada_entao_total_linha_e_500(): void
    {
        // Given
        $linha = new LinhaVenda(5, 'Caderno A4', 1, 500.0, 0.0, 0.0);

        // Then
        $this->assertEqualsWithDelta(500.0, $linha->totalLinha(), 0.01);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Scenario: Operador emite linha com desconto
    // ─────────────────────────────────────────────────────────────────────────

    #[Test]
    public function dado_produto_com_desconto_quando_linha_criada_entao_subtotal_bruto_e_1000(): void
    {
        // Given — Monitor: 2 × 500 = 1000 bruto, desconto 10%, IVA 14%
        $linha = new LinhaVenda(1, 'Monitor', 2, 500.0, 10.0, 14.0);

        // Then — subtotal bruto = qty × preco, sem desconto
        $this->assertEqualsWithDelta(1000.0, $linha->subtotal(), 0.01);
    }

    #[Test]
    public function dado_produto_com_desconto_quando_linha_criada_entao_subtotal_com_desconto_e_900(): void
    {
        // Given — 1000 - 10% = 900
        $linha = new LinhaVenda(1, 'Monitor', 2, 500.0, 10.0, 14.0);

        // Then
        $this->assertEqualsWithDelta(900.0, $linha->subtotalComDesconto(), 0.01);
    }

    #[Test]
    public function dado_produto_com_desconto_quando_linha_criada_entao_iva_calculado_sobre_900(): void
    {
        // Given — IVA = 900 × 14% = 126
        $linha = new LinhaVenda(1, 'Monitor', 2, 500.0, 10.0, 14.0);

        // Then
        $this->assertEqualsWithDelta(126.0, $linha->valorImposto(), 0.01);
    }

    #[Test]
    public function dado_produto_com_desconto_quando_linha_criada_entao_total_linha_e_1026(): void
    {
        // Given — total = 900 + 126 = 1026
        $linha = new LinhaVenda(1, 'Monitor', 2, 500.0, 10.0, 14.0);

        // Then
        $this->assertEqualsWithDelta(1026.0, $linha->totalLinha(), 0.01);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Scenario: Sistema rejeita linha com quantidade zero
    // ─────────────────────────────────────────────────────────────────────────

    #[Test]
    public function dado_quantidade_zero_quando_linha_criada_entao_sistema_rejeita(): void
    {
        // Then
        $this->expectException(\DomainException::class);
        $this->expectExceptionMessage('Quantidade deve ser maior que zero');

        // When
        new LinhaVenda(1, 'Produto', 0, 100.0, 0.0, 0.0);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Scenario: Sistema rejeita linha com quantidade negativa
    // ─────────────────────────────────────────────────────────────────────────

    #[Test]
    public function dado_quantidade_negativa_quando_linha_criada_entao_sistema_rejeita(): void
    {
        // Then
        $this->expectException(\DomainException::class);
        $this->expectExceptionMessage('Quantidade deve ser maior que zero');

        // When
        new LinhaVenda(1, 'Produto', -1, 100.0, 0.0, 0.0);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Scenario: Sistema aceita linha com quantidade mínima de 1
    // ─────────────────────────────────────────────────────────────────────────

    #[Test]
    public function dado_quantidade_1_quando_linha_criada_entao_e_o_minimo_valido(): void
    {
        // Given — quantidade mínima válida
        $linha = new LinhaVenda(1, 'Produto', 1, 100.0, 0.0, 0.0);

        // Then
        $this->assertSame(1, $linha->quantidade());
        $this->assertEqualsWithDelta(100.0, $linha->subtotal(), 0.01);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Scenario: Sistema rejeita linha com preço negativo
    // ─────────────────────────────────────────────────────────────────────────

    #[Test]
    public function dado_preco_negativo_quando_linha_criada_entao_sistema_rejeita(): void
    {
        // Then
        $this->expectException(\DomainException::class);
        $this->expectExceptionMessage('Preço não pode ser negativo');

        // When
        new LinhaVenda(1, 'Produto', 1, -10.0, 0.0, 0.0);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Scenario: Sistema aceita linha com preço zero (brinde)
    // ─────────────────────────────────────────────────────────────────────────

    #[Test]
    public function dado_preco_zero_quando_linha_criada_entao_e_aceite(): void
    {
        // Given — brinde gratuito
        $linha = new LinhaVenda(1, 'Brinde', 1, 0.0, 0.0, 0.0);

        // Then
        $this->assertEqualsWithDelta(0.0, $linha->totalLinha(), 0.01);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Scenario: Sistema rejeita linha com desconto negativo
    // ─────────────────────────────────────────────────────────────────────────

    #[Test]
    public function dado_desconto_negativo_quando_linha_criada_entao_sistema_rejeita(): void
    {
        // Then
        $this->expectException(\DomainException::class);
        $this->expectExceptionMessage('Desconto não pode ser negativo');

        // When
        new LinhaVenda(1, 'Produto', 1, 100.0, -5.0, 0.0);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Scenario: Sistema rejeita linha com desconto acima de 100%
    // ─────────────────────────────────────────────────────────────────────────

    #[Test]
    public function dado_desconto_acima_de_100_quando_linha_criada_entao_sistema_rejeita(): void
    {
        // Then
        $this->expectException(\DomainException::class);
        $this->expectExceptionMessage('Desconto não pode ser superior a 100%');

        // When
        new LinhaVenda(1, 'Produto', 1, 100.0, 101.0, 0.0);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Scenario: Sistema aceita linha com desconto de exactamente 100%
    // ─────────────────────────────────────────────────────────────────────────

    #[Test]
    public function dado_desconto_100_quando_linha_criada_entao_subtotal_com_desconto_e_zero(): void
    {
        // Given — desconto total
        $linha = new LinhaVenda(1, 'Oferta', 1, 100.0, 100.0, 0.0);

        // Then
        $this->assertEqualsWithDelta(0.0, $linha->subtotalComDesconto(), 0.01);
        $this->assertEqualsWithDelta(0.0, $linha->totalLinha(), 0.01);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Scenario: Imposto de exactamente 6.5% é identificado como retenção
    // ─────────────────────────────────────────────────────────────────────────

    #[Test]
    public function dado_imposto_6_virgula_5_quando_linha_criada_entao_e_retencao(): void
    {
        // Given — fronteira exacta da retenção
        $linha = new LinhaVenda(1, 'Serviço', 1, 1000.0, 0.0, 6.5);

        // Then
        $this->assertTrue($linha->temRetencao());
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Scenario: Imposto de 6.4% não é retenção
    // ─────────────────────────────────────────────────────────────────────────

    #[Test]
    public function dado_imposto_6_virgula_4_quando_linha_criada_entao_nao_e_retencao(): void
    {
        // Given — abaixo da fronteira
        $linha = new LinhaVenda(1, 'Produto', 1, 1000.0, 0.0, 6.4);

        // Then
        $this->assertFalse($linha->temRetencao());
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Scenario: Imposto de 6.6% não é retenção
    // ─────────────────────────────────────────────────────────────────────────

    #[Test]
    public function dado_imposto_6_virgula_6_quando_linha_criada_entao_nao_e_retencao(): void
    {
        // Given — acima da fronteira
        $linha = new LinhaVenda(1, 'Produto', 1, 1000.0, 0.0, 6.6);

        // Then
        $this->assertFalse($linha->temRetencao());
    }

    // ═════════════════════════════════════════════════════════════════════════
    // Testes adicionais de fronteira para resistência à mutação (Infection)
    // ═════════════════════════════════════════════════════════════════════════

    #[Test]
    public function dado_desconto_zero_quando_linha_criada_entao_subtotal_com_desconto_igual_ao_subtotal(): void
    {
        // Mutante: se desconto=0 não alterar subtotalComDesconto vs subtotal
        $linha = new LinhaVenda(1, 'Produto', 2, 100.0, 0.0, 0.0);

        $this->assertEqualsWithDelta(200.0, $linha->subtotal(), 0.01);
        $this->assertEqualsWithDelta(200.0, $linha->subtotalComDesconto(), 0.01);
    }

    #[Test]
    public function dado_desconto_positivo_quando_linha_criada_entao_subtotal_com_desconto_menor_que_subtotal(): void
    {
        // Mutante: + em vez de - na fórmula do desconto
        // subtotal = 1000, subtotalComDesconto = 900 (não 1100)
        $linha = new LinhaVenda(1, 'Produto', 2, 500.0, 10.0, 0.0);

        $this->assertEqualsWithDelta(1000.0, $linha->subtotal(), 0.01);
        $this->assertEqualsWithDelta(900.0, $linha->subtotalComDesconto(), 0.01);
        $this->assertLessThan($linha->subtotal(), $linha->subtotalComDesconto());
    }

    #[Test]
    public function dado_retencao_6_virgula_5_entao_retencao_nao_soma_ao_total_e_iva_6_virgula_6_soma(): void
    {
        // Mutante: separação retenção vs IVA
        $retencao = new LinhaVenda(1, 'Serviço', 1, 1000.0, 0.0, 6.5);
        $iva = new LinhaVenda(2, 'Produto', 1, 1000.0, 0.0, 6.6);

        // Retenção não soma ao total
        $this->assertEqualsWithDelta(1000.0, $retencao->totalLinha(), 0.01);
        // IVA soma ao total
        $this->assertGreaterThan(1000.0, $iva->totalLinha());
    }

    #[Test]
    public function dado_preco_zero_quando_linha_criada_entao_subtotal_e_imposto_e_total_sao_zero(): void
    {
        // Mutante: fronteira preço=0 aceite (não <=)
        $linha = new LinhaVenda(1, 'Brinde Gratuito', 3, 0.0, 0.0, 14.0);

        $this->assertEqualsWithDelta(0.0, $linha->subtotal(), 0.01);
        $this->assertEqualsWithDelta(0.0, $linha->valorImposto(), 0.01);
        $this->assertEqualsWithDelta(0.0, $linha->totalLinha(), 0.01);
    }

    #[Test]
    public function dado_desconto_100_virgula_01_quando_linha_criada_entao_sistema_rejeita(): void
    {
        // Mutante: fronteira > vs >= no desconto máximo
        $this->expectException(\DomainException::class);

        new LinhaVenda(1, 'Produto', 1, 100.0, 100.01, 0.0);
    }

    #[Test]
    public function dado_preco_negativo_minimo_quando_linha_criada_entao_sistema_rejeita(): void
    {
        // Mutante: fronteira < vs <= no preço
        $this->expectException(\DomainException::class);

        new LinhaVenda(1, 'Produto', 1, -0.01, 0.0, 0.0);
    }

    #[Test]
    public function dado_imposto_6_virgula_5_entao_retencao_e_informativa_e_nao_soma_ao_total(): void
    {
        // Garante que totalLinha = subtotalComDesconto (retenção fora)
        $linha = new LinhaVenda(1, 'Serviço', 2, 1000.0, 0.0, 6.5);

        // subtotal = 2000, retenção = 130, total deve ser 2000 (não 2130, não 1870)
        $this->assertEqualsWithDelta(2000.0, $linha->subtotalComDesconto(), 0.01);
        $this->assertEqualsWithDelta(130.0, $linha->valorImposto(), 0.01);
        $this->assertEqualsWithDelta(2000.0, $linha->totalLinha(), 0.01);
    }
}