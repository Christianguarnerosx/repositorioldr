<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FindingType extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description'];

    public function auditFindings()
    {
        return $this->hasMany(AuditFinding::class);
    }
}
