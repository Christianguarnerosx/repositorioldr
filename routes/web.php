<?php

use App\Http\Controllers\CompanyController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\AreaController;
use App\Http\Controllers\FolderController;
use App\Http\Controllers\DocumentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('Companies', CompanyController::class);
    Route::resource('Departments', DepartmentController::class);
    Route::resource('Areas', AreaController::class);
    Route::resource('Folders', FolderController::class);
    Route::resource('Documents', DocumentController::class);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
