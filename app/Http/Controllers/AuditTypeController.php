<?php

namespace App\Http\Controllers;

use App\Models\AuditType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuditTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $auditTypes = AuditType::paginate(9);
        return Inertia::render('AuditTypes/Index', ['auditTypes' => $auditTypes]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('AuditTypes/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string',
            'status' => 'boolean',
        ]);

        AuditType::create($validated);

        return redirect()
            ->route('audit-types.index')
            ->with('success', 'Audit Type created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AuditType $auditType)
    {
        return Inertia::render('AuditTypes/Edit', ['auditType' => $auditType]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, AuditType $auditType)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string',
            'status' => 'boolean',
        ]);

        $auditType->update($validated);

        return redirect()
            ->route('audit-types.index')
            ->with('success', 'Audit Type updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AuditType $auditType)
    {
        $auditType->delete();

        return redirect()
            ->route('audit-types.index')
            ->with('success', 'Audit Type deleted successfully.');
    }
}
