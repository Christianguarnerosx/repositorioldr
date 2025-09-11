import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { BreadcrumbItem } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Head, router, useForm } from "@inertiajs/react";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Company {
    id: number;
    name: string;
}

interface Department {
    id: number;
    name: string;
    company_id: number;
}

interface CreateProps {
    companies: Company[];
    departments: Department[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Areas',
        href: '/areas'
    },
    {
        title: 'Crear',
        href: ''
    }
];


export default function Create({ companies, departments }: CreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        company_id: "",
        department_id: "",
        name: "", // aquí escribes el área
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('areas.store'), {
            onError: (errors) => {
                console.log("❌ Errores desde Inertia:", errors);
            },
            onFinish: () => {
                console.log("🔄 Finalizó la request");
            }
        });
    }

    const handleCancel = () => {
        if (data.name) {
            if (!confirm('Are you sure you want to leave this form. Any unsaved changes will be lost?')) {
                return;
            }
        }

        router.visit(route('areas.index'))
    }

    //Filtrar departamentos segun la empresa
    const filteredDepartments = departments.filter(
        (d) => String(d.company_id) === data.company_id
    );

    return (
        <div>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Crear area" />
                <div className="flex flex-col gap-4 p-4">
                    <h1 className="text-2xl font-semibold">Crear area</h1>

                    <Card>
                        <form onSubmit={handleSubmit}>
                            <CardHeader>Informacion de la area</CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                {/* Seleccion de empresa */}
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

                                {/* Seleccion de departamento */}
                                <div className="flex flex-col gap-1 mt-3">
                                    <Label htmlFor="department_id">Departamento</Label>
                                    <Select
                                        value={data.department_id}
                                        onValueChange={(value) => setData("department_id", value)}
                                        disabled={!data.company_id || processing}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona un departamento" />
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
                                        <p className="text-red-500 text-sm">
                                            {errors.department_id}
                                        </p>
                                    )}
                                </div>

                                {/* Area */}
                                <div className="flex flex-col gap-1 mt-3">
                                    <Label htmlFor="name">Area</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        autoFocus
                                        onChange={(e) => setData("name", e.target.value)}
                                        disabled={!data.department_id || processing}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500">{errors.name}</p>
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter className="mt-4 flex justify-end">
                                <Button
                                    className="mr-5"
                                    type='button'
                                    variant='outline'
                                    onClick={handleCancel}
                                >
                                    Cancelar
                                </Button>

                                <Button
                                    type='submit'
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Saving...
                                        </div>
                                    ) : (
                                        'Save'
                                    )}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </AppLayout >
        </div >
    )
}