<?php

declare(strict_types=1);

namespace App\Modules\POS\Domain\Ports\Saida;

/**
 * Interface TransacaoPort
 *
 * Contrato para garantir a atomicidade das operações (efeitos secundários).
 * Permite que o Service não dependa directamente da infraestrutura do Laravel (ex: DB::transaction).
 */
interface TransacaoPort
{
    /**
     * Executa um callback garantindo atomicidade.
     * Se uma excepção for lançada dentro do callback, as alterações devem ser revertidas (Rollback).
     *
     * @param callable $operacao
     * @return mixed O retorno do próprio callback
     * @throws \Exception Relança a excepção gerada pela operação após rollback
     */
    public function executar(callable $operacao): mixed;
}
