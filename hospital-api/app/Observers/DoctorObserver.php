<?php

namespace App\Observers;

use App\Models\Doctor;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

class DoctorObserver
{

    public function created(Doctor $doctor)
    {
        ActivityLog::create([

            'user_id' => Auth::id(),

            'action' => 'Created',

            'module' => 'Doctor',

            'description' => 
                'Added new doctor: ' . $doctor->name,

            'ip_address' => request()->ip(),

        ]);
    }


    public function updated(Doctor $doctor)
    {
        ActivityLog::create([

            'user_id' => Auth::id(),

            'action' => 'Updated',

            'module' => 'Doctor',

            'description' =>
                'Updated doctor: ' . $doctor->name,

            'ip_address' => request()->ip(),

        ]);
    }


    public function deleted(Doctor $doctor)
    {
        ActivityLog::create([

            'user_id' => Auth::id(),

            'action' => 'Deleted',

            'module' => 'Doctor',

            'description' =>
                'Deleted doctor: ' . $doctor->name,

            'ip_address' => request()->ip(),

        ]);
    }

}