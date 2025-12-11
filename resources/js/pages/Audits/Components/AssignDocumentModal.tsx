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
import { router } from "@inertiajs/react";
import { useState } from "react";
import { toast } from "sonner";
import { Combobox } from "@/components/ui/combobox";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  auditId: number;
  documents: any[];
  users: any[];
}

export function AssignDocumentModal({ open, onOpenChange, auditId, documents, users }: Props) {
  const [selectedDocumentId, setSelectedDocumentId] = useState<string>("");
  const [selectedVersionId, setSelectedVersionId] = useState<string>("");
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const selectedDocument = documents.find((d) => d.id.toString() === selectedDocumentId);
  const versions = selectedDocument?.versions || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDocumentId || !selectedVersionId || !selectedUserId) {
        toast.error("Please fill in all fields");
        return;
    }

    setLoading(true);
    router.post(
      route("audit-document-reviews.store"),
      {
        audit_id: auditId,
        document_version_id: selectedVersionId,
        user_id: selectedUserId,
      },
      {
        onSuccess: () => {
          setLoading(false);
          onOpenChange(false);
          toast.success("Document assigned successfully");
          // Reset form
          setSelectedDocumentId("");
          setSelectedVersionId("");
          setSelectedUserId("");
        },
        onError: () => {
          setLoading(false);
          toast.error("Failed to assign document");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Document</DialogTitle>
          <DialogDescription>
            Select a document version and an auditor to assign.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="document" className="text-right">
              Document
            </Label>
            <div className="col-span-3">
                <Combobox
                    options={documents.map(doc => ({ label: doc.name, value: doc.id.toString() }))}
                    value={selectedDocumentId}
                    onChange={(value) => {
                        setSelectedDocumentId(value);
                        setSelectedVersionId(""); // Reset version when doc changes
                    }}
                    placeholder="Select document"
                    searchPlaceholder="Search document..."
                />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="version" className="text-right">
              Version
            </Label>
            <div className="col-span-3">
                <Combobox
                    options={versions.map((ver: any) => ({ 
                        label: `${new Date(ver.created_at).toLocaleDateString()} (ID: ${ver.id})`, 
                        value: ver.id.toString() 
                    }))}
                    value={selectedVersionId}
                    onChange={setSelectedVersionId}
                    placeholder="Select version"
                    searchPlaceholder="Search version..."
                    disabled={!selectedDocumentId}
                />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="auditor" className="text-right">
              Auditor
            </Label>
            <div className="col-span-3">
                <Combobox
                    options={users.map((user) => ({ label: user.name, value: user.id.toString() }))}
                    value={selectedUserId}
                    onChange={setSelectedUserId}
                    placeholder="Select auditor"
                    searchPlaceholder="Search auditor..."
                />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Assigning..." : "Assign"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
