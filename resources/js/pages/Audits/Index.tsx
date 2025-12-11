import AppLayout from '@/layouts/app-layout';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import { PageProps, type BreadcrumbItem, Audit } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Pencil, Plus, Trash2, Eye } from 'lucide-react';
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
} from "@/components/ui/alert-dialog";
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Audits', href: '/audits' }];

export default function Index() {
    const { audits } = usePage<PageProps>().props;
    const [recordIdToDelete, setRecordIdToDelete] = useState<number | null>(null);

    const handlePageChange = (url: string | null) => {
        if (url) {
            router.get(url);
        }
    }

    const columns: ColumnDef<Audit>[] = [
        {
            accessorKey: 'id',
            header: 'ID',
        },
        {
            accessorKey: 'title',
            header: 'Title',
        },
        {
            accessorKey: 'audit_type_name',
            header: 'Type',
        },
        {
            accessorKey: 'description',
            header: 'Description',
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const audit = row.original;
                return (
                    <div className="flex gap-2">
                        <Button size="sm" variant="outline" asChild>
                            <Link href={route('audits.show', audit.id)}>
                                <Eye className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button size="sm" variant="default" asChild>
                            <Link href={route('audits.edit', audit.id)}>
                                <Pencil className="h-4 w-4" />
                            </Link>
                        </Button>
                        <AlertDialog open={recordIdToDelete === audit.id} onOpenChange={(open) => !open && setRecordIdToDelete(null)}>
                            <AlertDialogTrigger asChild>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => setRecordIdToDelete(audit.id)}
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
                                        This action cannot be undone. This will permanently delete the audit.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => {
                                            if (recordIdToDelete) {
                                                router.delete(route('audits.destroy', recordIdToDelete));
                                                setRecordIdToDelete(null);
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
            }
        }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Audits" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className='flex items-center justify-between'>
                    <h1 className="text-2xl font-bold">Audits</h1>
                    <Link href={route('audits.create')}>
                        <Button
                            variant="default"
                            size="sm"
                            className="rounded-md"
                        >
                            <Plus className="h-4 w-4" /> Add Audit
                        </Button>
                    </Link>
                </div>
                <DataTable
                    columns={columns}
                    data={audits.data}
                    pagination={
                        {
                            from: audits.from,
                            to: audits.to,
                            total: audits.total,
                            links: audits.links,
                            onPageChange: handlePageChange
                        }}
                />
            </div>
        </AppLayout>
    );
}
