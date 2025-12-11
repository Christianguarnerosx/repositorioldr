<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Audit extends Model
{
    use HasFactory;

    protected $fillable = ['audit_type_id', 'title', 'description'];

    public function auditType()
    {
        return $this->belongsTo(AuditType::class);
    }
}
