<?php

namespace App\Http\Controllers;

use App\Models\Area;
use App\Models\Department;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AreaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $areas = Area::with('department')->paginate(10);

        //mapeamos cada departamento para obtener el nombre de la compañia
        $areas->getCollection()->transform(function ($area) {
            return [
                'id' => $area->id,
                'name' => $area->name,
                'department_name' => $area->department?->name ?? 'N/A',
            ];
        });

        return Inertia::render('Areas/Index', ['areas' => $areas]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // devolver una vista de edición
        $departments = Department::all();
        return Inertia::render('Areas/Create', ['departments' => $departments]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // devolver una vista de edición
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:100',
                'department_id' => 'required|exists:departments,id',
            ]);
            Area::create($validated);
            return redirect()
                ->route('areas.index')
                ->with('success', 'Area created successfully.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', 'Failed to create area. ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Area $area)
    {
        // devolver una vista de edición
        $departments = Department::all();
        return Inertia::render('Areas/Edit', [
            'area' => $area,
            'departments' => $departments
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Area $area)
    {
        // Actualizar los datos
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:100',
                'department_id' => 'required|exists:departments,id',
            ]);
            $area->update($validated);
            return redirect()
                ->route('areas.index')
                ->with('success', 'Area updated successfully.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', 'Failed to update area. ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Area $area)
    {
        // Eliminar el registro
        try {
            if (!$request->has('confirm') && $area->folders()->count() > 0) {
                return back()->with('warning', "This area has {$area->folders()->count()} folders. Confirm to delete.");
            }
            $area->delete();
            return redirect()
                ->route('areas.index')
                ->with('success', 'Area deleted successfully.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', 'Failed to delete area. ' . $e->getMessage());
        }
    }
}
