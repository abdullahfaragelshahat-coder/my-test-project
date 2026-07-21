<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Doctor extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'specialization',
        'department_id',
        'image'
    ];

    /**
     * Get the department that owns the doctor.
     */
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }
}