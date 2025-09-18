import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, router, useForm } from "@inertiajs/react";
import { Loader2 } from "lucide-react";

interface Area {
    id: number;
    name: string;
}

interface Folder {
    id: number;
    name: string;
    area_id?: number;
    parent_folder_id?: number;
}

interface CreateProps {
    areas: Area[];
    folders: Folder[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Folders",
        href: "/folders"
    },
    {
        title: "Crear Folder",
        href: ""
    },
];

export default function ({ areas, folders }: CreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        area_id: "",
        parent_folder_id: "",
        name: "", // aqui escribe el area
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        console.log("🚀 Enviando request con datos...", data);

        post(route("folders.store"), {
            onError: (errors) => {
                console.log("❌ Errores desde Inertia:", errors);
            },
            onFinish: () => {
                console.log("🔄 Finalizó la request");
            },
        });
    };

    const handleCancel = () => {
        if (data.name) {
            if (!confirm('Are you sure you want to leave this form. Any unsaved changes will be lost?')) {
                return;
            }
        }

        router.visit(route('folders.index'));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Folder" />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-semibold">Crear folder</h1>

                <Card>
                    <form onSubmit={handleSubmit}>
                        <CardHeader>Informacion del folder</CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            {/* Aqui estan los campos */}
                            <div className="flex flex-col gap-1 mt-5">
                                <Label htmlFor="area_id">Area (Opcional)</Label>
                                <Select
                                    value={data.area_id ? String(data.area_id) : ""}
                                    onValueChange={(value) => setData("area_id", value)}
                                    disabled={processing}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona un area" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {areas.map((a) => (
                                            <SelectItem key={a.id} value={String(a.id)}>
                                                {a.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.area_id && (
                                    <p className="text-red-500 text-sm">{errors.area_id}</p>
                                )}
                            </div>

                            {/* Aqui estaran los folders padre */}
                            <div className="flex flex-col gap-1 mt-3">
                                <Label htmlFor="parent_folder_id">Folder padre (Opcional)</Label>
                                <Select
                                    value={data.parent_folder_id ? String(data.parent_folder_id) : ""}
                                    onValueChange={(value) => setData("parent_folder_id", value)}
                                    disabled={processing}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona un folder" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {folders.map((f) => (
                                            <SelectItem key={f.id} value={String(f.id)}>
                                                {f.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.parent_folder_id && (
                                    <p className="text-red-500 text-sm">{errors.parent_folder_id}</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-1 mt-3">
                                <Label htmlFor="name">Nombre del folder</Label>
                                <Input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)}
                                    disabled={processing}
                                    placeholder="Escribe el nombre del folder"
                                    required
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm">{errors.name}</p>
                                )}
                            </div>

                        </CardContent>
                        <CardFooter className="flex justify-end mt-4">
                            <Button
                                className="mr-5"
                                type='button'
                                variant='outline'
                                onClick={handleCancel}
                            >
                                Cancelar
                            </Button>

                            <Button
                                type="submit"
                                disabled={processing}
                            >
                                {processing ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 />
                                        Guardando...
                                    </div>
                                ) : (
                                    'Guardar'
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Card >
            </div>
        </AppLayout>
    );
}