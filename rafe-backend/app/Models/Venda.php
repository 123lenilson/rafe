<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Venda extends Model
{
    protected $table = 'venda';
    protected $primaryKey = 'idVenda';
    public $timestamps = false;

    protected $guarded = [];
}
