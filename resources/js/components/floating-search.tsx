import { Input } from '@/components/ui/input';
import { router } from '@inertiajs/react';
import { FileText, Folder } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SearchResult {
    documents: Array<{ id: number; name: string; folder_id: number | null }>;
    folders: Array<{ id: number; name: string }>;
}

export function FloatingSearch() {
    const [isFocused, setIsFocused] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult>({ documents: [], folders: [] });
    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        if (query.trim().length === 0) {
            setResults({ documents: [], folders: [] });
            setShowResults(false);
            return;
        }

        const timeoutId = setTimeout(async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/search?q=${encodeURIComponent(query)}`);
                const data = await response.json();
                setResults(data);
                setShowResults(true);
            } catch (error) {
                console.error('Error fetching search results:', error);
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query]);

    const handleResultClick = (type: 'document' | 'folder', item: any) => {
        let url = '/dashboard';

        if (type === 'document') {
            // For documents, navigate to the parent folder if it exists
            if (item.folder_id) {
                url = `/dashboard?folder_id=${item.folder_id}`;
            }
        } else {
            // For folders, navigate directly to that folder
            url = `/dashboard?folder_id=${item.id}`;
        }

        router.visit(url);
        setQuery('');
        setShowResults(false);
    };

    const hasResults = results.documents.length > 0 || results.folders.length > 0;

    return (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
            <div
                className={`
                    relative flex items-center transition-all duration-300 ease-in-out
                    antigravity-glass rounded-full border border-white/20 dark:border-white/10
                    ${isFocused ? 'shadow-[0_0_20px_rgba(255,255,255,0.1)] ring-2 ring-primary/20 scale-105' : 'shadow-lg'}
                `}
            >
                <Input
                    type="text"
                    placeholder="Buscar documentos, carpetas..."
                    className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-11 text-sm placeholder:text-muted-foreground/50 px-6"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => {
                        setIsFocused(false);
                        setTimeout(() => setShowResults(false), 200);
                    }}
                />
            </div>

            {/* Results Dropdown */}
            {showResults && (
                <div className="absolute top-full mt-2 w-full antigravity-glass rounded-lg border border-white/20 dark:border-white/10 shadow-xl overflow-hidden">
                    {isLoading ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            Buscando...
                        </div>
                    ) : hasResults ? (
                        <div className="max-h-96 overflow-y-auto">
                            {results.folders.length > 0 && (
                                <div>
                                    <div className="px-4 py-2 text-xs font-semibold text-muted-foreground bg-muted/50">
                                        Carpetas
                                    </div>
                                    {results.folders.map((folder) => (
                                        <button
                                            key={`folder-${folder.id}`}
                                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-accent/50 transition-colors text-left"
                                            onMouseDown={() => handleResultClick('folder', folder)}
                                        >
                                            <Folder className="size-4 text-primary" />
                                            <span className="text-sm">{folder.name}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                            {results.documents.length > 0 && (
                                <div>
                                    <div className="px-4 py-2 text-xs font-semibold text-muted-foreground bg-muted/50">
                                        Documentos
                                    </div>
                                    {results.documents.map((document) => (
                                        <button
                                            key={`document-${document.id}`}
                                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-accent/50 transition-colors text-left"
                                            onMouseDown={() => handleResultClick('document', document)}
                                        >
                                            <FileText className="size-4 text-primary" />
                                            <span className="text-sm">{document.name}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            No se encontraron resultados
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
