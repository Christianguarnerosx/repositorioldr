<?php

use App\Http\Controllers\CompanyController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\AreaController;
use App\Http\Controllers\FolderController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\AuditTypeController;
use App\Http\Controllers\AuditController;
use App\Http\Controllers\HallazgosController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('companies', CompanyController::class);
    Route::resource('departments', DepartmentController::class);
    Route::resource('areas', AreaController::class);
    Route::resource('folders', FolderController::class);
    Route::resource('documents', DocumentController::class);
    Route::resource('audit-types', AuditTypeController::class);
    Route::resource('audits', AuditController::class);
    Route::resource('hallazgos', HallazgosController::class);
    Route::resource('audit-document-reviews', \App\Http\Controllers\AuditDocumentReviewController::class)->only(['store', 'update', 'destroy']);


    // Document Versions
    Route::get('documents/{document}/versions', [App\Http\Controllers\DocumentVersionController::class, 'index'])->name('documents.versions.index');
    Route::post('documents/{document}/versions', [App\Http\Controllers\DocumentVersionController::class, 'store'])->name('documents.versions.store');
    Route::get('document-versions/{version}/download', [App\Http\Controllers\DocumentVersionController::class, 'download'])->name('document-versions.download');
    Route::put('document-versions/{version}', [App\Http\Controllers\DocumentVersionController::class, 'update'])->name('documents.versions.update');
    Route::delete('document-versions/{version}', [App\Http\Controllers\DocumentVersionController::class, 'destroy'])->name('documents.versions.destroy');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';