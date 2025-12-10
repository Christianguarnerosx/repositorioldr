<?php

namespace App\Http\Controllers;

use App\Models\Folder;
use App\Models\Area;
use App\Models\Company;
use App\Models\Department;
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
        $folders = Folder::with(['area', 'parentFolder'])->paginate(9);

        $folders->setCollection(
            $folders->getCollection()->transform(function ($folder) {
                return [
                    'id' => $folder->id,
                    'name' => $folder->name,
                    'area_name' => $folder->area?->name ?? 'N/A',
                    'parent_folder_name' => $folder->parentFolder?->name ?? 'Ninguno',
                ];
            })
        );

        return Inertia::render('Folders/Index', ['folders' => $folders]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // devolver una vista de creación
        $companies = Company::select('id', 'name')->get();
        $departments = Department::select('id', 'name', 'company_id')->get();
        $areas = Area::select('id', 'name', 'department_id')->get();
        $folders = Folder::select('id', 'name', 'parent_folder_id', 'area_id')->get(); // Opcional: para seleccionar carpeta padre

        return Inertia::render('Folders/Create', [
            'companies' => $companies,
            'departments' => $departments,
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
        $folders = Folder::select('id', 'name', 'parent_folder_id', 'area_id')->get();

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
                'area_id' => 'nullable|exists:areas,id',
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
            // Verificar si la carpeta tiene documentos o subcarpetas
            $documentsCount = $folder->documents()->count();
            $subFoldersCount = $folder->childFolders()->count();
            
            if ($documentsCount > 0 || $subFoldersCount > 0) {
                $message = "Cannot delete this folder. It contains {$documentsCount} document(s) and {$subFoldersCount} subfolder(s). Please delete or move the contents first.";
                return redirect()
                    ->back()
                    ->with('error', $message);
            }
            
            // Si está vacía, eliminar
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
