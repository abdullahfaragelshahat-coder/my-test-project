<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePatientRequest;
use App\Http\Requests\UpdatePatientRequest;
use App\Http\Resources\PatientResource;
use App\Models\Patient;

class PatientController extends Controller
{
    // عرض جميع المرضى
    public function index()
    {
        return PatientResource::collection(
            Patient::all()
        );
    }

    // إنشاء مريض جديد
    public function store(StorePatientRequest $request)
    {
        $patient = Patient::create(
            $request->validated()
        );

        return new PatientResource(
            $patient
        );
    }

    // عرض مريض واحد
    public function show(Patient $patient)
    {
        return new PatientResource(
            $patient
        );
    }

    // تعديل بيانات مريض
    public function update(
        UpdatePatientRequest $request,
        Patient $patient
    )
    {
        $patient->update(
            $request->validated()
        );

        return new PatientResource(
            $patient
        );
    }

    // حذف مريض
    public function destroy(Patient $patient)
    {
        $patient->delete();

        return response()->json([
            'message' => 'Patient deleted successfully'
        ]);
    }
}