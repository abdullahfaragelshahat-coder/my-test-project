<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class DoctorResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'specialization' => $this->specialization,
            
            // اسم القسم
            'department' => $this->department?->name,
            
            // رقم القسم (مهم جداً للتعديل)
            'department_id' => $this->department_id,
            
            // إرجاع الرابط الكامل للصورة إذا كانت موجودة
            'image' => $this->image ? Storage::url($this->image) : null,
            
            // إضافة التوقيت مفيد جداً في الفرونت
            'created_at' => $this->created_at?->format('Y-m-d H:i'),
        ];
    }
}