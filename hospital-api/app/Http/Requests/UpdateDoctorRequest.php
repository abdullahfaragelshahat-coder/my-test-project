<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDoctorRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'name'           => 'required|string|max:255',
            // تجاهل الإيميل الحالي عند التحقق من الـ Unique
            'email'          => [
                'required',
                'email',
                Rule::unique('doctors', 'email')->ignore($this->doctor),
            ],
            'phone'          => 'required|string|max:20',
            'specialization' => 'required|string|max:255',
            'department_id'  => 'required|exists:departments,id',
            'image'          => 'nullable|image|mimes:jpg,jpeg,png,jfif|max:2048',
        ];
    }
}