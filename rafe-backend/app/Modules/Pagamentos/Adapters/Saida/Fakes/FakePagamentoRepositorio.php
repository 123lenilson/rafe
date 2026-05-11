<?php

namespace App\Modules\Pagamentos\Adapters\Saida\Fakes;

use App\Modules\Pagamentos\Domain\Ports\Saida\PagamentoRepositorioPort;

class FakePagamentoRepositorio implements PagamentoRepositorioPort
{
    private array $tabela_pagamento = [];
    private array $pagamentos_registados = [];
    private bool $deveFalhar = false;

    public function __construct()
    {
        $this->tabela_pagamento = FakePagamentosSeeder::tabela_pagamento();
    }

    /**
     * Regista o pagamento de um documento fiscal.
     */
    public function registar(int $documentoFiscalId, float $valor, string $metodo): void
    {
        if ($this->deveFalhar) {
            throw new \DomainException('Falha simulada no registo de pagamento.');
        }

        $this->pagamentos_registados[] = [
            'documento_fiscal_id' => $documentoFiscalId,
            'valor'               => $valor,
            'metodo'              => $metodo,
        ];
    }

    // ─── Métodos auxiliares de teste (Não fazem parte dos Ports) ────────────────

    public function definirFalhaNoPagamento(bool $falhar): void
    {
        $this->deveFalhar = $falhar;
    }

    public function pagamentosRegistadosActual(): array
    {
        return $this->pagamentos_registados;
    }
}
