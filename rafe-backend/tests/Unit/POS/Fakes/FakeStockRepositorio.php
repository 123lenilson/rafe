<?php

namespace Tests\Unit\POS\Fakes;

use App\Modules\Stock\Domain\Ports\Saida\StockRepositorioPort;
use DomainException;

class FakeStockRepositorio implements StockRepositorioPort
{
    private array $stock = [];
    private array $logSubtraccoes = [];

    public function inicializarStock(int $produtoId, int $quantidade): void
    {
        $this->stock[$produtoId] = $quantidade;
    }

    public function subtrair(int $produtoId, int $quantidade): void
    {
        if ($quantidade <= 0) {
            throw new DomainException("Quantidade a subtrair deve ser maior que zero.");
        }

        $stockActual = $this->stock[$produtoId] ?? 0;

        if ($stockActual < $quantidade) {
            throw new DomainException("Stock insuficiente no momento da escrita.");
        }

        $this->stock[$produtoId] -= $quantidade;
        $this->logSubtraccoes[] = [
            'produtoId' => $produtoId,
            'quantidade' => $quantidade,
        ];
    }

    public function getLogSubtraccoes(): array
    {
        return $this->logSubtraccoes;
    }

    public function getStock(int $produtoId): int
    {
        return $this->stock[$produtoId] ?? 0;
    }
}
