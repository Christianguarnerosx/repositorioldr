import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, pageProps } from "@/types";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Trash2 } from "lucide-react";

interface Document {
    id: number;
    name: string;
    parent_folder_name: string;
    user_name: string;
    file_path: string;
    size?: number;
    mime_type?: string;
    created_at: string;
    updated_at: string;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Documents', href: '/documents' }];

export default function Index() {
    const { documents } = usePage<pageProps>().props;

    const handleDelete = (id: number) => {
        if (!confirm('Are you sure you want to delete this document?')) {
            router.delete(route("documents.destroy", id));
        }
    }

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
            accessorKey: 'file_path',
            header: 'File location'
        },
        {
            accessorKey: 'size',
            header: 'Size'
        },
        {
            accessorKey: 'mime_type',
            header: 'Type'
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
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(document.id)}
                    >
                        <Trash2 className="h-4 w-4 text-white" />
                    </Button>
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