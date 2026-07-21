<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Prescription;

class PrescriptionPolicy
{
    public function update(
        User $user,
        Prescription $prescription
    ): bool
    {
        return $user->role === 'admin'
            || $prescription->doctor_id == $user->id;
    }

    public function delete(
        User $user,
        Prescription $prescription
    ): bool
    {
        return $user->role === 'admin';
    }
}