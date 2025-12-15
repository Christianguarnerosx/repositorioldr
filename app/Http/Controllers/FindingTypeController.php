<?php

namespace App\Http\Controllers;

use App\Models\FindingType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FindingTypeController extends Controller
{
    /**
     * Display a listing of finding types.
     */
    public function index()
    {
        $findingTypes = FindingType::query()
            ->select('id', 'name', 'description', 'created_at', 'updated_at')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('FindingTypes/Index', [
            'findingTypes' => $findingTypes,
        ]);
    }

    /**
     * Show the form for creating a new finding type.
     */
    public function create()
    {
        return Inertia::render('FindingTypes/Create');
    }

    /**
     * Store a newly created finding type in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        FindingType::create($validated);

        return redirect()->route('finding-types.index')
            ->with('success', 'Tipo de hallazgo creado exitosamente.');
    }

    /**
     * Show the form for editing the specified finding type.
     */
    public function edit(FindingType $findingType)
    {
        return Inertia::render('FindingTypes/Edit', [
            'findingType' => $findingType,
        ]);
    }

    /**
     * Update the specified finding type in storage.
     */
    public function update(Request $request, FindingType $findingType)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $findingType->update($validated);

        return redirect()->route('finding-types.index')
            ->with('success', 'Tipo de hallazgo actualizado exitosamente.');
    }

    /**
     * Remove the specified finding type from storage.
     */
    public function destroy(FindingType $findingType)
    {
        $findingType->delete();

        return redirect()->route('finding-types.index')
            ->with('success', 'Tipo de hallazgo eliminado exitosamente.');
    }
}
