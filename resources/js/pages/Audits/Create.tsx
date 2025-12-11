import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { BreadcrumbItem, AuditType } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Head, router, useForm } from "@inertiajs/react";
import { Loader2 } from "lucide-react";

interface CreateProps {
    auditTypes: AuditType[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Audits',
        href: '/audits'
    },
    {
        title: 'Create',
        href: ''
    }
];

export default function Create({ auditTypes }: CreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        description: "",
        audit_type_id: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('audits.store'), {
            onFinish: () => {
                // optional cleanup
            }
        });
    }

    const handleCancel = () => {
        if (data.title) {
            if (!confirm('Are you sure you want to leave this form? Any unsaved changes will be lost.')) {
                return;
            }
        }

        router.visit(route('audits.index'));
    }

    return (
        <div>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Create Audit" />
                <div className="flex flex-col gap-4 p-4">
                    <h1 className="text-2xl font-semibold">Create Audit</h1>

                    <Card>
                        <form onSubmit={handleSubmit}>
                            <CardHeader>Audit Information</CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                {/* Title */}
                                <div className="flex flex-col gap-1">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        autoFocus
                                        onChange={(e) => setData("title", e.target.value)}
                                        placeholder="Enter audit title"
                                        disabled={processing}
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-red-500">{errors.title}</p>
                                    )}
                                </div>

                                {/* Audit Type */}
                                <div className="flex flex-col gap-1">
                                    <Label htmlFor="audit_type_id">Audit Type</Label>
                                    <Select
                                        value={data.audit_type_id}
                                        onValueChange={(value) => setData("audit_type_id", value)}
                                        disabled={processing}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select an audit type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {auditTypes.map((type) => (
                                                <SelectItem key={type.id} value={String(type.id)}>
                                                    {type.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.audit_type_id && (
                                        <p className="text-sm text-red-500">{errors.audit_type_id}</p>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="flex flex-col gap-1">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData("description", e.target.value)}
                                        placeholder="Enter description (optional)"
                                        disabled={processing}
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-red-500">{errors.description}</p>
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
                                    Cancel
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
