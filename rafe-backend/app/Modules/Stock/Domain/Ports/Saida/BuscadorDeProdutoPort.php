<?php

namespace App\Modules\Stock\Domain\Ports\Saida;

use App\Modules\Stock\Domain\DadosProduto;

/**
 * BuscadorDeProdutoPort
 *
 * Port de saída do módulo Stock.
 * Define o contrato para consulta de dados de produtos.
 *
 * Localização: app/Modules/Stock/Domain/Ports/Saida/BuscadorDeProdutoPort.php
 *
 * Este Port é usado pelo módulo POS para obter os dados de um produto 
 * antes de criar um ItemPedido.
 */
interface BuscadorDeProdutoPort
{
    /**
     * Devolve os dados de um produto pelo seu ID.
     * Retorna null se o produto não existir ou não estiver activo.
     *
     * @param int $id Identificador único do produto
     * @return DadosProduto|null Dados do produto, ou null se não encontrado
     */
    public function buscarPorId(int $id): ?DadosProduto;
}
