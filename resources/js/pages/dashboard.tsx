import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Folder } from 'lucide-react';
import { FileManagerItem } from '@/components/file-manager-item';
import { FloatingSearch } from '@/components/floating-search';

interface Item {
    id: number;
    name: string;
    type: 'folder' | 'document';
    updated_at: string;
    file_size?: string;
    extension?: string;
}

interface DashboardProps {
    items: Item[];
    currentFolder: {
        id: number;
        name: string;
    } | null;
    breadcrumbsProps: BreadcrumbItem[];
}

export default function Dashboard({ items, currentFolder, breadcrumbsProps }: DashboardProps) {
    const handleAction = (action: string, id: number) => {
        console.log(`Action: ${action}, ID: ${id}`);
        // Here you would implement the real logic for favorite, delete, etc.
    };

    return (
        <AppLayout breadcrumbs={breadcrumbsProps}>
            <Head title="Inicio" />

            <FloatingSearch />

            <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
                        {currentFolder ? currentFolder.name : 'Inicio'}
                    </h1>
                </div>

                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-20 text-center">
                        <div className="p-4 rounded-full bg-muted mb-4">
                            <Folder className="size-12 text-muted-foreground/30" />
                        </div>
                        <h3 className="text-lg font-medium text-foreground">Esta carpeta está vacía</h3>
                        <p className="text-sm text-muted-foreground max-w-xs mt-1">Sube documentos o crea carpetas para empezar a organizar tus archivos.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {items.map((item) => (
                            <FileManagerItem
                                key={`${item.type}-${item.id}`}
                                {...item}
                                onAction={handleAction}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
