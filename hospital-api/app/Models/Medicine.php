<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Medicine extends Model
{
    protected $fillable = [
    'name',
    'company',
    'price',
    'quantity'
];

    public function prescriptions()
    {
        return $this->belongsToMany(
            Prescription::class
        )
        ->withPivot(
            'quantity',
            'dosage'
        )
        ->withTimestamps();
    }
}
