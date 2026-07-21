<?php

namespace App\Http\Controllers\Api;

use App\Models\Appointment;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAppointmentRequest;
use App\Http\Requests\UpdateAppointmentRequest;
use App\Http\Resources\AppointmentResource;

class AppointmentController extends Controller
{
    public function index()
    {
        return AppointmentResource::collection(
            Appointment::with(['doctor', 'patient'])->get()
        );
    }

    public function store(StoreAppointmentRequest $request)
    {
        $appointment = Appointment::create(
            $request->validated()
        );

        return new AppointmentResource($appointment);
    }

    public function show(Appointment $appointment)
    {
        return new AppointmentResource($appointment);
    }

    public function update(
        UpdateAppointmentRequest $request,
        Appointment $appointment
    )
    {
        $appointment->update(
            $request->validated()
        );

        return new AppointmentResource($appointment);
    }

    public function destroy(Appointment $appointment)
    {
        $appointment->delete();

        return response()->json([
            'message' => 'Appointment deleted successfully'
        ]);
    }
}