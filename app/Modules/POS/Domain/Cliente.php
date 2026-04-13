<?php

namespace App\Modules\POS\Domain;

class Cliente
{
    private string $nome;
    private ?string $nif;
    private ?string $email;
    private ?string $telefone;
    private ?string $morada;

    public function __construct(
        string $nome,
        ?string $nif = null,
        ?string $email = null,
        ?string $telefone = null,
        ?string $morada = null
    ) {
        // Regra 1 — Nome é obrigatório
        $nome = trim($nome);
        if (empty($nome)) {
            throw new \DomainException('Nome do cliente é obrigatório');
        }

        // Regra 2 — Email deve ser válido se fornecido
        if ($email !== null && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new \DomainException('Email inválido');
        }

        // Regra 3 — NIF deve ser numérico se fornecido
        if ($nif !== null && !ctype_digit($nif)) {
            throw new \DomainException('NIF inválido — deve conter apenas números');
        }

        $this->nome = $nome;
        $this->nif = $nif;
        $this->email = $email;
        $this->telefone = $telefone;
        $this->morada = $morada;
    }

    // ── Getters ──────────────────────────────────────
    public function nome(): string
    {
        return $this->nome;
    }
    public function nif(): ?string
    {
        return $this->nif;
    }
    public function email(): ?string
    {
        return $this->email;
    }
    public function telefone(): ?string
    {
        return $this->telefone;
    }
    public function morada(): ?string
    {
        return $this->morada;
    }

    // ── Regra de negócio ─────────────────────────────
    public function isConsumidorFinal(): bool
    {
        return strtolower(trim($this->nome)) === 'consumidor final';
    }
}