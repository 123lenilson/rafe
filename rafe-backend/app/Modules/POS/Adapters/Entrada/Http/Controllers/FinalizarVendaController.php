<?php

namespace App\Modules\POS\Adapters\Entrada\Http\Controllers;

use Illuminate\Http\JsonResponse;
use App\Modules\POS\Services\FinalizarVendaService;
use App\Modules\POS\Adapters\Entrada\Http\Requests\FinalizarVendaRequest;

class FinalizarVendaController
{
    public function __construct(private FinalizarVendaService $service) {}

    public function finalizar(FinalizarVendaRequest $request): JsonResponse
    {
        $idDocumento = $this->service->finalizar(
            (int) $request->pedido_id,
            $request->tipo_documento,
            $request->metodo_pagamento,
            (float) $request->valor_entregue
        );

        return response()->json([
            'success' => true,
            'data' => ['documento_id' => $idDocumento],
            'message' => 'Venda finalizada com sucesso.'
        ]);
    }
}
