'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BreadcrumbItem, Folder } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Documents', href: '/documents' },
    { title: 'Create Document', href: '' },
];

interface CreateProps {
    folders: Folder[];
}

export default function CreateDocument({ folders }: CreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        folder_id: '' as number | '',
        name: '',
        file: null as File | null,
        user_id: '',
    });

    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');

    // Query para el input del combobox
    // No necesitamos filtrar manualmente, el componente Command lo hace por nosotros

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('documents.store'));
    };

    const handleCancel = () => {
        if (data.name || data.folder_id) {
            if (!confirm('Are you sure you want to leave this form? Any unsaved changes will be lost.')) {
                return;
            }
        }
        router.visit(route('documents.index'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Document" />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-semibold">Crear documento</h1>

                <Card>
                    <form onSubmit={handleSubmit}>
                        <CardHeader>Información del documento</CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            {/* Nombre del documento */}
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="name">Nombre</Label>
                                <input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="rounded border p-2"
                                />
                                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                            </div>

                            {/* Archivo */}
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="file">Archivo</Label>
                                <input
                                    id="file"
                                    type="file"
                                    onChange={(e) => setData('file', e.target.files ? e.target.files[0] : null)}
                                    className="rounded border p-2"
                                />
                                {errors.file && <p className="text-sm text-red-500">{errors.file}</p>}
                            </div>

                            {/* Selector de carpeta */}
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="folder_id">Folder</Label>
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={open}
                                            className="w-full justify-between"
                                            disabled={processing}
                                        >
                                            {data.folder_id ? folders.find((folder) => folder.id === data.folder_id)?.name : 'Select a folder'}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput placeholder="Search folder..." value={query} onValueChange={setQuery} />
                                            <CommandList>
                                                <CommandEmpty>No folder found.</CommandEmpty>
                                                <CommandGroup heading="Folders">
                                                    {folders.map((folder) => (
                                                        <CommandItem
                                                            key={folder.id}
                                                            value={folder.name}
                                                            onSelect={() => {
                                                                setData('folder_id', folder.id);
                                                                setOpen(false);
                                                                // setTimeout(() => setQuery(""), 80); // Optional: Clear query on select if desired
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    'mr-2 h-4 w-4',
                                                                    data.folder_id === folder.id ? 'opacity-100' : 'opacity-0',
                                                                )}
                                                            />
                                                            {folder.name}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                {errors.folder_id && <p className="text-sm text-red-500">{errors.folder_id}</p>}
                            </div>

                            {/* Botones */}
                            <div className="mt-4 flex gap-2">
                                <Button type="submit" disabled={processing}>
                                    Guardar
                                </Button>
                                <Button type="button" variant="outline" onClick={handleCancel}>
                                    Cancelar
                                </Button>
                            </div>
                        </CardContent>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
