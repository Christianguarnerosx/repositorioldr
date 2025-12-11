<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuditType extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'status'];

    public function audits()
    {
        return $this->hasMany(Audit::class);
    }
}
