<?php

namespace Database\Seeders;

use App\Models\FindingType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FindingTypeSeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        $findingTypes = [
            [
                'name' => 'No Conformidad',
                'description' => 'Incumplimiento de un requisito especificado',
            ],
            [
                'name' => 'Acción Correctiva',
                'description' => 'Acción tomada para eliminar la causa de una no conformidad detectada',
            ],
            [
                'name' => 'Observación',
                'description' => 'Hallazgo que no constituye una no conformidad pero requiere atención',
            ],
            [
                'name' => 'Mejora',
                'description' => 'Oportunidad de mejora identificada durante la auditoría',
            ],
        ];

        foreach ($findingTypes as $type) {
            FindingType::create($type);
        }
    }
}
