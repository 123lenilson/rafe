<?php

namespace App\Modules\Clientes\Domain;

/**
 * DadosCliente
 *
 * Value Object que encapsula os dados de um cliente necessários ao módulo POS.
 * Imutável — representa um snapshot dos dados no momento da consulta.
 *
 * Localização: app/Modules/Clientes/Domain/DadosCliente.php
 *
 * Nota: O NIF pode ser vazio para clientes consumidor final (vendas ao balcão).
 */
final class DadosCliente
{
    public function __construct(
        private readonly int    $id,
        private readonly string $nome,
        private readonly string $nif = '',   // vazio para consumidor final
    ) {
        if (empty(trim($this->nome))) {
            throw new \DomainException('Nome do cliente não pode ser vazio');
        }
    }

    public function id(): int      { return $this->id; }
    public function nome(): string { return $this->nome; }
    public function nif(): string  { return $this->nif; }

    public function temNIF(): bool { return !empty($this->nif); }

    public function eConsumidorFinal(): bool { return !$this->temNIF(); }
}
