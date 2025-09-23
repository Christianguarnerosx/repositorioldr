import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, router, useForm } from "@inertiajs/react";
import { Loader2 } from "lucide-react";

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
}

interface CreateProps {
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
        title: "Crear Folder",
        href: ""
    },
];

export default function ({ companies, departments, areas, folders }: CreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        company_id: "",
        department_id: "",
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

    //Filtrar departamentos de uan empresa
    const filteredDepartments = departments.filter(
        (d) => String(d.company_id) === data.company_id
    );

    //Filtrar areas de un departamneto
    const filteredAreas = areas.filter(
        (a) => String(a.department_id) === data.department_id
    );

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
        </AppLayout >
    );
}