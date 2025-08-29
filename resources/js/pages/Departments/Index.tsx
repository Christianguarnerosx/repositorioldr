import AppLayout from '@/layouts/app-layout';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import { pageProps, type BreadcrumbItem, Department } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Departments', href: '/departments' }];

const handlePageChange = (url: string | null) => {
    if (url) {
        router.get(url);
    }
}

const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this department?')) {
        router.delete(route('companies.destroy', id));
    }
}

const columns: ColumnDef<Department>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
    },
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'company_name',
        header: 'Company Name',
    },
    {
        id: 'actions',
        header: 'Acciones',
        cell: ({ row }) => {
            const department = row.original;
            return (
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(department.id)}
                >
                    <Trash2 className="h-4 w-4 text-white" />
                </Button>
            )
        }
    }
];


export default function Index() {
    const { departments } = usePage<pageProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Departments" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1>departments</h1>
                <DataTable
                    columns={columns}
                    data={departments.data}
                    pagination={
                        {
                            from: departments.from,
                            to: departments.to,
                            total: departments.total,
                            links: departments.links,
                            onPageChange: handlePageChange
                        }
                    }
                />
            </div>
        </AppLayout>
    );
}
