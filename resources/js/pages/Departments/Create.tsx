import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { BreadcrumbItem } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Head, router, useForm } from "@inertiajs/react";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CreateProps {
    companies: { id: number; name: string }[];
}


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Departamentos',
        href: '/departments'
    },
    {
        title: 'Crear',
        href: ''
    }
];

export default function Create({ companies }: CreateProps) {

    //hook useform: utilidad que ayuda a gestionar el estado de un formulario, enviar datos al controlador y manejar las respuestas
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        company_id: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('departments.store'), {
            onError: (errors) => {
                console.log("❌ Errores desde Inertia:", errors);
            },
            onSuccess: () => {
                console.log("✅ Insertado con éxito");
            },
            onFinish: () => {
                console.log("🔄 Finalizó la request");
            }
        }
        );
    }

    const handleCancel = () => {
        if (data.name) {
            if (!confirm('Are you sure you want to leave this form. Any unsaved changes will be lost?')) {
                return;
            }
        }

        router.visit(route('departments.index'));
    }

    return (
        <div>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Crear departamento" />
                <div className="flex flex-col gap-4 p-4">
                    <h1 className="text-2xl font-semibold">Crear departamento</h1>

                    <Card>
                        <form onSubmit={handleSubmit}>
                            <CardHeader>Informacion del departamento</CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1">
                                    <Label className="mt-5" htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        autoFocus
                                        onChange={(e) => setData('name', e.target.value)}
                                        disabled={processing}
                                    />
                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}


                                    <div className="flex flex-col gap-1 mt-4">
                                        <Label htmlFor="company_id">Company</Label>
                                        <Select
                                            value={data.company_id}
                                            onValueChange={(value) => setData('company_id', value)}
                                            disabled={processing}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a company" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {companies.map((c: CreateProps['companies'][number]) => (
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
            </AppLayout>
        </div>
    )
}