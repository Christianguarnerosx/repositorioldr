import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, router, useForm } from "@inertiajs/react";
import { Loader2 } from "lucide-react";
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
import { useState } from "react";

interface Company {
    id: number,
    name: string
}

interface Department {
    id: number,
    name: string,
    company_id: number
}

interface Area {
    id: number;
    name: string;
    department_id: number;
}

interface Folder {
    id: number;
    name: string;
    area_id?: number;
    parent_folder_id?: number;
    company_id?: number;
    department_id?: number;
}

interface EditProps {
    folder: Folder;
    companies: Company[];
    departments: Department[];
    areas: Area[];
    folders: Folder[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Folders",
        href: "/folders"
    },
    {
        title: "Editar Folder",
        href: ""
    },
];

export default function Edit({ folder, companies, departments, areas, folders }: EditProps) {
    const { data, setData, put, processing, errors } = useForm({
        company_id: String(folder.company_id || ""),
        department_id: String(folder.department_id || ""),
        area_id: String(folder.area_id || ""),
        parent_folder_id: String(folder.parent_folder_id || ""),
        name: folder.name || "",
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("folders.update", folder.id));
    };

    const handleCancel = () => {
        if (data.name !== folder.name || 
            data.company_id !== String(folder.company_id || "") ||
            data.department_id !== String(folder.department_id || "") ||
            data.area_id !== String(folder.area_id || "") ||
            data.parent_folder_id !== String(folder.parent_folder_id || "")) {
            setIsDialogOpen(true);
        } else {
            router.visit(route('folders.index'));
        }
    }

    //Filtrar departamentos de una empresa
    const filteredDepartments = departments.filter(
        (d) => String(d.company_id) === data.company_id
    );

    //Filtrar areas de un departamento
    const filteredAreas = areas.filter(
        (a) => String(a.department_id) === data.department_id
    );

    return (
        <div>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Editar Folder" />
                <div className="flex flex-col gap-4 p-4">
                    <h1 className="text-2xl font-semibold">Editar folder</h1>

                    <Card>
                        <form onSubmit={handleSubmit}>
                            <CardHeader>Informacion del folder</CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                {/* Aqui estan los campos */}
                                <div className="flex flex-col gap-1 mt-5">
                                    <Label htmlFor="company_id">Empresa</Label>
                                    <Select
                                        value={data.company_id}
                                        onValueChange={(value) => {
                                            setData("company_id", value);
                                            setData("department_id", "");
                                        }}
                                        disabled={processing}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona una empresa"></SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {companies.map((c) => (
                                                <SelectItem key={c.id} value={String(c.id)}>
                                                    {c.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.company_id && (
                                        <p className="text-red-500 text-sm">{errors.company_id}</p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1 mt-3">
                                    <Label htmlFor="department_id">Departamento</Label>
                                    <Select
                                        value={data.department_id}
                                        onValueChange={(value) => setData("department_id", value)}
                                        disabled={!data.company_id || processing}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona un departamento"></SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {filteredDepartments.map((d) => (
                                                <SelectItem key={d.id} value={String(d.id)}>
                                                    {d.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.department_id && (
                                        <p className="text-red-500 text-sm">{errors.department_id}</p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1 mt-3">
                                    <Label htmlFor="area_id">Area</Label>
                                    <Select
                                        value={data.area_id}
                                        onValueChange={(value) => setData("area_id", value)}
                                        disabled={!data.department_id || processing}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona un area"></SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {filteredAreas.map((a) => (
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
                                            {folders
                                                .filter(f => f.id !== folder.id) // Exclude current folder
                                                .map((f) => (
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
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Updating...
                                        </div>
                                    ) : (
                                        'Update'
                                    )}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </AppLayout>

            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Any unsaved changes will be lost.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex justify-end gap-2">
                        <AlertDialogCancel>Stay</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => router.visit(route('folders.index'))}
                        >
                            Leave
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
