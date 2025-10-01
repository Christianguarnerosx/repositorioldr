import AppLayout from '@/layouts/app-layout';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import { pageProps, type BreadcrumbItem, Company } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Pencil, Plus, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Empresas', href: '/companies' }];

export default function Index() {
    const { companies } = usePage<pageProps>().props;

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this company?')) {
            router.delete(route('companies.destroy', id));
        }
    }

    const handlePageChange = (url: string | null) => {
        if (url) {
            router.get(url);
        }
    }

    const columns: ColumnDef<Company>[] = [
        {
            accessorKey: 'id',
            header: 'ID Empresa',
        },
        {
            accessorKey: 'name',
            header: 'Empresa',
        },
        {
            id: 'actions',
            header: 'Acciones',
            cell: ({ row }) => {
                const company = row.original;
                return (
                    <div className="flex gap-2">
                        <Link href={route('companies.edit', company.id)}>
                            <Button size="sm" variant="default">
                                <Pencil className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(company.id)}
                        >
                            <Trash2 className="h-4 w-4 text-white" />
                        </Button>
                    </div>
                )
            },
        }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Empresas" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className='flex items-center justify-between'>
                    <h1 className='text-1xl'>Empresas</h1>
                    <Link href={route('companies.create')}>
                        <Button
                            variant="default"
                            size="sm"
                            className="rounded-md"
                        >
                            <Plus className="h-4 w-4" /> Add Company
                        </Button>
                    </Link>
                </div>
                <DataTable
                    columns={columns}
                    data={companies.data}
                    pagination={{
                        from: companies.from,
                        to: companies.to,
                        total: companies.total,
                        links: companies.links,
                        onPageChange: handlePageChange,
                    }}
                />
            </div>
        </AppLayout>
    );
}
