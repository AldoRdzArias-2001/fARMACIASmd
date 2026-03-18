<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class BranchController extends Controller
{
    public function index()
    {
        $branches = Branch::orderBy('id', 'desc')->get();

        return response()->json([
            'success' => true,
            'message' => 'Listado de sucursales',
            'data' => $branches,
            'errors' => null,
            'timestamp' => now()->toISOString(),
        ]);
    }

    public function show(Branch $branch)
    {
        return response()->json([
            'success' => true,
            'message' => 'Detalle de sucursal',
            'data' => $branch,
            'errors' => null,
            'timestamp' => now()->toISOString(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:50', 'unique:branches,code'],
            'address' => ['nullable', 'string', 'max:255'],
            'active' => ['required', 'boolean'],
        ]);

        $branch = Branch::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Sucursal creada',
            'data' => $branch,
            'errors' => null,
            'timestamp' => now()->toISOString(),
        ], 201);
    }

    public function update(Request $request, Branch $branch)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:50', Rule::unique('branches', 'code')->ignore($branch->id)],
            'address' => ['nullable', 'string', 'max:255'],
            'active' => ['required', 'boolean'],
        ]);

        $branch->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Sucursal actualizada',
            'data' => $branch->fresh(),
            'errors' => null,
            'timestamp' => now()->toISOString(),
        ]);
    }

    public function destroy(Branch $branch)
    {
        $branch->delete();

        return response()->json([
            'success' => true,
            'message' => 'Sucursal eliminada',
            'data' => null,
            'errors' => null,
            'timestamp' => now()->toISOString(),
        ]);
    }
}