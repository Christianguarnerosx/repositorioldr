import Typewriter from '@/components/typewriter';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Bienvenido">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
            </Head>

            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] text-[#121317] dark:bg-[#0a0a0a] dark:text-[#EDEDEC] font-['Instrument_Sans'] selection:bg-blue-100 dark:selection:bg-blue-900">
                {/* Header / Nav */}
                <header className="fixed top-0 z-50 flex w-full justify-center p-6">
                    <nav className="antigravity-glass flex items-center gap-2 rounded-full px-4 py-2 shadow-sm transition-all duration-300 hover:shadow-md">
                        <Link href="/" className="px-4 py-1.5 text-sm font-medium transition-colors hover:text-blue-600">
                            Inicio
                        </Link>
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="bg-[#121317] text-white dark:bg-[#EDEDEC] dark:text-[#121317] rounded-full px-6 py-1.5 text-sm font-medium transition-all hover:opacity-90"
                            >
                                Panel de Control
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="px-4 py-1.5 text-sm font-medium transition-colors hover:text-blue-600"
                                >
                                    Iniciar sesión
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="bg-[#121317] text-white dark:bg-[#EDEDEC] dark:text-[#121317] rounded-full px-6 py-1.5 text-sm font-medium transition-all hover:opacity-90"
                                >
                                    Registrarse
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                {/* Hero Section */}
                <main className="flex grow flex-col items-center justify-center px-6 text-center">
                    <div className="relative mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-white shadow-xl dark:bg-[#161615]">
                        <div className="h-12 w-12 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin-slow"></div>
                        <div className="absolute h-6 w-6 rounded-full bg-blue-500 blur-sm animate-pulse"></div>
                    </div>

                    <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl">
                        Doc<span className="text-blue-600">Flow</span>
                    </h1>

                    <div className="mb-12 min-h-[1.5em] text-xl font-medium text-[#706f6c] dark:text-[#A1A09A] md:text-2xl lg:text-3xl">
                        <Typewriter
                            texts={[
                                "Versiónado de documentación.",
                                "Seguimiento de auditorías de documentos.",
                                "Sistema de gestión de calidad.",
                                "Seguimiento de documentación."
                            ]}
                            speed={70}
                            delayBetween={2500}
                        />
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row">
                        <Link
                            href={auth.user ? route('dashboard') : route('login')}
                            className="bg-[#121317] text-white dark:bg-[#EDEDEC] dark:text-[#121317] rounded-full px-10 py-4 text-base font-semibold shadow-lg transition-all hover:scale-105 active:scale-95"
                        >
                            Comenzar ahora
                        </Link>
                        {!auth.user && (
                            <Link
                                href={route('register')}
                                className="antigravity-glass rounded-full px-10 py-4 text-base font-semibold transition-all hover:bg-white/10"
                            >
                                Registrarse
                            </Link>
                        )}
                    </div>
                </main>

                {/* Footer */}
                <footer className="w-full p-8 text-center text-sm text-[#706f6c] dark:text-[#A1A09A]">
                    <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-4">
                        <p>© LDR SOLUTIONS 2026</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
