<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Imposto extends Model
{
    protected $table = 'imposto';
    // id como PK
    public $timestamps = false;

    protected $guarded = [];
}
