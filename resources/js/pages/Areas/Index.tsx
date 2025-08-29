import AppLayout from '@/layouts/app-layout';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import { Area, pageProps, type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Areas', href: '/areas' }];

const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this area?')) {
        router.delete(route("areas.destroy", id));

    }
}

const handlePageChange = (url : string | null) => {
    if (url) {
        router.get(url);
    }
}

const columns: ColumnDef<Area>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
    },
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'department_name',
        header: 'Department Name',
    },
    {
        id: 'actions',
        header: 'Acciones',
        cell: ({ row }) => {
            const area = row.original;
            return (
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(area.id)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            )
        }
    }
];

export default function Index() {
    const { areas } = usePage<pageProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Areas" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1>areas</h1>
                <DataTable 
                columns={columns} 
                data={areas.data} 
                pagination={{
                    from: areas.from,
                    to: areas.to,
                    total: areas.total,
                    links: areas.links,
                    onPageChange: handlePageChange
                }}
                />
            </div>
        </AppLayout>
    );
}
