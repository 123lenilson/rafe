<?php

namespace App\Modules\POS\Domain;

/**
 * LinhaVenda
 *
 * Representa uma linha de um documento fiscal já emitido.
 * Pertence ao Domain do módulo POS.
 *
 * Localização: app/Modules/POS/Domain/LinhaVenda.php
 *
 * Responsabilidades:
 *  - Congelar os valores no momento da emissão (quantidade, preço, desconto, imposto)
 *  - Calcular subtotal bruto, subtotal com desconto, valor do imposto e total da linha
 *  - Identificar se o imposto é retenção (6.5%) ou IVA
 *
 * Regras:
 *  - É imutável após criação — os valores não mudam
 *  - Retenção (6.5%) é informativa — não soma ao total da linha
 *  - total da linha = subtotalComDesconto + valorImposto (apenas se IVA)
 *  - A lógica de cálculo é idêntica à do ItemPedido
 *  - Validação de stock é feita pelo Service — o Domain não conhece stock
 */
class LinhaVenda
{
    private const PERCENTAGEM_RETENCAO = 6.5;

    public function __construct(
        private readonly int $idProduto,
        private readonly string $descricao,
        private readonly int $quantidade,
        private readonly float $preco,
        private readonly float $desconto,
        private readonly float $imposto,
    ) {
        $this->validar();
    }

    // ─── Validação ────────────────────────────────────────────────────────────

    private function validar(): void
    {
        if ($this->quantidade <= 0) {
            throw new \DomainException('Quantidade deve ser maior que zero');
        }

        if ($this->preco < 0) {
            throw new \DomainException('Preço não pode ser negativo');
        }

        if ($this->desconto < 0) {
            throw new \DomainException('Desconto não pode ser negativo');
        }

        if ($this->desconto > 100) {
            throw new \DomainException('Desconto não pode ser superior a 100%');
        }
    }

    // ─── Consultas ────────────────────────────────────────────────────────────

    public function idProduto(): int
    {
        return $this->idProduto;
    }

    public function descricao(): string
    {
        return $this->descricao;
    }

    public function quantidade(): int
    {
        return $this->quantidade;
    }

    public function preco(): float
    {
        return $this->preco;
    }

    public function desconto(): float
    {
        return $this->desconto;
    }

    public function imposto(): float
    {
        return $this->imposto;
    }

    /**
     * Verifica se o imposto desta linha é retenção (6.5%).
     */
    public function temRetencao(): bool
    {
        return $this->imposto === self::PERCENTAGEM_RETENCAO;
    }

    // ─── Cálculos ─────────────────────────────────────────────────────────────

    /**
     * Valor bruto sem desconto nem imposto.
     * subtotal = quantidade × preço
     */
    public function subtotal(): float
    {
        return $this->quantidade * $this->preco;
    }

    /**
     * Valor após aplicação do desconto.
     * subtotalComDesconto = subtotal - (subtotal × desconto / 100)
     */
    public function subtotalComDesconto(): float
    {
        return $this->subtotal() - ($this->subtotal() * $this->desconto / 100);
    }

    /**
     * Valor do imposto calculado sobre o subtotal com desconto.
     * valorImposto = subtotalComDesconto × imposto / 100
     */
    public function valorImposto(): float
    {
        return $this->subtotalComDesconto() * $this->imposto / 100;
    }

    /**
     * Valor total da linha.
     * Se IVA  → totalLinha = subtotalComDesconto + valorImposto
     * Se retenção → totalLinha = subtotalComDesconto (retenção é informativa)
     */
    public function totalLinha(): float
    {
        if ($this->temRetencao()) {
            return $this->subtotalComDesconto();
        }

        return $this->subtotalComDesconto() + $this->valorImposto();
    }
}