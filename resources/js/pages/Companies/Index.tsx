import CompaniesTable from '@/components/ui/data-table';
import AppLayout from '@/layouts/app-layout';
import { pageProps, type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Companies', href: '/companies' }];

export default function Index() {
    const { companies } = usePage<pageProps>().props;

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this company?')) {
            router.delete(`/companies/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Companies" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1>Companies</h1>

                <CompaniesTable companies={companies.data} handleDelete={handleDelete} />
            </div>
        </AppLayout>
    );
}

