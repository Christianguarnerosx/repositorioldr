<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\Department;

class Area extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'department_id'];
    
    // Agregar company_id como atributo calculado
    protected $appends = ['company_id'];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }
    
    public function folders()
    {
        return $this->hasMany(Folder::class);
    }
    
    // Accessor para obtener company_id a través del departamento
    public function getCompanyIdAttribute()
    {
        return $this->department?->company_id;
    }
}
