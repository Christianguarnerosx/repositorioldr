import AppLayout from '@/layouts/app-layout';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import { Department, pageProps, type BreadcrumbItem} from '@/types';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Departments', href: '/departments' }];

const columns: ColumnDef<Department>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
    },
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'company_name',
        header: 'Company Name',
    }
];

export default function Index() {
    const { departments } = usePage<pageProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="departments" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1>departments</h1>
                <DataTable columns={columns} data={departments.data}/>
            </div>
        </AppLayout>
    );
}
