<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PrescriptionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [

            'id' => $this->id,

            'doctor' => $this->doctor->name,

            'patient' => $this->patient->name,

            'diagnosis' => $this->diagnosis,

            'notes' => $this->notes,

            'prescription_date' => $this->prescription_date,

            'medicines' => $this->medicines->map(function ($medicine) {

                return [

                    'id' => $medicine->id,

                    'name' => $medicine->name,

                    'quantity' => $medicine->pivot->quantity,

                    'dosage' => $medicine->pivot->dosage,

                ];

            }),

        ];
    }
}