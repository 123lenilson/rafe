<?php

namespace App\Modules\POS\Domain;

class Produto
{
    private string $descricao;
    private float $preco;
    private string $tipo;
    private int $stock;
    private ?float $precoCompra;
    private float $impostoPercentagem;
    private int $impostoId;

    public function __construct(
        string $descricao,
        float $preco,
        string $tipo,
        int $stock,
        ?float $precoCompra = null,
        float $impostoPercentagem = 0.0,
        int $impostoId = 0
    ) {
        // Regra 1 — Descrição obrigatória
        $descricao = trim($descricao);
        if (empty($descricao)) {
            throw new \DomainException('Descrição do produto é obrigatória');
        }

        // Regra 2 — Preço de venda maior que zero
        if ($preco <= 0) {
            throw new \DomainException('Preço de venda deve ser maior que zero');
        }

        // Regra 3 — Tipo deve ser P ou S
        $tipo = strtoupper(trim($tipo));
        if (!in_array($tipo, ['P', 'S'])) {
            throw new \DomainException('Tipo deve ser P (produto) ou S (serviço)');
        }

        // Regra 4 — Stock não pode ser negativo
        if ($stock < 0) {
            throw new \DomainException('Stock não pode ser negativo');
        }

        // Regra 5 — Preço de compra não pode ser negativo
        if ($precoCompra !== null && $precoCompra < 0) {
            throw new \DomainException('Preço de compra não pode ser negativo');
        }

        $this->descricao = $descricao;
        $this->preco = $preco;
        $this->tipo = $tipo;
        $this->stock = $stock;
        $this->precoCompra = $precoCompra;
        $this->impostoPercentagem = $impostoPercentagem;
        $this->impostoId = $impostoId;
    }

    // ── Getters ──────────────────────────────────────────
    public function descricao(): string
    {
        return $this->descricao;
    }
    public function preco(): float
    {
        return $this->preco;
    }
    public function tipo(): string
    {
        return $this->tipo;
    }
    public function stock(): int
    {
        return $this->stock;
    }
    public function precoCompra(): ?float
    {
        return $this->precoCompra;
    }
    public function impostoPercentagem(): float
    {
        return $this->impostoPercentagem;
    }
    public function impostoId(): int
    {
        return $this->impostoId;
    }

    // ── Regras de negócio ────────────────────────────────

    public function isProduto(): bool
    {
        return $this->tipo === 'P';
    }

    public function isServico(): bool
    {
        return $this->tipo === 'S';
    }

    public function temStockSuficiente(int $quantidade): bool
    {
        // Serviço não tem controlo de stock — sempre passa
        if ($this->isServico()) {
            return true;
        }

        return $this->stock >= $quantidade;
    }

    public function precoComImposto(): float
    {
        // impostoId = 4 significa isento — preço não muda
        if ($this->impostoId === 4) {
            return $this->preco;
        }

        // Sem imposto definido — preço não muda
        if ($this->impostoPercentagem <= 0) {
            return $this->preco;
        }

        // Preço + (Preço * percentagem / 100)
        return round(
            $this->preco + ($this->preco * $this->impostoPercentagem / 100),
            2
        );
    }
}