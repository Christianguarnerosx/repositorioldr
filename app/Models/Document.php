<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'file_path',
        'folder_id',
        'area_id',
        'size',
        'mime_type',
        'user_id',
    ];

    public function folder()
    {
        return $this->belongsTo(Folder::class);
    }

    public function area()
    {
        return $this->belongsTo(Area::class);
    }
    

    public function uploadedBy()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
