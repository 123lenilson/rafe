<?php

namespace Tests\Unit\POS\Domain;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use App\Modules\POS\Domain\LinhaVenda;
use App\Modules\POS\Domain\DocumentoFiscal;

/**
 * Testes do DocumentoFiscal — estilo BDD
 *
 * Localização: tests/Unit/POS/Domain/DocumentoFiscalTest.php
 *
 * Correr:
 *   php artisan test --filter DocumentoFiscalTest
 */
class DocumentoFiscalTest extends TestCase
{
    // ═════════════════════════════════════════════════════════════════════════
    // Feature: Representar um documento fiscal emitido (DocumentoFiscal)
    // ═════════════════════════════════════════════════════════════════════════

    // ─────────────────────────────────────────────────────────────────────────
    // Scenario: Operador emite uma Fatura com um produto com IVA
    // ─────────────────────────────────────────────────────────────────────────

    #[Test]
    public function dado_fatura_com_uma_linha_com_iva_quando_criado_entao_tem_1_linha(): void
    {
        // Given
        $documento = new DocumentoFiscal('Fatura', [
            new LinhaVenda(10, 'Caneta BIC', 2, 150.0, 0.0, 14.0),
        ]);

        // Then
        $this->assertSame(1, $documento->totalLinhas());
    }

    #[Test]
    public function dado_fatura_com_uma_linha_com_iva_quando_criado_entao_total_iliquido_e_300(): void
    {
        // Given — 2 × 150 = 300
        $documento = new DocumentoFiscal('Fatura', [
            new LinhaVenda(10, 'Caneta BIC', 2, 150.0, 0.0, 14.0),
        ]);

        // Then
        $this->assertEqualsWithDelta(300.0, $documento->totalIliquido(), 0.01);
    }

    #[Test]
    public function dado_fatura_com_uma_linha_com_iva_quando_criado_entao_total_iva_e_42(): void
    {
        // Given — IVA = 300 × 14% = 42
        $documento = new DocumentoFiscal('Fatura', [
            new LinhaVenda(10, 'Caneta BIC', 2, 150.0, 0.0, 14.0),
        ]);

        // Then
        $this->assertEqualsWithDelta(42.0, $documento->totalIva(), 0.01);
    }

    #[Test]
    public function dado_fatura_com_uma_linha_com_iva_quando_criado_entao_total_retencao_e_zero(): void
    {
        // Given
        $documento = new DocumentoFiscal('Fatura', [
            new LinhaVenda(10, 'Caneta BIC', 2, 150.0, 0.0, 14.0),
        ]);

        // Then
        $this->assertEqualsWithDelta(0.0, $documento->totalRetencao(), 0.01);
    }

    #[Test]
    public function dado_fatura_com_uma_linha_com_iva_quando_criado_entao_valor_a_pagar_e_342(): void
    {
        // Given — 300 + 42 = 342
        $documento = new DocumentoFiscal('Fatura', [
            new LinhaVenda(10, 'Caneta BIC', 2, 150.0, 0.0, 14.0),
        ]);

        // Then
        $this->assertEqualsWithDelta(342.0, $documento->valorAPagar(), 0.01);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Scenario: Operador emite uma Fatura com múltiplas linhas
    // ─────────────────────────────────────────────────────────────────────────

    #[Test]
    public function dado_fatura_com_multiplas_linhas_quando_criado_entao_tem_3_linhas(): void
    {
        // Given
        $documento = new DocumentoFiscal('Fatura', [
            new LinhaVenda(10, 'Caneta BIC', 2, 150.0, 0.0, 14.0),
            new LinhaVenda(5, 'Caderno A4', 1, 500.0, 0.0, 0.0),
            new LinhaVenda(99, 'Instalação de AC', 1, 5000.0, 0.0, 6.5),
        ]);

        // Then
        $this->assertSame(3, $documento->totalLinhas());
    }

    #[Test]
    public function dado_fatura_com_multiplas_linhas_quando_criado_entao_total_iliquido_e_5800(): void
    {
        // Given — 300 + 500 + 5000 = 5800
        $documento = new DocumentoFiscal('Fatura', [
            new LinhaVenda(10, 'Caneta BIC', 2, 150.0, 0.0, 14.0),
            new LinhaVenda(5, 'Caderno A4', 1, 500.0, 0.0, 0.0),
            new LinhaVenda(99, 'Instalação de AC', 1, 5000.0, 0.0, 6.5),
        ]);

        // Then
        $this->assertEqualsWithDelta(5800.0, $documento->totalIliquido(), 0.01);
    }

    #[Test]
    public function dado_fatura_com_multiplas_linhas_quando_criado_entao_total_iva_e_42(): void
    {
        // Given — só a Caneta tem IVA: 300 × 14% = 42
        $documento = new DocumentoFiscal('Fatura', [
            new LinhaVenda(10, 'Caneta BIC', 2, 150.0, 0.0, 14.0),
            new LinhaVenda(5, 'Caderno A4', 1, 500.0, 0.0, 0.0),
            new LinhaVenda(99, 'Instalação de AC', 1, 5000.0, 0.0, 6.5),
        ]);

        // Then
        $this->assertEqualsWithDelta(42.0, $documento->totalIva(), 0.01);
    }

    #[Test]
    public function dado_fatura_com_multiplas_linhas_quando_criado_entao_total_retencao_e_325(): void
    {
        // Given — só o serviço tem retenção: 5000 × 6.5% = 325
        $documento = new DocumentoFiscal('Fatura', [
            new LinhaVenda(10, 'Caneta BIC', 2, 150.0, 0.0, 14.0),
            new LinhaVenda(5, 'Caderno A4', 1, 500.0, 0.0, 0.0),
            new LinhaVenda(99, 'Instalação de AC', 1, 5000.0, 0.0, 6.5),
        ]);

        // Then
        $this->assertEqualsWithDelta(325.0, $documento->totalRetencao(), 0.01);
    }

    #[Test]
    public function dado_fatura_com_multiplas_linhas_quando_criado_entao_valor_a_pagar_e_5842(): void
    {
        // Given — ilíquido=5800 + IVA=42 = 5842 (retenção não soma)
        $documento = new DocumentoFiscal('Fatura', [
            new LinhaVenda(10, 'Caneta BIC', 2, 150.0, 0.0, 14.0),
            new LinhaVenda(5, 'Caderno A4', 1, 500.0, 0.0, 0.0),
            new LinhaVenda(99, 'Instalação de AC', 1, 5000.0, 0.0, 6.5),
        ]);

        // Then
        $this->assertEqualsWithDelta(5842.0, $documento->valorAPagar(), 0.01);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Scenario: Tipos de documento suportados
    // ─────────────────────────────────────────────────────────────────────────

    #[Test]
    public function dado_tipo_fatura_recibo_quando_criado_entao_tipo_e_fatura_recibo(): void
    {
        // Given
        $documento = new DocumentoFiscal('Fatura-Recibo', [
            new LinhaVenda(1, 'Produto', 1, 100.0, 0.0, 0.0),
        ]);

        // Then
        $this->assertSame('Fatura-Recibo', $documento->tipo());
    }

    #[Test]
    public function dado_tipo_factura_proforma_quando_criado_entao_tipo_e_factura_proforma(): void
    {
        // Given
        $documento = new DocumentoFiscal('Factura-Proforma', [
            new LinhaVenda(1, 'Produto', 1, 100.0, 0.0, 0.0),
        ]);

        // Then
        $this->assertSame('Factura-Proforma', $documento->tipo());
    }

    #[Test]
    public function dado_tipo_orcamento_quando_criado_entao_tipo_e_orcamento(): void
    {
        // Given
        $documento = new DocumentoFiscal('Orçamento', [
            new LinhaVenda(1, 'Produto', 1, 100.0, 0.0, 0.0),
        ]);

        // Then
        $this->assertSame('Orçamento', $documento->tipo());
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Scenario: Sistema rejeita documento fiscal sem linhas
    // ─────────────────────────────────────────────────────────────────────────

    #[Test]
    public function dado_documento_sem_linhas_quando_criado_entao_sistema_rejeita(): void
    {
        // Then
        $this->expectException(\DomainException::class);
        $this->expectExceptionMessage('Documento fiscal não pode ser criado sem linhas');

        // When
        new DocumentoFiscal('Fatura', []);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Scenario: Sistema rejeita documento com tipo inválido
    // ─────────────────────────────────────────────────────────────────────────

    #[Test]
    public function dado_tipo_invalido_quando_criado_entao_sistema_rejeita(): void
    {
        // Then
        $this->expectException(\DomainException::class);
        $this->expectExceptionMessage('Tipo de documento inválido');

        // When
        new DocumentoFiscal('NotaDeCredito', [
            new LinhaVenda(1, 'Produto', 1, 100.0, 0.0, 0.0),
        ]);
    }

    #[Test]
    public function dado_tipo_vazio_quando_criado_entao_sistema_rejeita(): void
    {
        // Then
        $this->expectException(\DomainException::class);
        $this->expectExceptionMessage('Tipo de documento inválido');

        // When
        new DocumentoFiscal('', [
            new LinhaVenda(1, 'Produto', 1, 100.0, 0.0, 0.0),
        ]);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Scenario: Sistema calcula total ilíquido como soma dos subtotais com desconto
    // ─────────────────────────────────────────────────────────────────────────

    #[Test]
    public function dado_dois_itens_sem_imposto_quando_calculado_entao_total_iliquido_e_800(): void
    {
        // Given — (2×100) + (3×200) = 200 + 600 = 800
        $documento = new DocumentoFiscal('Fatura', [
            new LinhaVenda(1, 'Produto A', 2, 100.0, 0.0, 0.0),
            new LinhaVenda(2, 'Produto B', 3, 200.0, 0.0, 0.0),
        ]);

        // Then
        $this->assertEqualsWithDelta(800.0, $documento->totalIliquido(), 0.01);
        $this->assertEqualsWithDelta(800.0, $documento->valorAPagar(), 0.01);
    }

    #[Test]
    public function dado_linhas_com_desconto_quando_calculado_entao_total_iliquido_usa_subtotal_com_desconto(): void
    {
        // Given
        // Produto A: 2 × 500 = 1000, desconto 10% → subtotalComDesconto = 900
        // Produto B: 1 × 200 = 200,  desconto 25% → subtotalComDesconto = 150
        // total ilíquido = 900 + 150 = 1050
        $documento = new DocumentoFiscal('Fatura', [
            new LinhaVenda(1, 'Produto A', 2, 500.0, 10.0, 0.0),
            new LinhaVenda(2, 'Produto B', 1, 200.0, 25.0, 0.0),
        ]);

        // Then
        $this->assertEqualsWithDelta(1050.0, $documento->totalIliquido(), 0.01);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Scenario: Sistema separa IVA de retenção nos totais globais
    // ─────────────────────────────────────────────────────────────────────────

    #[Test]
    public function dado_linha_com_iva_e_linha_com_retencao_quando_calculado_entao_totais_separados(): void
    {
        // Given
        // IVA:      1000 × 14% = 140
        // Retenção: 2000 × 6.5% = 130
        $documento = new DocumentoFiscal('Fatura', [
            new LinhaVenda(1, 'Produto com IVA', 1, 1000.0, 0.0, 14.0),
            new LinhaVenda(2, 'Serviço AC', 1, 2000.0, 0.0, 6.5),
        ]);

        // Then
        $this->assertEqualsWithDelta(140.0, $documento->totalIva(), 0.01);
        $this->assertEqualsWithDelta(130.0, $documento->totalRetencao(), 0.01);
        // valor a pagar = 1000 + 2000 + 140 = 3140 (retenção não soma)
        $this->assertEqualsWithDelta(3140.0, $documento->valorAPagar(), 0.01);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Scenario: Sistema calcula valor a pagar sem incluir retenção
    // ─────────────────────────────────────────────────────────────────────────

    #[Test]
    public function dado_servico_com_retencao_quando_calculado_entao_retencao_nao_soma_ao_valor_a_pagar(): void
    {
        // Given
        $documento = new DocumentoFiscal('Fatura', [
            new LinhaVenda(99, 'Serviço', 1, 1000.0, 0.0, 6.5),
        ]);

        // Then
        $this->assertEqualsWithDelta(65.0, $documento->totalRetencao(), 0.01);
        $this->assertEqualsWithDelta(1000.0, $documento->valorAPagar(), 0.01);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Scenario: Sistema devolve todas as linhas do documento
    // ─────────────────────────────────────────────────────────────────────────

    #[Test]
    public function dado_documento_com_3_linhas_quando_devolvidas_entao_sao_exactamente_3(): void
    {
        // Given
        $documento = new DocumentoFiscal('Fatura', [
            new LinhaVenda(1, 'Produto A', 1, 100.0, 0.0, 0.0),
            new LinhaVenda(2, 'Produto B', 1, 200.0, 0.0, 0.0),
            new LinhaVenda(3, 'Produto C', 1, 300.0, 0.0, 0.0),
        ]);

        // Then
        $this->assertCount(3, $documento->linhas());
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Scenario: Sistema devolve o tipo do documento
    // ─────────────────────────────────────────────────────────────────────────

    #[Test]
    public function dado_documento_do_tipo_fatura_quando_devolvido_tipo_entao_e_fatura(): void
    {
        // Given
        $documento = new DocumentoFiscal('Fatura', [
            new LinhaVenda(1, 'Produto', 1, 100.0, 0.0, 0.0),
        ]);

        // Then
        $this->assertSame('Fatura', $documento->tipo());
    }

    // ═════════════════════════════════════════════════════════════════════════
    // Testes adicionais de fronteira para resistência à mutação (Infection)
    // ═════════════════════════════════════════════════════════════════════════

    #[Test]
    public function dado_documento_com_linha_com_desconto_quando_calculado_entao_iva_sobre_subtotal_com_desconto(): void
    {
        // Mutante: + em vez de - na fórmula do desconto dentro de LinhaVenda
        // IVA correcto = 900 × 14% = 126
        // IVA mutante  = 1100 × 14% = 154
        $documento = new DocumentoFiscal('Fatura', [
            new LinhaVenda(1, 'Produto', 2, 500.0, 10.0, 14.0),
        ]);

        $this->assertEqualsWithDelta(126.0, $documento->totalIva(), 0.01);
        $this->assertLessThan(150.0, $documento->totalIva());
    }

    #[Test]
    public function dado_documento_com_retencao_quando_calculado_entao_retencao_nao_entra_no_iva(): void
    {
        // Mutante: separação IVA vs retenção nos totais globais
        $documento = new DocumentoFiscal('Fatura', [
            new LinhaVenda(1, 'Serviço', 1, 1000.0, 0.0, 6.5),
        ]);

        $this->assertEqualsWithDelta(0.0, $documento->totalIva(), 0.01);
        $this->assertEqualsWithDelta(65.0, $documento->totalRetencao(), 0.01);
    }

    #[Test]
    public function dado_documento_com_iva_quando_calculado_entao_iva_nao_entra_na_retencao(): void
    {
        // Mutante: separação IVA vs retenção nos totais globais (inverso)
        $documento = new DocumentoFiscal('Fatura', [
            new LinhaVenda(1, 'Produto', 1, 1000.0, 0.0, 14.0),
        ]);

        $this->assertEqualsWithDelta(140.0, $documento->totalIva(), 0.01);
        $this->assertEqualsWithDelta(0.0, $documento->totalRetencao(), 0.01);
    }

    #[Test]
    public function dado_documento_com_1_linha_quando_total_linhas_e_1_entao_nao_e_zero(): void
    {
        // Mutante: count() removido ou substituído por 0
        $documento = new DocumentoFiscal('Fatura', [
            new LinhaVenda(1, 'Produto', 1, 100.0, 0.0, 0.0),
        ]);

        $this->assertSame(1, $documento->totalLinhas());
        $this->assertGreaterThan(0, $documento->totalLinhas());
    }

    #[Test]
    public function dado_valor_a_pagar_quando_calculado_entao_e_soma_de_iliquido_e_iva_nao_subtraccao(): void
    {
        // Mutante: + trocado por - em valorAPagar
        // correcto = 300 + 42 = 342
        // mutante  = 300 - 42 = 258
        $documento = new DocumentoFiscal('Fatura', [
            new LinhaVenda(10, 'Caneta BIC', 2, 150.0, 0.0, 14.0),
        ]);

        $this->assertEqualsWithDelta(342.0, $documento->valorAPagar(), 0.01);
        $this->assertGreaterThan($documento->totalIliquido(), $documento->valorAPagar());
    }
}