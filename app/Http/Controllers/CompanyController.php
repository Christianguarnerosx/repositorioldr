<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CompanyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $companies = Company::paginate(9);
        return Inertia::render(
            'Companies/Index',
            [
                'companies' => $companies
            ]
        );
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Companies/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //Guardar los datos
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:100',
            ]);
            Company::create($validated);
            return redirect()
                ->route('companies.index')
                ->with('success', 'Company created successfully.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', 'Failed to create company.' . $e->getMessage());
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
    public function edit(Company $company)
    {
        //devolver una vista de edición
        return Inertia::render('Companies/Edit', [
            'company' => $company
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Company $company)
    {
        // Actualizar los datos
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:100',
            ]);
            $company->update($validated);
            return redirect()
                ->route('companies.index')
                ->with('success', 'Company updated successfully.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', 'Failed to update company.' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Company $company)
    {
        // Eliminar el registro
        try {
            // if (!$request->has('confirm') || $company->departments->count() > 0) {
            //     return back()->with('warning', "This company has {$company->departments->count()} departments. asociated with it. if you delete it, you will also delete all the departments associated with it.");
            // }
            $company->delete();
            return redirect()
                ->route('companies.index')
                ->with('success', 'Company deleted successfully.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', 'Failed to delete company.' . $e->getMessage());
        }
    }
}
