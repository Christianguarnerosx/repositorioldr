import AppLayout from '@/layouts/app-layout';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import { PageProps, type BreadcrumbItem, AuditType } from '@/types';
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
} from "@/components/ui/alert-dialog";
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Audit Types', href: '/audit-types' }];

export default function Index() {
    const { auditTypes } = usePage<PageProps>().props;
    const [recordIdToDelete, setRecordIdToDelete] = useState<number | null>(null);

    const handlePageChange = (url: string | null) => {
        if (url) {
            router.get(url);
        }
    }

    const columns: ColumnDef<AuditType>[] = [
        {
            accessorKey: 'id',
            header: 'ID',
        },
        {
            accessorKey: 'name',
            header: 'Name',
        },
        {
            accessorKey: 'description',
            header: 'Description',
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const status = row.original.status;
                return (
                    <Badge variant={status ? 'default' : 'secondary'}>
                        {status ? 'Active' : 'Inactive'}
                    </Badge>
                );
            }
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const auditType = row.original;
                return (
                    <div className="flex gap-2">
                        <Link href={route('audit-types.edit', auditType.id)}>
                            <Button size="sm" variant="default">
                                <Pencil className="h-4 w-4" />
                            </Button>
                        </Link>
                        <AlertDialog open={recordIdToDelete === auditType.id} onOpenChange={(open) => !open && setRecordIdToDelete(null)}>
                            <AlertDialogTrigger asChild>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => setRecordIdToDelete(auditType.id)}
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
                                        This action cannot be undone. This will permanently delete the audit type.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => {
                                            if (recordIdToDelete) {
                                                router.delete(route('audit-types.destroy', recordIdToDelete));
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
            <Head title="Audit Types" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className='flex items-center justify-between'>
                    <h1 className="text-2xl font-bold">Audit Types</h1>
                    <Link href={route('audit-types.create')}>
                        <Button
                            variant="default"
                            size="sm"
                            className="rounded-md"
                        >
                            <Plus className="h-4 w-4" /> Add Audit Type
                        </Button>
                    </Link>
                </div>
                <DataTable
                    columns={columns}
                    data={auditTypes.data}
                    pagination={
                        {
                            from: auditTypes.from,
                            to: auditTypes.to,
                            total: auditTypes.total,
                            links: auditTypes.links,
                            onPageChange: handlePageChange
                        }}
                />
            </div>
        </AppLayout>
    );
}
