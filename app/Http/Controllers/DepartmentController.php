<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Company;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DepartmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $departments = Department::with('company')->paginate(9);

        //mapeamos cada departamento para obtener el nombre de la compañia
        $departments->getCollection()->transform(function ($department) {
            return [
                'id' => $department->id,
                'name' => $department->name,
                'company_name' => $department->company?->name ?? 'N/A',
            ];
        });

        return Inertia::render('Departments/Index', ['departments' => $departments]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // devolver una vista de creación
        $companies = Company::all();
        return Inertia::render('Departments/Create', ['companies' => $companies]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Guardar los datos
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:100',
                'company_id' => 'required|exists:companies,id',
            ]);
            Department::create($validated);
            return redirect()
                ->route('departments.index')
                ->with('success', 'Department created successfully.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', 'Failed to create department. ' . $e->getMessage());
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
    public function edit(Request $request, Department $department)
    {
        // devolver una vista de edición
        // devolver una vista de edición
        $companies = Company::all();
        return Inertia::render('Departments/Edit', ['department' => $department, 'companies' => $companies]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Department $department)
    {
        // Actualizar los datos
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:100',
                'company_id' => 'required|exists:companies,id',
            ]);
            $department->update($validated);
            return redirect()
                ->route('departments.index')
                ->with('success', 'Department updated successfully.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', 'Failed to update department. ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Department $department)
    {
        // Eliminar el registro
        try {
            if (!$request->has('confirm') || $department->areas()->count() > 0) {
                return back()->with('warning', "This department has {$department->areas()->count()} areas. Confirm to delete.");
            }
            $department->delete();
            return redirect()
                ->route('departments.index')
                ->with('success', 'Department deleted successfully.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', 'Failed to delete department. ' . $e->getMessage());
        }
    }
}
