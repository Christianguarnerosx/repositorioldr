import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { BreadcrumbItem } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Head, router, useForm } from "@inertiajs/react";
import { Loader2 } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Audit Types',
        href: '/audit-types'
    },
    {
        title: 'Create',
        href: ''
    }
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        description: "",
        status: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('audit-types.store'), {
            onFinish: () => {
                // optional cleanup
            }
        });
    }

    const handleCancel = () => {
        if (data.name) {
            if (!confirm('Are you sure you want to leave this form? Any unsaved changes will be lost.')) {
                return;
            }
        }

        router.visit(route('audit-types.index'));
    }

    return (
        <div>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Create Audit Type" />
                <div className="flex flex-col gap-4 p-4">
                    <h1 className="text-2xl font-semibold">Create Audit Type</h1>

                    <Card>
                        <form onSubmit={handleSubmit}>
                            <CardHeader>Audit Type Information</CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                {/* Name */}
                                <div className="flex flex-col gap-1">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        autoFocus
                                        onChange={(e) => setData("name", e.target.value)}
                                        placeholder="Enter audit type name"
                                        disabled={processing}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500">{errors.name}</p>
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

                                {/* Status */}
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="status"
                                        checked={data.status}
                                        onCheckedChange={(checked) => setData("status", checked as boolean)}
                                        disabled={processing}
                                    />
                                    <Label htmlFor="status">Active Status</Label>
                                    {errors.status && (
                                        <p className="text-sm text-red-500">{errors.status}</p>
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
