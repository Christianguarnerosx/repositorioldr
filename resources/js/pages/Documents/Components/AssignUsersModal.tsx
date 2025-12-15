import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { router } from "@inertiajs/react";
import { useState } from "react";
import { toast } from "sonner";
import { MultiSelectCombobox } from "@/components/ui/multi-select-combobox";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentId: number;
  users: any[];
}

export function AssignUsersModal({ open, onOpenChange, documentId, users }: Props) {
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [canEdit, setCanEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUserIds.length === 0) {
        toast.error("Selecciona al menos un usuario");
        return;
    }

    setLoading(true);
    router.post(
      route("documents.assign-users", documentId),
      {
        user_ids: selectedUserIds.map(id => parseInt(id)),
        can_edit: canEdit,
      },
      {
        onSuccess: () => {
          setLoading(false);
          onOpenChange(false);
          toast.success("Usuarios asignados correctamente");
          // Reset form
          setSelectedUserIds([]);
          setCanEdit(false);
        },
        onError: () => {
          setLoading(false);
          toast.error("Error al asignar usuarios");
        },
      }
    );
  };

  const userOptions = users.map((user) => ({
    label: user.name,
    value: user.id.toString(),
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Asignar Usuarios al Documento</DialogTitle>
          <DialogDescription>
            Selecciona los usuarios que tendrán acceso a este documento.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Usuarios</Label>
            <MultiSelectCombobox
              options={userOptions}
              value={selectedUserIds}
              onChange={setSelectedUserIds}
              placeholder="Seleccionar usuarios..."
              searchPlaceholder="Buscar usuarios..."
              emptyMessage="No se encontraron usuarios."
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="can_edit"
              checked={canEdit}
              onCheckedChange={(checked) => setCanEdit(checked as boolean)}
            />
            <Label
              htmlFor="can_edit"
              className="text-sm font-normal cursor-pointer"
            >
              Permitir edición
            </Label>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Asignando..." : "Asignar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
