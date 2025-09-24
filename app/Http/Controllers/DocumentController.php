<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Folder;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DocumentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // vista de edición
        $documents = Document::with('folder', 'area', 'user')->paginate(9);
        return Inertia::render('Documents/Index', ['documents' => $documents]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //vista de edición
        $folders = Folder::all();
        return Inertia::render('Documents/Create', [
            'folders' => $folders,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Crear un nuevo registro
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:100',
                'folder_id' => 'required|exists:folders,id',
                'file_path' => 'required|string|max:255',
            ]);

            Document::create($validated);
            return redirect()
                ->route('documents.index')
                ->with('success', 'Document created successfully.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', 'Failed to create document: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show()
    {
        // 
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Document $document)
    {
        // vista de edición
        $folders = Folder::all();
        return Inertia::render('Documents/Edit', [
            'document' => $document,
            'folders' => $folders,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Document $document)
    {
        // Actualizar un registro existente
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:100',
                'folder_id' => 'required|exists:folders,id',
                'file_path' => 'required|string|max:255',
            ]);

            $document->update($validated);
            return redirect()
                ->route('documents.index')
                ->with('success', 'Document updated successfully.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', 'Failed to update document: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Document $document)
    {
        // Eliminar un registro
        try {
            if (!$request->has('confirm')) {
                return back()->with('warning', "This document will be deleted. Confirm to delete.");
            }
            $document->delete();
            return redirect()
                ->route('documents.index')
                ->with('success', 'Document deleted successfully.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', 'Failed to delete document: ' . $e->getMessage());
        }
    }
}
