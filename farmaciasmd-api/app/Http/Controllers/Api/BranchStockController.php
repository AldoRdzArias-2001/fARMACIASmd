<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BranchProductStock;
use Illuminate\Http\Request;

class BranchStockController extends Controller
{
    public function index(Request $request)
    {
        $branchId = $request->query('branch_id');

        $stocks = BranchProductStock::with(['branch', 'product'])
            ->when($branchId, fn($q) => $q->where('branch_id', $branchId))
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Listado de existencias por sucursal',
            'data' => $stocks,
            'errors' => null,
            'timestamp' => now()->toISOString(),
        ]);
    }
}