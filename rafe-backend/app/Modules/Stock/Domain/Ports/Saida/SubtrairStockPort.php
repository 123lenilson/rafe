<?php

declare(strict_types=1);

namespace App\Modules\Stock\Domain\Ports\Saida;

interface SubtrairStockPort
{
    /**
     * Subtrai a quantidade do stock do produto.
     * Para produtos do tipo Serviço, não faz nada.
     *
     * @throws \DomainException se o produto não for encontrado ou quantidade insuficiente.
     */
    public function subtrair(int $id, int $quantidade): void;
}
