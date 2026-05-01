<?php

declare(strict_types=1);

namespace App\Modules\Pagamentos\Adapters\Saida;

use App\Modules\Pagamentos\Domain\Ports\Saida\PagamentoRepositorioPort;
use App\Models\FormaPago;
use App\Models\Venda;

class MySQLPagamentoRepositorio implements PagamentoRepositorioPort
{
    public function registar(int $idDocumento, float $valor, string $metodoPagamento): void
    {
        $venda = Venda::find($idDocumento);
        $nFat = $venda ? $venda->N_fat : 'DESCONHECIDO';

        FormaPago::create([
            'forma' => $metodoPagamento,
            'valor' => $valor,
            'N_FACTURA' => $nFat,
            'dataa' => date('Y-m-d'),
            'empresa' => 1,
            'usuario' => 1
        ]);
    }
}
