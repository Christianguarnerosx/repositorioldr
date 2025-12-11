import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, PageProps } from "@/types";
import { Head, Link, useForm, usePage, router } from "@inertiajs/react";
import { Download, FileText, Upload, Pencil, Trash2 } from "lucide-react";
import { FormEventHandler, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Document {
    id: number;
    name: string;
}

interface Version {
    id: number;
    file_path: string;
    notes: string;
    mime_type: string;
    size: number;
    created_at: string;
    uploader?: {
        name: string;
    };
}

export default function VersionsIndex() {
    const { document, versions } = usePage<PageProps<{ document: Document, versions: Version[] }>>().props;
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    const { data,setData, post, processing, errors, reset } = useForm({
        file_path: null as File | null,
        notes: '',
    });

    const [editingVersion, setEditingVersion] = useState<Version | null>(null);
    const [editNotes, setEditNotes] = useState('');
    const [processingWait, setProcessingWait] = useState(false);
    const [recordIdToDelete, setRecordIdToDelete] = useState<number | null>(null);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('documents.versions.store', document.id), {
            onSuccess: () => {
                setIsUploadOpen(false);
                reset();
            },
        });
    };

    const submitEdit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!editingVersion) return;
        
        setProcessingWait(true);
        router.put(route('documents.versions.update', editingVersion.id), {
            notes: editNotes
        }, {
            onSuccess: () => {
                setEditingVersion(null);
                setProcessingWait(false);
            },
            onError: () => {
                setProcessingWait(false);
            }
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Documents', href: '/documents' },
        { title: 'Versions', href: `/documents/${document.id}/versions` }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Versions - ${document.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-y-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Document Versions</h1>
                        <p className="text-gray-500">Managing versions for: {document.name}</p>
                    </div>
                    
                    <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Upload className="mr-2 h-4 w-4" />
                                Upload New Version
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Upload New Version</DialogTitle>
                                <DialogDescription>
                                    Add a new revision to this document.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={submit} className="space-y-4">
                                <div>
                                    <Label htmlFor="file">File</Label>
                                    <Input
                                        id="file"
                                        type="file"
                                        onChange={(e) => setData('file_path', e.target.files ? e.target.files[0] : null)}
                                        className="mt-1 block w-full"
                                    />
                                    {errors.file_path && <div className="text-red-500 text-sm mt-1">{errors.file_path}</div>}
                                </div>
                                <div>
                                    <Label htmlFor="notes">Notes</Label>
                                    <Textarea
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        placeholder="Describe what changed in this version..."
                                        className="mt-1 block w-full"
                                    />
                                    {errors.notes && <div className="text-red-500 text-sm mt-1">{errors.notes}</div>}
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button type="button" variant="outline" onClick={() => setIsUploadOpen(false)}>Cancel</Button>
                                    <Button type="submit" disabled={processing}>Upload</Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="grid gap-4">
                    {versions.map((version) => (
                        <div key={version.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-blue-50 rounded-full">
                                    <FileText className="h-6 w-6 text-blue-500" />
                                </div>
                                <div>
                                    <p className="font-medium">Version uploaded on {new Date(version.created_at).toLocaleString()}</p>
                                    <p className="text-sm text-gray-500">By {version.uploader?.name ?? 'Unknown'}</p>
                                    {version.notes && (
                                        <p className="text-sm mt-1 bg-gray-50 p-2 rounded">{version.notes}</p>
                                    )}
                                    <div className="flex gap-4 mt-1 text-xs text-gray-400">
                                        <span>Size: {(version.size / 1024).toFixed(2)} KB</span>
                                        <span>Type: {version.mime_type}</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => {
                                        setEditingVersion(version);
                                        setEditNotes(version.notes || '');
                                    }}>
                                        <Pencil className="h-4 w-4 mr-2" />
                                        Edit Note
                                    </Button>
                                    <a href={route('document-versions.download', version.id)} target="_blank" rel="noreferrer">
                                        <Button variant="outline" size="sm">
                                            <Download className="h-4 w-4 mr-2" />
                                            Download
                                        </Button>
                                    </a>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => setRecordIdToDelete(version.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}

                    <Dialog open={!!editingVersion} onOpenChange={(open) => !open && setEditingVersion(null)}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit Version Notes</DialogTitle>
                                <DialogDescription>
                                    Update the notes for this version.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={submitEdit} className="space-y-4">
                                <div>
                                    <Label htmlFor="edit-notes">Notes</Label>
                                    <Textarea
                                        id="edit-notes"
                                        value={editNotes}
                                        onChange={(e) => setEditNotes(e.target.value)}
                                        className="mt-1 block w-full"
                                    />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button type="button" variant="outline" onClick={() => setEditingVersion(null)}>Cancel</Button>
                                    <Button type="submit" disabled={processingWait}>Update</Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>

                    <AlertDialog open={!!recordIdToDelete} onOpenChange={(open) => !open && setRecordIdToDelete(null)}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete this version of the document.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => {
                                        if (recordIdToDelete) {
                                            router.delete(route('documents.versions.destroy', recordIdToDelete));
                                            setRecordIdToDelete(null);
                                        }
                                    }}
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    {versions.length === 0 && (
                        <div className="text-center p-8 text-gray-500 border-2 border-dashed rounded-lg">
                            No versions found. Upload the first version to get started.
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
