<?php

namespace App\Http\Controllers;

use App\Models\Folder;
use App\Models\Area;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FolderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // devolver una vista de edición
        $folders = Folder::with('area')->paginate(9);
        return Inertia::render('Folders/Index', ['folders' => $folders]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // devolver una vista de creación
        $areas = Area::select('id', 'name')->get();
        $folders = Folder::select('id', 'name')->get(); // Opcional: para seleccionar carpeta padre

        return Inertia::render('Folders/Create', [
            'areas' => $areas,
            'folders' => $folders,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // guardar el registro carpeta
        try {
            //Reglas de validacion
            $validated = $request->validate([
                'name' => 'required|string|max:100',
                'area_id' => 'nullable|exists:areas,id',
                'parent_folder_id' => 'nullable|exists:folders,id',
            ]);
            //Usamios el modelo con Eloquent para crear el registro
            Folder::create($validated);
            return redirect()
                ->route('folders.index')
                ->with('success', 'Folder created successfully.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', 'Failed to create folder: ' . $e->getMessage());
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
    public function edit(Folder $folder)
    {
        // devolver una vista de edición
        $areas = Area::select('id', 'name')->get();
        $folders = Folder::select('id', 'name')->get();

        return Inertia::render('Folders/Edit', [
            'folder' => $folder->load(['area', 'parentFolder']),
            'areas' => $areas,
            'folders' => $folders,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Folder $folder)
    {
        // Actualizar los datos
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:100',
                'area_id' => 'required|exists:areas,id',
                'parent_folder_id' => 'nullable|exists:folders,id',
            ]);

            $folder->update($validated);
            return redirect()
                ->route('folders.index')
                ->with('success', 'Folder updated successfully.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', 'Failed to update folder: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Folder $folder)
    {
        // Eliminar el registro
        try {
            if (!$request->has('confirm') || ($folder->documents()->count() > 0 || $folder->childFolders()->count() > 0)) {
                $message = "This folder has {$folder->documents()->count()} documents and {$folder->childFolders()->count()} subfolders. They will also be deleted.";
                return back()->with('warning', $message);
            }
            $folder->delete();
            return redirect()
                ->route('folders.index')
                ->with('success', 'Folder deleted successfully.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', 'Failed to delete folder: ' . $e->getMessage());
        }
    }
}
