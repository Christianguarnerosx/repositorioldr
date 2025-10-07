import AppLayout from '@/layouts/app-layout';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import { PageProps, type BreadcrumbItem, Department } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Departments', href: '/departments' }];

export default function Index() {
    const { departments } = usePage<PageProps>().props;

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this department?')) {
            router.delete(route('departments.destroy', id));
        }
    }

    const handlePageChange = (url: string | null) => {
        if (url) {
            router.get(url);
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Departments" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className='flex items-center justify-between'>
                    <h1 className="text-1xl">Departamentos</h1>
                    <Link href={route('departments.create')}>
                        <Button
                            variant="default"
                            size="sm"
                            className="rounded-md"
                        >
                            <Plus className="h-4 w-4" /> Add Department
                        </Button>
                    </Link>
                </div>
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
                        }}
                />
            </div>
        </AppLayout>
    );
}
