<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDoctorRequest;
use App\Http\Requests\UpdateDoctorRequest;
use App\Http\Resources\DoctorResource;
use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DoctorController extends Controller
{
    public function index(Request $request)
    {
        $doctors = Doctor::with('department')
            ->when(
                $request->search,
                function ($query) use ($request) {
                    $query->where(
                        'name',
                        'like',
                        '%' . $request->search . '%'
                    );
                }
            )
            ->orderBy(
                $request->sort ?? 'id',
                $request->direction ?? 'asc'
            )
            ->get();

        return DoctorResource::collection($doctors);
    }

    public function store(StoreDoctorRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {

            $path = $request->file('image')
                ->store('doctors', 'public');

            $data['image'] = $path;
        }

        $doctor = Doctor::create($data);

        $doctor->load('department');

        return new DoctorResource($doctor);
    }

    public function show(Doctor $doctor)
    {
        return new DoctorResource(
            $doctor->load('department')
        );
    }

    public function update(
        UpdateDoctorRequest $request,
        Doctor $doctor
    ) {
        $data = $request->validated();

        if ($request->hasFile('image')) {

            if (
                $doctor->image &&
                Storage::disk('public')->exists($doctor->image)
            ) {
                Storage::disk('public')->delete($doctor->image);
            }

            $data['image'] = $request
                ->file('image')
                ->store('doctors', 'public');
        }

        $doctor->update($data);

        $doctor->load('department');

        return new DoctorResource($doctor);
    }

    public function destroy(Doctor $doctor)
    {
        if (
            $doctor->image &&
            Storage::disk('public')->exists($doctor->image)
        ) {
            Storage::disk('public')->delete($doctor->image);
        }

        $doctor->delete();

        return response()->json([
            'message' => 'Doctor deleted successfully'
        ]);
    }
}