<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AppointmentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
{
    return [
        'id' => $this->id,

        'doctor' => $this->doctor->name,

        'patient' => $this->patient->name,

        'appointment_date' => $this->appointment_date,

        'appointment_time' => $this->appointment_time,

        'status' => $this->status,

        'notes' => $this->notes
    ];
}
}
