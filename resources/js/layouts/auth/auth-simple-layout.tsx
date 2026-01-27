import AppLogoIcon from '@/components/app-logo-icon';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-background p-6 md:p-10 font-['Instrument_Sans']">
            <div className="w-full max-w-sm">
                <div className="antigravity-glass flex flex-col gap-8 rounded-[2rem] p-8 shadow-2xl transition-all duration-500 hover:shadow-blue-500/10 dark:hover:shadow-blue-900/10">
                    <div className="flex flex-col items-center gap-4">
                        <Link href={route('home')} className="flex flex-col items-center gap-2 font-medium group text-[#121317] dark:text-[#EDEDEC]">
                            <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#121317] dark:bg-[#EDEDEC] transition-transform duration-300 group-hover:scale-110">
                                <AppLogoIcon className="size-7 fill-current text-white dark:text-[#121317]" />
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-1.5 text-center">
                            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                            <p className="text-center text-sm text-[#706f6c] dark:text-[#A1A09A] px-2">{description}</p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
