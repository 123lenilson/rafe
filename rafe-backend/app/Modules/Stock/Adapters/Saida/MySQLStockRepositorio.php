<?php

declare(strict_types=1);

namespace App\Modules\Stock\Adapters\Saida;

use App\Modules\Stock\Domain\Ports\Saida\BuscadorDeProdutoPort;
use App\Modules\Stock\Domain\Ports\Saida\VerificadorDeStockPort;
use App\Modules\Stock\Domain\Ports\Saida\SubtrairStockPort;
use App\Modules\Stock\Domain\Ports\Saida\StockRepositorioPort;
use App\Modules\Stock\Domain\DadosProduto;
use App\Models\Produto;
use DomainException;

class MySQLStockRepositorio implements BuscadorDeProdutoPort, VerificadorDeStockPort, SubtrairStockPort, StockRepositorioPort
{
    public function buscarPorId(int $id): ?DadosProduto
    {
        $produto = Produto::with('impostoRel')->find($id);
        if (!$produto) return null;

        $impostoPerc = $produto->impostoRel ? $produto->impostoRel->percentagem : 14.0;
        
        return new DadosProduto(
            $produto->IDPRODUTO,
            $produto->descricao,
            (float) $produto->venda,
            $produto->ps === 'Serviço' ? 'S' : 'P',
            (float) $impostoPerc
        );
    }

    public function temStockDisponivel(int $id, int $quantidade): bool
    {
        $produto = Produto::find($id);
        if (!$produto) return false;
        if ($produto->ps === 'Serviço') return true;
        return $produto->qtd >= $quantidade;
    }

    public function subtrair(int $id, int $quantidade): void
    {
        $produto = Produto::find($id);
        if (!$produto) {
            throw new DomainException("Produto não encontrado");
        }
        if ($produto->ps !== 'Serviço') {
            if ($produto->qtd < $quantidade) {
                throw new DomainException("Quantidade insuficiente em stock");
            }
            $produto->qtd -= $quantidade;
            $produto->save();
        }
    }
}
