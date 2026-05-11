<?php

namespace App\Modules\POS\Adapters\Entrada\Http\Controllers;

use Illuminate\Http\JsonResponse;
use App\Modules\POS\Services\GerirPedidoService;
use App\Modules\POS\Adapters\Entrada\Http\Requests\AdicionarItemPedidoRequest;

class GerirPedidoController
{
    public function __construct(private GerirPedidoService $service) {}

    public function iniciar(): JsonResponse
    {
        $idPedido = $this->service->iniciarPedido();
        
        return response()->json([
            'success' => true,
            'data' => ['pedido_id' => $idPedido],
            'message' => 'Pedido iniciado com sucesso.'
        ], 201);
    }

    public function adicionarItem(int $idPedido, AdicionarItemPedidoRequest $request): JsonResponse
    {
        $this->service->adicionarItem(
            $idPedido,
            (int) $request->produto_id,
            (int) $request->quantidade
        );

        return response()->json([
            'success' => true,
            'message' => 'Item adicionado com sucesso ao pedido.'
        ]);
    }

    public function removerItem(int $idPedido, int $idProduto): JsonResponse
    {
        $this->service->removerItem($idPedido, $idProduto);

        return response()->json([
            'success' => true,
            'message' => 'Item removido com sucesso do pedido.'
        ]);
    }
}
