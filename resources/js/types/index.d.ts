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

export interface Folder {
    id: number;
    name: string;
    area_name?: string;            // opcional, si quieres mostrar el nombre del área
    parent_folder_name?: string;   // opcional, para mostrar el folder padre
}

export interface Document {
    id: number;
    name: string;
    folder_id: number;                // referencia al folder donde está
    parent_folder_name: string;       // opcional, solo para mostrar en tablas
    user_id: number;                  // referencia al usuario que subió el documento
    user_name: string;                // opcional, solo para mostrar

    size?: number;                    // opcional
    mime_type?: string;               // opcional
    created_at: string;
    updated_at: string;
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
export interface PageProps {
    flash: {
        success?: string;
        info?: string;
        warning?: string;
        error?: string;
    }

    companies: PaginateData<Company>;
    areas: PaginateData<Area>;
    departments: PaginateData<Department>;
    folders: PaginateData<Folder>;
    documents: PaginateData<Document>;
    auditTypes: PaginateData<AuditType>;
    audits: PaginateData<Audit>;
    hallazgos: PaginateData<Hallazgo>;

    [key: string]: unknown;
}

export interface AuditType {
    id: number;
    name: string;
    description?: string;
    status: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface Audit {
    id: number;
    title: string;
    description?: string;
    audit_type_id: number;
    audit_type_name?: string;
    created_at?: string;
    updated_at?: string;
}

export interface FindingType {
    id: number;
    name: string;
    description?: string;
}

export interface Hallazgo {
    id: number;
    title: string;
    description: string;
    severity: 'minor' | 'major' | 'critical';
    status: 'pending' | 'resolved' | 'not_applicable';
    action_required?: string;
    due_date?: string;
    corrected_at?: string;
    finding_type_name?: string;
    audit_title?: string;
    document_name?: string;
    created_by_name?: string;
    created_at?: string;
}
