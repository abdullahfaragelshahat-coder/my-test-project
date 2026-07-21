<?php

namespace App\Observers;

use App\Models\Appointment;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

class AppointmentObserver
{

    public function created(Appointment $appointment)
    {
        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'Created',
            'module' => 'Appointment',
            'description' => 'Created new appointment ID: '.$appointment->id,
            'ip_address' => request()->ip(),
        ]);
    }


    public function updated(Appointment $appointment)
    {
        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'Updated',
            'module' => 'Appointment',
            'description' => 'Updated appointment ID: '.$appointment->id,
            'ip_address' => request()->ip(),
        ]);
    }


    public function deleted(Appointment $appointment)
    {
        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'Deleted',
            'module' => 'Appointment',
            'description' => 'Deleted appointment ID: '.$appointment->id,
            'ip_address' => request()->ip(),
        ]);
    }

}