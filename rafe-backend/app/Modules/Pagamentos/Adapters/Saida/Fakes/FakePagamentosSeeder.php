<?php

namespace App\Modules\Pagamentos\Adapters\Saida\Fakes;

class FakePagamentosSeeder
{
    public static function tabela_pagamento(): array
    {
        return [
            ['idpagamento' => 1,  'forma' => 'Dinheiro',              'taxa' => 0,   'ativo' => 's', 'empresa' => 1, 'usuario' => 1],
            ['idpagamento' => 2,  'forma' => 'TPA Multicaixa',        'taxa' => 1.5, 'ativo' => 's', 'empresa' => 1, 'usuario' => 1],
            ['idpagamento' => 3,  'forma' => 'Transferência Express', 'taxa' => 0,   'ativo' => 's', 'empresa' => 1, 'usuario' => 1],
            ['idpagamento' => 4,  'forma' => 'Cartão de Crédito',     'taxa' => 3.5, 'ativo' => 's', 'empresa' => 1, 'usuario' => 1],
            ['idpagamento' => 5,  'forma' => 'Unitel Money',          'taxa' => 0.5, 'ativo' => 's', 'empresa' => 1, 'usuario' => 1],
            ['idpagamento' => 6,  'forma' => 'Depósito Bancário',     'taxa' => 0,   'ativo' => 'n', 'empresa' => 1, 'usuario' => 1],
            ['idpagamento' => 7,  'forma' => 'Cheque Visado',         'taxa' => 2.0, 'ativo' => 'n', 'empresa' => 1, 'usuario' => 1],
            ['idpagamento' => 8,  'forma' => 'Multicaixa Express',    'taxa' => 0,   'ativo' => 'n', 'empresa' => 1, 'usuario' => 1],
            ['idpagamento' => 9,  'forma' => 'Criptomoeda (USDT)',    'taxa' => 1.0, 'ativo' => 'n', 'empresa' => 1, 'usuario' => 1],
            ['idpagamento' => 10, 'forma' => 'Pagamento por Referência','taxa' => 150, 'ativo' => 'n', 'empresa' => 1, 'usuario' => 1],
        ];
    }
}
