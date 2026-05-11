<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PedidoTabela extends Model
{
    protected $table = 'pedido';
    protected $primaryKey = 'idpedido';
    public $timestamps = false;

    protected $guarded = [];
}
