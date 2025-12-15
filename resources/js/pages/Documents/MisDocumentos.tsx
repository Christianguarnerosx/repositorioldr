import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, PageProps } from "@/types";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Document {
    id: number;
    name: string;
    parent_folder_name: string;
    user_name: string;
    version_count: number;
    created_at: string;
    updated_at: string;
    can_edit: boolean;
    assigned_at: string;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Mis Documentos', href: '/mis-documentos' }];

export default function MisDocumentos() {
    const { documents } = usePage<PageProps>().props;

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
            header: 'Nombre'
        },
        {
            accessorKey: 'parent_folder_name',
            header: 'Carpeta',
        },
        {
            accessorKey: 'user_name',
            header: 'Creado por',
        },
        {
            accessorKey: 'can_edit',
            header: 'Permisos',
            cell: ({ row }) => (
                <Badge variant={row.original.can_edit ? "default" : "outline"}>
                    {row.original.can_edit ? 'Editar' : 'Lectura'}
                </Badge>
            )
        },
        {
            accessorKey: 'version_count',
            header: 'Versiones',
            cell: ({ row }) => (
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    {row.original.version_count}
                </span>
            )
        },
        {
            accessorKey: 'assigned_at',
            header: 'Asignado',
            cell: ({ row }) => new Date(row.original.assigned_at).toLocaleDateString()
        },
        {
            id: 'actions',
            header: 'Acciones',
            cell: ({ row }) => {
                const document = row.original;
                return (
                    <div className="flex gap-2">
                        <Link href={route('documents.versions.index', document.id)}>
                            <Button size="sm" variant="outline" title="Ver Versiones">
                                <Eye className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                )
            }
        }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mis Documentos" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Mis Documentos</h1>
                        <p className="text-sm text-muted-foreground">
                            Documentos que te han sido asignados
                        </p>
                    </div>
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
