<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\DoctorController;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\PrescriptionController;
use App\Http\Controllers\Api\MedicineController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::post(
    'register',
    [AuthController::class, 'register']
);

Route::post(
    'login',
    [AuthController::class, 'login']
);

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    Route::get(
        'profile',
        [AuthController::class, 'profile']
    );

    Route::post(
        'logout',
        [AuthController::class, 'logout']
    );

    Route::get(
        'dashboard',
        [DashboardController::class, 'index']
    );

    /*
    |--------------------------------------------------------------------------
    | Admin Only
    |--------------------------------------------------------------------------
    */

    Route::middleware('role:admin')->group(function () {

        Route::apiResource(
            'departments',
            DepartmentController::class
        );

        Route::apiResource(
            'doctors',
            DoctorController::class
        );

        Route::apiResource(
            'medicines',
            MedicineController::class
        );

    });

    /*
    |--------------------------------------------------------------------------
    | Admin + Receptionist
    |--------------------------------------------------------------------------
    */

    Route::middleware(
        'role:admin,receptionist'
    )->group(function () {

        Route::apiResource(
            'patients',
            PatientController::class
        );

        Route::apiResource(
            'appointments',
            AppointmentController::class
        );

    });

    /*
    |--------------------------------------------------------------------------
    | Admin + Doctor
    |--------------------------------------------------------------------------
    */

    Route::middleware(
        'role:admin,doctor'
    )->group(function () {

        Route::apiResource(
            'prescriptions',
            PrescriptionController::class
        );

    });

});

/*
|--------------------------------------------------------------------------
| Current Authenticated User
|--------------------------------------------------------------------------
*/

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
Route::get('/test-db', function () {
    try {
        $tables = \Illuminate\Support\Facades\DB::connection()->getDoctrineSchemaManager()->listTableNames();
        return response()->json(['status' => 'success', 'tables' => $tables]);
    } catch (\Exception $e) {
        return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
    }
});