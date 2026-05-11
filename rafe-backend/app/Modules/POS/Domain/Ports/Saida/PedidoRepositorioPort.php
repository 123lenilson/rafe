<?php

declare(strict_types=1);

namespace App\Modules\POS\Domain\Ports\Saida;

use App\Modules\POS\Domain\Pedido;

/**
 * Interface PedidoRepositorioPort
 *
 * Contrato de saída para persistência da entidade Pedido.
 */
interface PedidoRepositorioPort
{
    /**
     * Salva o pedido. Retorna o ID gerado (ou o ID existente).
     */
    public function salvar(Pedido $pedido): int;

    public function buscarPorId(int $id): ?Pedido;

    /**
     * Obtém o próximo número de pedido disponível (ID do cabeçalho de sessão).
     */
    public function proximoNumeroPedido(): int;

    /**
     * Elimina um pedido (ex: quando fica sem itens).
     */
    public function eliminar(int $id): void;
}
