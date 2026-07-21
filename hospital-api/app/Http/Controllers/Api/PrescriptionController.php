<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Prescription;
use App\Http\Requests\StorePrescriptionRequest;
use App\Http\Requests\UpdatePrescriptionRequest;
use App\Http\Resources\PrescriptionResource;

class PrescriptionController extends Controller
{

    /**
     * Display all prescriptions
     */
    public function index()
    {
        return Prescription::with([
            'doctor',
            'patient',
            'medicines'
        ])->get();
    }



    /**
     * Store new prescription
     */
    public function store(StorePrescriptionRequest $request)
    {

        $prescription = Prescription::create(

            $request->safe()->except('medicines')

        );


        foreach($request->medicines as $medicine)
        {

            $prescription->medicines()->attach(

                $medicine['id'],

                [
                    'quantity' => $medicine['quantity'],

                    'dosage' => $medicine['dosage']
                ]

            );

        }



        return new PrescriptionResource(

            $prescription->load([
                'doctor',
                'patient',
                'medicines'
            ])

        );

    }





    /**
     * Display single prescription
     */
    public function show(Prescription $prescription)
    {

        return new PrescriptionResource(

            $prescription->load([
                'doctor',
                'patient',
                'medicines'
            ])

        );

    }







    /**
     * Update prescription
     */
    public function update(
        UpdatePrescriptionRequest $request,
        Prescription $prescription
    )
    {

        $prescription->update(

            $request->validated()

        );



        return new PrescriptionResource(

            $prescription->load([
                'doctor',
                'patient',
                'medicines'
            ])

        );

    }







    /**
     * Delete prescription
     */
    public function destroy(Prescription $prescription)
    {

        $prescription->medicines()->detach();


        $prescription->delete();



        return response()->json([

            'message' => 'Prescription deleted successfully'

        ]);

    }


}