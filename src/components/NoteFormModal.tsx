import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Maximize2, Minimize2 } from "lucide-react";
import { NoteBlockEditor } from "@/components/NoteBlockEditor";
import type { Note, NoteBlock } from "@/lib/database";

interface NoteFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: Partial<Note>;
  isEditing?: boolean;
}

export const NoteFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = {},
  isEditing = false
}: NoteFormModalProps) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [note, setNote] = useState<Omit<Note, 'id' | 'createdAt' | 'updatedAt'>>({
    title: "",
    blocks: []
  });

  useEffect(() => {
    if (initialData) {
      setNote({
        title: initialData.title || "",
        blocks: initialData.blocks || []
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(note);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${isMaximized ? 'max-w-[95vw] max-h-[95vh]' : 'max-w-4xl max-h-[90vh]'} overflow-y-auto`}>
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <DialogTitle className="text-lg font-semibold">
            {isEditing ? "Edit Note" : "Add New Note"}
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMaximized(!isMaximized)}
            className="h-8 w-8 p-0 hover:bg-secondary"
          >
            {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </Button>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={note.title}
              onChange={(e) => setNote({...note, title: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Content Blocks</Label>
            <NoteBlockEditor
              blocks={note.blocks}
              onChange={(blocks) => setNote({...note, blocks})}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? "Update Note" : "Add Note"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};