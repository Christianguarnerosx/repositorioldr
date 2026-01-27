import { Link } from '@inertiajs/react';
import { Folder, FileText, FileCode, FileImage, File, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface FileManagerItemProps {
    id: number;
    name: string;
    type: 'folder' | 'document';
    updated_at: string;
    file_size?: string;
    extension?: string;
    onAction?: (action: string, id: number) => void;
}

const FileIcon = ({ extension, className }: { extension?: string; className?: string }) => {
    switch (extension?.toLowerCase()) {
        case 'pdf':
        case 'doc':
        case 'docx':
        case 'txt':
            return <FileText className={`${className} text-red-500`} />;
        case 'xls':
        case 'xlsx':
        case 'csv':
            return <FileText className={`${className} text-green-600`} />;
        case 'png':
        case 'jpg':
        case 'jpeg':
        case 'svg':
            return <FileImage className={`${className} text-purple-500`} />;
        case 'js':
        case 'ts':
        case 'tsx':
        case 'php':
        case 'html':
        case 'css':
            return <FileCode className={`${className} text-blue-400`} />;
        default:
            return <File className={`${className} text-gray-400`} />;
    }
};

export function FileManagerItem({ id, name, type, updated_at, file_size, extension, onAction }: FileManagerItemProps) {
    const isFolder = type === 'folder';

    return (
        <Card className="group relative flex flex-col overflow-hidden border-border/50 transition-all hover:shadow-xl hover:-translate-y-1 bg-card/50 backdrop-blur-sm">

            <CardContent className="flex-1 flex flex-col items-center justify-center py-10">
                {isFolder ? (
                    <Link
                        href={route('dashboard', { folder_id: id })}
                        className="transition-transform group-hover:scale-110 duration-200"
                    >
                        <Folder className="size-20 text-blue-600 fill-blue-50/50 dark:fill-blue-900/10" />
                    </Link>
                ) : (
                    <div className="transition-transform group-hover:scale-110 duration-200">
                        <FileIcon extension={extension} className="size-20" />
                    </div>
                )}
            </CardContent>

            <CardFooter className="px-4 py-3 border-t bg-muted/20">
                <div className="flex items-center justify-between w-full gap-2">
                    <div className="flex-1 min-w-0">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <h4 className="text-sm font-semibold text-foreground truncate cursor-default">
                                        {isFolder ? (
                                            <Link href={route('dashboard', { folder_id: id })} className="hover:text-primary">
                                                {name}
                                            </Link>
                                        ) : (
                                            name
                                        )}
                                    </h4>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{name}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1.5 font-medium">
                            <span>{updated_at}</span>
                            {file_size && (
                                <>
                                    <span className="text-[10px] opacity-30">•</span>
                                    <span>{file_size}</span>
                                </>
                            )}
                        </p>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                <MoreVertical className="size-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onAction?.('details', id)}>Ver detalles</DropdownMenuItem>
                            {!isFolder && <DropdownMenuItem onClick={() => onAction?.('download', id)}>Descargar</DropdownMenuItem>}
                            <DropdownMenuItem className="text-destructive" onClick={() => onAction?.('delete', id)}>Eliminar</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardFooter>
        </Card>
    );
}
