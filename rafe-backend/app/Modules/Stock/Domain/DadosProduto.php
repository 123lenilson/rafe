<?php

namespace App\Modules\Stock\Domain;

/**
 * DadosProduto
 *
 * Value Object que encapsula os dados de um produto necessários ao módulo POS.
 * Imutável — representa um snapshot dos dados no momento da consulta.
 *
 * Localização: app/Modules/Stock/Domain/DadosProduto.php
 *
 * Responsabilidades:
 *  - Transportar os dados do produto entre o módulo Stock e o módulo POS
 *  - Validar que os dados são consistentes no momento da criação
 *
 * Regras:
 *  - Imutável após criação (readonly)
 *  - Preço não pode ser negativo
 *  - Tipo apenas 'P' (Produto físico) ou 'S' (Serviço)
 *  - Taxa de imposto não pode ser negativa
 */
final class DadosProduto
{
    public function __construct(
        private readonly int    $id,
        private readonly string $nome,
        private readonly float  $preco,
        private readonly string $tipo,        // 'P' = Produto físico, 'S' = Serviço
        private readonly float  $taxaImposto, // percentagem (ex: 14.0 para 14% IVA)
    ) {
        if ($this->preco < 0) {
            throw new \DomainException('Preço do produto não pode ser negativo');
        }

        if (!in_array($this->tipo, ['P', 'S'], strict: true)) {
            throw new \DomainException('Tipo de produto inválido — deve ser P (Produto físico) ou S (Serviço)');
        }

        if ($this->taxaImposto < 0) {
            throw new \DomainException('Taxa de imposto não pode ser negativa');
        }
    }

    // ─── Consultas ────────────────────────────────────────────────────────────

    public function id(): int
    {
        return $this->id;
    }

    public function nome(): string
    {
        return $this->nome;
    }

    public function preco(): float
    {
        return $this->preco;
    }

    public function tipo(): string
    {
        return $this->tipo;
    }

    public function taxaImposto(): float
    {
        return $this->taxaImposto;
    }

    // ─── Derivados ────────────────────────────────────────────────────────────

    public function eProdutoFisico(): bool
    {
        return $this->tipo === 'P';
    }

    public function eServico(): bool
    {
        return $this->tipo === 'S';
    }
}
