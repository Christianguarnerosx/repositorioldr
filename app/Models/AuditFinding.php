<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuditFinding extends Model
{
    use HasFactory;

    protected $fillable = [
        'audit_document_review_id',
        'finding_type_id',
        'title',
        'description',
        'severity',
        'action_required',
        'status',
        'due_date',
        'corrected_at',
        'created_by',
    ];

    protected $casts = [
        'due_date' => 'date',
        'corrected_at' => 'datetime',
    ];

    public function auditDocumentReview()
    {
        return $this->belongsTo(AuditDocumentReview::class);
    }

    public function findingType()
    {
        return $this->belongsTo(FindingType::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
