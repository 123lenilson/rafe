<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FormaPago extends Model
{
    protected $table = 'formapago';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $guarded = [];
}
