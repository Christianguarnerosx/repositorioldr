import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, PageProps } from "@/types";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowLeft, Plus, Trash2, UserPlus } from "lucide-react";
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
import { AssignUsersModal } from "./Components/AssignUsersModal";
import { Badge } from "@/components/ui/badge";

interface Document {
    id: number;
    name: string;
    folder: { id: number; name: string } | null;
    user: { id: number; name: string } | null;
    assigned_users: AssignedUser[];
}

interface AssignedUser {
    id: number;
    name: string;
    email: string;
    pivot: {
        can_edit: boolean;
        status: string;
        created_at: string;
    };
}

interface ShowProps extends PageProps {
    document: Document;
    users: any[];
}

export default function Show() {
    const { document, users } = usePage<ShowProps>().props;
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [userIdToRemove, setUserIdToRemove] = useState<number | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Documents', href: '/documents' },
        { title: document.name, href: `/documents/${document.id}` }
    ];

    const columns: ColumnDef<AssignedUser>[] = [
        {
            accessorKey: 'name',
            header: 'Usuario'
        },
        {
            accessorKey: 'email',
            header: 'Email'
        },
        {
            accessorKey: 'pivot.can_edit',
            header: 'Permisos',
            cell: ({ row }) => (
                <Badge variant={row.original.pivot.can_edit ? "default" : "outline"}>
                    {row.original.pivot.can_edit ? 'Puede editar' : 'Solo lectura'}
                </Badge>
            )
        },
        {
            accessorKey: 'pivot.created_at',
            header: 'Asignado',
            cell: ({ row }) => new Date(row.original.pivot.created_at).toLocaleDateString()
        },
        {
            id: 'actions',
            header: 'Acciones',
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <AlertDialog open={userIdToRemove === user.id} onOpenChange={(open) => !open && setUserIdToRemove(null)}>
                        <AlertDialogTrigger asChild>
                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => setUserIdToRemove(user.id)}
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
                                    Esto removerá el acceso de {user.name} a este documento.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => {
                                        if (userIdToRemove) {
                                            router.delete(route('documents.remove-user', {
                                                document: document.id,
                                                user: userIdToRemove
                                            }));
                                            setUserIdToRemove(null);
                                        }
                                    }}
                                >
                                    Remover
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )
            }
        }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Documento: ${document.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={route('documents.index')}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold">{document.name}</h1>
                            <p className="text-sm text-muted-foreground">
                                Carpeta: {document.folder?.name ?? 'Ninguna'} | 
                                Creado por: {document.user?.name ?? 'N/A'}
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="default"
                        size="sm"
                        onClick={() => setAssignModalOpen(true)}
                    >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Asignar Usuarios
                    </Button>
                </div>

                <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-4">Usuarios Asignados</h2>
                    {document.assigned_users && document.assigned_users.length > 0 ? (
                        <DataTable
                            columns={columns}
                            data={document.assigned_users}
                        />
                    ) : (
                        <div className="text-center py-8 text-muted-foreground border rounded-md">
                            No hay usuarios asignados a este documento
                        </div>
                    )}
                </div>
            </div>

            <AssignUsersModal
                open={assignModalOpen}
                onOpenChange={setAssignModalOpen}
                documentId={document.id}
                users={users}
            />
        </AppLayout>
    );
}
