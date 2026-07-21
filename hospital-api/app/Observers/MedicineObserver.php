<?php

namespace App\Observers;

use App\Models\Medicine;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

class MedicineObserver
{

    public function created(Medicine $medicine)
    {
        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'Created',
            'module' => 'Medicine',
            'description' => 'Added new medicine: '.$medicine->name,
            'ip_address' => request()->ip(),
        ]);
    }


    public function updated(Medicine $medicine)
    {
        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'Updated',
            'module' => 'Medicine',
            'description' => 'Updated medicine: '.$medicine->name,
            'ip_address' => request()->ip(),
        ]);
    }


    public function deleted(Medicine $medicine)
    {
        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'Deleted',
            'module' => 'Medicine',
            'description' => 'Deleted medicine: '.$medicine->name,
            'ip_address' => request()->ip(),
        ]);
    }

}