<?php

namespace App\Modules\POS\Adapters\Entrada\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AdicionarItemPedidoRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'produto_id' => 'required|integer',
            'quantidade' => 'required|integer|min:1',
            'desconto_percentagem' => 'nullable|numeric|min:0|max:100',
        ];
    }
}
