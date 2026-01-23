import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Trash, ArrowUp, ArrowDown, Type, Image, Code, Quote, Columns, Grid, Layout } from "lucide-react";
import { ImageUpload } from "@/components/ImageUpload";

export interface ArticleBlock {
  id: string;
  type: 'h1' | 'h2' | 'h3' | 'h4' | 'paragraph' | 'image' | 'code' | 'quote' | 'image-grid' | 'two-column';
  content: string;
  metadata?: {
    alt?: string;
    caption?: string;
    language?: string;
    images?: Array<{
      url: string;
      alt: string;
      caption: string;
    }>;
    layout?: 'single' | 'grid-2' | 'grid-3' | 'grid-4';
  };
}

interface ArticleBlockEditorProps {
  blocks: ArticleBlock[];
  onChange: (blocks: ArticleBlock[]) => void;
}

export const ArticleBlockEditor = ({ blocks, onChange }: ArticleBlockEditorProps) => {
  const addBlock = (type: ArticleBlock['type']) => {
    const newBlock: ArticleBlock = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      content: '',
      metadata: type === 'image-grid' ? { images: [], layout: 'grid-2' } : {}
    };
    onChange([...blocks, newBlock]);
  };

  const updateBlock = (id: string, updates: Partial<ArticleBlock>) => {
    const newBlocks = blocks.map(block =>
      block.id === id ? { ...block, ...updates } : block
    );
    onChange(newBlocks);
  };

  const deleteBlock = (id: string) => {
    onChange(blocks.filter(block => block.id !== id));
  };

  const moveBlock = (id: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex(block => block.id === id);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;

    const newBlocks = [...blocks];
    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
    onChange(newBlocks);
  };

  const addImageToGrid = (blockId: string) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block || !block.metadata) return;

    const newImages = [...(block.metadata.images || []), { url: '', alt: '', caption: '' }];
    updateBlock(blockId, {
      metadata: { ...block.metadata, images: newImages }
    });
  };

  const updateGridImage = (blockId: string, imageIndex: number, updates: Partial<{ url: string; alt: string; caption: string }>) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block || !block.metadata?.images) return;

    const newImages = [...block.metadata.images];
    newImages[imageIndex] = { ...newImages[imageIndex], ...updates };

    updateBlock(blockId, {
      metadata: { ...block.metadata, images: newImages }
    });
  };

  const removeImageFromGrid = (blockId: string, imageIndex: number) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block || !block.metadata?.images) return;

    const newImages = block.metadata.images.filter((_, i) => i !== imageIndex);
    updateBlock(blockId, {
      metadata: { ...block.metadata, images: newImages }
    });
  };

  const renderBlockEditor = (block: ArticleBlock) => {
    switch (block.type) {
      case 'h1':
        return (
          <Input
            value={block.content}
            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
            placeholder="Enter H1 heading..."
            className="text-2xl font-bold"
          />
        );
      case 'h2':
        return (
          <Input
            value={block.content}
            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
            placeholder="Enter H2 heading..."
            className="text-xl font-semibold"
          />
        );
      case 'h3':
        return (
          <Input
            value={block.content}
            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
            placeholder="Enter H3 heading..."
            className="text-lg font-medium"
          />
        );
      case 'h4':
        return (
          <Input
            value={block.content}
            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
            placeholder="Enter H4 heading..."
            className="text-base font-medium"
          />
        );
      case 'paragraph':
        return (
          <Textarea
            value={block.content}
            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
            placeholder="Enter paragraph text..."
            className="min-h-[100px]"
          />
        );
      case 'image':
        return (
          <div className="space-y-3">
            <ImageUpload
              value={block.content}
              onChange={(url) => updateBlock(block.id, { content: url })}
              label=""
              placeholder="Upload image"
            />
            <Input
              value={block.metadata?.alt || ''}
              onChange={(e) => updateBlock(block.id, {
                metadata: { ...block.metadata, alt: e.target.value }
              })}
              placeholder="Alt text..."
            />
            <Input
              value={block.metadata?.caption || ''}
              onChange={(e) => updateBlock(block.id, {
                metadata: { ...block.metadata, caption: e.target.value }
              })}
              placeholder="Caption..."
            />
          </div>
        );
      case 'image-grid':
        return (
          <div className="space-y-4">
            <div className="flex gap-2 items-center">
              <Label className="text-sm">Layout:</Label>
              <Select
                value={block.metadata?.layout || 'grid-2'}
                onValueChange={(value: 'single' | 'grid-2' | 'grid-3' | 'grid-4') =>
                  updateBlock(block.id, {
                    metadata: { ...block.metadata, layout: value }
                  })
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">1 Column</SelectItem>
                  <SelectItem value="grid-2">2 Columns</SelectItem>
                  <SelectItem value="grid-3">3 Columns</SelectItem>
                  <SelectItem value="grid-4">4 Columns</SelectItem>
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addImageToGrid(block.id)}
              >
                <Plus size={14} className="mr-2" /> Add Image
              </Button>
            </div>
            <div className={`grid gap-4 ${
              block.metadata?.layout === 'grid-2' ? 'grid-cols-1 md:grid-cols-2' :
              block.metadata?.layout === 'grid-3' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
              block.metadata?.layout === 'grid-4' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' :
              'grid-cols-1'
            }`}>
              {block.metadata?.images?.map((image, index) => (
                <div key={index} className="border border-border p-3 rounded space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Image {index + 1}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeImageFromGrid(block.id, index)}
                      className="h-6 w-6 p-0"
                    >
                      <Trash size={12} />
                    </Button>
                  </div>
                  <ImageUpload
                    value={image.url}
                    onChange={(url) => updateGridImage(block.id, index, { url })}
                    label=""
                    placeholder="Upload image"
                  />
                  <Input
                    value={image.alt}
                    onChange={(e) => updateGridImage(block.id, index, { alt: e.target.value })}
                    placeholder="Alt text..."
                    className="text-sm"
                  />
                  <Input
                    value={image.caption}
                    onChange={(e) => updateGridImage(block.id, index, { caption: e.target.value })}
                    placeholder="Caption..."
                    className="text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        );
      case 'code':
        return (
          <div className="space-y-3">
            <Select
              value={block.metadata?.language || ''}
              onValueChange={(value) => updateBlock(block.id, {
                metadata: { ...block.metadata, language: value }
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="typescript">TypeScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="bash">Bash</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="html">HTML</SelectItem>
                <SelectItem value="css">CSS</SelectItem>
                <SelectItem value="sql">SQL</SelectItem>
              </SelectContent>
            </Select>
            <Textarea
              value={block.content}
              onChange={(e) => updateBlock(block.id, { content: e.target.value })}
              placeholder="Enter code..."
              className="min-h-[150px] font-mono"
            />
          </div>
        );
      case 'quote':
        return (
          <Textarea
            value={block.content}
            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
            placeholder="Enter quote..."
            className="min-h-[80px] italic"
          />
        );
      case 'two-column':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Textarea
              value={block.content}
              onChange={(e) => updateBlock(block.id, { content: e.target.value })}
              placeholder="Left column content..."
              className="min-h-[120px]"
            />
            <Textarea
              value={block.metadata?.caption || ''}
              onChange={(e) => updateBlock(block.id, {
                metadata: { ...block.metadata, caption: e.target.value }
              })}
              placeholder="Right column content..."
              className="min-h-[120px]"
            />
          </div>
        );
      default:
        return null;
    }
  };

  const getBlockIcon = (type: ArticleBlock['type']) => {
    switch (type) {
      case 'h1': return <Type size={16} />;
      case 'h2': return <Type size={16} />;
      case 'h3': return <Type size={16} />;
      case 'h4': return <Type size={16} />;
      case 'paragraph': return <Type size={16} />;
      case 'image': return <Image size={16} />;
      case 'image-grid': return <Grid size={16} />;
      case 'code': return <Code size={16} />;
      case 'quote': return <Quote size={16} />;
      case 'two-column': return <Columns size={16} />;
      default: return <Type size={16} />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Add Block Buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addBlock('h1')}
        >
          <Type size={14} className="mr-2" /> H1
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addBlock('h2')}
        >
          <Type size={14} className="mr-2" /> H2
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addBlock('h3')}
        >
          <Type size={14} className="mr-2" /> H3
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addBlock('h4')}
        >
          <Type size={14} className="mr-2" /> H4
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addBlock('paragraph')}
        >
          <Type size={14} className="mr-2" /> Paragraph
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addBlock('image')}
        >
          <Image size={14} className="mr-2" /> Image
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addBlock('image-grid')}
        >
          <Grid size={14} className="mr-2" /> Image Grid
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addBlock('code')}
        >
          <Code size={14} className="mr-2" /> Code
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addBlock('quote')}
        >
          <Quote size={14} className="mr-2" /> Quote
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addBlock('two-column')}
        >
          <Columns size={14} className="mr-2" /> Two Column
        </Button>
      </div>

      {/* Blocks */}
      <div className="space-y-3">
        {blocks.map((block, index) => (
          <div key={block.id} className="terminal-border bg-card/50 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {getBlockIcon(block.type)}
                <span className="text-sm text-primary capitalize">
                  {block.type.replace('-', ' ')}
                </span>
              </div>
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => moveBlock(block.id, 'up')}
                  disabled={index === 0}
                  className="h-8 w-8 p-0"
                >
                  <ArrowUp size={14} />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => moveBlock(block.id, 'down')}
                  disabled={index === blocks.length - 1}
                  className="h-8 w-8 p-0"
                >
                  <ArrowDown size={14} />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteBlock(block.id)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash size={14} />
                </Button>
              </div>
            </div>
            {renderBlockEditor(block)}
          </div>
        ))}
      </div>

      {blocks.length === 0 && (
        <div className="terminal-border bg-card/50 p-8 text-center text-muted-foreground">
          <p>No blocks yet. Add your first block above!</p>
        </div>
      )}
    </div>
  );
};