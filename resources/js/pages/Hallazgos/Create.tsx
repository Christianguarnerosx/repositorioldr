import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { BreadcrumbItem, FindingType } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Combobox } from "@/components/ui/combobox";
import { Head, router, useForm } from "@inertiajs/react";
import { Loader2 } from "lucide-react";

interface CreateProps {
    auditDocumentReviews: { id: number; label: string }[];
    findingTypes: FindingType[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Hallazgos',
        href: '/hallazgos'
    },
    {
        title: 'Crear',
        href: ''
    }
];

export default function Create({ auditDocumentReviews, findingTypes }: CreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        audit_document_review_id: "",
        finding_type_id: "",
        title: "",
        description: "",
        severity: "",
        action_required: "",
        status: "pending",
        due_date: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('hallazgos.store'), {
            onFinish: () => {
                // optional cleanup
            }
        });
    }

    const handleCancel = () => {
        if (data.title) {
            if (!confirm('¿Estás seguro de que quieres salir? Los cambios no guardados se perderán.')) {
                return;
            }
        }

        router.visit(route('hallazgos.index'));
    }

    return (
        <div>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Crear Hallazgo" />
                <div className="flex flex-col gap-4 p-4">
                    <h1 className="text-2xl font-semibold">Crear Hallazgo</h1>

                    <Card>
                        <form onSubmit={handleSubmit}>
                            <CardHeader>Información del Hallazgo</CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                {/* Audit Document Review */}
                                <div className="flex flex-col gap-1">
                                    <Label htmlFor="audit_document_review_id">Revisión de Documento</Label>
                                    <Combobox
                                        options={auditDocumentReviews.map((review) => ({ label: review.label, value: String(review.id) }))}
                                        value={data.audit_document_review_id}
                                        onChange={(value) => setData("audit_document_review_id", value)}
                                        disabled={processing}
                                        placeholder="Seleccionar revisión"
                                        searchPlaceholder="Buscar revisión..."
                                    />
                                    {errors.audit_document_review_id && (
                                        <p className="text-sm text-red-500">{errors.audit_document_review_id}</p>
                                    )}
                                </div>

                                {/* Finding Type */}
                                <div className="flex flex-col gap-1">
                                    <Label htmlFor="finding_type_id">Tipo de Hallazgo</Label>
                                    <Combobox
                                        options={findingTypes.map((type) => ({ label: type.name, value: String(type.id) }))}
                                        value={data.finding_type_id}
                                        onChange={(value) => setData("finding_type_id", value)}
                                        disabled={processing}
                                        placeholder="Seleccionar tipo"
                                        searchPlaceholder="Buscar tipo..."
                                    />
                                    {errors.finding_type_id && (
                                        <p className="text-sm text-red-500">{errors.finding_type_id}</p>
                                    )}
                                </div>

                                {/* Title */}
                                <div className="flex flex-col gap-1">
                                    <Label htmlFor="title">Título</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        autoFocus
                                        onChange={(e) => setData("title", e.target.value)}
                                        placeholder="Ingrese el título"
                                        disabled={processing}
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-red-500">{errors.title}</p>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="flex flex-col gap-1">
                                    <Label htmlFor="description">Descripción</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData("description", e.target.value)}
                                        placeholder="Ingrese la descripción"
                                        disabled={processing}
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-red-500">{errors.description}</p>
                                    )}
                                </div>

                                {/* Severity */}
                                <div className="flex flex-col gap-1">
                                    <Label htmlFor="severity">Severidad</Label>
                                    <Combobox
                                        options={[
                                            { label: 'Menor', value: 'minor' },
                                            { label: 'Mayor', value: 'major' },
                                            { label: 'Crítico', value: 'critical' },
                                        ]}
                                        value={data.severity}
                                        onChange={(value) => setData("severity", value)}
                                        disabled={processing}
                                        placeholder="Seleccionar severidad"
                                        searchPlaceholder="Buscar severidad..."
                                    />
                                    {errors.severity && (
                                        <p className="text-sm text-red-500">{errors.severity}</p>
                                    )}
                                </div>

                                {/* Action Required */}
                                <div className="flex flex-col gap-1">
                                    <Label htmlFor="action_required">Acción Requerida</Label>
                                    <Textarea
                                        id="action_required"
                                        value={data.action_required}
                                        onChange={(e) => setData("action_required", e.target.value)}
                                        placeholder="Ingrese la acción requerida (opcional)"
                                        disabled={processing}
                                    />
                                    {errors.action_required && (
                                        <p className="text-sm text-red-500">{errors.action_required}</p>
                                    )}
                                </div>

                                {/* Status */}
                                <div className="flex flex-col gap-1">
                                    <Label htmlFor="status">Estado</Label>
                                    <Combobox
                                        options={[
                                            { label: 'Pendiente', value: 'pending' },
                                            { label: 'Resuelto', value: 'resolved' },
                                            { label: 'No Aplica', value: 'not_applicable' },
                                        ]}
                                        value={data.status}
                                        onChange={(value) => setData("status", value)}
                                        disabled={processing}
                                        placeholder="Seleccionar estado"
                                        searchPlaceholder="Buscar estado..."
                                    />
                                    {errors.status && (
                                        <p className="text-sm text-red-500">{errors.status}</p>
                                    )}
                                </div>

                                {/* Due Date */}
                                <div className="flex flex-col gap-1">
                                    <Label htmlFor="due_date">Fecha Límite</Label>
                                    <Input
                                        id="due_date"
                                        type="date"
                                        value={data.due_date}
                                        onChange={(e) => setData("due_date", e.target.value)}
                                        disabled={processing}
                                    />
                                    {errors.due_date && (
                                        <p className="text-sm text-red-500">{errors.due_date}</p>
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
                                            Guardando...
                                        </div>
                                    ) : (
                                        'Guardar'
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
