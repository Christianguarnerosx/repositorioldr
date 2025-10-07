import AppLayout from '@/layouts/app-layout';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import { PageProps, type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface Folder {
    id: number;
    name: string;
    area_name?: string;
    parent_folder_name?: string;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Folders', href: '/folders' }];

export default function Index() {
    const { folders } = usePage<PageProps>().props;

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this folder?')) {
            router.delete(route("folders.destroy", id));
        }
    }

    const handlePageChange = (url: string | null) => {
        if (url) {
            router.get(url);
        }
    }

    const columns: ColumnDef<Folder>[] = [
        {
            accessorKey: 'id',
            header: 'ID',
        },
        {
            accessorKey: 'name',
            header: 'Folder Name',
        },
        {
            accessorKey: 'area_name',
            header: 'Area',
        },
        {
            accessorKey: 'parent_folder_name',
            header: 'Parent Folder',
        },
        {
            id: 'actions',
            header: 'Acciones',
            cell: ({ row }) => {
                const folder = row.original;
                return (
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(folder.id)}
                    >
                        <Trash2 className="h-4 w-4 text-white" />
                    </Button>
                )
            }
        }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Folders" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className='flex items-center justify-between'>
                    <h1 className="text-2xl font-bold">Folders</h1>
                    <Link href={route('folders.create')}>
                        <Button
                            variant="default"
                            size="sm"
                            className="rounded-md"
                        >
                            <Plus className="h-4 w-4" /> Add Folder
                        </Button>
                    </Link>
                </div>
                <DataTable
                    columns={columns}
                    data={folders.data}
                    pagination={{
                        from: folders.from,
                        to: folders.to,
                        total: folders.total,
                        links: folders.links,
                        onPageChange: handlePageChange
                    }}
                />
            </div>
        </AppLayout>
    );
}
