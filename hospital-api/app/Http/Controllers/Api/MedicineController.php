<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Medicine;
use App\Http\Requests\StoreMedicineRequest;
use App\Http\Requests\UpdateMedicineRequest;
use App\Http\Resources\MedicineResource;

class MedicineController extends Controller
{
    public function index()
    {
        return MedicineResource::collection(
            Medicine::all()
        );
    }

   public function store(StoreMedicineRequest $request)
{
    $medicine = new Medicine();

    $medicine->name = $request->name;
    $medicine->company = $request->company;
    $medicine->price = $request->price;
    $medicine->quantity = $request->quantity;

    $medicine->save();

    return new MedicineResource($medicine);
}

    public function show(Medicine $medicine)
    {
        return new MedicineResource(
            $medicine
        );
    }

    public function update(
        UpdateMedicineRequest $request,
        Medicine $medicine
    )
    {
        $medicine->update(
            $request->validated()
        );

        return new MedicineResource(
            $medicine
        );
    }

    public function destroy(
        Medicine $medicine
    )
    {
        $medicine->delete();

        return response()->json([
            'message' => 'Medicine deleted successfully'
        ]);
    }
}