import AppLayout from '@/layouts/app-layout';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import { pageProps, type BreadcrumbItem, Area } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Areas', href: '/areas' }];

export default function Index() {
    const { areas } = usePage<pageProps>().props;

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this area?')) {
            router.delete(route("areas.destroy", id));
        }
    }

    const handlePageChange = (url: string | null) => {
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
                        <Trash2 className="h-4 w-4 text-white" />
                    </Button>
                )
            }
        }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Areas" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className='flex items-center justify-between'>
                    <h1 className="text-2xl font-bold">areas</h1>
                    <Link href={route('areas.create')}>
                        <Button
                            variant="default"
                            size="sm"
                            className="rounded-md"
                        >
                            <Plus className="h-4 w-4" /> Add Area
                        </Button>
                    </Link>
                </div>
                <DataTable
                    columns={columns}
                    data={areas.data}
                    pagination={
                        {
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
