<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\DocumentVersion;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class DocumentVersionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Document $document)
    {
        // Load versions for the document
        $versions = $document->versions()->with('uploader')->latest()->get();

        return Inertia::render('Documents/Versions/Index', [
            'document' => $document,
            'versions' => $versions,
        ]);
    }

    /**
     * Store a newly created version in storage.
     */
    public function store(Request $request, Document $document)
    {
        try {
            $validated = $request->validate([
                'file_path' => 'required|file|max:10240', // 10MB
                'notes' => 'nullable|string|max:1000',
            ]);

            if ($request->hasFile('file_path')) {
                $file = $request->file('file_path');
                $path = $file->store('documents');

                $document->versions()->create([
                    'file_name' => basename($path),
                    'uploaded_by' => auth()->id(),
                    'notes' => $validated['notes'] ?? null,
                    'mime_type' => $file->getClientMimeType(),
                    'size' => $file->getSize(),
                ]);
            }

            return redirect()
                ->back()
                ->with('success', 'New version uploaded successfully.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', 'Failed to upload version: ' . $e->getMessage());
        }
    }

    /**
     * Update the specified version in storage.
     */
    public function update(Request $request, DocumentVersion $version)
    {
        try {
            $validated = $request->validate([
                'notes' => 'nullable|string|max:1000',
            ]);

            $version->update([
                'notes' => $validated['notes'],
            ]);

            return redirect()
                ->back()
                ->with('success', 'Version updated successfully.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', 'Failed to update version: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified version from storage.
     */
    public function destroy(DocumentVersion $version)
    {
        try {
            // Delete file from storage
            $path = 'documents/' . $version->file_name;
            if (Storage::exists($path)) {
                Storage::delete($path);
            }

            $version->delete();

            return redirect()
                ->back()
                ->with('success', 'Version deleted successfully.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', 'Failed to delete version: ' . $e->getMessage());
        }
    }

    /**
     * Download the specified version.
     */
    public function download(DocumentVersion $version)
    {
        $path = 'documents/' . $version->file_name;
        if (Storage::exists($path)) {
            return Storage::download($path, $version->document->name . '_' . $version->created_at->format('Ymd_His') . '.' . pathinfo($version->file_name, PATHINFO_EXTENSION));
        }
        return redirect()->back()->with('error', 'File not found. Path: ' . $path);
    }
}
