<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePrescriptionRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }



    public function rules(): array
    {
        return [

            'doctor_id' => [
                'required',
                'exists:doctors,id'
            ],


            'patient_id' => [
                'required',
                'exists:patients,id'
            ],


            'diagnosis' => [
                'required',
                'string'
            ],


            'notes' => [
                'nullable',
                'string'
            ],


            'prescription_date' => [
    'required',
    'date'
],

'medicines' => [
    'required',
    'array'
],

'medicines.*.id' => [
    'required',
    'exists:medicines,id'
],

'medicines.*.quantity' => [
    'required',
    'integer',
    'min:1'
],

'medicines.*.dosage' => [
    'required',
    'string'
],

        ];
    }
}