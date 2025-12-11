<?php

namespace App\Http\Controllers;

use App\Models\Audit;
use App\Models\AuditType;
use App\Models\Document;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuditController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $audits = Audit::with('auditType')->paginate(9);
        
        // Transform the collection to include audit_type_name flattened if needed, 
        // though accessing .audit_type.name in frontend is also fine.
        // Let's pass it as is, or transform if we follow Department pattern strictly.
        // Department pattern:
        $audits->getCollection()->transform(function ($audit) {
            return [
                'id' => $audit->id,
                'title' => $audit->title,
                'description' => $audit->description,
                'audit_type_name' => $audit->auditType?->name ?? 'N/A',
                'created_at' => $audit->created_at,
            ];
        });

        return Inertia::render('Audits/Index', ['audits' => $audits]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $auditTypes = AuditType::where('status', true)->get();
        return Inertia::render('Audits/Create', ['auditTypes' => $auditTypes]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:100',
            'description' => 'nullable|string',
            'audit_type_id' => 'required|exists:audit_types,id',
        ]);

        Audit::create($validated);

        return redirect()
            ->route('audits.index')
            ->with('success', 'Audit created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Audit $audit)
    {
        $audit->load(['auditType', 'documentReviews.documentVersion.document', 'documentReviews.auditor']);
        
        $documents = Document::with('versions:id,document_id,created_at')->select('id', 'name')->get();
        $users = User::select('id', 'name')->get();

        return Inertia::render('Audits/Show', [
            'audit' => $audit,
            'assignedDocuments' => $audit->documentReviews,
            'documents' => $documents,
            'users' => $users,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Audit $audit)
    {
        $auditTypes = AuditType::where('status', true)->get();
        return Inertia::render('Audits/Edit', ['audit' => $audit, 'auditTypes' => $auditTypes]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Audit $audit)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:100',
            'description' => 'nullable|string',
            'audit_type_id' => 'required|exists:audit_types,id',
        ]);

        $audit->update($validated);

        return redirect()
            ->route('audits.index')
            ->with('success', 'Audit updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Audit $audit)
    {
        $audit->delete();

        return redirect()
            ->route('audits.index')
            ->with('success', 'Audit deleted successfully.');
    }
}
