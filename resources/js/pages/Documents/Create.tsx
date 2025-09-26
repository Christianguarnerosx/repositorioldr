"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, router, useForm } from "@inertiajs/react";

interface Folder {
    id: number;
    name: string;
    area_id?: number;
    parent_folder_id?: number;
}

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

interface CreateProps {
    folders: Folder[];
    documents: Document[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Documents",
        href: "/documents"
    }, {
        title: "Create Document",
        href: ""
    }
]

export default function ({ folders, documents }: CreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        folder_id: "",
        name: "",
        file_path: "",
        size: "",
        mime_type: "",
        created_at: "",
        updated_at: "",
        user_id: ""
    });

    const [open, setOpen] = useState(false);
    const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);

    const [query, setQuery] = useState("");

    const filteredFolders = folders.filter(folder =>
        folder.name.toLowerCase().includes(query.toLowerCase())
    )

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        console.log("🚀 Enviando request con datos...", data);

        post(route("documents.store"), {
            onError: (errors) => {
                console.log("🚀 Errores: ", errors);
            },
            onFinish: () => {
                console.log("🚀 Documento creado");
            }
        });
    }

    const handleCancel = () => {
        if (data.name) {
            if (!confirm('Are you sure you want to leave this form. Any unsaved changes will be lost?')) {
                return;
            }
        }

        router.visit(route('documents.index'));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Document" />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2x1 font-semibold">Crear documento</h1>

                <Card>
                    <form onSubmit={handleSubmit}>
                        <CardHeader>Informacion del documento</CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            {/* Aqui estan los campos */}
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-[200px] justify-start">
                                        {selectedFolder ? selectedFolder.name : "Seleccionar carpeta"}
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent className="p-0">
                                    <Command>
                                        <CommandInput
                                            placeholder="Buscar carpeta..."
                                            value={query}               // <-- ahora controlado
                                            onValueChange={(val: string) => setQuery(val)}
                                        />
                                        <CommandList>
                                            {filteredFolders.length === 0 ? (
                                                <CommandEmpty>No se encontró carpeta.</CommandEmpty>
                                            ) : (
                                                <CommandGroup>
                                                    {filteredFolders.map((folder) => (
                                                        <CommandItem
                                                            key={folder.id}
                                                            value={String(folder.id)}
                                                            onSelect={(value: string) => {
                                                                // value viene del CommandItem
                                                                const found = folders.find(f => String(f.id) === value);
                                                                if (!found) return;
                                                                setSelectedFolder(found);
                                                                setData("folder_id", value);
                                                                // cerrar popover
                                                                setOpen(false);
                                                                // limpiar query *después* de cerrar para evitar re-renders que quiten el list
                                                                // puedes ajustar o eliminar el timeout si no lo necesitas
                                                                setTimeout(() => setQuery(""), 80);
                                                            }}
                                                        >
                                                            {folder.name}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            )}
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </CardContent>
                    </form>
                </Card>
            </div>
        </AppLayout>
    )
}