import AppLayout from '@/layouts/app-layout';
import { PageProps, Audit, User } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { AssignDocumentModal } from './Components/AssignDocumentModal';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
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
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

// Define types locally or import if available. 
// Assuming types for DocumentReview
interface DocumentReview {
    id: number;
    audit_id: number;
    document_version_id: number;
    user_id: number;
    status: string;
    document_version: {
        id: number;
        document: {
            id: number;
            name: string;
        };
        created_at: string;
    };
    auditor: User;
    created_at: string;
}

interface ShowProps extends PageProps {
    audit: Audit & { audit_type: { name: string } };
    assignedDocuments: DocumentReview[];
    documents: any[]; // Ideally typed
    users: User[];
}

export default function Show({ auth, audit, assignedDocuments, documents, users }: ShowProps) {
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [recordIdToDelete, setRecordIdToDelete] = useState<number | null>(null);

    const columns: ColumnDef<DocumentReview>[] = [
        {
            accessorKey: 'document_version.document.name',
            header: 'Document',
            cell: ({ row }) => (
                <span className="font-medium">
                    {row.original.document_version.document.name}
                </span>
            )
        },
        {
            accessorKey: 'document_version.id',
            header: 'Version',
            cell: ({ row }) => (
                <span>
                    v{row.original.document_version.id} (
                    {format(new Date(row.original.document_version.created_at), 'PP')})
                </span>
            )
        },
        {
            accessorKey: 'auditor.name',
            header: 'Auditor',
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => (
                <Badge variant="secondary" className="capitalize">
                    {row.original.status}
                </Badge>
            )
        },
        {
            accessorKey: 'created_at',
            header: 'Assigned Date',
            cell: ({ row }) => format(new Date(row.original.created_at), 'PP')
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const review = row.original;
                return (
                    <AlertDialog open={recordIdToDelete === review.id} onOpenChange={(open) => !open && setRecordIdToDelete(null)}>
                        <AlertDialogTrigger asChild>
                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => setRecordIdToDelete(review.id)}
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
                                    This action cannot be undone. This will unassign the document from the audit.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => {
                                        if (recordIdToDelete) {
                                            router.delete(route('audit-document-reviews.destroy', recordIdToDelete), {
                                                preserveScroll: true,
                                            });
                                            setRecordIdToDelete(null);
                                        }
                                    }}
                                >
                                    Unassign
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )
            }
        }
    ];

    return (
        <AppLayout breadcrumbs={[
            { title: 'Audits', href: '/audits' },
            { title: audit.title, href: `/audits/${audit.id}` },
        ]}>
            <Head title={`Audit: ${audit.title}`} />
            
            <div className="flexh-full flex-1 flex-col gap-8 rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Link href={route('audits.index')}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">{audit.title}</h1>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <span className="font-semibold">Type:</span> {audit.audit_type?.name || 'N/A'}
                            </div>
                            <div>
                                <span className="font-semibold">Description:</span>
                                <p className="text-gray-600 mt-1">{audit.description || 'No description provided.'}</p>
                            </div>
                            <div>
                                <span className="font-semibold">Created At:</span> {format(new Date(audit.created_at), 'PPP')}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Assigned Documents</h2>
                        <Button onClick={() => setIsAssignModalOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" /> Assign Document
                        </Button>
                    </div>

                    <DataTable
                        columns={columns}
                        data={assignedDocuments}
                    />
                </div>

                <AssignDocumentModal 
                    open={isAssignModalOpen} 
                    onOpenChange={setIsAssignModalOpen}
                    auditId={audit.id}
                    documents={documents}
                    users={users}
                />
            </div>
        </AppLayout>
    );
}
