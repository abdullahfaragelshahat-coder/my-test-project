<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreAppointmentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
{
    return true;
}

public function rules(): array
{
    return [
        'doctor_id' => 'required|exists:doctors,id',

        'patient_id' => 'required|exists:patients,id',

        'appointment_date' => 'required|date',

        'appointment_time' => 'required',

        'status' => 'nullable|in:pending,confirmed,completed,cancelled',

        'notes' => 'nullable|string'
    ];
}
}
