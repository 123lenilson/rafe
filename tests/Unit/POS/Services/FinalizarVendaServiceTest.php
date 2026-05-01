<?php

declare(strict_types=1);

namespace Tests\Unit\POS\Services;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use App\Modules\POS\Services\FinalizarVendaService;
use App\Modules\POS\Adapters\Saida\Fakes\FakePedidoRepositorio;
use App\Modules\POS\Adapters\Saida\Fakes\FakeDocumentoFiscalRepositorio;
use App\Modules\POS\Adapters\Saida\Fakes\FakeTransacao;
use App\Modules\Stock\Adapters\Saida\Fakes\FakeStockRepositorio;
use App\Modules\Pagamentos\Adapters\Saida\Fakes\FakePagamentoRepositorio;
use DomainException;

/**
 * FinalizarVendaServiceTest
 * 
 * Testes unitários para orquestração da venda.
 * Estes testes iniciam a vermelho (Red State).
 */
class FinalizarVendaServiceTest extends TestCase
{
    private FinalizarVendaService $service;
    private FakePedidoRepositorio $pedidoRepo;
    private FakeDocumentoFiscalRepositorio $documentoRepo;
    private FakeStockRepositorio $stockRepo;
    private FakePagamentoRepositorio $pagamentoRepo;
    private FakeTransacao $transacao;

    protected function setUp(): void
    {
        $this->pedidoRepo = new FakePedidoRepositorio();
        $this->documentoRepo = new FakeDocumentoFiscalRepositorio();
        $this->stockRepo = new FakeStockRepositorio();
        $this->pagamentoRepo = new FakePagamentoRepositorio();
        $this->transacao = new FakeTransacao();

        $this->service = new FinalizarVendaService(
            $this->pedidoRepo,
            $this->documentoRepo,
            $this->stockRepo,
            $this->pagamentoRepo,
            $this->transacao
        );

        // --- Configurar Estado para os Cenários ---
        
        $produto10 = new \App\Modules\Stock\Domain\DadosProduto(10, 'Prod 10', 500, 'P', 14);
        $produto15 = new \App\Modules\Stock\Domain\DadosProduto(15, 'Prod 15', 500, 'P', 14);
        
        $this->stockRepo->definirProdutoEStock(10, $produto10, 50); // Stock suficiente
        $this->stockRepo->definirProdutoEStock(15, $produto15, 1);  // Stock insuficiente para 2
        
        // Itens
        $item10_2 = new \App\Modules\POS\Domain\ItemPedido(10, 'Prod 10', 2, 500, 0, 14);
        $item15_2 = new \App\Modules\POS\Domain\ItemPedido(15, 'Prod 15', 2, 500, 0, 14);
        $item10_1 = new \App\Modules\POS\Domain\ItemPedido(10, 'Prod 10', 1, 500, 0, 14);

        // Pedido 1: Sucesso
        $pedido1 = new \App\Modules\POS\Domain\Pedido([$item10_2], 1);
        $this->pedidoRepo->salvar($pedido1);

        // Pedido 2: Sem itens (Não existe na BD/Repo, será retornado null)
        
        // Pedido 3: Stock insuficiente
        $pedido3 = new \App\Modules\POS\Domain\Pedido([$item15_2], 3);
        $this->pedidoRepo->salvar($pedido3);

        // Pedido 4: Falha no pagamento
        $pedido4 = new \App\Modules\POS\Domain\Pedido([$item10_1], 4);
        $this->pedidoRepo->salvar($pedido4);
    }

    #[Test]
    public function sucesso_ao_finalizar_uma_venda(): void
    {
        // When
        $idDoc = $this->service->finalizar(1, 'Fatura-Recibo', 'numerario', 1000.0);

        // Then
        $this->assertGreaterThan(0, $idDoc);
        $this->assertNull($this->pedidoRepo->buscarPorId(1));
    }

    #[Test]
    public function falha_ao_tentar_finalizar_pedido_sem_itens(): void
    {
        $this->expectException(DomainException::class);
        $this->expectExceptionMessage('Pedido não pode estar vazio');

        // When
        $this->service->finalizar(2, 'Fatura-Recibo', 'numerario', 1000.0);
    }

    #[Test]
    public function falha_por_stock_insuficiente_no_momento_do_checkout(): void
    {
        $this->expectException(DomainException::class);
        $this->expectExceptionMessage('Stock insuficiente no momento do checkout');

        // When
        $this->service->finalizar(3, 'Fatura-Recibo', 'numerario', 1000.0);
    }

    #[Test]
    public function falha_na_atomicidade_por_erro_de_pagamento_mantem_estado_intacto(): void
    {
        $this->pagamentoRepo->definirFalhaNoPagamento(true);

        $this->expectException(DomainException::class);
        $this->expectExceptionMessage('Falha simulada no registo de pagamento.');

        // When
        try {
            $this->service->finalizar(4, 'Fatura-Recibo', 'cartao', 1000.0);
        } catch (DomainException $e) {
            // Then
            $this->assertEquals('Falha simulada no registo de pagamento.', $e->getMessage());
            
            // Verifica estado intacto: pedido não foi apagado
            $pedido4Guardado = $this->pedidoRepo->buscarPorId(4);
            $this->assertNotNull($pedido4Guardado);
            
            throw $e;
        }
    }
}
