<?php

namespace App\Modules\Stock\Domain\Ports\Saida;

/**
 * VerificadorDeStockPort
 *
 * Port de saída do módulo Stock.
 * Define o contrato para verificação de stock de produtos.
 *
 * Localização: app/Modules/Stock/Domain/Ports/Saida/VerificadorDeStockPort.php
 *
 * Este Port é usado pelo módulo POS para verificar se existe stock 
 * suficiente antes de adicionar o item ao Pedido.
 */
interface VerificadorDeStockPort
{
    /**
     * Verifica se existe stock suficiente para a quantidade pedida.
     *
     * @param int $produtoId  ID do produto a verificar
     * @param int $quantidade Quantidade pretendida (deve ser > 0)
     * @return bool true se o stock disponível >= quantidade pedida
     */
    public function temStockDisponivel(int $produtoId, int $quantidade): bool;
}
