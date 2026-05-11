<?php

declare(strict_types=1);

namespace App\Modules\POS\Adapters\Saida;

use App\Modules\POS\Domain\Ports\Saida\TransacaoPort;
use Illuminate\Support\Facades\DB;

class MySQLTransacao implements TransacaoPort
{
    public function executar(callable $operacao): mixed
    {
        return DB::transaction($operacao);
    }
}
