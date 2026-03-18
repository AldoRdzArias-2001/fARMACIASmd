<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BranchProductStock;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StockMovementController extends Controller
{
    public function index(Request $request)
    {
        $branchId = $request->query('branch_id');
        $productId = $request->query('product_id');

        $movements = StockMovement::with(['branch', 'product', 'user'])
            ->when($branchId, fn($q) => $q->where('branch_id', $branchId))
            ->when($productId, fn($q) => $q->where('product_id', $productId))
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Listado de movimientos',
            'data' => $movements,
            'errors' => null,
            'timestamp' => now()->toISOString(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'branch_id' => ['required', 'exists:branches,id'],
            'product_id' => ['required', 'exists:products,id'],
            'type' => ['required', 'in:entry,exit,adjustment'],
            'quantity' => ['required', 'integer', 'min:1'],
            'notes' => ['nullable', 'string'],
        ]);

        return DB::transaction(function () use ($data, $request) {
            $stock = BranchProductStock::firstOrCreate(
                [
                    'branch_id' => $data['branch_id'],
                    'product_id' => $data['product_id'],
                ],
                [
                    'stock' => 0,
                ]
            );

            if ($data['type'] === 'entry') {
                $stock->stock += $data['quantity'];
            } elseif ($data['type'] === 'exit') {
                if ($stock->stock < $data['quantity']) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Stock insuficiente para realizar la salida',
                        'data' => null,
                        'errors' => ['stock' => ['No se permite stock negativo']],
                        'timestamp' => now()->toISOString(),
                    ], 422);
                }

                $stock->stock -= $data['quantity'];
            } elseif ($data['type'] === 'adjustment') {
                $stock->stock = $data['quantity'];
            }

            $stock->save();

            $movement = StockMovement::create([
                'branch_id' => $data['branch_id'],
                'product_id' => $data['product_id'],
                'type' => $data['type'],
                'quantity' => $data['quantity'],
                'notes' => $data['notes'] ?? null,
                'user_id' => $request->user()?->id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Movimiento registrado correctamente',
                'data' => [
                    'movement' => $movement->load(['branch', 'product', 'user']),
                    'current_stock' => $stock->stock,
                ],
                'errors' => null,
                'timestamp' => now()->toISOString(),
            ], 201);
        });
    }
}