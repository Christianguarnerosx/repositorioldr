<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuditDocumentReview extends Model
{
    use HasFactory;

    protected $fillable = [
        'audit_id',
        'document_version_id',
        'user_id',
        'status',
    ];

    public function audit()
    {
        return $this->belongsTo(Audit::class);
    }

    public function documentVersion()
    {
        return $this->belongsTo(DocumentVersion::class);
    }

    public function auditor()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function auditFindings()
    {
        return $this->hasMany(AuditFinding::class);
    }
}
