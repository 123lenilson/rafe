<?php

declare(strict_types=1);

namespace App\Modules\POS\Services;

use App\Modules\Clientes\Domain\Ports\Saida\ClienteRepositorioPort;
use App\Modules\Stock\Domain\Ports\Saida\BuscadorDeProdutoPort;
use App\Modules\Stock\Domain\Ports\Saida\VerificadorDeStockPort;
use App\Modules\POS\Domain\Ports\Saida\PedidoRepositorioPort;
use App\Modules\POS\Domain\Pedido;
use App\Modules\POS\Domain\ItemPedido;
use DomainException;

/**
 * GerirPedidoService
 * 
 * Orquestrador do ciclo de vida de um Pedido (abrir, adicionar itens).
 */
class GerirPedidoService
{
    public function __construct(
        private ClienteRepositorioPort $clienteRepo,
        private BuscadorDeProdutoPort $buscadorProduto,
        private VerificadorDeStockPort $verificadorStock,
        private PedidoRepositorioPort $pedidoRepo
    ) {}

    public function iniciarPedido(?int $idCliente = null): int
    {
        if ($idCliente !== null) {
            $cliente = $this->clienteRepo->buscarPorId($idCliente);
            if ($cliente === null) {
                throw new DomainException('Cliente não encontrado');
            }
        }

        return $this->pedidoRepo->proximoNumeroPedido();
    }

    public function adicionarItem(int $idPedido, int $idProduto, int $quantidade): void
    {
        $produto = $this->buscadorProduto->buscarPorId($idProduto);
        if ($produto === null) {
            throw new DomainException('Produto não encontrado');
        }

        if (!$this->verificadorStock->temStockDisponivel($idProduto, $quantidade)) {
            throw new DomainException('Stock insuficiente');
        }

        $item = new ItemPedido(
            $produto->id(),
            $produto->nome(),
            $quantidade,
            $produto->preco(),
            0.0, // Desconto é 0 por enquanto
            $produto->taxaImposto()
        );

        $pedido = $this->pedidoRepo->buscarPorId($idPedido);

        if ($pedido === null) {
            // É o primeiro item! Criamos a entidade Pedido.
            $pedido = new Pedido([$item], $idPedido);
        } else {
            // Pedido já existe, adicionamos o item.
            $pedido->adicionarItem($item);
        }

        $this->pedidoRepo->salvar($pedido);
    }

    public function removerItem(int $idPedido, int $idProduto): void
    {
        $pedido = $this->pedidoRepo->buscarPorId($idPedido);
        if ($pedido === null) {
            throw new DomainException('Pedido não encontrado');
        }

        $pedido->removerItem($idProduto);

        if (empty($pedido->itens())) {
            $this->pedidoRepo->eliminar($idPedido);
        } else {
            $this->pedidoRepo->salvar($pedido);
        }
    }
}
