import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

// ------------------------------------------------------------------------------ Tipos para el proyject

// El tipado de tipescript para un objeto para companies
export interface Company {
    id: number;
    name: string;
}

// El tipado de tipescript para un objeto para departments o direcciones
export interface Department {
    id: number;
    name: string;
    company_id: number;
}

// El tipado de tipescript para un objeto para areas
export interface Area {
    id: number;
    name: string;
    company_id: number;
}

//Para la paginacion
export interface PaginationLinks {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginateData<T> {
    data: T[];
    current_page: number;
    from: number;
    to: number;
    total: number;
    per_page: number;
    last_page: number;
    links: PaginationLinks[];
}

// PageProps para Inertia, siempre abajo de las interfaces principales
export interface pageProps {
    companies: PaginateData<Company>;
    areas: PaginateData<Area>;
    departments: PaginateData<Department>;

    [key: string]: unknown;
}
