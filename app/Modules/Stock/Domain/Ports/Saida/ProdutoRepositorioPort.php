<?php

namespace App\Modules\Stock\Domain\Ports\Saida;

use App\Modules\Stock\Domain\DadosProduto;

/**
 * ProdutoRepositorioPort
 *
 * Port de saída do módulo Stock.
 * Define o contrato para consulta de dados de produtos e verificação de stock.
 *
 * Localização: app/Modules/Stock/Domain/Ports/Saida/ProdutoRepositorioPort.php
 *
 * Este Port é usado pelo módulo POS para:
 *  - Obter os dados de um produto antes de criar um ItemPedido
 *  - Verificar se existe stock suficiente antes de adicionar o item ao Pedido
 *
 * Implementações esperadas:
 *  - MySQLProdutoRepo (Adapter Laravel via Eloquent — Milestone 2)
 *  - FakeProdutoRepositorio (em memória, para testes — Fase 2)
 */
interface ProdutoRepositorioPort
{
    /**
     * Devolve os dados de um produto pelo seu ID.
     * Retorna null se o produto não existir ou não estiver activo.
     *
     * @param int $id Identificador único do produto
     * @return DadosProduto|null Dados do produto, ou null se não encontrado
     */
    public function buscarPorId(int $id): ?DadosProduto;

    /**
     * Verifica se existe stock suficiente para a quantidade pedida.
     *
     * @param int $produtoId  ID do produto a verificar
     * @param int $quantidade Quantidade pretendida (deve ser > 0)
     * @return bool true se o stock disponível >= quantidade pedida
     */
    public function temStockDisponivel(int $produtoId, int $quantidade): bool;
}
