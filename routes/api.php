<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Modules\POS\Adapters\Entrada\Http\Controllers\GerirPedidoController;
use App\Modules\POS\Adapters\Entrada\Http\Controllers\FinalizarVendaController;

Route::prefix('pos')->group(function () {
    Route::post('/pedido/iniciar', [GerirPedidoController::class, 'iniciar']);
    Route::post('/pedido/{idPedido}/itens', [GerirPedidoController::class, 'adicionarItem']);
    Route::delete('/pedido/{idPedido}/itens/{idProduto}', [GerirPedidoController::class, 'removerItem']);
    
    Route::post('/venda/finalizar', [FinalizarVendaController::class, 'finalizar']);
});
