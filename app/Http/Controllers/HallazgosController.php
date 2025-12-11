<?php

namespace App\Http\Controllers;

use App\Models\AuditFinding;
use App\Models\AuditDocumentReview;
use App\Models\FindingType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HallazgosController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $hallazgos = AuditFinding::with([
            'auditDocumentReview.audit',
            'auditDocumentReview.documentVersion.document',
            'findingType',
            'creator'
        ])->paginate(9);

        // Transform the collection to flatten relationships
        $hallazgos->getCollection()->transform(function ($hallazgo) {
            return [
                'id' => $hallazgo->id,
                'title' => $hallazgo->title,
                'description' => $hallazgo->description,
                'severity' => $hallazgo->severity,
                'status' => $hallazgo->status,
                'due_date' => $hallazgo->due_date,
                'finding_type_name' => $hallazgo->findingType?->name ?? 'N/A',
                'audit_title' => $hallazgo->auditDocumentReview?->audit?->title ?? 'N/A',
                'document_name' => $hallazgo->auditDocumentReview?->documentVersion?->document?->name ?? 'N/A',
                'created_by_name' => $hallazgo->creator?->name ?? 'N/A',
                'created_at' => $hallazgo->created_at,
            ];
        });

        return Inertia::render('Hallazgos/Index', ['hallazgos' => $hallazgos]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $auditDocumentReviews = AuditDocumentReview::with([
            'audit',
            'documentVersion.document'
        ])->get()->map(function ($review) {
            return [
                'id' => $review->id,
                'label' => $review->audit->title . ' - ' . $review->documentVersion->document->name,
            ];
        });

        $findingTypes = FindingType::all();

        return Inertia::render('Hallazgos/Create', [
            'auditDocumentReviews' => $auditDocumentReviews,
            'findingTypes' => $findingTypes,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'audit_document_review_id' => 'required|exists:audit_document_reviews,id',
            'finding_type_id' => 'required|exists:finding_types,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'severity' => 'required|in:minor,major,critical',
            'action_required' => 'nullable|string',
            'status' => 'required|in:pending,resolved,not_applicable',
            'due_date' => 'nullable|date',
        ]);

        $validated['created_by'] = auth()->id();

        AuditFinding::create($validated);

        return redirect()
            ->route('hallazgos.index')
            ->with('success', 'Hallazgo creado exitosamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(AuditFinding $hallazgo)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AuditFinding $hallazgo)
    {
        $hallazgo->load([
            'auditDocumentReview.audit',
            'auditDocumentReview.documentVersion.document',
            'findingType',
            'creator'
        ]);

        $auditDocumentReviews = AuditDocumentReview::with([
            'audit',
            'documentVersion.document'
        ])->get()->map(function ($review) {
            return [
                'id' => $review->id,
                'label' => $review->audit->title . ' - ' . $review->documentVersion->document->name,
            ];
        });

        $findingTypes = FindingType::all();

        return Inertia::render('Hallazgos/Edit', [
            'hallazgo' => $hallazgo,
            'auditDocumentReviews' => $auditDocumentReviews,
            'findingTypes' => $findingTypes,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, AuditFinding $hallazgo)
    {
        $validated = $request->validate([
            'audit_document_review_id' => 'required|exists:audit_document_reviews,id',
            'finding_type_id' => 'required|exists:finding_types,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'severity' => 'required|in:minor,major,critical',
            'action_required' => 'nullable|string',
            'status' => 'required|in:pending,resolved,not_applicable',
            'due_date' => 'nullable|date',
        ]);

        // Set corrected_at timestamp if status changed to resolved
        if ($validated['status'] === 'resolved' && $hallazgo->status !== 'resolved') {
            $validated['corrected_at'] = now();
        }

        $hallazgo->update($validated);

        return redirect()
            ->route('hallazgos.index')
            ->with('success', 'Hallazgo actualizado exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AuditFinding $hallazgo)
    {
        $hallazgo->delete();

        return redirect()
            ->route('hallazgos.index')
            ->with('info', 'Hallazgo eliminado exitosamente.');
    }
}
