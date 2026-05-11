<?php

namespace App\Modules\Clientes\Domain\Ports\Saida;

use App\Modules\Clientes\Domain\DadosCliente;

/**
 * ClienteRepositorioPort
 *
 * Port de saída do módulo Clientes.
 * Define o contrato para consulta de dados de clientes.
 *
 * Localização: app/Modules/Clientes/Domain/Ports/Saida/ClienteRepositorioPort.php
 *
 * Implementações esperadas:
 *  - MySQLClienteRepo (Adapter Laravel — fase posterior)
 *  - FakeClienteRepositorio (para testes — Fase 2)
 */
interface ClienteRepositorioPort
{
    /**
     * Devolve os dados de um cliente pelo seu ID.
     * Retorna null se o cliente não existir.
     */
    public function buscarPorId(int $id): ?DadosCliente;
}
