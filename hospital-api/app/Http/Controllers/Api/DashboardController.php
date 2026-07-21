<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\Medicine;
use App\Models\Appointment;
use App\Models\Prescription;

class DashboardController extends Controller
{
    public function index()
    {
        return response()->json([

            'total_doctors' =>
                Doctor::count(),

            'total_patients' =>
                Patient::count(),

            'total_medicines' =>
                Medicine::count(),

            'total_appointments' =>
                Appointment::count(),

            'total_prescriptions' =>
                Prescription::count(),

            'today_appointments' =>
                Appointment::whereDate(
                    'appointment_date',
                    today()
                )->count(),

            'today_prescriptions' =>
                Prescription::whereDate(
                    'prescription_date',
                    today()
                )->count(),

        ]);
    }
}