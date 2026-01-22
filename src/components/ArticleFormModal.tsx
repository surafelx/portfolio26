import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Trash } from "lucide-react";
import type { Article } from "@/types/database";

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
    content: "",
    tags: [],
    publishedAt: new Date().toISOString().split('T')[0],
    readingTime: "5 min",
    author: "Surafel Yimam",
    images: []
  });

  useEffect(() => {
    if (initialData) {
      setPost({
        title: initialData.title || "",
        excerpt: initialData.excerpt || "",
        content: initialData.content || "",
        tags: initialData.tags || [],
        publishedAt: initialData.publishedAt || new Date().toISOString().split('T')[0],
        readingTime: initialData.readingTime || "5 min",
        author: initialData.author || "Surafel Yimam",
        images: initialData.images || []
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
              <Label htmlFor="content">Content (Markdown)</Label>
              <Textarea
                id="content"
                value={post.content}
                onChange={(e) => setPost({...post, content: e.target.value})}
                className="min-h-[200px]"
                placeholder="# Title\n\n## Subtitle\n\nContent here..."
                required
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

            {/* Images Section */}
            <div className="space-y-2">
              <Label>Images</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPost({...post, images: [...post.images, { url: "", alt: "", caption: "" }]})}
              >
                <Plus size={16} className="mr-2" /> Add Image
              </Button>
              <div className="space-y-2 mt-2">
                {post.images.map((image, index) => (
                  <div key={index} className="border border-border p-3 rounded space-y-2">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm font-medium">Image {index + 1}</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setPost({...post, images: post.images.filter((_, i) => i !== index)})}
                      >
                        <Trash size={14} />
                      </Button>
                    </div>
                    <Input
                      placeholder="Image URL"
                      value={image.url}
                      onChange={(e) => {
                        const newImages = [...post.images];
                        newImages[index].url = e.target.value;
                        setPost({...post, images: newImages});
                      }}
                    />
                    <Input
                      placeholder="Alt text"
                      value={image.alt}
                      onChange={(e) => {
                        const newImages = [...post.images];
                        newImages[index].alt = e.target.value;
                        setPost({...post, images: newImages});
                      }}
                    />
                    <Input
                      placeholder="Caption"
                      value={image.caption}
                      onChange={(e) => {
                        const newImages = [...post.images];
                        newImages[index].caption = e.target.value;
                        setPost({...post, images: newImages});
                      }}
                    />
                  </div>
                ))}
              </div>
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