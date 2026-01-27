import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Building, Files, Folder, Grid2x2, LayoutGrid, Puzzle, ClipboardList, ClipboardCheck, AlertCircle, FileCheck } from 'lucide-react';
import AppLogo from './app-logo';

// Aqui se crean los menus
const mainNavItems: NavItem[] = [
    {
        title: 'Panel de Control',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Empresas',
        href: '/companies',
        icon: Building,
    },
    {
        title: 'Departamentos',
        href: '/departments',
        icon: Puzzle,
    },
    {
        title: 'Áreas',
        href: '/areas',
        icon: Grid2x2,
    },
    {
        title: 'Carpetas',
        href: '/folders',
        icon: Folder,
    },
    {
        title: 'Documentos',
        href: '/documents',
        icon: Files,
    },
    {
        title: 'Tipos de Auditoría',
        href: '/audit-types',
        icon: ClipboardList,
    },
    {
        title: 'Auditorías',
        href: '/audits',
        icon: ClipboardCheck,
    },
    {
        title: 'Hallazgos',
        href: '/hallazgos',
        icon: AlertCircle,
    },
    {
        title: 'Tipos de Hallazgos',
        href: '/finding-types',
        icon: FileCheck,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repositorio',
        href: 'https://github.com/Christianguarnerosx/repositorioldr.git',
        icon: Folder,
    },
    {
        title: 'Documentación',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
