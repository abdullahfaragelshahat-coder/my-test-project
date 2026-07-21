<?php

namespace App\Providers;

use App\Models\Doctor;
use App\Models\Patient;
use App\Models\Medicine;
use App\Models\Appointment;
use App\Models\Prescription;

use App\Observers\DoctorObserver;
use App\Observers\PatientObserver;
use App\Observers\MedicineObserver;
use App\Observers\AppointmentObserver;
use App\Observers\PrescriptionObserver;

use App\Policies\PrescriptionPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;


class AppServiceProvider extends ServiceProvider
{

    public function register(): void
    {

    }


    public function boot(): void
    {

        Gate::policy(
            Prescription::class,
            PrescriptionPolicy::class
        );


        Doctor::observe(
            DoctorObserver::class
        );
        Patient::observe(PatientObserver::class);

Medicine::observe(MedicineObserver::class);

Appointment::observe(AppointmentObserver::class);

Prescription::observe(PrescriptionObserver::class);
    }
    
}
