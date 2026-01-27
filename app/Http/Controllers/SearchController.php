<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Folder;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function search(Request $request)
    {
        $query = $request->input('q');

        if (empty($query)) {
            return response()->json([
                'documents' => [],
                'folders' => [],
            ]);
        }

        $documents = Document::where('name', 'like', "%{$query}%")
            ->limit(10)
            ->get(['id', 'name', 'folder_id']);

        $folders = Folder::where('name', 'like', "%{$query}%")
            ->limit(10)
            ->get(['id', 'name']);

        return response()->json([
            'documents' => $documents,
            'folders' => $folders,
        ]);
    }
}
