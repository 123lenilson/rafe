<?php

declare(strict_types=1);

namespace App\Modules\Clientes\Adapters\Saida;

use App\Modules\Clientes\Domain\Ports\Saida\ClienteRepositorioPort;
use App\Modules\Clientes\Domain\DadosCliente;
use App\Models\Cliente;

class MySQLClienteRepositorio implements ClienteRepositorioPort
{
    public function buscarPorId(int $id): ?DadosCliente
    {
        $cliente = Cliente::find($id);
        if (!$cliente) return null;

        return new DadosCliente(
            $cliente->idcliente,
            $cliente->nome ?? 'Consumidor Final',
            $cliente->nif ?? '999999999'
        );
    }
}
