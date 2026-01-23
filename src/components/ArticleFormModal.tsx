import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Trash } from "lucide-react";
import { ImageUpload } from "@/components/ImageUpload";
import { ArticleBlockEditor, ArticleBlock } from "@/components/ArticleBlockEditor";
import type { Article } from "@/lib/database";

interface BlogFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (post: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: Partial<Article>;
  isEditing?: boolean;
}

export const ArticleFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = {},
  isEditing = false
}: BlogFormModalProps) => {
  const [post, setPost] = useState<Omit<Article, 'id' | 'createdAt' | 'updatedAt'>>({
    title: "",
    excerpt: "",
    blocks: [],
    tags: [],
    publishedAt: new Date().toISOString().split('T')[0],
    readingTime: "5 min",
    author: "Surafel Yimam"
  });

  useEffect(() => {
    if (initialData) {
      setPost({
        title: initialData.title || "",
        excerpt: initialData.excerpt || "",
        blocks: initialData.blocks || [],
        tags: initialData.tags || [],
        publishedAt: initialData.publishedAt || new Date().toISOString().split('T')[0],
        readingTime: initialData.readingTime || "5 min",
        author: initialData.author || "Surafel Yimam"
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(post);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Article" : "Add New Article"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={post.title}
                onChange={(e) => setPost({...post, title: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={post.excerpt}
                onChange={(e) => setPost({...post, excerpt: e.target.value})}
                placeholder="Brief description of the post"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Content Blocks</Label>
              <ArticleBlockEditor
                blocks={post.blocks}
                onChange={(blocks) => setPost({...post, blocks})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={post.tags.join(", ")}
                onChange={(e) => setPost({...post, tags: e.target.value.split(",").map(s => s.trim()).filter(s => s)})}
                placeholder="technology, coding, ethiopia"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="publishedAt">Published Date</Label>
                <Input
                  id="publishedAt"
                  type="date"
                  value={post.publishedAt}
                  onChange={(e) => setPost({...post, publishedAt: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="readingTime">Reading Time</Label>
                <Input
                  id="readingTime"
                  value={post.readingTime}
                  onChange={(e) => setPost({...post, readingTime: e.target.value})}
                  placeholder="5 min"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={post.author}
                onChange={(e) => setPost({...post, author: e.target.value})}
              />
            </div>

          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? "Update Post" : "Add Post"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ArticleFormModal