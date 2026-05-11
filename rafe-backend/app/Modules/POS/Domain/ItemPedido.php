<?php

namespace App\Modules\POS\Domain;

/**
 * ItemPedido
 *
 * Representa uma linha do carrinho antes da emissão do documento fiscal.
 * Pertence ao Domain do módulo POS.
 *
 * Localização: app/Modules/POS/Domain/ItemPedido.php
 *
 * Responsabilidades:
 *  - Guardar os dados do item no momento em que foi adicionado ao carrinho
 *  - Validar quantidade, preço e desconto
 *  - Calcular subtotal, desconto, imposto e total da linha
 *  - Identificar se o imposto é retenção (6.5%) ou IVA
 *
 * O imposto chega já resolvido da tabela pedido (JOIN com tabela imposto).
 * O POS não valida a taxa — essa responsabilidade é do módulo Stock.
 */



class ItemPedido
{
    private const TAXA_RETENCAO = 6.5;

    public function __construct(
        private int $idProduto,
        private string $descricao,
        private int $quantidade,
        private float $preco,
        private float $desconto,
        private float $imposto
    ) {
        $this->validar();
    }

    // ─── Validações ───────────────────────────────────────────────────────────

    private function validar(): void
    {
        if ($this->quantidade <= 0) {
            throw new \DomainException('Quantidade tem de ser maior que zero');
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

    // ─── Getters ──────────────────────────────────────────────────────────────

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
        $valorDesconto = $this->subtotal() * ($this->desconto / 100);
        return $this->subtotal() - $valorDesconto;
    }

    /**
     * Valor do imposto (IVA ou retenção) calculado sobre o subtotal com desconto.
     * valorImposto = subtotalComDesconto × (imposto / 100)
     *
     * Nota: no caso da retenção (6.5%) este valor é informativo —
     * não é somado ao total da linha (ver totalLinha()).
     */
    public function valorImposto(): float
    {
        return $this->subtotalComDesconto() * ($this->imposto / 100);
    }

    /**
     * Total a pagar pela linha.
     *
     * IVA  → totalLinha = subtotalComDesconto + valorImposto
     * Retenção (6.5%) → totalLinha = subtotalComDesconto  (retenção é informativa)
     */
    public function totalLinha(): float
    {
        if ($this->temRetencao()) {
            return $this->subtotalComDesconto();
        }

        return $this->subtotalComDesconto() + $this->valorImposto();
    }

    /**
     * Indica se o imposto deste item é retenção na fonte (6.5%).
     * A retenção é um valor que o cliente deve pagar à AGT pelo serviço adquirido.
     * Aparece informativo na factura mas não soma ao valor a pagar.
     */
    public function temRetencao(): bool
    {
        return $this->imposto === self::TAXA_RETENCAO;
    }
}
