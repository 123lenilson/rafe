<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Produto extends Model
{
    protected $table = 'produto';
    protected $primaryKey = 'IDPRODUTO';
    public $timestamps = false; // Assumindo base de dados legada sem created_at/updated_at

    protected $guarded = [];

    // Relacionamento com imposto (se existir)
    public function impostoRel()
    {
        return $this->belongsTo(Imposto::class, 'impostos', 'id');
    }
}
