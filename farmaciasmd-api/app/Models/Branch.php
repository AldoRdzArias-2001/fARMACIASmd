<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    protected $fillable = [
        'name',
        'code',
        'address',
        'active',
    ];

    protected $casts = [
        'active' => 'boolean',
    ];

    public function stocks()
    {
        return $this->hasMany(BranchProductStock::class);
    }

    public function movements()
    {
        return $this->hasMany(StockMovement::class);
    }
}