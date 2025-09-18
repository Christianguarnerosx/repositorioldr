<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Folder extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'parent_folder_id',
        'area_id'
    ];

    public function parentFolder()
    {
        return $this->belongsTo(Folder::class, 'parent_folder_id');
    }

    public function childFolders()
    {
        return $this->hasMany(Folder::class, 'parent_folder_id');
    }

    public function documents()
    {
        return $this->hasMany(Document::class);
    }

    public function area()
    {
        return $this->belongsTo(Area::class);
    }
}
