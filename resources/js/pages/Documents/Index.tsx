import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, PageProps } from "@/types";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
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

    interface Document {
    id: number;
    name: string;
    parent_folder_name: string;
    user_name: string;
    version_count: number;
    created_at: string;
    updated_at: string;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Documents', href: '/documents' }];

export default function Index() {
    const { documents } = usePage<PageProps>().props;
    const [recordIdToDelete, setRecordIdToDelete] = useState<number | null>(null);

    const handlePageChange = (url: string | null) => {
        if (url) {
            router.get(url);
        }
    }

    const columns: ColumnDef<Document>[] = [
        {
            accessorKey: 'id',
            header: 'ID'
        },
        {
            accessorKey: 'name',
            header: 'Name'
        },
        {
            accessorKey: 'parent_folder_name',
            header: 'Parent folder',
        },
        {
            accessorKey: 'user_name',
            header: 'User',
        },
        {
            accessorKey: 'version_count',
            header: 'Versions',
            cell: ({ row }) => (
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    {row.original.version_count}
                </span>
            )
        },
        {
            accessorKey: 'created_at',
            header: 'Created At'
        },
        {
            accessorKey: 'updated_at',
            header: 'Updated At'
        },
        {
            id: 'actions',
            header: 'Acciones',
            cell: ({ row }) => {
                const document = row.original;
                return (
                    <div className="flex gap-2">
                         <Link href={route('documents.show', document.id)}>
                            <Button size="sm" variant="outline" title="Ver Detalles">
                                <Eye className="h-4 w-4" />
                            </Button>
                        </Link>
                         <Link href={route('documents.versions.index', document.id)}>
                            <Button size="sm" variant="outline" title="View Versions">
                                Versions
                            </Button>
                        </Link>
                        <Link href={route('documents.edit', document.id)}>
                            <Button size="sm" variant="default">
                                <Pencil className="h-4 w-4" />
                            </Button>
                        </Link>
                        <AlertDialog open={recordIdToDelete === document.id} onOpenChange={(open) => !open && setRecordIdToDelete(null)}>
                            <AlertDialogTrigger asChild>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => setRecordIdToDelete(document.id)}
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
                                        This action cannot be undone. This will permanently delete the document.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => {
                                            if (recordIdToDelete) {
                                                router.delete(route('documents.destroy', recordIdToDelete));
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
            <Head title="Documents" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Documents</h1>
                    <Link href={route('documents.create')}>
                        <Button
                            variant="default"
                            size="sm"
                            className="rounded-md"
                        >
                            <Plus className="h-4 w-4" />
                            Add Document
                        </Button>
                    </Link>
                </div>

                <DataTable
                    columns={columns}
                    data={documents.data}
                    pagination={{
                        from: documents.from,
                        to: documents.to,
                        total: documents.total,
                        links: documents.links,
                        onPageChange: handlePageChange
                    }}
                >
                </DataTable>
            </div>
        </AppLayout>
    );
}