<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Company;
use App\Models\Department;
use App\Models\Area;
use App\Models\Folder;
use App\Models\Document;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Crear 10 usuarios
        $users = User::factory(10)->create();

        // Crear 3 empresas con departamentos y áreas
        Company::factory(3)
            ->has(
                Department::factory(2)
                    ->has(
                        Area::factory(2)
                    )
            )
            ->create()
            ->each(function ($company) use ($users) {
                // Para cada empresa, crear carpetas y documentos
                $company->departments->each(function ($department) use ($users) {
                    $department->areas->each(function ($area) use ($users) {
                        // Crear carpeta padre para el área
                        $parentFolder = Folder::factory()->create([
                            'area_id' => $area->id,
                            'parent_folder_id' => null,
                            'name' => 'Root folder for ' . $area->name,
                        ]);

                        // Crear carpeta hija dentro del padre
                        $childFolder = Folder::factory()->create([
                            'area_id' => $area->id,
                            'parent_folder_id' => $parentFolder->id,
                            'name' => 'Child folder of ' . $parentFolder->name,
                        ]);

                        // Crear documentos en carpeta hija
                        Document::factory(3)->create([
                            'folder_id' => $childFolder->id,
                            'user_id' => $users->random()->id,
                        ]);
                    });
                });
            });

        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
    }
}
