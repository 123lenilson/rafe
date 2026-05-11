<?php

namespace App\Modules\Stock\Domain\Ports\Saida;

/**
 * StockRepositorioPort
 *
 * Port de saída do módulo Stock.
 * Define o contrato para operações de movimentação de stock.
 *
 * Localização: app/Modules/Stock/Domain/Ports/Saida/StockRepositorioPort.php
 *
 * Nota: A subtracção de stock é um efeito (Fase 3 do Service — após Domain aprovar).
 * Este Port é chamado dentro da transacção do FinalizarVendaService.
 *
 * Implementações esperadas:
 *  - MySQLStockRepo (Adapter Laravel — fase posterior)
 *  - FakeStockRepositorio (para testes — Fase 2)
 */
interface StockRepositorioPort
{
    /**
     * Subtrai a quantidade indicada do stock do produto.
     * Executado após a aprovação do Domain e dentro de uma transacção.
     *
     * @param int $produtoId ID do produto
     * @param int $quantidade Quantidade a subtrair (deve ser > 0)
     * @throws \DomainException se o stock for insuficiente no momento da escrita
     */
    public function subtrair(int $produtoId, int $quantidade): void;
}
