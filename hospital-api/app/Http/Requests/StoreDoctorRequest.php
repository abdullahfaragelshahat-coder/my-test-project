<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDoctorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'           => 'required|string|max:255',
            'email'          => 'required|email|unique:doctors,email',
            'phone'          => 'required|string|max:20',
            'specialization' => 'required|string|max:255',
            'department_id'  => 'required|exists:departments,id',
            'image'          => 'nullable|image|mimes:jpg,jpeg,png,jfif|max:2048',
        ];
    }
}