import AppLayout from '@/layouts/app-layout';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import { PageProps, type BreadcrumbItem, Company } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useState } from 'react';


const breadcrumbs: BreadcrumbItem[] = [{ title: 'Empresas', href: '/companies' }];

export default function Index() {
    const { companies } = usePage<PageProps>().props;

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [recordIdToDelete, setRecordIdToDelete] = useState<number | null>(null);

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
                        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <AlertDialogTrigger asChild>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => setRecordIdToDelete(company.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Are you absolutely sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the company
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => {
                                            if (recordIdToDelete) {
                                                router.delete(route('companies.destroy', recordIdToDelete));
                                                setIsDialogOpen(false);
                                            }
                                        }}
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
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
