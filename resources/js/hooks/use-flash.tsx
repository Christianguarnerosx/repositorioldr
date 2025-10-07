import { PageProps } from "@/types";
import { usePage } from "@inertiajs/react";
import { useEffect } from "react";
import { toast } from "sonner";

export default function useFlash() {
    const { flash } = usePage<PageProps>().props;

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
        if (flash.info) {
            toast.info(flash.info);
        }
        if (flash.warning) {
            toast.warning(flash.warning);
        }
        if (flash.error) {
            toast.error(flash.error);
        }
    }, [flash])

    return {
        success: flash.success,
        info: flash.info,
        warning: flash.warning,
        error: flash.error
    }
}
