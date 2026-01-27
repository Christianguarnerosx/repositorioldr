<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'folder_id',
        'user_id',
    ];

    public function scopeRoot($query)
    {
        return $query->whereNull('folder_id');
    }

    public function scopeInFolder($query, $folderId)
    {
        return $query->where('folder_id', $folderId);
    }

    public function folder()
    {
        return $this->belongsTo(Folder::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function versions()
    {
        return $this->hasMany(DocumentVersion::class);
    }

    public function assignedUsers()
    {
        return $this->belongsToMany(User::class, 'document_user')
            ->withPivot('can_edit', 'assigned_by', 'notified_at')
            ->withTimestamps();
    }
}
