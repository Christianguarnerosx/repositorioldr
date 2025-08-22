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

export interface pageProps {
    companies: {
        data: Company[];
    };
    [key: string]: unknown; // obliga a hacer una validacion de que es un objeto permite tener propiedades dinamicas
}

// El tipado de tipescript para un objeto para departments o direcciones
export interface Department {
    id: number;
    name: string;
    company_id: number;
}

export interface pageProps {
    departments: {
        data: Department[];
    };
    [key: string]: unknown; // obliga a hacer una validacion de que es un objeto permite tener propiedades dinamicas
}

// El tipado de tipescript para un objeto para areas
export interface Area {
    id: number;
    name: string;
    company_id: number;
}

export interface pageProps {
    areas: {
        data: Area[];
    };
    [key: string]: unknown; // obliga a hacer una validacion de que es un objeto permite tener propiedades dinamicas
}

