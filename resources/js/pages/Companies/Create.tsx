import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, router, useForm } from "@inertiajs/react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Empresas',
        href: '/companies'
    },
    {
        title: 'Crear',
        href: ''
    }
];


export default function Create() {

    //hook useform: utilidad que ayuda a gestionar el estado de un formulario, enviar datos al controlador y manejar las respuestas
    const { data, setData, post, processing, errors } = useForm({
        name: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('companies.store'));
    }

    const handleCancel = () => {
        //Si el usuario esta cargando datos y quiere salir salta precaucion, con propiedades de data
        if (data.name) {
            if (!confirm('Are you sure you want to leave this form. Any unsaved changes will be lost?')) {
                return;
            }
        }

        router.visit(route('companies.index'));
    }

    return (
        <div>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Crear empresa" />
                <div className="flex flex-col gap-4 p-4">
                    <h1 className="text-2xl font-bold">Crear empresa</h1>

                    <Card>
                        <form onSubmit={handleSubmit}>
                            <CardHeader>Company information</CardHeader>
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