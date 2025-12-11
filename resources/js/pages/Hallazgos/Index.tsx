import AppLayout from '@/layouts/app-layout';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import { PageProps, type BreadcrumbItem, Hallazgo } from '@/types';
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
import { Badge } from "@/components/ui/badge";
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Hallazgos', href: '/hallazgos' }];

const getSeverityBadge = (severity: string) => {
    const variants = {
        minor: 'default',
        major: 'secondary',
        critical: 'destructive',
    };
    return <Badge variant={variants[severity as keyof typeof variants] as any}>{severity}</Badge>;
};

const getStatusBadge = (status: string) => {
    const variants = {
        pending: 'outline',
        resolved: 'default',
        not_applicable: 'secondary',
    };
    const labels = {
        pending: 'Pendiente',
        resolved: 'Resuelto',
        not_applicable: 'No Aplica',
    };
    return <Badge variant={variants[status as keyof typeof variants] as any}>{labels[status as keyof typeof labels]}</Badge>;
};

export default function Index() {
    const { hallazgos } = usePage<PageProps>().props;
    const [recordIdToDelete, setRecordIdToDelete] = useState<number | null>(null);

    const handlePageChange = (url: string | null) => {
        if (url) {
            router.get(url);
        }
    }

    const columns: ColumnDef<Hallazgo>[] = [
        {
            accessorKey: 'id',
            header: 'ID',
        },
        {
            accessorKey: 'title',
            header: 'Título',
        },
        {
            accessorKey: 'finding_type_name',
            header: 'Tipo',
        },
        {
            accessorKey: 'audit_title',
            header: 'Auditoría',
        },
        {
            accessorKey: 'document_name',
            header: 'Documento',
        },
        {
            accessorKey: 'severity',
            header: 'Severidad',
            cell: ({ row }) => getSeverityBadge(row.original.severity),
        },
        {
            accessorKey: 'status',
            header: 'Estado',
            cell: ({ row }) => getStatusBadge(row.original.status),
        },
        {
            accessorKey: 'due_date',
            header: 'Fecha Límite',
        },
        {
            id: 'actions',
            header: 'Acciones',
            cell: ({ row }) => {
                const hallazgo = row.original;
                return (
                    <div className="flex gap-2">
                        <Button size="sm" variant="default" asChild>
                            <Link href={route('hallazgos.edit', hallazgo.id)}>
                                <Pencil className="h-4 w-4" />
                            </Link>
                        </Button>
                        <AlertDialog open={recordIdToDelete === hallazgo.id} onOpenChange={(open) => !open && setRecordIdToDelete(null)}>
                            <AlertDialogTrigger asChild>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => setRecordIdToDelete(hallazgo.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        ¿Estás seguro?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta acción no se puede deshacer. Esto eliminará permanentemente el hallazgo.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => {
                                            if (recordIdToDelete) {
                                                router.delete(route('hallazgos.destroy', recordIdToDelete));
                                                setRecordIdToDelete(null);
                                            }
                                        }}
                                    >
                                        Eliminar
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
            <Head title="Hallazgos" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className='flex items-center justify-between'>
                    <h1 className="text-2xl font-bold">Hallazgos</h1>
                    <Link href={route('hallazgos.create')}>
                        <Button
                            variant="default"
                            size="sm"
                            className="rounded-md"
                        >
                            <Plus className="h-4 w-4" /> Agregar Hallazgo
                        </Button>
                    </Link>
                </div>
                <DataTable
                    columns={columns}
                    data={hallazgos.data}
                    pagination={
                        {
                            from: hallazgos.from,
                            to: hallazgos.to,
                            total: hallazgos.total,
                            links: hallazgos.links,
                            onPageChange: handlePageChange
                        }}
                />
            </div>
        </AppLayout>
    );
}
