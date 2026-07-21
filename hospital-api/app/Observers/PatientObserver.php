<?php

namespace App\Observers;

use App\Models\Patient;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

class PatientObserver
{

    public function created(Patient $patient)
    {
        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'Created',
            'module' => 'Patient',
            'description' => 'Added new patient: '.$patient->name,
            'ip_address' => request()->ip(),
        ]);
    }


    public function updated(Patient $patient)
    {
        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'Updated',
            'module' => 'Patient',
            'description' => 'Updated patient: '.$patient->name,
            'ip_address' => request()->ip(),
        ]);
    }


    public function deleted(Patient $patient)
    {
        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'Deleted',
            'module' => 'Patient',
            'description' => 'Deleted patient: '.$patient->name,
            'ip_address' => request()->ip(),
        ]);
    }

}