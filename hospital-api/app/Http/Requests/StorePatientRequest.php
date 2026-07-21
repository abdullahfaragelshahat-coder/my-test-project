<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StorePatientRequest extends FormRequest
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
        'name' => 'required|string|max:255',

        'email' => 'required|email|unique:patients,email',

        'phone' => 'required|string',

        'date_of_birth' => 'required|date',

        'gender' => 'required|in:male,female',

        'blood_group' => 'required|string',

        'address' => 'nullable|string',
    ];
}
}
