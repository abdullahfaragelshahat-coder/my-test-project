<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'date_of_birth',
        'gender',
        'blood_group',
        'address'
    ];

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }
}
