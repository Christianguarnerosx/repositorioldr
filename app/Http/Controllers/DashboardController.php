<?php

namespace App\Http\Controllers;

use App\Models\Folder;
use App\Models\Document;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the dashboard home with folders and documents.
     */
    public function index(Request $request)
    {
        $folderId = $request->query('folder_id');

        // Fetch current folder context
        $currentFolder = null;
        if ($folderId) {
            $currentFolder = Folder::with('parentFolder')->findOrFail($folderId);
            
            $foldersQuery = Folder::inFolder($folderId);
            $documentsQuery = Document::inFolder($folderId);
        } else {
            $foldersQuery = Folder::root();
            $documentsQuery = Document::root();
        }

        // Get folders with basic mapping
        $folders = $foldersQuery->get()->map(fn ($folder) => [
            'id' => $folder->id,
            'name' => $folder->name,
            'type' => 'folder',
            'updated_at' => $folder->updated_at->diffForHumans(),
        ]);

        // Get documents with latest version info
        $documents = $documentsQuery->with(['versions' => fn ($q) => $q->latest()])
            ->get()
            ->map(function ($document) {
                $latestVersion = $document->versions->first();
                return [
                    'id' => $document->id,
                    'name' => $document->name,
                    'type' => 'document',
                    'updated_at' => $document->updated_at->diffForHumans(),
                    'file_size' => $latestVersion ? $this->formatBytes($latestVersion->size ?? 0) : '0 B',
                    'extension' => $latestVersion ? pathinfo($latestVersion->file_name, PATHINFO_EXTENSION) : 'pdf',
                ];
            });

        return Inertia::render('dashboard', [
            'items' => $folders->concat($documents),
            'currentFolder' => $currentFolder ? [
                'id' => $currentFolder->id,
                'name' => $currentFolder->name,
            ] : null,
            'breadcrumbsProps' => $this->getBreadcrumbs($currentFolder),
        ]);
    }

    /**
     * Generate breadcrumbs for the current folder structure.
     */
    private function getBreadcrumbs($folder)
    {
        $breadcrumbs = [];
        $temp = $folder;

        while ($temp) {
            array_unshift($breadcrumbs, [
                'title' => $temp->name,
                'href' => route('dashboard', ['folder_id' => $temp->id]),
            ]);
            $temp = $temp->parentFolder;
        }

        array_unshift($breadcrumbs, [
            'title' => 'Inicio',
            'href' => route('dashboard'),
        ]);

        return $breadcrumbs;
    }

    /**
     * Format bytes to readable size.
     */
    private function formatBytes($bytes, $precision = 1)
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= (1 << (10 * $pow));
        return round($bytes, $precision) . ' ' . $units[$pow];
    }
}
