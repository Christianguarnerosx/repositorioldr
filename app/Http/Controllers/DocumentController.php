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
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $documents = Document::with(['folder', 'user', 'versions' => function ($query) {
            $query->latest();
        }])->paginate(9);

        $documents->setCollection(
            $documents->getCollection()->transform(function ($document) {
                $latestVersion = $document->versions->first();
                return [
                    'id' => $document->id,
                    'name' => $document->name,
                    'parent_folder_name' => $document->folder?->name ?? 'Ninguno',
                    'user_name' => $document->user?->name ?? 'N/A',
                    // Use latest version info if available, otherwise placeholders
                    'file_name' => $latestVersion?->file_name ?? '',
                    'size' => $latestVersion?->size ?? 0,
                    'mime_type' => $latestVersion?->mime_type ?? '',
                    'version_count' => $document->versions->count(),
                    'created_at' => $document->created_at,
                    'updated_at' => $document->updated_at,
                ];
            })
        );

        return Inertia::render('Documents/Index', ['documents' => $documents]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
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
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:100',
                'folder_id' => 'required|exists:folders,id',
                'file' => 'required|file|max:10240', // 10MB max
            ]);

            // Create the Document Concept
            $document = Document::create([
                'name' => $validated['name'],
                'folder_id' => $validated['folder_id'],
                'user_id' => auth()->id(),
            ]);

            // Handle File Upload for the first version
            if ($request->hasFile('file')) {
                $file = $request->file('file');
                $path = $file->store('documents'); // Storage path: storage/app/documents. Returns "documents/filename.ext"

                // Create the first Document Version
                $document->versions()->create([
                    'file_name' => basename($path), // Store only the filename
                    'uploaded_by' => auth()->id(),
                    'notes' => 'Initial version',
                    'mime_type' => $file->getClientMimeType(),
                    'size' => $file->getSize(),
                ]);
            }

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
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:100',
                'folder_id' => 'required|exists:folders,id',
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
        try {
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
