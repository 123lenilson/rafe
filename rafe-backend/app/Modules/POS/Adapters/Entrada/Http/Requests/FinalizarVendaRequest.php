<?php

namespace App\Modules\POS\Adapters\Entrada\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FinalizarVendaRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'pedido_id' => 'required|integer',
            'valor_entregue' => 'required|numeric|min:0',
            'metodo_pagamento' => 'required|string',
            'tipo_documento' => 'required|string|in:Fatura,Fatura-Recibo',
        ];
    }
}
