<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDepartmentRequest;
use App\Http\Requests\UpdateDepartmentRequest;
use App\Http\Resources\DepartmentResource;
use App\Models\Department;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
{
    return DepartmentResource::collection(
        Department::all()
    );
}

    public function store(
    StoreDepartmentRequest $request
)
{
    $department = Department::create(
        $request->validated()
    );

    return new DepartmentResource(
        $department
    );
}

    public function show(
    Department $department
)
{
    return new DepartmentResource(
        $department
    );
}

    public function update(
    Request $request,
    Department $department
)
{
    $department->update(
        $request->all()
    );

    return new DepartmentResource(
        $department
    );
}

   public function destroy(
    Department $department
)
{
    $department->delete();

    return response()->json([
        'message' => 'Department deleted successfully'
    ]);
}
}
