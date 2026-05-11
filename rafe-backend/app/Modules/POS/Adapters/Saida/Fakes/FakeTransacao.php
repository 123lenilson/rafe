<?php

declare(strict_types=1);

namespace App\Modules\POS\Adapters\Saida\Fakes;

use App\Modules\POS\Domain\Ports\Saida\TransacaoPort;

/**
 * FakeTransacao
 *
 * Adaptador falso para testes. Como os testes correm com dados em memória,
 * a atomicidade real (Rollback de BD) não é estritamente simulada pela transacção,
 * pois as variáveis em memória teriam de suportar snapshots.
 *
 * O objectivo aqui é garantir que o Service consegue invocar o `executar`
 * sem depender de uma Base de Dados real. O callback é executado imediatamente.
 */
class FakeTransacao implements TransacaoPort
{
    public function executar(callable $operacao): mixed
    {
        // Num ambiente em memória, apenas executamos o callback.
        // O lançamento de excepções fará com que o código seguinte não seja executado,
        // o que já simula parcialmente o comportamento desejado nos nossos testes unitários.
        return $operacao();
    }
}
