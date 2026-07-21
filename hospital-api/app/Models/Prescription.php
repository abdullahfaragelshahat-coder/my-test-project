<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Prescription extends Model
{

    protected $fillable = [

        'doctor_id',

        'patient_id',

        'diagnosis',

        'notes',

        'prescription_date'

    ];



    public function doctor()
    {
        return $this->belongsTo(Doctor::class);
    }



    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

public function medicines()
{
    return $this->belongsToMany(
        Medicine::class
    )
    ->withPivot(
        'quantity',
        'dosage'
    )
    ->withTimestamps();
}
}