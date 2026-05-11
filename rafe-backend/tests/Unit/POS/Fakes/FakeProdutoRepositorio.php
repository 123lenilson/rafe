<?php

namespace Tests\Unit\POS\Fakes;

use App\Modules\Stock\Domain\DadosProduto;
use App\Modules\Stock\Domain\Ports\Saida\BuscadorDeProdutoPort;
use App\Modules\Stock\Domain\Ports\Saida\VerificadorDeStockPort;

class FakeProdutoRepositorio implements BuscadorDeProdutoPort, VerificadorDeStockPort
{
    private array $produtos = [];
    private array $stock = [];

    public function adicionarProduto(DadosProduto $produto, int $quantidadeStock = 0): void
    {
        $this->produtos[$produto->id()] = $produto;
        $this->stock[$produto->id()] = $quantidadeStock;
    }

    public function buscarPorId(int $id): ?DadosProduto
    {
        return $this->produtos[$id] ?? null;
    }

    public function temStockDisponivel(int $produtoId, int $quantidade): bool
    {
        if ($quantidade <= 0) {
            return false;
        }

        $stockActual = $this->stock[$produtoId] ?? 0;
        return $stockActual >= $quantidade;
    }
}
