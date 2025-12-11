<?php

namespace App\Http\Controllers;

use App\Models\AuditDocumentReview;
use Illuminate\Http\Request;
use Illuminate\Foundation\Validation\ValidatesRequests;

class AuditDocumentReviewController extends Controller
{
    use ValidatesRequests;

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'audit_id' => 'required|exists:audits,id',
            'document_version_id' => 'required|exists:document_versions,id',
            'user_id' => 'required|exists:users,id', // Auditor
        ]);

        // Check if already assigned
        $exists = AuditDocumentReview::where('audit_id', $validated['audit_id'])
            ->where('document_version_id', $validated['document_version_id'])
            ->exists();

        if ($exists) {
            return back()->withErrors(['message' => 'This document version is already assigned to this audit.']);
        }

        AuditDocumentReview::create([
            'audit_id' => $validated['audit_id'],
            'document_version_id' => $validated['document_version_id'],
            'user_id' => $validated['user_id'],
            'status' => 'pending',
        ]);

        return back()->with('success', 'Document assigned to audit successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, AuditDocumentReview $auditDocumentReview)
    {
        $validated = $request->validate([
            'user_id' => 'sometimes|exists:users,id',
            'status' => 'sometimes|string',
        ]);

        $auditDocumentReview->update($validated);

        return back()->with('success', 'Audit assignment updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AuditDocumentReview $auditDocumentReview)
    {
        $auditDocumentReview->delete();

        return back()->with('success', 'Document unassigned from audit.');
    }
}
