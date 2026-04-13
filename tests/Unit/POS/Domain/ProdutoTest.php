<?php

namespace Tests\Unit\POS\Domain;

use App\Modules\POS\Domain\Produto;
use Tests\TestCase;

class ProdutoTest extends TestCase
{
    // ══════════════════════════════════════════
    // CAMINHO FELIZ
    // ══════════════════════════════════════════

    public function test_cria_produto_com_dados_validos(): void
    {
        $produto = new Produto(
            descricao: 'Caneta BIC',
            preco: 150.00,
            tipo: 'P',
            stock: 10,
            precoCompra: 80.00,
            impostoPercentagem: 14.0,
            impostoId: 2
        );

        $this->assertEquals('Caneta BIC', $produto->descricao());
        $this->assertEquals(150.00, $produto->preco());
        $this->assertEquals('P', $produto->tipo());
        $this->assertEquals(10, $produto->stock());
    }

    public function test_cria_servico_com_dados_validos(): void
    {
        $produto = new Produto(
            descricao: 'Consultoria',
            preco: 5000.00,
            tipo: 'S',
            stock: 0,
            impostoPercentagem: 6.5,
            impostoId: 3
        );

        $this->assertEquals('S', $produto->tipo());
        $this->assertTrue($produto->isServico());
        $this->assertFalse($produto->isProduto());
    }

    public function test_produto_nao_e_servico(): void
    {
        $produto = new Produto(
            descricao: 'Caneta BIC',
            preco: 150.00,
            tipo: 'P',
            stock: 10
        );

        $this->assertTrue($produto->isProduto());
        $this->assertFalse($produto->isServico());
    }

    public function test_tem_stock_suficiente(): void
    {
        $produto = new Produto(
            descricao: 'Caneta BIC',
            preco: 150.00,
            tipo: 'P',
            stock: 10
        );

        $this->assertTrue($produto->temStockSuficiente(5));
        $this->assertTrue($produto->temStockSuficiente(10));
        $this->assertFalse($produto->temStockSuficiente(11));
    }

    public function test_servico_sempre_tem_stock_suficiente(): void
    {
        // Serviço não tem stock — nunca deve falhar por stock
        $produto = new Produto(
            descricao: 'Consultoria',
            preco: 5000.00,
            tipo: 'S',
            stock: 0
        );

        $this->assertTrue($produto->temStockSuficiente(999));
    }

    public function test_calcula_preco_com_iva_14(): void
    {
        $produto = new Produto(
            descricao: 'Computador',
            preco: 100_000.00,
            tipo: 'P',
            stock: 5,
            impostoPercentagem: 14.0,
            impostoId: 2
        );

        // 100.000 + (100.000 * 14 / 100) = 114.000
        $this->assertEquals(114_000.00, $produto->precoComImposto());
    }

    public function test_calcula_preco_com_iva_7(): void
    {
        $produto = new Produto(
            descricao: 'Produto B',
            preco: 100_000.00,
            tipo: 'P',
            stock: 5,
            impostoPercentagem: 7.0,
            impostoId: 1
        );

        // 100.000 + (100.000 * 7 / 100) = 107.000
        $this->assertEquals(107_000.00, $produto->precoComImposto());
    }

    public function test_produto_isento_mantem_preco_original(): void
    {
        // impostoId = 4 significa isento — preço não muda
        $produto = new Produto(
            descricao: 'Produto Isento',
            preco: 100_000.00,
            tipo: 'P',
            stock: 5,
            impostoPercentagem: 0.0,
            impostoId: 4  // ← isento
        );

        $this->assertEquals(100_000.00, $produto->precoComImposto());
    }

    public function test_produto_sem_imposto_mantem_preco_original(): void
    {
        $produto = new Produto(
            descricao: 'Produto Simples',
            preco: 50_000.00,
            tipo: 'P',
            stock: 5
        );

        $this->assertEquals(50_000.00, $produto->precoComImposto());
    }

    // ══════════════════════════════════════════
    // REGRAS DE NEGÓCIO
    // ══════════════════════════════════════════

    public function test_nao_permite_descricao_vazia(): void
    {
        $this->expectException(\DomainException::class);
        $this->expectExceptionMessage('Descrição do produto é obrigatória');

        new Produto(descricao: '', preco: 150.00, tipo: 'P', stock: 10);
    }

    public function test_nao_permite_descricao_apenas_espacos(): void
    {
        $this->expectException(\DomainException::class);
        $this->expectExceptionMessage('Descrição do produto é obrigatória');

        new Produto(descricao: '   ', preco: 150.00, tipo: 'P', stock: 10);
    }

    public function test_nao_permite_preco_zero(): void
    {
        $this->expectException(\DomainException::class);
        $this->expectExceptionMessage('Preço de venda deve ser maior que zero');

        new Produto(descricao: 'Caneta', preco: 0, tipo: 'P', stock: 10);
    }

    public function test_nao_permite_preco_negativo(): void
    {
        $this->expectException(\DomainException::class);
        $this->expectExceptionMessage('Preço de venda deve ser maior que zero');

        new Produto(descricao: 'Caneta', preco: -10.00, tipo: 'P', stock: 10);
    }

    public function test_nao_permite_stock_negativo(): void
    {
        $this->expectException(\DomainException::class);
        $this->expectExceptionMessage('Stock não pode ser negativo');

        new Produto(descricao: 'Caneta', preco: 150.00, tipo: 'P', stock: -1);
    }

    public function test_nao_permite_tipo_invalido(): void
    {
        $this->expectException(\DomainException::class);
        $this->expectExceptionMessage('Tipo deve ser P (produto) ou S (serviço)');

        new Produto(descricao: 'Caneta', preco: 150.00, tipo: 'X', stock: 10);
    }

    public function test_nao_permite_preco_compra_negativo(): void
    {
        $this->expectException(\DomainException::class);
        $this->expectExceptionMessage('Preço de compra não pode ser negativo');

        new Produto(
            descricao: 'Caneta',
            preco: 150.00,
            tipo: 'P',
            stock: 10,
            precoCompra: -10.00
        );
    }

    public function test_descricao_e_limpa_automaticamente(): void
    {
        $produto = new Produto(
            descricao: '  Caneta BIC  ',
            preco: 150.00,
            tipo: 'P',
            stock: 10
        );

        $this->assertEquals('Caneta BIC', $produto->descricao());
    }
}