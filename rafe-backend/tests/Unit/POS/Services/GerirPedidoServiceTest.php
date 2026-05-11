<?php

declare(strict_types=1);

namespace Tests\Unit\POS\Services;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use App\Modules\POS\Services\GerirPedidoService;
use App\Modules\Clientes\Adapters\Saida\Fakes\FakeClienteRepositorio;
use App\Modules\Stock\Adapters\Saida\Fakes\FakeStockRepositorio;
use App\Modules\POS\Adapters\Saida\Fakes\FakePedidoRepositorio;
use DomainException;

/**
 * GerirPedidoServiceTest
 * 
 * Testes unitários baseados nos cenários BDD definidos em gerir-pedido.feature.
 * Estes testes devem falhar numa primeira fase (Red State) até a implementação
 * do Service estar concluída (Plano 02-03).
 */
class GerirPedidoServiceTest extends TestCase
{
    private GerirPedidoService $service;
    private FakeClienteRepositorio $clienteRepo;
    private FakeStockRepositorio $stockRepo;
    private FakePedidoRepositorio $pedidoRepo;

    protected function setUp(): void
    {
        $this->clienteRepo = new FakeClienteRepositorio();
        $this->stockRepo = new FakeStockRepositorio();
        $this->pedidoRepo = new FakePedidoRepositorio();

        $this->service = new GerirPedidoService(
            $this->clienteRepo,
            $this->stockRepo, // Assume BuscadorDeProdutoPort
            $this->stockRepo, // Assume VerificadorDeStockPort
            $this->pedidoRepo
        );

        // Prepara dados base no fake
        $this->clienteRepo->definirCliente(100, new \App\Modules\Clientes\Domain\DadosCliente(100, 'João', ''));
        $this->stockRepo->definirProdutoEStock(10, new \App\Modules\Stock\Domain\DadosProduto(10, 'Produto 10', 100.0, 'P', 14.0), 50);
        $this->stockRepo->definirProdutoEStock(15, new \App\Modules\Stock\Domain\DadosProduto(15, 'Produto 15', 50.0, 'P', 14.0), 1);
    }

    #[Test]
    public function iniciar_pedido_para_cliente_existente_retorna_id_pedido(): void
    {
        // When
        $idPedido = $this->service->iniciarPedido(100);

        // Then
        $this->assertGreaterThan(0, $idPedido);
    }

    #[Test]
    public function iniciar_pedido_para_consumidor_final_retorna_id_pedido(): void
    {
        // When
        $idPedido = $this->service->iniciarPedido(null);

        // Then
        $this->assertGreaterThan(0, $idPedido);
    }

    #[Test]
    public function iniciar_pedido_com_cliente_inexistente_lanca_excepcao(): void
    {
        // Then
        $this->expectException(DomainException::class);
        $this->expectExceptionMessage('Cliente não encontrado');

        // When
        $this->service->iniciarPedido(999);
    }

    #[Test]
    public function adicionar_item_valido_ao_pedido_com_sucesso(): void
    {
        // Given
        $idPedido = $this->service->iniciarPedido(null);

        // When
        $this->service->adicionarItem($idPedido, 10, 2);

        // Then
        $pedido = $this->pedidoRepo->buscarPorId($idPedido);
        $this->assertNotNull($pedido);
        $this->assertSame(2, $pedido->quantidadeDoProduto(10));
    }

    #[Test]
    public function tentar_adicionar_produto_sem_stock_lanca_excepcao(): void
    {
        // Given
        $idPedido = $this->service->iniciarPedido(null);
        
        // Then
        $this->expectException(DomainException::class);
        $this->expectExceptionMessage('Stock insuficiente');

        // When
        $this->service->adicionarItem($idPedido, 15, 2);
    }

    #[Test]
    public function tentar_adicionar_produto_que_nao_existe_lanca_excepcao(): void
    {
        // Given
        $idPedido = $this->service->iniciarPedido(null);
        
        // Then
        $this->expectException(DomainException::class);
        $this->expectExceptionMessage('Produto não encontrado');

        // When
        $this->service->adicionarItem($idPedido, 99, 1);
    }

    #[Test]
    public function iniciar_pedido_delega_a_geracao_do_n_pedido_ao_repositorio(): void
    {
        // When
        $idPedido = $this->service->iniciarPedido(null);

        // Then
        // O FakePedidoRepositorio devolve sempre 1
        $this->assertSame(1, $idPedido);
    }

    #[Test]
    public function item_adicionado_ao_pedido_tem_desconto_zero(): void
    {
        // Given
        $idPedido = $this->service->iniciarPedido(null);
        
        // When
        $this->service->adicionarItem($idPedido, 10, 2);

        // Then
        $pedido = $this->pedidoRepo->buscarPorId($idPedido);
        $item = $pedido->itens()[0];
        $this->assertSame(0.0, $item->desconto());
    }
}
