<?php

namespace App\Observers;

use App\Models\Prescription;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

class PrescriptionObserver
{

    public function created(Prescription $prescription)
    {
        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'Created',
            'module' => 'Prescription',
            'description' => 'Created prescription ID: '.$prescription->id,
            'ip_address' => request()->ip(),
        ]);
    }


    public function updated(Prescription $prescription)
    {
        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'Updated',
            'module' => 'Prescription',
            'description' => 'Updated prescription ID: '.$prescription->id,
            'ip_address' => request()->ip(),
        ]);
    }


    public function deleted(Prescription $prescription)
    {
        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'Deleted',
            'module' => 'Prescription',
            'description' => 'Deleted prescription ID: '.$prescription->id,
            'ip_address' => request()->ip(),
        ]);
    }

}